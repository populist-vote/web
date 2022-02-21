/* eslint-disable react-hooks/exhaustive-deps */
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { ReactElement, useEffect, useRef, useState } from "react";
// import { dehydrate, GetNextPageParamFunction, QueryClient } from "react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
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

const PAGE_SIZE = 20;

const PoliticianRow = ({ politician }: { politician: PoliticianResult }) => {
  const { isMobile } = useDeviceInfo();

  const officeTitle = politician.votesmartCandidateBio.office?.title;
  const officeType = politician.votesmartCandidateBio.office?.typeField;
  const computeOfficeTitle = () => {
    switch (true) {
      case officeType === "State Legislative" && officeTitle === "Senator":
        return `${politician.homeState} Senate`;
      case officeType === "State Legislative" &&
        officeTitle === "Representative":
        return `${politician.homeState} House`;
      case officeTitle === "Senator":
        return "U.S. Congress";
      case officeTitle === "Representative":
        return "U.S. House";
      default:
        return `${politician.homeState} ${officeTitle}`;
    }
  };

  const officeTitleDisplay = computeOfficeTitle();
  const district = politician.votesmartCandidateBio.office?.district;

  const districtDisplay =
    !district || isNaN(+district) ? district : `DISTRICT ${district}`;

  return (
    <Link href={`/politicians/${politician.slug}`} passHref>
      <li className={styles.rowItem}>
        <PartyAvatar
          size="60"
          party={politician.officeParty || ("UNKNOWN" as PoliticalParty)}
          src={politician.votesmartCandidateBio.candidate.photo}
          alt={politician.fullName}
        />
        <div className={styles.politicianInfo}>
          <p style={{ margin: 0 }}>{politician.fullName}</p>
          {isMobile ? (
            <div className={`${styles.bold} ${styles.flexBetween}`}>
              {officeTitleDisplay && <span>{officeTitleDisplay}</span>}
              {district && officeTitleDisplay && (
                <Spacer size={8} delimiter="•" />
              )}
              {districtDisplay && <span>{districtDisplay}</span>}
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

const PoliticianIndex: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce<string | null>(searchQuery, 500);
  const [politicalScope, setPoliticalScope] = useState<PoliticalScope | null>(
    null
  );
  const [chamberFilter, setChamberFilter] = useState<Chambers | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      router.push({ query: { search: null } });
    } else {
      router.push({ query: { search: searchQuery } });
    }
  }, [searchQuery, politicalScope, chamberFilter]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
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
        if (entry.isIntersecting) {
          fetchNextPage();
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
  }, [loadMoreRef.current, hasNextPage]);

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
                onChange={(e) =>
                  setPoliticalScope(e.target.value as PoliticalScope)
                }
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
                onChange={(e) =>
                  setPoliticalScope(e.target.value as PoliticalScope)
                }
              />
              <label htmlFor="state-radio" className={styles.radioLabel}>
                State
              </label>
              <select
                name="chamber"
                onChange={(e) => setChamberFilter(e.target.value as Chambers)}
              >
                <option value={Chambers.AllChambers}>All Chambers</option>
                <option value={Chambers.House}>House</option>
                <option value={Chambers.Senate}>Senate</option>
              </select>
            </form>
          </div>
        </header>
        <div>
          {(isLoading || isFetching) && (
            <div className={styles.center}>
              {" "}
              <LoaderFlag />
            </div>
          )}
          {error && (
            <h4>Something went wrong fetching politician records...</h4>
          )}
          <div>
            {data?.pages.map((page, i) =>
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

PoliticianIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PoliticianIndex;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchInfiniteQuery(
  //   useInfinitePoliticianIndexQuery.getKey(),
  //   usePoliticianIndexQuery.fetcher({ pageSize: PAGE_SIZE })
  // );

  // let state = dehydrate(queryClient);

  return {
    props: {
      // dehydratedState: state,
    },
  };
};
