import { BillCard, Button, Layout, LoaderFlag, Select } from "components";
import { BillResult, BillStatus, State, usePopularBillsQuery } from "generated";
import useDebounce from "hooks/useDebounce";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import clsx from "clsx";
import { StickyButton } from "components/StickyButton/StickyButton";
import { FaSearch } from "react-icons/fa";
import { FiltersIcon } from "components/Icons";
import {
  BillFilters,
  PopularityFilter,
} from "components/BillFilters/BillFilters";

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

export type BillIndexProps = {
  query: {
    search: string;
    status: BillStatus;
    state: State;
    year: "2022" | "2020";
    popularity: PopularityFilter;
    showFilters: string;
  };
};

function BillIndex(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const {
    showFilters = "false",
    state = null,
    status = null,
    search = null,
  } = props.query || query;

  const showFiltersParam = showFilters === "true";

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = usePopularBillsQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        status,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const popularBills = data?.popularBills.edges.map((edge) => edge.node) || [];

  if (showFiltersParam)
    return (
      <Layout mobileNavTitle="Legislation">
        <BillFilters {...props} />
      </Layout>
    );

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
                    <p className={styles.noResults}>No Results</p>
                  )}
                </div>
              </>
            )}
          </section>
        </>
      </div>
      <StickyButton
        position="left"
        onClick={() =>
          router.push({
            query: { ...query, showFilters: true },
          })
        }
      >
        <FiltersIcon /> Filters
      </StickyButton>
      <StickyButton position="right">
        <FaSearch color="var(--blue-lighter)" />
      </StickyButton>
    </Layout>
  );
}

export default BillIndex;
