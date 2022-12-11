import { useInfiniteQuery } from "@tanstack/react-query";
import { BillCard, Button, Layout, LoaderFlag, Select } from "components";
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
import clsx from "clsx";

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // TDOD implement a resolver for this with LIMIT 10
  const popularBills =
    data?.pages
      .flatMap((page) => page.bills.edges.map((edge) => edge.node))
      .slice(0, 10) || [];

  return (
    <Layout mobileNavTitle="Legislation">
      <div className={styles.container}>
        <>
          {error && <div>Failed to load</div>}
          <section className={styles.filters}>
            <Select
              onChange={(e) => {
                if (e.target.value === "all") {
                  const { state: _, ...newQuery } = query;
                  void router.push({ query: newQuery });
                } else {
                  void router.push({
                    query: { ...query, state: e.target.value },
                  });
                }
              }}
              value={state || "all"}
              options={[
                {
                  value: "CO",
                  label: "Colorado",
                },
                {
                  value: "MN",
                  label: "Minnesota",
                },
              ]}
              color="yellow"
            />
          </section>
          <section className={styles.header}>
            <h2>How does legislation become law?</h2>
            <p>
              Cum sociis natoque penatibus et magnis dis parturient montes,
              nascetur ridiculus mus.
            </p>
            <Button
              variant="primary"
              label="Learn More"
              size="medium"
              style={{ maxWidth: "fit-content" }}
            />
          </section>

          <section className={styles.billsSection}>
            <h2 className={styles.gradientHeader}>Popular Bills</h2>
            {isLoading ? (
              <LoaderFlag />
            ) : (
              <>
                <div className={clsx(styles.billResults)}>
                  {popularBills?.length > 0 ? (
                    popularBills?.map((bill) => (
                      <BillCard bill={bill as BillResult} key={bill.id} />
                    ))
                  ) : (
                    <p>No Results</p>
                  )}
                </div>
              </>
            )}
          </section>
        </>
      </div>
    </Layout>
  );
}

export default BillIndex;
