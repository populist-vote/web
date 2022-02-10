/* eslint-disable react-hooks/exhaustive-deps */
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { ReactElement, useEffect, useRef, useState } from "react";
import { dehydrate, GetNextPageParamFunction, QueryClient } from "react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

import { Layout, LoaderFlag, PartyAvatar, Spacer } from "components";
import styles from "components/Layout/Layout.module.scss"; // TODO not use Layout styles module here

import {
  PoliticalParty,
  useInfinitePoliticianIndexQuery,
} from "../../generated";
import type { PoliticianIndexQuery, PoliticianResult } from "../../generated";
import useDeviceInfo from "hooks/useDeviceInfo";
import useDebounce from "hooks/useDebounce";
import { NextPageWithLayout } from "../_app";

const PAGE_SIZE = 20;

const PoliticianRow = ({ politician }: { politician: PoliticianResult }) => {
  const { isMobile } = useDeviceInfo();

  const officeTitle = politician.votesmartCandidateBio.office?.title;
  const officeInfo = () => {
    switch (officeTitle) {
      case "Senator":
        return "U.S. CONGRESS";
      case "Representative":
        return "U.S. HOUSE";
      default:
        return officeTitle;
    }
  };
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
              {district && (
                <>
                  <span>{districtDisplay}</span>
                  <Spacer size={8} delimiter="•" />
                </>
              )}

              <span>{officeInfo()}</span>
            </div>
          ) : (
            <>
              <span className={styles.bold}>{districtDisplay}</span>
              <span className={styles.bold}>{officeInfo()}</span>
            </>
          )}
        </div>
      </li>
    </Link>
  );
};

const PoliticianIndex: NextPageWithLayout = () => {
  // TODO use `politicians` query with search params and accept user selected filters
  // instead of filtering clientside.
  const router = useRouter();

  type LocalityFilter = "all" | "federal" | "state";
  type ChamberFilter = "all" | "house" | "senate";

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce<string | null>(searchQuery, 500);
  const [localityFilter, setLocalityFilter] = useState<LocalityFilter>(
    (router.query.locality as LocalityFilter) || "all"
  );
  const [chamberFilter, setChamberFilter] = useState<ChamberFilter>(
    (router.query.chambers as ChamberFilter) || "all"
  );

  useEffect(() => {
    if (!searchQuery) {
      router.push({ query: null });
    } else {
      router.push({ query: { search: searchQuery } });
    }
  }, [searchQuery]);

  useEffect(() => {
    router.push({
      query: { locality: localityFilter, chambers: chamberFilter },
    });
  }, [localityFilter, chamberFilter]);

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

  const { isMobile } = useDeviceInfo();

  const localityFilterFn = (
    politician: PoliticianResult,
    scope: LocalityFilter
  ) => {
    let officeType = politician.votesmartCandidateBio.office?.typeField;
    switch (scope) {
      case "all":
        return politician;
      case "federal":
        if (officeType === "Congressional") {
          return politician;
        } else return null;
      case "state":
        if (officeType === "State Legislative") {
          return politician;
        } else return null;
    }
  };

  const chamberFilterFn = (
    politician: PoliticianResult,
    scope: ChamberFilter
  ) => {
    const officeTitle = politician.votesmartCandidateBio.office?.title;
    switch (scope) {
      case "house":
        if (officeTitle === "Representative") {
          return politician;
        } else return null;
      case "senate":
        if (officeTitle === "Senator") {
          return politician;
        } else return null;
      default:
        return politician;
    }
  };

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
        <div className={`${styles.stickyMainHeader} ${styles.shadow}`}>
          {!isMobile && <h1>Colorado Legislators</h1>}
          <div className={styles.filtersContainer}>
            {!isMobile && <h2>Browse</h2>}
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
                value="federal"
                checked={localityFilter === "federal"}
                onChange={(e) =>
                  setLocalityFilter(e.target.value as LocalityFilter)
                }
              />
              <label htmlFor="federal-radio" className={styles.radioLabel}>
                Federal
              </label>
              <input
                name="scope"
                id="state-radio"
                type="radio"
                value="state"
                checked={localityFilter === "state"}
                onChange={(e) =>
                  setLocalityFilter(e.target.value as LocalityFilter)
                }
              />
              <label htmlFor="state-radio" className={styles.radioLabel}>
                State
              </label>
              <select
                name="chamber"
                onChange={(e) =>
                  setChamberFilter(e.target.value as ChamberFilter)
                }
              >
                <option value="all">All Chambers</option>
                <option value="house">House</option>
                <option value="senate">Senate</option>
              </select>
            </form>
          </div>
        </div>
        <div>
          {isLoading && <LoaderFlag />}
          {error && (
            <h4>Something went wrong fetching politician records...</h4>
          )}
          <div>
            {data?.pages.map((page, i) =>
              page.politicians.edges
                ?.map((edge) => edge?.node as PoliticianResult)
                .filter((p: PoliticianResult) =>
                  localityFilterFn(p, localityFilter)
                )
                .filter((p: PoliticianResult) =>
                  chamberFilterFn(p, chamberFilter)
                )
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
