import { Layout, LoaderFlag, PartyAvatar, VerticalDivider } from "components";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "components/Layout/Layout.module.scss";
import {
  PoliticalParty,
  PoliticalScope,
  PoliticianResult,
  RaceResult,
  useUpcomingElectionsQuery,
} from "generated";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { FlagSection, FieldSet } from "components";

import dynamic from "next/dynamic";
import { dateString } from "utils/dates";
import { useAuth } from "hooks/useAuth";
import { groupBy } from "utils/groupBy";
import Link from "next/link";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

// Races associated with a single office (to handle primaries)
const OfficeRacesSlider = ({ races }: { races: RaceResult[] }) => {
  const office = races[0].office;

  let incumbentId = office.incumbent?.id;

  // Display race that has incumbent first
  const raceSortFn = (a: RaceResult, b: RaceResult) =>
    a.candidates.some((politician) => politician.id === incumbentId) &&
    !b.candidates.some((politician) => politician.id === incumbentId)
      ? -1
      : 1;

  const candidateSortFn = (a: PoliticianResult, b: PoliticianResult) =>
    a.id === incumbentId && b.id !== incumbentId ? -1 : 1;

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset}`}
      >
        <h2>
          <span>{office?.title} </span>
          {/* If the district is not a number, don't display it */}
          {!isNaN(parseInt(office?.district as string)) && (
            <span>{`District ${office?.district}`}</span>
          )}
        </h2>
        <h3>{office.state}</h3>
      </header>

      <div className={`${styles.roundedCard}`}>
        <Scroller>
          <div className={styles.flexBetween}>
            {races.sort(raceSortFn).map((race) => (
              <FieldSet
                heading={race.title}
                color={
                  race.party === PoliticalParty.Republican ? "red" : "blue"
                }
                key={race.id}
              >
                {race.candidates
                  .sort(candidateSortFn)
                  ?.map((politician: PoliticianResult) => (
                    <div
                      className={styles.flexBetween}
                      key={politician.id}
                      style={{ height: "9rem" }}
                    >
                      {politician.id == incumbentId && (
                        <span className={styles.sideText}>INCUMBENT</span>
                      )}
                      <Link href={`/politicians/${politician.slug}`} passHref>
                        <div className={styles.avatarContainer}>
                          <PartyAvatar
                            size={80}
                            party={
                              politician?.party || ("Unknown" as PoliticalParty)
                            }
                            src={
                              politician?.thumbnailImageUrl ||
                              PERSON_FALLBACK_IMAGE_URL
                            }
                            fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                            alt={politician.fullName}
                          />
                          <h4>{politician.fullName}</h4>
                        </div>
                      </Link>
                      {politician.id == incumbentId &&
                        race.candidates.length > 1 && <VerticalDivider />}
                    </div>
                  ))}
              </FieldSet>
            ))}
          </div>
        </Scroller>
      </div>
    </>
  );
};

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const { data, error, isLoading } = useUpcomingElectionsQuery();

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

  const { user } = useAuth({ redirectTo: "/login" });

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
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={false}>
        {isLoading && (
          <div className={styles.center}>
            <LoaderFlag />
          </div>
        )}
        {error && <h4>Something went wrong fetching politician records...</h4>}

        {upcomingElection && (
          <>
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
                      <OfficeRacesSlider
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
                    <OfficeRacesSlider
                      key={officeId}
                      races={races as RaceResult[]}
                    />
                  )
                )}
              </FlagSection>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default BallotPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      mobileNavTitle: "My Ballot",
    },
  };
};
