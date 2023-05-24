import { Layout, LoaderFlag } from "components";
import {
  PollResult,
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
import { toast } from "react-toastify";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { PollMetrics } from "components/PollMetrics/PollMetrics";
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

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
    redirectTo: `/login?redirect=${encodeURIComponent(
      `/dashboard/${slug}/embeds/poll/${id}/submissions`
    )}`,
  });

  const { data, isLoading: embedLoading } = useEmbedByIdQuery(
    {
      id,
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );

  const poll = data?.embedById.poll as PollResult;
  const prompt = poll?.prompt;

  return organizationQuery.isLoading || isLoading || !user || embedLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={prompt} embedType="question" />
      <EmbedPageTabs embedType={"poll"} />
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
