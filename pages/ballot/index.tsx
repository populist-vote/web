import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQueryClient } from "react-query";

import {
  Layout,
  LoaderFlag,
  FlagSection,
  VotingGuideWelcome,
  OfficeRaces,
} from "components";

import {
  PoliticalScope,
  RaceResult,
  useElectionVotingGuideByUserIdQuery,
  useNextElectionQuery,
  useUpsertVotingGuideMutation,
  useVotingGuideByIdQuery,
} from "generated";

import { dateString } from "utils/dates";
import { groupBy } from "utils/groupBy";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";

import { VOTING_GUIDE_WELCOME_VISIBLE } from "utils/constants";

import styles from "components/Layout/Layout.module.scss";
import ballotStyles from "./Ballot.module.scss";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const user = useAuth({ redirectTo: "/login?next=ballot" });
  const upcomingElectionsQuery = useNextElectionQuery(
    {},
    {
      enabled: !!user?.id,
    }
  );

  const electionId = upcomingElectionsQuery?.data?.nextElection?.id as string;

  const queryClient = useQueryClient();

  const createVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => queryClient.invalidateQueries(userVotingGuideQueryKey),
  });

  const userVotingGuideQuery = useElectionVotingGuideByUserIdQuery(
    {
      userId: user?.id,
      electionId,
    },
    {
      enabled: !!user?.id && !!electionId,
      onSuccess: (data) => {
        if (!data?.electionVotingGuideByUserId)
          createVotingGuide.mutate({ electionId: electionId as string });
      },
    }
  );

  const userVotingGuideQueryKey = useElectionVotingGuideByUserIdQuery.getKey({
    userId: user?.id,
    electionId,
  });

  const router = useRouter();
  const { addSavedGuideId } = useSavedGuideIds(user?.id);

  // Use either the voting guide ID from query params OR the users voting guide ID
  // to instantiate the VotingGuideContext
  const queriedGuideId = router.query.votingGuideId;
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

  const upcomingElection = upcomingElectionsQuery.data?.nextElection;

  const otherGuideData = otherVotingGuideQuery?.data?.votingGuideById;
  const otherGuideCandidateIds = otherGuideData?.candidates.map(
    (candidate) => candidate.politician.id
  );

  // This is not optimal.  Pulling all races into memory and filtering them to display only races with candidates referenced in voting guide.
  // Need to update API to accept arguments for the `upcomingRaces` query... allRaces vs racesByUserDistrict vs votingGuideRaces?
  const races =
    queriedGuideId && otherVotingGuideQuery.isSuccess
      ? upcomingElection?.races.filter((race) => {
          const raceCandidateIds = race.candidates.map((c) => c.id);
          const racesInGuide = otherGuideCandidateIds?.filter((id) =>
            raceCandidateIds?.includes(id)
          );
          return racesInGuide?.length || 0 > 0;
        }) || []
      : upcomingElection?.racesByUserDistricts || [];

  const federalRacesGroupedByOffice = groupBy(
    races?.filter(
      (race) => race.office.politicalScope === PoliticalScope.Federal
    ),
    (race) => race.office.id
  );
  const stateRacesGroupedByOffice = groupBy(
    races?.filter(
      (race) => race.office.politicalScope === PoliticalScope.State
    ),
    (race) => race.office.id
  );

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(
    localStorage.getItem(VOTING_GUIDE_WELCOME_VISIBLE) !== "false"
  );

  const handleWelcomeDismissal = () => {
    setIsWelcomeVisible(false);
    localStorage.setItem(VOTING_GUIDE_WELCOME_VISIBLE, "false");
  };

  if (upcomingElectionsQuery.isError) {
    router
      .push({ pathname: "/404" })
      .catch((err) => console.error("Problem redirecting to 404", err));
  }

  const flagSectionTitle = otherGuideData
    ? `${
        otherGuideData.user.firstName || otherGuideData.user.username
      }'s Voting Guide`
    : "My Ballot";

  const isLoading =
    upcomingElectionsQuery.isLoading || otherVotingGuideQuery.isLoading;
  const error = upcomingElectionsQuery.error;

  if (!user) return null;
  return (
    <>
      <Head>
        <title>Populist - The Ballot</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>

      {isWelcomeVisible ? (
        <VotingGuideWelcome onClose={handleWelcomeDismissal} />
      ) : (
        <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
          <VotingGuideProvider votingGuideId={votingGuideId}>
            {isLoading && (
              <div className={styles.center}>
                <LoaderFlag />
              </div>
            )}
            {error && (
              <h4>Something went wrong fetching your ballot data...</h4>
            )}
            {upcomingElection && (
              <div data-testid="ballot-page">
                <FlagSection title={flagSectionTitle} hideFlagForMobile={true}>
                {races.length < 1 ? (
                    <h2>
                      Looks like your voting address is outside of our current
                      service area. We will be continuously adding states, so be
                      sure to check back soon!
                    </h2>
                  ) : (
                  <div className={ballotStyles.electionHeader}>
                    {upcomingElection.electionDate && (
                      <h1>{dateString(upcomingElection.electionDate, true)}</h1>
                    )}
                    {upcomingElection.title && (
                      <h4>{upcomingElection.title}</h4>
                    )}
                    {upcomingElection.description && (
                      <p>{upcomingElection.description}</p>
                    )}
                  </div>
                  )}
                </FlagSection>

                {Object.keys(federalRacesGroupedByOffice).length > 0 && (
                  <FlagSection title="Federal" color="aqua">
                    {Object.entries(federalRacesGroupedByOffice).map(
                      ([officeId, races]) => {
                        return (
                          <OfficeRaces
                            key={officeId}
                            races={races as RaceResult[]}
                          />
                        );
                      }
                    )}
                  </FlagSection>
                )}

                {Object.keys(stateRacesGroupedByOffice).length > 0 && (
                  <FlagSection title="State" color="yellow">
                    {Object.entries(stateRacesGroupedByOffice).map(
                      ([officeId, races]) => (
                        <OfficeRaces
                          key={officeId}
                          races={races as RaceResult[]}
                        />
                      )
                    )}
                  </FlagSection>
                )}
              </div>
            )}
          </VotingGuideProvider>
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
