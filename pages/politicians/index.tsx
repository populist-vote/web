/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";

import { Layout, LoaderFlag, PartyAvatar, SEO, Spacer } from "components";
import styles from "components/Layout/Layout.module.scss";

import {
  Chambers,
  PoliticalParty,
  PoliticalScope,
  State,
  useInfinitePoliticianIndexQuery,
} from "../../generated";
import type { PoliticianResult } from "../../generated";
import useDeviceInfo from "hooks/useDeviceInfo";
import useDebounce from "hooks/useDebounce";
import { NextPageWithLayout } from "../_app";
import { computeOfficeTitle } from "utils/politician";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { GetServerSideProps } from "next";
import classNames from "classnames";

const PAGE_SIZE = 20;

const PoliticianRow = ({ politician }: { politician: PoliticianResult }) => {
  const { isMobile } = useDeviceInfo();
  const officeTitleDisplay = computeOfficeTitle(politician);
  const district = politician.currentOffice?.district;

  const districtDisplay =
    !district || isNaN(+district) ? district : `District ${district}`;

  return (
    <Link href={`/politicians/${politician.slug}`} passHref>
      <li className={styles.rowItem}>
        <PartyAvatar
          size={60}
          party={politician.party as PoliticalParty}
          src={
            politician.thumbnailImageUrl ||
            (politician.votesmartCandidateBio?.candidate.photo as string)
          }
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={politician.fullName}
        />
        <div className={styles.politicianInfo}>
          <p style={{ margin: 0 }}>{politician.fullName}</p>
          {isMobile ? (
            <div className={styles.flexBetween}>
              {officeTitleDisplay && (
                <span className={styles.bold}>{officeTitleDisplay}</span>
              )}
              {district && officeTitleDisplay && (
                <Spacer size={8} delimiter="•" axis="horizontal" />
              )}
              {districtDisplay && (
                <span className={styles.bold}>{districtDisplay}</span>
              )}
            </div>
          ) : (
            <>
              <span className={styles.bold}>{districtDisplay}</span>
              <span className={styles.bold}>{officeTitleDisplay}</span>
            </>
          )}
        </div>
      </li>
    </Link>
  );
};

type PoliticianIndexProps = {
  query: {
    search: string;
    scope: PoliticalScope;
    chamber: Chambers;
    state: State;
  };
};

const PoliticianIndex: NextPageWithLayout<PoliticianIndexProps> = (
  props: PoliticianIndexProps
) => {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    scope = null,
    chamber = null,
    search = null,
  } = props.query || query;
  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    500
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePoliticianIndexQuery(
    "cursor",
    {
      pageSize: PAGE_SIZE,
      search: {
        name: debouncedSearchQuery || null,
        homeState: state as State,
      },
      filter: {
        politicalScope: scope as PoliticalScope,
        chambers: chamber as Chambers,
      },
    },
    {
      queryKey: `politicianIndex-${debouncedSearchQuery}-${scope}-${chamber}-${state}`,
      getNextPageParam: (lastPage) => {
        if (!lastPage.politicians.pageInfo.hasNextPage) return undefined;
        return {
          cursor: lastPage.politicians.pageInfo.endCursor,
        };
      },
    }
  );

  const loadMoreRef = useRef(null);

  // Handle infinite scroll
  useEffect(() => {
    if (!hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      })
    );
    const el = loadMoreRef && loadMoreRef.current;
    if (!el) {
      return;
    }
    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage]);

  const handleScopeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    }
    const scope = e.target.value as PoliticalScope;
    void router.push({ query: { ...query, scope } });
  };

  const handleChamberSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const chamber = e.target.value as Chambers;
    void router.push({ query: { ...query, chamber } });
  };

  return (
    <Layout>
      <SEO
        title="Politician Browser"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <div>
        <header>
          <div className={styles.filtersContainer}>
            <div className={styles.flexLeft}>
              <select
                className={styles.pillSelect}
                name="state"
                onChange={(e) =>
                  void router.push({
                    query: { ...query, state: e.target.value },
                  })
                }
                value={state as State}
              >
                <option value={State.Co}>Colorado</option>
                <option value={State.Mn}>Minnesota</option>
              </select>
              <AiFillCaretDown className={styles.chevron} />
            </div>
            <h2 className={styles.desktopOnly}>Browse</h2>
            <div className={styles.inputWithIcon}>
              <input
                placeholder="Search"
                onChange={(e) =>
                  void router.push({
                    query: { ...query, search: e.target.value },
                  })
                }
                value={search || ""}
              ></input>
              <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
            </div>
            <Spacer size={16} axis="vertical" />
            <form className={`${styles.flexBetween}`}>
              <input
                name="scope"
                id="federal-radio"
                type="radio"
                value={PoliticalScope.Federal}
                checked={scope === PoliticalScope.Federal}
                onChange={handleScopeChange}
              />
              <label
                htmlFor="federal-radio"
                className={classNames(styles.radioLabel, styles.aquaLabel)}
              >
                Federal
              </label>
              <input
                name="scope"
                id="state-radio"
                type="radio"
                value={PoliticalScope.State}
                checked={scope === PoliticalScope.State}
                onChange={handleScopeChange}
              />
              <label
                htmlFor="state-radio"
                className={classNames(styles.radioLabel, styles.yellowLabel)}
              >
                State
              </label>
              <input
                name="scope"
                id="local-radio"
                type="radio"
                value={PoliticalScope.Local}
                checked={scope === PoliticalScope.Local}
                onChange={handleScopeChange}
              />
              <label
                htmlFor="local-radio"
                className={classNames(styles.radioLabel, styles.salmonLabel)}
              >
                Local
              </label>
              <div className={styles.flexLeft}>
                <select
                  className={styles.pillSelect}
                  name="chambers"
                  onChange={handleChamberSelect}
                  value={chamber || Chambers.All}
                >
                  <option value={Chambers.All}>All Chambers</option>
                  <option value={Chambers.House}>House</option>
                  <option value={Chambers.Senate}>Senate</option>
                </select>
                <AiFillCaretDown className={styles.chevron} />
              </div>
            </form>
          </div>
        </header>
        <div>
          {isLoading && (
            <div className={styles.center}>
              <LoaderFlag />
            </div>
          )}
          {error && (
            <h4>Something went wrong fetching politician records...</h4>
          )}
          <div>
            {data?.pages.map((page) =>
              page.politicians.edges
                ?.map((edge) => edge?.node as PoliticianResult)
                .map((politician: PoliticianResult) => (
                  <PoliticianRow politician={politician} key={politician.id} />
                ))
            )}
          </div>
          {hasNextPage && (
            <>
              <button
                className={styles.wideButton}
                style={{ margin: "1rem 0 0 " }}
                ref={loadMoreRef}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: ctx.query };
};

export default PoliticianIndex;
