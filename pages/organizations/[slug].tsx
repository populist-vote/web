import { useRouter } from "next/router";
import { Layout, LoaderFlag } from "components";
import {
  OrganizationBySlugQuery,
  useOrganizationBySlugQuery,
} from "../../generated";
import { GetServerSideProps } from "next";
import { Params } from "next/dist/server/router";
import { dehydrate, QueryClient } from "react-query";

function OrganizationPage({ mobileNavTitle }: { mobileNavTitle: string }) {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  if (error) return <p>Error: {error}</p>;

  const { organizationBySlug: organization } = data || {};
  return (
    <Layout
      mobileNavTitle={mobileNavTitle}
      showNavBackButton
      showNavLogoOnMobile={true}
    >
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <h1>{organization?.name}</h1>
      <p>{organization?.description}</p>
    </Layout>
  );
}

export default OrganizationPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useOrganizationBySlugQuery.getKey({ slug }),
    useOrganizationBySlugQuery.fetcher({ slug })
  );
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as OrganizationBySlugQuery;

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
      mobileNavTitle: data.organizationBySlug?.name,
    },
  };
};
