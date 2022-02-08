import { NextPage } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import Layout from "../../components/Layout/Layout";
import { NextPageWithLayout } from "../_app";

const OrganizationIndex: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Populist - Politician Browser</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
      <Layout>
        <h1>Organizations</h1>
      </Layout>
    </>
  );
};

OrganizationIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default OrganizationIndex;
