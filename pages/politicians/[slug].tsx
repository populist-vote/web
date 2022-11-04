import type { GetServerSideProps } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { dehydrate, QueryClient } from "react-query";
import {
  Layout,
  HeaderSection,
  ElectionInfoSection,
  LoaderFlag,
  VotingGuideNav,
} from "components";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import {
  GetCandidateBioResponse,
  PoliticianBasicInfoQuery,
  PoliticianResult,
  usePoliticianBasicInfoQuery,
} from "../../generated";
import styles from "./PoliticianPage.module.scss";
import { OfficeSection } from "components/PoliticianPage/OfficeSection/OfficeSection";
import { BasicInfoSection } from "components/PoliticianPage/BasicInfoSection/BasicInfoSection";
import { CommitteesSection } from "components/PoliticianPage/CommitteesSection/CommitteesSection";
import { SponsoredBillsSection } from "components/PoliticianPage/SponsoredBillsSection/SponsoredBillsSection";
import { EndorsementsSection } from "components/PoliticianPage/EndorsementsSection/EndorsementsSection";
import { RatingsSection } from "components/PoliticianPage/RatingsSection/RatingsSection";
import { BioSection } from "components/PoliticianPage/BioSection/BioSection";
import { FinancialsSection } from "components/PoliticianPage/FinancialsSection/FinancialsSection";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";

function PoliticianPage({
  slug,
  votingGuideId,
  mobileNavTitle,
  referer,
}: {
  slug: string;
  votingGuideId?: string;
  mobileNavTitle?: string;
  referer?: string;
}) {
  const { data, isLoading } = usePoliticianBasicInfoQuery(
    {
      slug: slug as string,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const hasVotingGuide = referer?.includes("voting-guide");

  const basicInfo = data?.politicianBySlug as Partial<PoliticianResult>;

  if (isLoading) return <LoaderFlag />;

  return (
    <Layout
      mobileNavTitle={mobileNavTitle}
      showNavLogoOnMobile={true}
      hasVotingGuide={hasVotingGuide}
    >
      <VotingGuideProvider votingGuideId={votingGuideId || ""}>
        {hasVotingGuide && <VotingGuideNav />}
        <div className={styles.container}>
          <HeaderSection basicInfo={basicInfo} />
          <OfficeSection />
          <ElectionInfoSection />
          <div className={styles.infoCommitteeWrapper}>
            <BasicInfoSection basicInfo={basicInfo} />
            <CommitteesSection
              votesmartCandidateBio={
                basicInfo.votesmartCandidateBio as GetCandidateBioResponse
              }
            />
          </div>
          <SponsoredBillsSection />
          <EndorsementsSection />
          <RatingsSection />
          <FinancialsSection />
          <BioSection />
        </div>
      </VotingGuideProvider>
    </Layout>
  );
}

export default PoliticianPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx;
  const { slug } = params as Params;
  const { votingGuideId = null } = ctx.query || {};
  const referer = ctx.req.headers?.referer || null;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    usePoliticianBasicInfoQuery.getKey({ slug }),
    usePoliticianBasicInfoQuery.fetcher({ slug })
  );
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as PoliticianBasicInfoQuery;

  return {
    notFound: !data,
    props: {
      slug,
      referer,
      votingGuideId,
      dehydratedState: state,
      mobileNavTitle: data?.politicianBySlug.fullName,
      title: data?.politicianBySlug.fullName,
      description: `Check out ${data?.politicianBySlug.fullName}'s voting record, financial data, and more on Populist.`,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};
