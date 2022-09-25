/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
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
import { PoliticianIndexFilters } from "components/PoliticianFilters/PoliticianFilters";

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

export type PoliticianIndexProps = {
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
    350
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

  return (
    <Layout>
      <SEO
        title="Politician Browser"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <div>
        <header>
          <PoliticianIndexFilters query={props.query} />
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
