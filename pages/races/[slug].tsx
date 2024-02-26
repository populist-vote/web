import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Layout, LoaderFlag } from "components";
import { Race } from "components/Ballot/Race";
import { Box } from "components/Box/Box";
import { RaceBySlugQuery, RaceResult, useRaceBySlugQuery } from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { SupportedLocale } from "types/global";

interface RacePageProps {
  slug: string;
  mobileNavTitle?: string;
}

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx;
  const { slug } = params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: useRaceBySlugQuery.getKey({ slug }),
    queryFn: useRaceBySlugQuery.fetcher({ slug }),
  });

  const dehydratedState = dehydrate(queryClient);
  const data = dehydratedState.queries[0]?.state.data as RaceBySlugQuery;
  const race = data.raceBySlug as RaceResult;

  return {
    props: {
      slug,
      dehydratedState,
      title: race.title,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function RacePage({ slug, mobileNavTitle }: RacePageProps) {
  const { data, isLoading } = useRaceBySlugQuery(
    {
      slug: slug as string,
    },
    {
      enabled: !!slug,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  if (isLoading) return <LoaderFlag />;

  const race = data?.raceBySlug as RaceResult;

  return (
    <Layout mobileNavTitle={mobileNavTitle}>
      <h1>{race.title}</h1>
      <Box>
        <Race race={race} itemId={race.id} />
      </Box>
    </Layout>
  );
}
