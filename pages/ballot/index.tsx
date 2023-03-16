import { ReactNode, useState } from "react";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

import { Election } from "components/Ballot/Election";
import {
  Layout,
  LoaderFlag,
  VotingGuideWelcome,
  TopNavElections,
} from "components";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useElections } from "hooks/useElections";

import { VOTING_GUIDE_WELCOME_VISIBLE } from "utils/constants";

import {
  ElectionVotingGuideByUserIdQuery,
  useElectionsQuery,
  useElectionVotingGuideByUserIdQuery,
  useUpsertVotingGuideMutation,
} from "generated";

import styles from "components/Layout/Layout.module.scss";
import { SupportedLocale } from "types/global";

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
  await queryClient.prefetchQuery(
    useElectionsQuery.getKey(),
    useElectionsQuery.fetcher()
  );

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
  const queryClient = useQueryClient();

  const createVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => queryClient.invalidateQueries(userVotingGuideQueryKey),
  });

  const { isLoading, isSuccess, error, selectedElectionId } = useElections();

  const userVotingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId: selectedElectionId as string,
    },
    {
      enabled: !!user?.id && !!selectedElectionId,
      onSuccess: (data: ElectionVotingGuideByUserIdQuery) => {
        if (!data?.electionVotingGuideByUserId)
          createVotingGuide.mutate({
            electionId: selectedElectionId as string,
          });
      },
    }
  );

  const userVotingGuideQueryKey = useElectionVotingGuideByUserIdQuery.getKey({
    userId: user?.id,
    electionId: selectedElectionId as string,
  });

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

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      {isWelcomeVisible ? (
        <VotingGuideWelcome onClose={handleWelcomeDismissal} />
      ) : (
        <div>
          <TopNavElections selected="Ballot" showElectionSelector />
          {isSuccess && (
            <>
              <VotingGuideProvider votingGuideId={userGuideId}>
                {isLoading && (
                  <div className={styles.center}>
                    <LoaderFlag />
                  </div>
                )}
                {error && (
                  <h4>Something went wrong fetching your ballot data...</h4>
                )}
                {selectedElectionId && (
                  <div data-testid="ballot-page">
                    <Election electionId={selectedElectionId} />
                  </div>
                )}
              </VotingGuideProvider>
            </>
          )}
        </div>
      )}
    </>
  );
}

BallotPage.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"My Ballot"} showNavLogoOnMobile>
    {page}
  </Layout>
);

export default BallotPage;
