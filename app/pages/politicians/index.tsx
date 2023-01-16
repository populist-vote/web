/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { usePoliticianIndexQuery } from "graphql-codegen/generated";
import { Layout, LoaderFlag, PartyAvatar, Spacer } from "components";
import styles from "components/Layout/Layout.module.scss";

import {
  Chambers,
  PoliticalParty,
  PoliticalScope,
  State,
} from "graphql-codegen/generated";
import type { PoliticianResult } from "graphql-codegen/generated";
import useDeviceInfo from "hooks/useDeviceInfo";
import useDebounce from "hooks/useDebounce";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { GetServerSideProps, NextPage } from "next";
import { PoliticianIndexFilters } from "components/PoliticianFilters/PoliticianFilters";
import nextI18NextConfig from "utils/next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "global";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

const PoliticianRow = ({ politician }: { politician: PoliticianResult }) => {
  const { isMobile } = useDeviceInfo();
  const officeTitle =
    politician.currentOffice?.name || politician.currentOffice?.title;
  const officeSubtitle = politician.currentOffice?.subtitleShort;

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
              {officeTitle && (
                <span className={styles.bold}>
                  {politician.currentOffice?.title}
                </span>
              )}
              {officeTitle && officeSubtitle && (
                <Spacer size={8} delimiter="•" axis="horizontal" />
              )}
              {officeSubtitle && (
                <span className={styles.bold}>{officeSubtitle}</span>
              )}
            </div>
          ) : (
            <>
              <span className={styles.bold}>{officeTitle}</span>
              <span className={styles.bold}>{officeSubtitle}</span>
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

const PoliticianIndex: NextPage<PoliticianIndexProps> = (
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
  } = useInfiniteQuery(
    ["politicianIndex", debouncedSearchQuery, scope, chamber, state],
    ({ pageParam }) =>
      usePoliticianIndexQuery.fetcher({
        pageSize: PAGE_SIZE,
        cursor: pageParam,
        filter: {
          query: debouncedSearchQuery || null,
          homeState: state as State,
          politicalScope: scope as PoliticalScope,
          chambers: chamber as Chambers,
        },
      })(),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.politicians.pageInfo.hasNextPage) return undefined;
        return lastPage.politicians.pageInfo.endCursor;
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
      <div>
        <header>
          <PoliticianIndexFilters query={props.query} />
        </header>
        <div>
          <>
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
                    <PoliticianRow
                      politician={politician}
                      key={politician.id}
                    />
                  ))
              )}
            </div>
            {hasNextPage && (
              <>
                <button
                  className={styles.wideButton}
                  style={{ margin: "1rem 0 0" }}
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
          </>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  return {
    props: {
      title: "Politician Browser",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...ctx.query,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18NextConfig
      )),
    },
  };
};

export default PoliticianIndex;
