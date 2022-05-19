// import { ReactElement } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Layout } from "components";
import styles from "components/Layout/Layout.module.scss";

const VoterGuides: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  return (
    <>
      <Head>
        <title>Populist - Voter Guides</title>
        <meta name="description" content="View Voter Guides." />
      </Head>

      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={false}>
        <h2>mobileNavTitle: {mobileNavTitle}</h2>
      </Layout>
    </>
  );
};

export default VoterGuides;
