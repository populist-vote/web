/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactElement,
  MouseEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import Link from "next/link";

import { Layout, LoaderFlag, PartyAvatar, Spacer } from "components";
import styles from "components/Layout/Layout.module.scss";

import {
  Chambers,
  PoliticalParty,
  PoliticalScope,
  useInfinitePoliticianIndexQuery,
} from "../../generated";
import type { PoliticianResult } from "../../generated";
import useDeviceInfo from "hooks/useDeviceInfo";
import useDebounce from "hooks/useDebounce";
import { NextPageWithLayout } from "../_app";
import { computeOfficeTitle } from "utils/politician";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { GetServerSideProps } from "next";

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
  search: string;
  scope: PoliticalScope;
  chamber: Chambers;
};

const PoliticianIndex: NextPageWithLayout<PoliticianIndexProps> = (
  props: PoliticianIndexProps
) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    props.search as string
  );
  const debouncedSearchQuery = useDebounce<string | null>(searchQuery, 500);
  const [politicalScope, setPoliticalScope] = useState<PoliticalScope | null>(
    (props.scope as PoliticalScope) || null
  );
  const [chamberFilter, setChamberFilter] = useState<Chambers | null>(
    (props.chamber as Chambers) || null
  );

  useEffect(() => {
    type RouteQuery = {
      search: string | null;
      scope: PoliticalScope | null;
      chamber: Chambers | null;
    };
    const query: Partial<RouteQuery> = {};
    if (!!debouncedSearchQuery) query.search = debouncedSearchQuery;
    if (!!politicalScope) query.scope = politicalScope;
    if (!!chamberFilter) query.chamber = chamberFilter;
    void router.push({ query });
  }, [debouncedSearchQuery, politicalScope, chamberFilter]);

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
      },
      filter: {
        politicalScope: politicalScope,
        chambers: chamberFilter,
      },
    },
    {
      queryKey: `politicianIndex-${debouncedSearchQuery}-${politicalScope}-${chamberFilter}`,
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

  const handleScopeClick = (e: MouseEvent) => {
    if (politicalScope === (e.target as HTMLInputElement).value)
      setPoliticalScope(null);
  };

  const handleScopeChange = (e: ChangeEvent) => {
    setPoliticalScope((e.target as HTMLInputElement).value as PoliticalScope);
  };

  return (
    <>
      <Head>
        <title>Populist - Politician Browser</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
      <div>
        <header>
          <h1 className={styles.desktopOnly}>Colorado Legislators</h1>
          <div className={styles.filtersContainer}>
            <h2 className={styles.desktopOnly}>Browse</h2>
            <div className={styles.inputWithIcon}>
              <input
                placeholder="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery || ""}
              ></input>
              <FaSearch color="var(--blue)" />
            </div>
            <Spacer size={16} axis="vertical" />
            <form className={`${styles.flexBetween}`}>
              <input
                name="scope"
                id="federal-radio"
                type="radio"
                value={PoliticalScope.Federal}
                checked={politicalScope === PoliticalScope.Federal}
                onClick={handleScopeClick}
                onChange={handleScopeChange}
              />
              <label htmlFor="federal-radio" className={styles.radioLabel}>
                Federal
              </label>
              <input
                name="scope"
                id="state-radio"
                type="radio"
                value={PoliticalScope.State}
                checked={politicalScope === PoliticalScope.State}
                onClick={handleScopeClick}
                onChange={handleScopeChange}
              />
              <label htmlFor="state-radio" className={styles.radioLabel}>
                State
              </label>
              <select
                className={styles.pillSelect}
                name="chambers"
                onChange={(e) => {
                  const newFilter =
                    e.target.value === Chambers.All ? null : e.target.value;
                  setChamberFilter(newFilter as Chambers);
                }}
                value={chamberFilter || Chambers.All}
              >
                <option value={Chambers.All}>All Chambers</option>
                <option value={Chambers.House}>House</option>
                <option value={Chambers.Senate}>Senate</option>
              </select>
              <FaChevronDown className={styles.chevron} />
            </form>
          </div>
        </header>
        <div>
          {isLoading && (
            <div className={styles.center}>
              {" "}
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { chamber = null, scope = null, search = null } = ctx.query;
  return { props: { chamber, scope, search } };
};

PoliticianIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PoliticianIndex;
