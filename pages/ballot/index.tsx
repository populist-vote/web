import { Layout } from "components";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "components/Layout/Layout.module.scss";

const BallotPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  return (
    <>
      <Head>
        <title>Populist - The Ballot</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
      <Layout mobileNavTitle={mobileNavTitle}>
        <h1 className={styles.desktopOnly}>Ballot</h1>
        <div className={`${styles.bold} ${styles.flexBetween} ${styles.inset}`}>
          <h2>U.S. Senate</h2>
          <h3>Colorado</h3>
        </div>
        <div className={styles.roundedCard}>
          <h1>People in here</h1>
        </div>
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
