import { Layout, LoaderFlag } from "components";
import {
  EmbedType,
  PollResult,
  useOrganizationBySlugQuery,
  usePollEmbedByIdQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { PollMetrics } from "components/PollMetrics/PollMetrics";
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
        nextI18nextConfig
      )),
    },
  };
}

function EmbedById({
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
      enabled: !!dashboardSlug,
    }
  );

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
    redirectTo: `/login?redirect=${encodeURIComponent(
      `/dashboard/${dashboardSlug}/embeds/poll/${id}/submissions`
    )}`,
  });

  const { data, isLoading: embedLoading } = usePollEmbedByIdQuery({
    id,
  });

  const poll = data?.embedById.poll as PollResult;
  const prompt = poll?.prompt;

  return organizationQuery.isLoading || isLoading || !user || embedLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={prompt} embedType={EmbedType.Poll} />
      <EmbedPageTabs embedType={EmbedType.Poll} selectedTab="Submissions" />
      <PollMetrics poll={poll} />
    </>
  );
}

EmbedById.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedById;
