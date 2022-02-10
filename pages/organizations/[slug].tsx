import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

import { Layout, LoaderFlag } from "components";
import { useOrganizationBySlugQuery } from "../../generated";
import { NextPageWithLayout } from "../_app";

const OrganizationPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  if (error) return <p>Error: {error}</p>;

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
};

OrganizationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default OrganizationPage;
