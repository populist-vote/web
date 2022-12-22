import { Button, Layout } from "components";
import { BillStatus, PoliticalScope, PopularitySort, State } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
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
    issue: string;
    popularity: PopularitySort;
    showFilters: string;
  };
};

function BillIndex(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const { scope = PoliticalScope.Federal, search } = query;
  const { showFilters = "false" } = props.query || query;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchValue, setSearchValue] = useState(search);
  const showFiltersParam = showFilters === "true";

  const handleScopeFilter = (scope: PoliticalScope) => {
    if (scope === PoliticalScope.Federal) {
      const { state: _, ...newQuery } = query;
      void router.push({ query: { ...newQuery, scope } });
    } else {
      void router.push({ query: { ...query, scope } });
    }
  };

  if (showFiltersParam && isMobile)
    return (
      <Layout mobileNavTitle="Legislation">
        <BillFiltersMobile {...props} />
      </Layout>
    );

  return (
    <Layout mobileNavTitle="Legislation">
      <TopNav />
      <div className={styles.container}>
        <section>
          <div className={styles.desktopOnly}>
            <Box>
              <div className={styles.flex}>
                <div className={styles.inputWithIcon}>
                  <input
                    placeholder="Search"
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
          </div>
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
