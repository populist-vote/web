import { ReactElement } from "react";
import { Layout, SEO } from "components";
import { NextPageWithLayout } from "../_app";

const OrganizationIndex: NextPageWithLayout = () => {
  return <h1>Organizations</h1>;
};

OrganizationIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <SEO
        title="Politician Browser"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <Layout>{page}</Layout>
    </>
  );
};

export default OrganizationIndex;
