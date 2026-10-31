import { Layout, LoaderFlag } from "components";
import { EmbedPage } from "components/EmbedPage/EmbedPage";
import {
  EmbedType,
  useBallotMeasureEmbedByIdQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: {
    dashboardSlug: string;
    id: string;
  };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      id: query.id,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig,
      )),
    },
  };
}

export default function EmbedById({
  dashboardSlug,
  id,
}: {
  dashboardSlug: string;
  id: string;
}) {
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      retry: false,
    },
  );

  const embedQuery = useBallotMeasureEmbedByIdQuery(
    {
      id,
    },
    {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  );

  const userQuery = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  const isLoading =
    userQuery.isLoading || embedQuery.isLoading || organizationQuery.isLoading;

  const embed = embedQuery.data?.embedById;
  const measure = embed?.ballotMeasure;
  const title = embed?.name || measure?.ballotMeasureCode || "Ballot Measure";

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader
        title={title}
        embedType={EmbedType.BallotMeasure}
        backLink={`/dashboard/${dashboardSlug}/embeds/ballot-measure`}
      />
      <EmbedPage id={id} embedType={EmbedType.BallotMeasure} />
    </>
  );
}

EmbedById.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
