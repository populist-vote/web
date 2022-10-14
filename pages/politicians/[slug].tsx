import type { GetServerSideProps } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import {
  Layout,
  LoaderFlag,
  HeaderSection,
  ElectionInfoSection,
  SEO,
} from "components";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import {
  PoliticianBySlugQuery,
  PoliticianResult,
  RatingResultEdge,
  usePoliticianBySlugQuery,
  GetCandidateBioResponse,
  DonationsSummary,
  DonationsByIndustry,
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
  const slug = query.slug as string;

  const votingGuideId = query[`voting-guide`] as string;

  const { data, isLoading, error } = usePoliticianBySlugQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (isLoading) return <LoaderFlag />;
  if (error) return <>Error: {error}</>;

  const politician = data?.politicianBySlug as PoliticianResult;

  const endorsements = politician?.endorsements;
  const ratings = politician?.ratings.edges as Array<RatingResultEdge>;

  const donationsSummary = politician?.donationsSummary as DonationsSummary;
  const donationsByIndustry =
    politician?.donationsByIndustry as DonationsByIndustry;
  const sponsoredBills = politician?.sponsoredBills || { edges: [] };

  return (
    <>
      <SEO title={`Politicians | ${politician?.fullName}`} />
      <Layout
        mobileNavTitle={mobileNavTitle}
        showNavBackButton
        showNavLogoOnMobile={true}
      >
        <VotingGuideProvider votingGuideId={votingGuideId || ""}>
          <div className={styles.container}>
            <HeaderSection politician={politician} />
            {politician?.currentOffice && (
              <OfficeSection currentOffice={politician?.currentOffice} />
            )}

            <ElectionInfoSection politician={politician} />
            <div className={styles.infoCommitteeWrapper}>
              <BasicInfoSection politician={politician} />
              <CommitteesSection
                votesmartCandidateBio={
                  politician?.votesmartCandidateBio as GetCandidateBioResponse
                }
              />
            </div>
            <SponsoredBillsSection sponsoredBills={sponsoredBills} />
            <EndorsementsSection endorsements={endorsements} />
            <RatingsSection ratings={ratings} />
            <FinancialsSection
              donationsSummary={donationsSummary}
              donationsByIndustry={donationsByIndustry}
            />
            <BioSection
              biography={politician.biography as string}
              biographySource={politician.biographySource as string}
            />
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
    usePoliticianBySlugQuery.getKey({ slug }),
    usePoliticianBySlugQuery.fetcher({ slug })
  );
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as PoliticianBySlugQuery;

  return {
    notFound: !data,
    props: {
      dehydratedState: state,
      mobileNavTitle: data?.politicianBySlug.fullName,
    },
  };
};
