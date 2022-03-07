import {
  Layout,
  PartyAvatar,
  Scroller,
  Spacer,
  VerticalDivider,
} from "components";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "components/Layout/Layout.module.scss";
import { PoliticalParty, RaceResult, State } from "generated";
import { PERSON_FALLBACK_IMAGE_URL } from "util/constants";
import FlagSection from "components/FlagSection/FlagSection";
import { useMediaQuery } from "hooks/useMediaQuery";
import states from "util/states";

const RaceSlider = ({ race }: { race: Partial<RaceResult> }) => {
  const { title = "U.S. Seante", state = "Colorado" } = race;

  return (
    <>
      <div className={`${styles.bold} ${styles.flexBetween} ${styles.inset}`}>
        <h2>{title}</h2>
        <h3>{state}</h3>
      </div>

      <div className={`${styles.roundedCard} ${styles.flexBetween}`}>
        <Scroller>
          <div className={`${styles.flexBetween}`}>
            <span className={styles.sideText}>INCUMBENT</span>
            <div className={styles.avatarContainer}>
              <PartyAvatar
                size={80}
                party={"REPUBLICAN" as PoliticalParty}
                src="https://static.wikia.nocookie.net/anchorman/images/1/10/Ron_burgundy.jpg/revision/latest?cb=20120329160125"
                fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                alt={"Ron Burgundy"}
              />
              <h4>Ron Burgundy</h4>
            </div>
          </div>
          <VerticalDivider />
          <div className={styles.avatarContainer}>
            <PartyAvatar
              size={80}
              party={"REPUBLICAN" as PoliticalParty}
              src="https://static.wikia.nocookie.net/anchorman/images/1/10/Ron_burgundy.jpg/revision/latest?cb=20120329160125"
              fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
              alt={"Ron Burgundy"}
            />
            <h4>Ron Burgundy</h4>
          </div>
          <div className={styles.avatarContainer}>
            <PartyAvatar
              size={80}
              party={"REPUBLICAN" as PoliticalParty}
              src="https://static.wikia.nocookie.net/anchorman/images/1/10/Ron_burgundy.jpg/revision/latest?cb=20120329160125"
              fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
              alt={"Ron Burgundy"}
            />
            <h4>Ron Burgundy</h4>
          </div>
          <div className={styles.avatarContainer}>
            <PartyAvatar
              size={80}
              party={"REPUBLICAN" as PoliticalParty}
              src="https://static.wikia.nocookie.net/anchorman/images/1/10/Ron_burgundy.jpg/revision/latest?cb=20120329160125"
              fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
              alt={"Ron Burgundy"}
            />
            <h4>Ron Burgundy</h4>
          </div>
        </Scroller>
      </div>
    </>
  );
};

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

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
        <h1 className={styles.desktopOnly}>Ballot</h1>

        <FlagSection title="Upcoming Vote">
          <h1>June 28, 2022</h1>
          <h2>Primary Election</h2>
          <p>
            Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque
            ornare sem lacinia quam venenatis vestibulum. Etiam porta sem
            malesuada magna mollis euismod. Vivamus sagittis lacus vel augue
            laoreet rutrum faucibus dolor auctor.
          </p>
        </FlagSection>
        <FlagSection title="Federal" color="green">
          <RaceSlider
            race={{ title: "U.S. Senate", state: states.CO as State }}
          />
          <RaceSlider
            race={{ title: "U.S. House", state: states.CO as State }}
          />
        </FlagSection>
        <FlagSection title="State" color="yellow">
          <RaceSlider
            race={{ title: "State Senate", state: states.CO as State }}
          />
          <RaceSlider race={{ title: "Governor", state: states.CO as State }} />
        </FlagSection>
        <FlagSection title="Local" color="salmon">
          <RaceSlider
            race={{ title: "Denver Mayor", state: states.CO as State }}
          />
        </FlagSection>
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
