import { Layout, LoaderFlag, PartyAvatar, VerticalDivider } from "components";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "components/Layout/Layout.module.scss";
import {
  PoliticalParty,
  PoliticalScope,
  PoliticianResult,
  RaceResult,
  UpcomingElectionsDocument,
  useUpcomingElectionsQuery,
} from "generated";
import { PERSON_FALLBACK_IMAGE_URL } from "util/constants";
import FlagSection from "components/FlagSection/FlagSection";

import dynamic from "next/dynamic";
import { dateString } from "util/dates";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

const RaceSlider = ({ race }: { race: RaceResult }) => {
  const { state, office } = race;

  let incumbentPolitician = race.candidates?.find(
    (politician) => politician.id === race.office?.incumbent?.id
  );

  let otherPoliticians = race.candidates?.filter(
    (politician) => politician.id !== race.office?.incumbent?.id
  );

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset}`}
      >
        <h2>
          <span>{office?.title}</span>{" "}
          <span>{`District ${office?.district}`}</span>
        </h2>
        <h3>{state}</h3>
      </header>

      <div className={`${styles.roundedCard} ${styles.flexBetween}`}>
        <Scroller>
          <div>
            {incumbentPolitician && (
              <div className={`${styles.flexBetween}`}>
                <span className={styles.sideText}>INCUMBENT</span>
                <div className={styles.avatarContainer}>
                  <PartyAvatar
                    size={80}
                    party={
                      incumbentPolitician?.party ||
                      ("Unknown" as PoliticalParty)
                    }
                    src={
                      incumbentPolitician?.thumbnailImageUrl ||
                      PERSON_FALLBACK_IMAGE_URL
                    }
                    fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                    alt={incumbentPolitician.fullName}
                  />
                  <h4>{incumbentPolitician.fullName}</h4>
                </div>
              </div>
            )}
          </div>
          <VerticalDivider />
          <div>
            {otherPoliticians?.map((politician: PoliticianResult) => (
              <div className={styles.avatarContainer} key={politician.id}>
                <PartyAvatar
                  size={80}
                  party={politician?.party || ("Unknown" as PoliticalParty)}
                  src={
                    politician?.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL
                  }
                  fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                  alt={politician.fullName}
                />
                <h4>{politician.fullName}</h4>
              </div>
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

  const federalRaces = upcomingElection?.races.filter(
    (race) => race.office.politicalScope === PoliticalScope.Federal
  );

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
            {" "}
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

            {federalRaces && federalRaces.length > 0 && (
              <FlagSection title="Federal" color="salmon">
                {federalRaces.map((race) => (
                  <RaceSlider key={race.id} race={race as RaceResult} />
                ))}
              </FlagSection>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default BallotPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      mobileNavTitle: "My Ballot",
    },
  };
};
