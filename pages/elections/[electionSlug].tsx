import { Layout, LoaderFlag, TopNavElections } from "components";
import { ElectionHeader } from "components/Ballot/ElectionHeader";
import {
  ElectionResult,
  RaceResult,
  State,
  useElectionBySlugQuery,
  useElectionVotingGuideByUserIdQuery,
} from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { SupportedLocale } from "types/global";
import { ElectionBrowserBreadcrumbs } from "./browse/[state]";
import { getYear } from "utils/dates";
import { ElectionRaces } from "components/Ballot/BallotRaces";
import { useSearchParams } from "next/navigation";
import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";

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
  const { electionSlug } = query;
  const searchParams = useSearchParams();

  // 🔍 Filters
  const stateSearchParam = searchParams.get("state");
  const searchParam = searchParams.get("search")?.trim() ?? "";
  const stateFilter = stateSearchParam || query.state;

  // 🧩 Pagination state
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  // 🧠 Build raceFilter
  const raceFilter = {
    // Add all your filter props here
    state: stateFilter ? State[stateFilter as keyof typeof State] : undefined,
    query: searchParam || undefined,
    // future: officeType, raceType, etc.
  };

  // 🗳️ Query election + first 10 races (or subsequent pages)
  const { data, isFetching, refetch } = useElectionBySlugQuery({
    slug: electionSlug as string,
    raceFilter,
    first: 10,
    after: afterCursor,
  });

  const user = useAuth().user;

  const votingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId: data?.electionBySlug?.id as string,
    },
    { enabled: !!user?.id && !!data?.electionBySlug?.id }
  );

  // 🪄 Combine and flatten edges → RaceResult[]
  const newEdges: RaceResult[] =
    data?.electionBySlug?.races?.edges?.map((e) => e.node as RaceResult) ?? [];
  const currentPageInfo = data?.electionBySlug?.races?.pageInfo;

  // When data changes (refetch), merge with previous races
  useEffect(() => {
    if (afterCursor) {
      setRaces((prev) => [...prev, ...newEdges]);
    } else {
      setRaces(newEdges);
    }
    setHasNextPage(!!currentPageInfo?.hasNextPage);
  }, [data]);

  const year = getYear(data?.electionBySlug?.electionDate).toString();

  // 📜 Load more handler (pagination)
  async function loadNextPage() {
    if (!hasNextPage) return;
    const nextCursor = currentPageInfo?.endCursor;
    if (!nextCursor) return;
    setAfterCursor(nextCursor);
    // refetch will automatically trigger useEffect to append
    await refetch();
  }

  const userGuideId = votingGuideQuery.data?.electionVotingGuideByUserId?.id;

  return (
    <VotingGuideProvider votingGuideId={userGuideId as string}>
      <ElectionBrowserBreadcrumbs state={stateFilter as string} year={year} />
      <div style={{ marginTop: "-3rem" }}>
        <ElectionHeader
          election={data?.electionBySlug as Partial<ElectionResult>}
        />
      </div>
      {isFetching && races.length === 0 ? (
        <LoaderFlag />
      ) : (
        <ElectionRaces
          races={races}
          onLoadMore={loadNextPage}
          hasNextPage={hasNextPage}
        />
      )}
    </VotingGuideProvider>
  );
}

ElectionPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
