import { Layout, LoaderFlag } from "components";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "components/Layout/Layout.module.scss";
import {
  PoliticalScope,
  RaceResult,
  useUpcomingElectionsQuery,
  useUpsertVotingGuideMutation,
} from "generated";
import { FlagSection } from "components";
import { dateString } from "utils/dates";
import { groupBy } from "utils/groupBy";
import { dehydrate, QueryClient } from "react-query";
import { useAuth } from "hooks/useAuth";
import { VotingGuideWelcome } from "components/VotingGuide/VotingGuideWelcome";
import { useState } from "react";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { OfficeRaces } from "components/Ballot/OfficeRaces";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const user = useAuth({ redirectTo: "/login?next=ballot" });
  const { data, error, isLoading } = useUpcomingElectionsQuery(
    {},
    {
      enabled: !!user?.id,
    }
  );

  const upcomingElection = data?.upcomingElections[0];
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

  const createVotingGuide = useUpsertVotingGuideMutation();

  const handleWelcomeDismissal = () => {
    setIsWelcomeVisible(false);
    localStorage.setItem("voting-guide-welcome-visible", "false");
    createVotingGuide.mutate({ electionId: upcomingElection?.id as string });
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
