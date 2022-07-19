import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQueryClient } from "react-query";

import { Layout, LoaderFlag, VotingGuideWelcome } from "components";

import {
  ElectionResult,
  useElectionsQuery,
  useElectionVotingGuideByUserIdQuery,
  useNextElectionQuery,
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

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const router = useRouter();
  const { asPath } = router;
  const user = useAuth({ redirectTo: `/login?next=${asPath}` });
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, error } = useElectionsQuery();
  const [selectedElectionId, setSelectedElectionId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (isSuccess) setSelectedElectionId(data?.elections[0]?.id);
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
                elections={data?.elections as Partial<ElectionResult>[]}
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
    useNextElectionQuery.getKey(),
    useNextElectionQuery.fetcher()
  );

  const state = dehydrate(queryClient);

  return {
    props: {
      dehydratedState: state,
      mobileNavTitle: "My Ballot",
    },
  };
};
