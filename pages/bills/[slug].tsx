import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { IssueTags, Candidate, FlagSection } from "components";
import { PoliticianResult } from "generated";

import {
  Layout,
  LoaderFlag,
  LegislationStatusBox,
  Button,
  SupportOppose,
} from "components";

import { BillBySlugQuery, useBillBySlugQuery } from "generated";
import styles from "./BillBySlug.module.scss";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CommitteeTag } from "components/PoliticianPage/CommitteesSection/CommitteesSection";

const BillPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const { data, isLoading, error } = useBillBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;
  if (error) return <>Error: {error}</>;

  const bill = data?.billBySlug;
  const summary =
    bill?.description || bill?.populistSummary || bill?.officialSummary;

  if (!bill) return null;
  return (
    <>
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
        <FlagSection label="placeholder session info" hideFlagForMobile={true}>
          <div className={styles.billContainer}>
            <header>
              <h3>{bill?.billNumber}</h3>
              <h1>{bill?.title}</h1>
              {bill?.issueTags && <IssueTags tags={bill.issueTags} />}
            </header>

            <section className={styles.statusAndCommitteesSection}>
              <div className={styles.statusSection}>
                <h4>Status</h4>
                <LegislationStatusBox status={bill.status} />
              </div>
              {bill?.legiscanCommitteeName && (
                <div className={styles.committeesSection}>
                  <h4>Committee</h4>
                  <CommitteeTag tag={{ text: bill.legiscanCommitteeName }} />
                </div>
              )}
            </section>

            {summary && (
              <section className={styles.center}>
                <ReactMarkdown>{summary}</ReactMarkdown>
              </section>
            )}

            {bill?.fullTextUrl && (
              <section>
                <a
                  className={styles.buttonWrapper}
                  href={bill?.fullTextUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    variant="secondary"
                    size="medium"
                    label="Full text"
                    width="10rem"
                  />
                </a>
              </section>
            )}

            {bill?.sponsors && bill.sponsors.length > 0 && (
              <section>
                <h2 className={styles.gradientHeader}>Sponsors</h2>
                <div className={styles.sponsorsWrapper}>
                  {bill.sponsors.map((sponsor) => (
                    <Candidate
                      key={sponsor.id}
                      itemId={sponsor.id}
                      candidate={sponsor as PoliticianResult}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </FlagSection>
      </Layout>

      <SupportOppose
        billId={bill?.id}
        billSlug={bill?.slug}
        publicVotes={bill?.publicVotes}
        usersVote={bill?.usersVote}
      />
    </>
  );
};

export default BillPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;
  const locale = ctx.locale as SupportedLocale;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useBillBySlugQuery.getKey({ slug }),
    useBillBySlugQuery.fetcher({ slug })
  );
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as BillBySlugQuery;

  return {
    notFound: state.queries.length === 0 || !data?.billBySlug,
    props: {
      dehydratedState: state,
      mobileNavTitle: data?.billBySlug?.billNumber,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};
