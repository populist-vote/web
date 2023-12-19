import { Layout } from "components";
import * as Separator from "@radix-ui/react-separator";
import { BillStatus, PoliticalScope, PopularitySort, State } from "generated";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FaSearch } from "react-icons/fa";
import { SupportedLocale } from "types/global";

import {
  StickyButton,
  FiltersIcon,
  PopularBills,
  MobileTabs,
  TopNav,
  BillFiltersMobile,
  BillSearchAndFilters,
} from "components";

import { useMediaQuery } from "hooks/useMediaQuery";
import { useBillFilters } from "hooks/useBillFilters";

import styles from "./BillIndex.module.scss";
import { BillResultsTable } from "components/BillResultsTable/BillResultsTable";

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
  const { scope = PoliticalScope.Federal } = query;
  const { showFilters = "false" } = props.query || query;
  const isMobile = useMediaQuery("(max-width: 896px)");
  const showFiltersParam = showFilters === "true";
  const { handleScopeFilter } = useBillFilters();
  const theme = scope === PoliticalScope.State ? "yellow" : "aqua";

  if (showFiltersParam && isMobile) return <BillFiltersMobile {...props} />;

  return (
    <>
      <TopNav>
        <ul>
          <li
            data-selected={scope === PoliticalScope.Federal}
            data-color="aqua"
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
          <li
            data-selected={scope === PoliticalScope.State}
            data-color="yellow"
          >
            <Link
              href={{
                pathname: "/bills",
                query: {
                  ...query,
                  scope: PoliticalScope.State,
                },
              }}
            >
              State
            </Link>
          </li>
        </ul>
      </TopNav>
      <div className={styles.container}>
        <div className={styles.desktopOnly}>
          <section>
            <BillSearchAndFilters
              theme={scope === PoliticalScope.State ? "yellow" : "aqua"}
            />
          </section>
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <BillResultsTable theme={theme} />
        </div>
        <Separator.Root
          className={styles.SeparatorRoot}
          decorative
          style={{
            height: "2px",
            backgroundColor: `var(--${theme})`,
          }}
        />
        <PopularBills />
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
