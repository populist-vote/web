import { Layout, LoaderFlag, TopNavElections } from "components";
import { ElectionHeader } from "components/Ballot/ElectionHeader";
import {
  ElectionResult,
  RaceResult,
  State,
  useElectionBySlugQuery,
} from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { ElectionBrowserBreadcrumbs } from "./browse/[state]";
import { getYear } from "utils/dates";
import { ElectionRaces } from "components/Ballot/BallotRaces";
import states from "utils/states";

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

export default function ElectionPage() {
  const { query } = useRouter();
  const { electionSlug, search, state } = query;
  const { data, isLoading } = useElectionBySlugQuery({
    slug: electionSlug as string,
    raceFilter: {
      state: State[state as keyof typeof State],
    },
  });

  const year = getYear(data?.electionBySlug?.electionDate).toString();
  const races = search
    ? (data?.electionBySlug.races.filter((race) => {
        const searchQuery = search?.toString().toLowerCase();
        const raceTitle = race.title.toLowerCase();
        const officeTitle = race.office.title.toLowerCase();
        const officeSubtitle = race.office.subtitle?.toLowerCase() || "";
        const officeName = race.office.name?.toLowerCase() || "";
        const raceState = race.office.state
          ? states[race.office.state].toLowerCase()
          : "";
        const combinedSearchable = `${raceTitle} ${officeTitle} ${officeSubtitle} ${officeName} ${raceState}`;
        return fuzzyMatch(combinedSearchable, searchQuery.trim());
      }) as RaceResult[])
    : (data?.electionBySlug.races as RaceResult[]);

  function fuzzyMatch(str: string, query: string) {
    const regex = new RegExp(query.split("").join(".*"), "i");
    return regex.test(str);
  }

  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <ElectionBrowserBreadcrumbs state={state as string} year={year} />
      <div style={{ marginTop: "-3rem" }}>
        <ElectionHeader
          election={data?.electionBySlug as Partial<ElectionResult>}
        />
      </div>
      <ElectionRaces races={races} />
    </div>
  );
}

ElectionPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
