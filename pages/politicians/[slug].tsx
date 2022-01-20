import { stat } from "fs";
import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import Layout from "../../components/Layout/Layout";
import { LoaderFlag } from "../../components/LoaderFlag";
import { usePoliticianBySlugQuery } from "../../generated";

const PoliticianPage: NextPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = usePoliticianBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  return (
    <Layout>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </Layout>
  );
};

export default PoliticianPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    usePoliticianBySlugQuery.getKey({ slug }),
    usePoliticianBySlugQuery.fetcher({ slug })
  );
  let state = dehydrate(queryClient);

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
    },
  };
};
