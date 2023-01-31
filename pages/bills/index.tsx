import { Button, Layout, Select } from "components";
import { BillStatus, PoliticalScope, PopularitySort, State } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import { StickyButton } from "components/StickyButton/StickyButton";
import { FaSearch } from "react-icons/fa";
import { FiltersIcon } from "components/Icons";
import { PopularBills } from "components/PopularBills/PopularBills";
import { MobileTabs } from "components/MobileTabs/MobileTabs";
import { TopNav } from "components/TopNav/TopNav";
import { Box } from "components/Box/Box";
import { BillFiltersMobile } from "components/BillFilters/BillFiltersMobile";
import { useMediaQuery } from "hooks/useMediaQuery";
import { useBillFilters } from "hooks/useBillFilters";
import styles from "./BillIndex.module.scss";
import { BillResults } from "components/BillResults/BillResults";
import clsx from "clsx";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import Link from "next/link";
import { ReactNode } from "react";

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

export interface BillFiltersParams {
  search: string;
  shouldFocusSearch: string;
  status: BillStatus;
  scope: PoliticalScope;
  state: State;
  year: "2023" | "2022" | "2021" | "2020";
  issue: string;
  committee: string;
  popularity: PopularitySort;
  showFilters: string;
}

export type BillIndexProps = {
  query: BillFiltersParams;
};

function BillIndex(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const { scope = PoliticalScope.Federal, state } = query;
  const { showFilters = "false" } = props.query || query;
  const isMobile = useMediaQuery("(max-width: 896px)");

  const showFiltersParam = showFilters === "true";
  const { handleScopeFilter } = useBillFilters();

  if (showFiltersParam && isMobile)
    return (
      <Layout mobileNavTitle="Legislation">
        <BillFiltersMobile {...props} />
      </Layout>
    );

  return (
    <>
      <TopNav>
        <ul>
          <li
            className={scope !== PoliticalScope.Federal ? styles.selected : ""}
          >
            <Select
              onChange={(e) => {
                if (e.target.value === "all") {
                  const { state: _, ...newQuery } = query;
                  void router.push({ query: newQuery });
                } else {
                  void router.push({
                    query: {
                      ...query,
                      state: e.target.value,
                      scope: PoliticalScope.State,
                    },
                  });
                }
              }}
              onClick={() =>
                void router.push({
                  query: {
                    ...query,
                    scope: PoliticalScope.State,
                  },
                })
              }
              value={state as string}
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
              accentColor="yellow"
              uppercase
            />
          </li>
          <li
            className={
              scope === PoliticalScope.Federal
                ? clsx(styles.selected, styles.aqua)
                : ""
            }
          >
            <Link
              href={{
                pathname: "/bills",
                query: {
                  ...query,
                  scope: PoliticalScope.Federal,
                },
              }}
            >
              Federal
            </Link>
          </li>
        </ul>
      </TopNav>
      <div className={styles.container}>
        <div className={styles.desktopOnly}>
          <section>
            <BillSearchAndFilters />
          </section>
        </div>
        <section className={styles.header}>
          <Box>
            <h2>How does a bill become law?</h2>
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
          </Box>
        </section>
        <BillResults />
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
          <FiltersIcon size={25} /> Filters
        </StickyButton>
        <StickyButton
          position="right"
          onClick={() =>
            router.push(
              {
                query: { ...query, showFilters: true, shouldFocusSearch: true },
              },
              undefined,
              {
                scroll: false,
              }
            )
          }
        >
          <FaSearch color="var(--blue-lighter)" size={25} />
        </StickyButton>
      </div>
      <MobileTabs
        value={scope as PoliticalScope}
        handleChange={handleScopeFilter}
      />
    </>
  );
}

BillIndex.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle="Legislation" hideFooter>
    {page}
  </Layout>
);

export default BillIndex;
