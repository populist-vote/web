import { Button, Layout } from "components";
import { BillStatus, PoliticalScope, PopularitySort, State } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import { StickyButton } from "components/StickyButton/StickyButton";
import { FaSearch } from "react-icons/fa";
import { FiltersIcon } from "components/Icons";
import { BillFiltersDesktop } from "components/BillFilters/BillFiltersDesktop";
import { PopularBills } from "components/PopularBills/PopularBills";
import { MobileTabs } from "components/MobileTabs/MobileTabs";
import { TopNav } from "components/TopNav/TopNav";
import { Box } from "components/Box/Box";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { BillFiltersMobile } from "components/BillFilters/BillFiltersMobile";
import { useMediaQuery } from "hooks/useMediaQuery";
import { useBillFilters } from "hooks/useBillFilters";
import styles from "./BillIndex.module.scss";
import { BillResults } from "components/BillResults/BillResults";

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
  year: "2022" | "2021" | "2020";
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
  const { scope = PoliticalScope.Federal, search } = query;
  const { showFilters = "false" } = props.query || query;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchValue, setSearchValue] = useState(search);
  const showFiltersParam = showFilters === "true";

  const { handleScopeFilter } = useBillFilters();

  if (showFiltersParam && isMobile)
    return (
      <Layout mobileNavTitle="Legislation">
        <BillFiltersMobile {...props} />
      </Layout>
    );

  return (
    <Layout mobileNavTitle="Legislation" hideFooter>
      <TopNav />
      <div className={styles.container}>
        <div className={styles.desktopOnly}>
          <section>
            <Box>
              <div className={styles.flex}>
                <div className={styles.inputWithIcon}>
                  <input
                    placeholder="Search for legislation"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      void router.push({
                        query: { ...query, search: e.target.value },
                      });
                    }}
                    value={searchValue || ""}
                  ></input>
                  <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
                </div>
                <Button
                  variant={showFiltersParam ? "primary" : "secondary"}
                  theme="yellow"
                  label="Filters"
                  size="medium"
                  onClick={() =>
                    router.push({
                      query: {
                        ...query,
                        showFilters: showFiltersParam ? false : true,
                      },
                    })
                  }
                />
                <Button
                  variant="secondary"
                  theme="yellow"
                  label="Clear"
                  size="medium"
                />
              </div>
              {showFiltersParam && <BillFiltersDesktop {...props} />}
            </Box>
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
        <BillResults {...props} />
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
