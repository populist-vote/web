import React from "react";
import { Layout, LoaderFlag, TopNavElections } from "components";
import { ElectionHeader } from "components/Ballot/ElectionHeader";
import {
  ElectionResult,
  RaceResult,
  State,
  ElectionBySlugQuery,
  useElectionBySlugQuery,
  useElectionVotingGuideByUserIdQuery,
} from "generated";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { ElectionBrowserBreadcrumbs } from "./browse/[state]";
import { getYear } from "utils/dates";
import { ElectionRaces } from "components/Ballot/BallotRaces";
import { useSearchParams } from "next/navigation";
import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import useDebounce from "hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  const stateSearchParam = searchParams.get("state");
  const searchInput = searchParams.get("search") ?? "";

  const debouncedSearch = useDebounce(searchInput.trim(), 300);
  const stateFilterRaw = stateSearchParam ?? query.state;
  const stateFilter = Array.isArray(stateFilterRaw)
    ? stateFilterRaw[0]
    : stateFilterRaw;
  const user = useAuth().user;

  // Normalize state to enum key (e.g. "mn" -> "Mn") so State[stateKey] matches
  const stateKey = stateFilter
    ? (stateFilter.charAt(0).toUpperCase() + stateFilter.slice(1).toLowerCase()) as keyof typeof State
    : null;
  const raceFilter = {
    state: stateKey && stateKey in State ? State[stateKey] : undefined,
    query: debouncedSearch || undefined,
  };

  // 📜 Cursor-based pagination using useInfiniteQuery
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<ElectionBySlugQuery>({
    queryKey: ["electionBySlug", electionSlug, raceFilter],
    queryFn: ({ pageParam }: { pageParam?: unknown }) =>
      useElectionBySlugQuery.fetcher({
        slug: electionSlug as string,
        raceFilter,
        first: 10,
        after: (pageParam as string | null | undefined) ?? undefined,
      })(),
    enabled: !!electionSlug,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.electionBySlug?.races?.pageInfo;
      return pageInfo?.hasNextPage ? pageInfo.endCursor : undefined;
    },
  });

  // 🧠 Merge all pages of races together
  const races: RaceResult[] =
    data?.pages?.flatMap(
      (page) =>
        page.electionBySlug?.races?.edges?.map(
          (edge) => edge.node as RaceResult
        ) ?? []
    ) ?? [];

  const lastPage = data?.pages?.[data.pages.length - 1];
  const election = lastPage?.electionBySlug;
  const year = getYear(election?.electionDate).toString();

  const votingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId: election?.id as string,
    },
    { enabled: !!user?.id && !!election?.id }
  );

  const userGuideId = votingGuideQuery.data?.electionVotingGuideByUserId?.id;

  // 📜 Load more handler (pagination)
  function loadNextPage() {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }

  return (
    <VotingGuideProvider votingGuideId={userGuideId as string}>
      <ElectionBrowserBreadcrumbs state={stateFilter as string} year={year} />

      <div style={{ marginTop: "-3rem" }}>
        {election && (
          <ElectionHeader election={election as Partial<ElectionResult>} />
        )}
      </div>

      {isPending && <LoaderFlag />}

      {!isPending && election && (
        <ElectionRaces
          races={races}
          onLoadMore={loadNextPage}
          hasNextPage={hasNextPage}
        />
      )}

      {isFetchingNextPage && <LoaderFlag />}

      {isError && <div>Error: {error.message}</div>}
    </VotingGuideProvider>
  );
}

ElectionPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
