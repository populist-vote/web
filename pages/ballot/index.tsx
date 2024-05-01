import { ReactNode, useState } from "react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

import { Election } from "components/Ballot/Election";
import {
  Layout,
  VotingGuideWelcome,
  TopNavElections,
  Button,
} from "components";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useElections, useElectionsOutput } from "hooks/useElections";

import {
  VOTING_GUIDE_WELCOME_VISIBLE,
  SELECTED_ELECTION,
} from "utils/constants";

import {
  useElectionVotingGuideByUserIdQuery,
  useElectionsIndexQuery,
} from "generated";

import { SupportedLocale } from "types/global";
import Link from "next/link";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  const queryClient = new QueryClient();

  /* 
    This is currently the only place useElectionsQuery is being used, 
    now that everything is in the hook.
    Just want to note in case it causes server side issues.
  */
  await queryClient.prefetchQuery({
    queryKey: useElectionsIndexQuery.getKey(),
    queryFn: useElectionsIndexQuery.fetcher(),
  });

  const state = dehydrate(queryClient);

  return {
    props: {
      dehydratedState: state,
      mobileNavTitle: "My Ballot",
      title: "My Ballot",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function BallotPage() {
  const { user } = useAuth({ redirectTo: `/ballot/choose` });

  const electionData = useElections(
    sessionStorage.getItem(SELECTED_ELECTION) || undefined
  );
  const { error, selectedElectionId } = electionData;

  const userVotingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId: selectedElectionId as string,
    },
    {
      enabled: !!user?.id && !!selectedElectionId,
      staleTime: 60 * 1000,
    }
  );
  // Use either the voting guide ID (above) from query params OR the users voting guide ID
  // to instantiate the VotingGuideContext
  const userGuideId = userVotingGuideQuery.data?.electionVotingGuideByUserId
    ?.id as string;

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(
    localStorage.getItem(VOTING_GUIDE_WELCOME_VISIBLE) !== "false"
  );

  const handleWelcomeDismissal = () => {
    setIsWelcomeVisible(false);
    localStorage.setItem(VOTING_GUIDE_WELCOME_VISIBLE, "false");
  };

  if (!user) return null;

  if (error) {
    if ((error as Error).message === "No user address data") {
      return (
        <div>
          <h2>
            We'll need your voting address if you want to see your ballot
            information
          </h2>
          <Link href="/settings/profile">
            <Button variant="primary" size="large" label="Update Address" />
          </Link>
        </div>
      );
    } else {
      return <div>Something went wrong</div>;
    }
  }

  return (
    <>
      {isWelcomeVisible ? (
        <VotingGuideWelcome onClose={handleWelcomeDismissal} />
      ) : (
        <BallotContent electionData={electionData} userGuideId={userGuideId} />
      )}
    </>
  );
}

function BallotContent({
  electionData,
  userGuideId,
}: {
  electionData: useElectionsOutput;
  userGuideId: string;
}) {
  const { isSuccess, selectedElectionId } = electionData;
  return (
    <div>
      {isSuccess && (
        <>
          <VotingGuideProvider votingGuideId={userGuideId}>
            <TopNavElections
              selected="Ballot"
              showElectionSelector
              electionData={electionData}
            />
            <div data-testid="ballot-page">
              <Election electionId={selectedElectionId} />
            </div>
          </VotingGuideProvider>
        </>
      )}
    </div>
  );
}

BallotPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"My Ballot"} showNavLogoOnMobile>
    {page}
  </Layout>
);

export default BallotPage;
