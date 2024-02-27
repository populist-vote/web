import { Layout, LoaderFlag } from "components";
import { EmbedPage } from "components/EmbedPage/EmbedPage";
import {
  EmbedType,
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
    slug: string;
    id: string;
  };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      id: query.id,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function EmbedById({ slug, id }: { slug: string; id: string }) {
  const { data, isLoading: embedLoading } = useEmbedByIdQuery({
    id,
  });
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      retry: false,
    }
  );
  const { isLoading: userLoading } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
    redirectTo: `/login?redirect=${encodeURIComponent(
      `/dashboard/${slug}/embeds/question/${id}/manage`
    )}`,
  });

  const prompt = data?.embedById?.question?.prompt || "";

  const isLoading = embedLoading || userLoading || organizationQuery.isLoading;

  return isLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={prompt} embedType={EmbedType.Question} />
      <EmbedPageTabs embedType={EmbedType.Question} />
      <EmbedPage id={id} embedType={EmbedType.Question} />
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
