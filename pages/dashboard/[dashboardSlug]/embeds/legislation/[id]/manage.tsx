import { Layout, LoaderFlag } from "components";
import { EmbedPage } from "components/EmbedPage/EmbedPage";
import {
  EmbedType,
  useLegislationEmbedByIdQuery,
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
    embedType: EmbedType;
  };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.dashboardSlug,
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
    }
  );

  const embedQuery = useLegislationEmbedByIdQuery(
    {
      id,
    },
    {
      retry: false,
      staleTime: 1000 * 60 * 5,
    }
  );

  const userQuery = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  const isLoading =
    userQuery.isLoading || embedQuery.isLoading || organizationQuery.isLoading;

  const embed = embedQuery.data?.embedById;
  const bill = embed?.bill;
  const title = embed?.name || `${bill?.state} ${bill?.billNumber}`;

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader
        title={title}
        embedType={EmbedType.Legislation}
        backLink={`/dashboard/${dashboardSlug}/embeds/legislation`}
      />
      <EmbedPage id={id} embedType={EmbedType.Legislation} />
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
