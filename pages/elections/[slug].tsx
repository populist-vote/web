import { Layout, LoaderFlag, TopNavElections } from "components";
import { ElectionHeader } from "components/Ballot/ElectionHeader";
import { ElectionResult, RaceResult, useElectionBySlugQuery } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { ElectionBrowserBreadcrumbs } from "./browse/[state]";
import { getYear } from "utils/dates";
import { ElectionRaces } from "components/Ballot/BallotRaces";

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
  const { slug } = useRouter().query as { slug: string };
  const { data, isLoading } = useElectionBySlugQuery({ slug });
  const state = data?.electionBySlug?.state as string;
  const year = getYear(data?.electionBySlug?.electionDate).toString();

  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <ElectionBrowserBreadcrumbs state={state} year={year} />
      <div style={{ marginTop: "-3rem" }}>
        <ElectionHeader
          election={data?.electionBySlug as Partial<ElectionResult>}
        />
      </div>
      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      <ElectionRaces races={data?.electionBySlug.races as RaceResult[]} />
    </div>
  );
}

ElectionPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
