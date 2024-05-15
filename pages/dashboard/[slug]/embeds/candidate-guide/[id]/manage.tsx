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
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: {
    slug: string;
    id: string;
    embedType: EmbedType;
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
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      retry: false,
    }
  );

  const embedQuery = useEmbedByIdQuery(
    {
      id,
    },
    {
      retry: false,
    }
  );

  const userQuery = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  const isLoading =
    userQuery.isLoading || embedQuery.isLoading || organizationQuery.isLoading;

  const embed = embedQuery.data?.embedById;
  const bills = embed?.bills;
  const title = bills?.map((b) => b.billNumber).join(", ") as string;

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={title} embedType={EmbedType.CandidateGuide} />
      <EmbedPage id={id} embedType={EmbedType.CandidateGuide} />
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
