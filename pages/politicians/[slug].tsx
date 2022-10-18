import type { GetServerSideProps } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import {
  Layout,
  HeaderSection,
  ElectionInfoSection,
  SEO,
  LoaderFlag,
  VotingGuideNav,
} from "components";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import {
  GetCandidateBioResponse,
  PoliticianBasicInfoQuery,
  PoliticianResult,
  usePoliticianBasicInfoQuery,
  useVotingGuideByIdQuery,
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

function PoliticianPage({ mobileNavTitle }: { mobileNavTitle?: string }) {
  const { query } = useRouter();
  const votingGuideId = query[`voting-guide`] as string;
  const votingGuideQuery = useVotingGuideByIdQuery({ id: votingGuideId });

  const { data, isLoading } = usePoliticianBasicInfoQuery({
    slug: query.slug as string,
  });
  const basicInfo = data?.politicianBySlug as Partial<PoliticianResult>;

  if (isLoading || votingGuideQuery.isLoading) return <LoaderFlag />;

  return (
    <>
      <SEO title={`Politicians | ${data?.politicianBySlug.fullName}`} />
      <Layout
        mobileNavTitle={mobileNavTitle}
        showNavBackButton
        showNavLogoOnMobile={true}
      >
        <VotingGuideProvider votingGuideId={votingGuideId || ""}>
          <VotingGuideNav />
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
    </>
  );
}

export default PoliticianPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

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
      dehydratedState: state,
      mobileNavTitle: data?.politicianBySlug.fullName,
    },
  };
};
