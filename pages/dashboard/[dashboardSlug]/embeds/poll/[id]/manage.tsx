import { Layout, LoaderFlag } from "components";
import { EmbedPage } from "components/EmbedPage/EmbedPage";
import {
  EmbedType,
  PollResult,
  useEmbedByIdQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
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
  const { data, isLoading: embedLoading } = useEmbedByIdQuery({
    id,
  });

  const poll = data?.embedById.poll as PollResult;
  const prompt = poll?.prompt;
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      retry: false,
      enabled: !!dashboardSlug,
    }
  );

  const { isLoading: userLoading } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
    redirectTo: `/login?redirect=${encodeURIComponent(
      `/dashboard/${dashboardSlug}/embeds/poll/${id}/manage`
    )}`,
  });

  const isLoading = embedLoading || organizationQuery.isLoading || userLoading;

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={prompt} embedType={EmbedType.Poll} />
      <EmbedPageTabs embedType={EmbedType.Poll} selectedTab="Manage" />
      <EmbedPage id={id} embedType={EmbedType.Poll} />
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
