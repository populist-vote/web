import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQueryClient } from "react-query";

import { Election } from "components/Ballot/Election";
import {
  Layout,
  LoaderFlag,
  VotingGuideWelcome,
  SEO,
  ElectionSelector,
} from "components";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import { useElections } from "hooks/useElections";

import { VOTING_GUIDE_WELCOME_VISIBLE } from "utils/constants";

import {
  ElectionResult,
  useElectionsQuery,
  useElectionVotingGuideByUserIdQuery,
  useUpsertVotingGuideMutation,
  useVotingGuideByIdQuery,
} from "generated";

import styles from "components/Layout/Layout.module.scss";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const router = useRouter();
  const queriedGuideId = router.query[`voting-guide`];
  const queriedElectionId = router.query[`election`];

  const user = useAuth({ redirectTo: `/ballot/choose` });
  const queryClient = useQueryClient();

  const createVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => queryClient.invalidateQueries(userVotingGuideQueryKey),
  });
  const {
    data,
    isLoading,
    isSuccess,
    error,
    selectedElectionId,
    setSelectedElectionId,
  } = useElections(queriedElectionId as string);

  const userVotingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId: selectedElectionId as string,
    },
    {
      enabled: !!user?.id && !!selectedElectionId,
      onSuccess: (data) => {
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

  const { addSavedGuideId } = useSavedGuideIds(user?.id);

  // Use either the voting guide ID (above) from query params OR the users voting guide ID
  // to instantiate the VotingGuideContext
  const userGuideId =
    userVotingGuideQuery.data?.electionVotingGuideByUserId?.id;
  const votingGuideId = (queriedGuideId ||
    userVotingGuideQuery.data?.electionVotingGuideByUserId?.id) as string;
  const isGuideOwner = queriedGuideId === userGuideId;

  useEffect(() => {
    if (!!queriedGuideId && !!userGuideId && !isGuideOwner) {
      addSavedGuideId(queriedGuideId as string);
    }
  }, [queriedGuideId, userGuideId, isGuideOwner, addSavedGuideId]);

  const otherVotingGuideQuery = useVotingGuideByIdQuery(
    { id: queriedGuideId as string },
    { enabled: !!queriedGuideId }
  );

  const otherGuideData = otherVotingGuideQuery?.data?.votingGuideById;

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(
    localStorage.getItem(VOTING_GUIDE_WELCOME_VISIBLE) !== "false"
  );

  const handleWelcomeDismissal = () => {
    setIsWelcomeVisible(false);
    localStorage.setItem(VOTING_GUIDE_WELCOME_VISIBLE, "false");
  };

  const flagLabel = otherGuideData
    ? `${
        otherGuideData.user.firstName || otherGuideData.user.username
      }'s Voting Guide`
    : "My Ballot";

  if (!user) return null;

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <SEO
        title="Ballot"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />

      {isWelcomeVisible ? (
        <VotingGuideWelcome onClose={handleWelcomeDismissal} />
      ) : (
        <Layout
          mobileNavTitle={flagLabel || mobileNavTitle}
          showNavLogoOnMobile
        >
          {isLoading && (
            <>
              Ballot Outer <LoaderFlag />
            </>
          )}
          {isSuccess && (
            <>
              {!queriedGuideId && (
                <ElectionSelector
                  elections={
                    data?.electionsByUserState as Partial<ElectionResult>[]
                  }
                  selectedElectionId={selectedElectionId as string}
                  setSelectedElectionId={setSelectedElectionId}
                />
              )}

              <VotingGuideProvider votingGuideId={votingGuideId}>
                {isLoading && (
                  <div className={styles.center}>
                    Ballot inner
                    <LoaderFlag />
                  </div>
                )}
                {error && (
                  <h4>Something went wrong fetching your ballot data...</h4>
                )}
                {selectedElectionId && (
                  <div data-testid="ballot-page">
                    <Election
                      electionId={selectedElectionId}
                      flagLabel={flagLabel}
                    />
                  </div>
                )}
              </VotingGuideProvider>
            </>
          )}
        </Layout>
      )}
    </>
  );
};

export default BallotPage;

export const getServerSideProps: GetServerSideProps = async () => {
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
    },
  };
};
