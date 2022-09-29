import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { dehydrate, QueryClient, useQueryClient } from "react-query";

import { Layout, LoaderFlag, VotingGuideWelcome } from "components";

import {
  ElectionResult,
  useElectionsQuery,
  useElectionVotingGuideByUserIdQuery,
  useUpsertVotingGuideMutation,
  useVotingGuideByIdQuery,
} from "generated";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";

import { VOTING_GUIDE_WELCOME_VISIBLE } from "utils/constants";

import styles from "components/Layout/Layout.module.scss";
import { SEO } from "components";
import { Election } from "components/Ballot/Election";
import { ElectionSelector } from "components/Ballot/ElectionSelector/ElectionSelector";
import { useRouter } from "next/router";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const router = useRouter();
  const user = useAuth({ redirectTo: `/ballot/choose` });
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, error } = useElectionsQuery();
  const [selectedElectionId, setSelectedElectionId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (isSuccess)
      setSelectedElectionId(
        // Sort by most current election - copy array to preserve chronological order
        [...(data?.electionsByUserState as ElectionResult[])].sort((a, b) => {
          const today = new Date();
          const distancea = Math.abs(
            today.getTime() - new Date(a.electionDate).getTime()
          );
          const distanceb = Math.abs(
            today.getTime() - new Date(b.electionDate).getTime()
          );
          return distancea - distanceb;
        })[0]?.id
      );
  }, [isSuccess, data]);

  const createVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => queryClient.invalidateQueries(userVotingGuideQueryKey),
  });

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

  // Use either the voting guide ID from query params OR the users voting guide ID
  // to instantiate the VotingGuideContext
  const queriedGuideId = router.query[`voting-guide`];
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
          {isLoading && <LoaderFlag />}
          {isSuccess && (
            <>
              <ElectionSelector
                elections={
                  data?.electionsByUserState as Partial<ElectionResult>[]
                }
                selectedElectionId={selectedElectionId as string}
                setSelectedElectionId={setSelectedElectionId}
              />
              <VotingGuideProvider votingGuideId={votingGuideId}>
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
