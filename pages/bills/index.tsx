import { Button, Layout, Select } from "components";
import { BillStatus, PoliticalScope, PopularitySort, State } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { StickyButton } from "components/StickyButton/StickyButton";
import { FaSearch } from "react-icons/fa";
import { FiltersIcon } from "components/Icons";
import { BillFilters } from "components/BillFilters/BillFilters";
import { PopularBills } from "components/PopularBills/PopularBills";
import { MobileTabs } from "components/MobileTabs/MobileTabs";
import { TopNav } from "components/TopNav/TopNav";
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

// TODO implement state machine for these
export type BillIndexProps = {
  query: {
    search: string;
    shouldFocusSearch: string;
    status: BillStatus;
    scope: PoliticalScope;
    state: State;
    year: "2022" | "2020";
    popularity: PopularitySort;
    showFilters: string;
  };
};

function BillIndex(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const { scope = PoliticalScope.Federal } = query;
  const { showFilters = "false", state = null } = props.query || query;

  const showFiltersParam = showFilters === "true";

  const handleScopeFilter = (scope: PoliticalScope) => {
    if (scope === PoliticalScope.Federal) {
      const { state: _, ...newQuery } = query;
      void router.push({ query: { ...newQuery, scope } });
    } else {
      void router.push({ query: { ...query, scope } });
    }
  };

  if (showFiltersParam)
    return (
      <Layout mobileNavTitle="Legislation">
        <BillFilters {...props} />
      </Layout>
    );

  return (
    <Layout mobileNavTitle="Legislation">
      <TopNav />
      <div className={styles.container}>
        {scope == PoliticalScope.State && (
          <section className={clsx(styles.filters, styles.mobileOnly)}>
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
        )}
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
        <PopularBills {...props} />
      </div>
      <div>
        <StickyButton
          position="left"
          onClick={() =>
            router.push({
              query: { ...query, showFilters: true, shouldFocusSearch: false },
            })
          }
        >
          <FiltersIcon /> Filters
        </StickyButton>
        <StickyButton
          position="right"
          onClick={() =>
            router.push({
              query: { ...query, showFilters: true, shouldFocusSearch: true },
            })
          }
        >
          <FaSearch color="var(--blue-lighter)" />
        </StickyButton>
      </div>
      <MobileTabs
        value={scope as PoliticalScope}
        handleChange={handleScopeFilter}
      />
    </Layout>
  );
}

export default BillIndex;
