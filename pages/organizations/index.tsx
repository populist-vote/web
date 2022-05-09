import Head from "next/head";
import { ReactElement } from "react";
import { Layout } from "components";
import { NextPageWithLayout } from "../_app";

const OrganizationIndex: NextPageWithLayout = () => {
  return <h1>Organizations</h1>;
};

OrganizationIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Populist - Politician Browser</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
      <Layout>{page}</Layout>
    </>
  );
};

export default OrganizationIndex;
