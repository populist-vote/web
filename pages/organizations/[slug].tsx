import { NextPage } from "next";
import { useRouter } from "next/router";
import { LoaderFlag } from "../../components/LoaderFlag";
import { useOrganizationBySlugQuery } from "../../generated";

const OrganizationPage: NextPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  if (error) return <p>Error: {error}</p>;

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
};

export default OrganizationPage;
