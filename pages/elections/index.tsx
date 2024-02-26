import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Layout, LoaderFlag, TopNavElections } from "components";
import { Box } from "components/Box/Box";
import { PoliticalScope, useElectionsIndexQuery } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useRef, useState } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useElectionsIndexQuery.getKey(),
    useElectionsIndexQuery.fetcher()
  );

  const state = dehydrate(queryClient);

  return {
    props: {
      dehydratedState: state,
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
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const router = useRouter();
  const { query } = router;
  const { scope } = query;

  const handleScopeChange = (newScope: PoliticalScope) => {
    if (newScope === scope) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    } else {
      void router.push({ query: { ...query, scope: newScope } });
    }
  };

  const { data, isLoading } = useElectionsIndexQuery({
    filter: {
      query: searchValue,
    },
  });

  if (isLoading) {
    return <LoaderFlag />;
  }

  return (
    <>
      <TopNavElections selected="Browse" electionData={undefined} />
      <div className={styles.container}>
        <Box>
          <div className={styles.inputWithIcon}>
            <input
              placeholder="Search for an election"
              ref={searchRef}
              onChange={(e) => {
                setSearchValue(e.target.value);
                void router.push({
                  query: { ...query, search: e.target.value },
                });
              }}
              value={searchValue || ""}
            />
            <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
          </div>
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
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
}

ElectionsPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    {page}
  </Layout>
);
