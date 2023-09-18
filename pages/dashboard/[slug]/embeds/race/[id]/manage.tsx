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
import { useRouter } from "next/router";
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
  const router = useRouter();
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      onError: () => void router.push("/404"),
      onSuccess: (data) => {
        if (!data.organizationBySlug) {
          void router.push("/404");
        }
      },
      retry: false,
    }
  );

  const embedQuery = useEmbedByIdQuery(
    {
      id,
    },
    {
      onError: () => void router.push("/404"),
      onSuccess: (data) => {
        if (!data.embedById) {
          void router.push("/404");
        }
      },
      retry: false,
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
      <EmbedHeader title={title} embedType={EmbedType.Race} />
      <EmbedPage id={id} embedType={EmbedType.Race} />
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
