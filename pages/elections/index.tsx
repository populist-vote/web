import { Layout, LoaderFlag, SearchInput, TopNavElections } from "components";
import { Box } from "components/Box/Box";
import { PoliticalScope, useElectionsIndexQuery } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useState } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";
import useDebounce from "hooks/useDebounce";
import { dateString } from "utils/dates";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      mobileNavTitle: "Elections",
      title: "Elections",
      description:
        "Browse upcoming elections, find your polling place, and learn about the candidates and issues on your ballot.",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function ElectionsPage() {
  const router = useRouter();
  const { query } = router;
  const { search, scope } = query;
  const [searchValue, setSearchValue] = useState<string>(search as string);

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const handleScopeChange = (newScope: PoliticalScope) => {
    if (newScope === scope) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    } else {
      void router.push({ query: { ...query, scope: newScope } });
    }
  };

  const { data, isLoading } = useElectionsIndexQuery(
    {
      filter: {
        query: debouncedSearchQuery,
        politicalScope: scope as PoliticalScope,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!debouncedSearchQuery || !!scope,
    }
  );

  return (
    <>
      <TopNavElections selected="Browse" electionData={undefined} />
      <div className={styles.container}>
        <Box>
          <SearchInput
            placeholder="Search for an election"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Separator.Root
            className={styles.SeparatorRoot}
            decorative
            style={{
              margin: "1rem 0",
              height: "1px",
              backgroundColor: `var(--yellow-dark)`,
            }}
          />
          <div className={styles.filters}>
            <input
              name="scope"
              id="federal-radio"
              type="radio"
              value={PoliticalScope.Federal}
              checked={scope === PoliticalScope.Federal}
              onClick={() => handleScopeChange(PoliticalScope.Federal)}
              onChange={() => null}
            />
            <label
              htmlFor="federal-radio"
              className={clsx(styles.radioLabel, styles.aquaLabel)}
            >
              Federal
            </label>
            <input
              name="scope"
              id="state-radio"
              type="radio"
              value={PoliticalScope.State}
              checked={scope === PoliticalScope.State}
              onClick={() => handleScopeChange(PoliticalScope.State)}
              onChange={() => null}
            />
            <label
              htmlFor="state-radio"
              className={clsx(styles.radioLabel, styles.yellowLabel)}
            >
              State
            </label>
            <input
              name="scope"
              id="local-radio"
              type="radio"
              value={PoliticalScope.Local}
              checked={scope === PoliticalScope.Local}
              onClick={() => handleScopeChange(PoliticalScope.Local)}
              onChange={() => null}
            />
            <label
              htmlFor="local-radio"
              className={clsx(styles.radioLabel, styles.salmonLabel)}
            >
              Local
            </label>
          </div>
        </Box>
        {isLoading ? (
          <LoaderFlag />
        ) : (
          <div style={{ marginTop: "1rem" }}>
            {data?.elections.map((election) => (
              <Box key={election.id}>
                <div className={styles.flexBetween}>
                  <h4 style={{ fontSize: "1.25em" }}>{election.title}</h4>
                  <h3>{dateString(election.electionDate, true)}</h3>
                </div>
                <div className={styles.divider} />
                <p className={styles.blueText}>{election.description}</p>
              </Box>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

ElectionsPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    {page}
  </Layout>
);
