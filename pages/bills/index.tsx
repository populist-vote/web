import { useInfiniteQuery } from "@tanstack/react-query";
import { BillCard, Layout, LoaderFlag } from "components";
import {
  BillResult,
  LegislationStatus,
  State,
  useBillIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Legislation",
      description:
        "Find information on bills and ballot measures that impact you.",
      ...(await serverSideTranslations(
        locale,
        ["common", "auth"],
        nextI18nextConfig
      )),
    },
  };
}

type BillIndexProps = {
  query: {
    search: string;
    status: LegislationStatus;
    state: State;
  };
};

const PAGE_SIZE = 20;

function BillIndex(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const { state = null, status = null, search = null } = props.query || query;

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
    ["politicianIndex", debouncedSearchQuery, state, status],
    ({ pageParam }) =>
      useBillIndexQuery.fetcher({
        pageSize: PAGE_SIZE,
        cursor: pageParam,
        filter: {
          query: debouncedSearchQuery || null,
          state: state as State,
          legislationStatus: status,
        },
      })(),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.bills.pageInfo.hasNextPage) return undefined;
        return lastPage.bills.pageInfo.endCursor;
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
      <>
        <header className={styles.header}>
          <h1>Bills</h1>
        </header>
        {isLoading && <LoaderFlag />}
        {error && <div>Failed to load</div>}
        <div className={styles.container}>
          <div>
            {data?.pages.map((page) =>
              page.bills.edges
                ?.map((edge) => edge?.node as BillResult)
                .map((bill: BillResult) => (
                  <BillCard bill={bill} itemId={bill.id} key={bill.id} />
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
      </>
    </Layout>
  );
}

export default BillIndex;
