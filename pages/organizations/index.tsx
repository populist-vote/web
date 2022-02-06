import { NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout/Layout";

const OrganizationIndex: NextPage = () => {
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

export default OrganizationIndex;
