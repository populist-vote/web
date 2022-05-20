import { NextPage } from "next";
import Head from "next/head";
import { Layout, Avatar, FlagSection } from "components";
import styles from "./VotingGuides.module.scss";

const VotingGuides: NextPage<{}> = () => {
  return (
    <>
      <Head>
        <title>Populist - Voting Guides</title>
        <meta name="description" content="View Voting Guides." />
      </Head>

      <Layout showNavLogoOnMobile={false}>
        <FlagSection title="Voting Guides">
        <h1>June 28, 2022</h1>
        <hr />
        <h2>Colorado Primaries</h2>
        <p className={styles.smallText}>Primary elections for the general election later this year on November 8, 2022.</p>
        <div className={styles.roundedCard}>
          <div className={styles.guideContainer}>
            <div className={styles.avatarContainer}>
              <Avatar src="https://www.gravatar.com/avatar/" size={80} fallbackSrc="https://www.gravatar.com/avatar/" alt="Henry Lai" />
              <h4>Henry Lai</h4>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.button}>Edit</button>
              <button className={styles.buttonPrimary}>Share</button>
            </div>
          </div>
        </div>

        </FlagSection>
      </Layout>
    </>
  );
};

export default VotingGuides;
