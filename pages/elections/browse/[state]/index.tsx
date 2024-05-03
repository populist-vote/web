import { Box, Layout, SearchInput, Select, TopNavElections } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { SupportedLocale } from "types/global";
import styles from "../../index.module.scss";
import states from "utils/states";
import Divider from "components/Divider/Divider";
import { State, useElectionsIndexQuery } from "generated";
import { dateString } from "utils/dates";
import Link from "next/link";

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

export default function StateElectionBrowser() {
  const router = useRouter();
  const state = router.query.state as string;
  const year = router.query.year as string;
  const search = router.query.search as string;

  const { data } = useElectionsIndexQuery({
    filter: {
      query: search,
      state: state === "federal" ? null : (state.toUpperCase() as State),
      year: parseInt(year),
    },
  });

  const elections = data?.elections || [];

  return (
    <div>
      <ElectionBrowserBreadcrumbs />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {elections.map((election) => (
          <Link href={`/elections/${election.slug}`} passHref key={election.id}>
            <Box isLink>
              <div className={styles.flexBetween}>
                <h4 style={{ fontSize: "1.25em", color: "var(--white)" }}>
                  {election.title}
                </h4>
                <h3 style={{ fontSize: "1.25em", color: "var(--white)" }}>
                  {dateString(election.electionDate, true)}
                </h3>
              </div>
              <Divider />
              <p className={styles.blueText}>{election.description}</p>
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ElectionBrowserBreadcrumbs({
  state,
  year,
}: {
  state?: string;
  year?: string;
}) {
  const router = useRouter();
  state = (state || router.query.state || "federal") as string;
  year = year || (router.query.year as string);
  const search = router.query.search as string;

  const [searchValue, setSearchValue] = useState<string>(search as string);

  const stateOptions = [
    ...Object.entries(states).map(([key, value]) => ({
      label: value,
      value: key,
    })),
    { label: "Federal", value: "FEDERAL" },
  ];

  const yearOptions = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "3rem",
        padding: "1rem 0",
      }}
    >
      <div
        className={styles.breadcrumbsContainer}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 0",
        }}
      >
        <BiChevronLeft size={25} onClick={() => router.push("/elections")} />
        <Select
          textColor={"white"}
          backgroundColor="blue"
          options={stateOptions}
          value={state?.toUpperCase()}
          onChange={(e) =>
            router.push(
              `/elections/browse/${e.target.value.toLowerCase()}${year ? `?year=${year}` : ""}${search ? `&search=${search}` : ""}`
            )
          }
        />
        <Divider vertical color="var(--blue-light)" />
        <Select
          textColor={"white"}
          backgroundColor="blue"
          options={yearOptions}
          value={year}
          onChange={(e) =>
            router.push(
              `/elections/browse/${state?.toLowerCase()}?year=${e.target.value}`
            )
          }
        />
      </div>
      <SearchInput
        placeholder="Search for elections"
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </div>
  );
}

StateElectionBrowser.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
