import { Box, Layout } from "components";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { DashboardTopNav } from "../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { EmbedType, useEmbedByIdQuery } from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideEmbedPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useEmbedByIdQuery({
    id: id as string,
  });
  const title = data?.embedById.race?.title as string;
  const candidateGuideId = data?.embedById.candidateGuide?.id as string;
  return (
    <>
      <EmbedHeader title={title} embedType={EmbedType.CandidateGuide} />
      <EmbedPageTabs embedType={EmbedType.CandidateGuide} />
      <section>
        <h3>Preview</h3>
        <Box>
          <CandidateGuideEmbed
            embedId={id as string}
            candidateGuideId={candidateGuideId}
            origin={window.location.origin}
          />
        </Box>
      </section>
    </>
  );
}

CandidateGuideEmbedPage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
