import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";

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
  useUpcomingElectionsQuery,
  useVotingGuideByIdQuery,
} from "generated";

import { dateString } from "utils/dates";
import { groupBy } from "utils/groupBy";

import { useAuth } from "hooks/useAuth";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useSharedGuideIds } from "hooks/useSharedGuideIds";

import styles from "components/Layout/Layout.module.scss";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const user = useAuth({ redirectTo: "/login?next=ballot" });

  const upcomingElectionsQuery = useUpcomingElectionsQuery(
    {},
    {
      enabled: !!user?.id,
    }
  );

  const router = useRouter();
  const votingGuideId = router.query[`voting-guide`] as string;
  const isSharedGuide = !!votingGuideId;

  const votingGuideQuery = useVotingGuideByIdQuery(
    { id: votingGuideId },
    {
      enabled: isSharedGuide,
    }
  );

  const { addSharedGuideId } = useSharedGuideIds();

  if (isSharedGuide && votingGuideQuery.isSuccess)
    addSharedGuideId(votingGuideId);

  const query = isSharedGuide ? votingGuideQuery : upcomingElectionsQuery;

  const { error, isLoading } = query;

  const upcomingElection = isSharedGuide
    ? votingGuideQuery.data?.votingGuideById.election
    : upcomingElectionsQuery.data?.upcomingElections[0];

  const races = upcomingElection?.racesByUserDistricts || [];

  const federalRacesGroupedByOffice = groupBy(
    races.filter(
      (race) => race.office.politicalScope === PoliticalScope.Federal
    ),
    (race) => race.office.id
  );

  const stateRacesGroupedByOffice = groupBy(
    races.filter((race) => race.office.politicalScope === PoliticalScope.State),
    (race) => race.office.id
  );

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(
    localStorage.getItem("voting-guide-welcome-visible") !== "false"
  );

  const handleWelcomeDismissal = () => {
    setIsWelcomeVisible(false);
    localStorage.setItem("voting-guide-welcome-visible", "false");
  };

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
        <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={false}>
          {isLoading ? (
            <div className={styles.center}>
              <LoaderFlag />
            </div>
          ) : (
            <VotingGuideProvider
              electionId={upcomingElection?.id as string}
              userId={user.id}
            >
              {error && (
                <h4>Something went wrong fetching your ballot data...</h4>
              )}
              {upcomingElection && (
                <div data-testid="ballot-page">
                  <h1 className={styles.desktopOnly}>Ballot</h1>

                  <FlagSection title="Upcoming Vote">
                    <h1>{dateString(upcomingElection?.electionDate)}</h1>
                    <h2>{upcomingElection?.title}</h2>
                    <p>{upcomingElection?.description}</p>
                  </FlagSection>

                  {Object.keys(federalRacesGroupedByOffice).length > 0 && (
                    <FlagSection title="Federal" color="salmon">
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
    useUpcomingElectionsQuery.getKey(),
    useUpcomingElectionsQuery.fetcher()
  );

  const state = dehydrate(queryClient);

  return {
    props: {
      dehydratedState: state,
      mobileNavTitle: "My Ballot",
    },
  };
};
