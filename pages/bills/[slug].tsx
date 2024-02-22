import { useMemo, useCallback } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { BsChevronLeft } from "react-icons/bs";
import { splitAtDigitAndJoin } from "utils/strings";
import clsx from "clsx";

import {
  IssueTags,
  Candidate,
  FlagSection,
  Layout,
  LoaderFlag,
  LegislationStatusBox,
  Button,
  SupportOppose,
  ColoredSection,
} from "components";
import { CommitteeTag } from "components/PoliticianPage/CommitteesSection/CommitteesSection";
import { SupportedLocale } from "types/global";

import {
  PoliticianResult,
  BillBySlugQuery,
  useBillBySlugQuery,
  IssueTagResult,
  BillVote,
} from "generated";

import styles from "./BillBySlug.module.scss";
import { BillVotes } from "components/BillVotes/BillVotes";

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

function BillPage({ mobileNavTitle }: { mobileNavTitle?: string }) {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { data, isLoading, error } = useBillBySlugQuery({ slug });

  const bill = data?.billBySlug;

  const summary =
    bill?.populistSummary || bill?.description || bill?.officialSummary;

  const $supportOppose = useMemo(
    () =>
      bill ? (
        <SupportOppose
          billId={bill?.id}
          billSlug={bill?.slug}
          publicVotes={bill?.publicVotes}
          usersVote={bill?.usersVote}
        />
      ) : null,
    [bill]
  );

  console.log(bill?.sponsors);

  const backAction = useCallback(() => {
    const { referrer } = document;
    if (
      referrer === "" ||
      new URL(referrer).origin !== window.location.origin
    ) {
      void router.push("/bills");
    } else {
      router.back();
    }
  }, [router]);

  if (isLoading) return <LoaderFlag />;
  if (error) return <>Error: {error}</>;
  if (!bill) return null;

  return (
    <>
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
        <nav className={styles.pageHeader}>
          <button className={styles.backLink} onClick={backAction}>
            <BsChevronLeft size={"1.875rem"} /> <span>{bill.billNumber}</span>
          </button>
          <div className={styles.supportOpposeDesktopContainer}>
            {$supportOppose}
          </div>
        </nav>
        <div className={styles.flagSectionContainer}>
          <FlagSection label={bill?.session?.name ?? ""} hideFlagForMobile>
            <div className={styles.billContainer}>
              <header>
                <h3>
                  {bill.state || "U.S."} -{" "}
                  {splitAtDigitAndJoin(bill?.billNumber || "")}
                </h3>
                <h1>{bill?.title}</h1>
                {bill?.issueTags && (
                  <IssueTags tags={bill.issueTags as IssueTagResult[]} />
                )}
              </header>

              <section className={styles.statusAndVotesSection}>
                <div className={styles.statusSection}>
                  <h4>Status</h4>
                  <LegislationStatusBox status={bill.status} />
                </div>

                <BillVotes
                  votes={(bill.legiscanData?.votes as BillVote[]) || []}
                />
              </section>

              {summary && (
                <section className={styles.center}>
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </section>
              )}

              {bill?.fullTextUrl && (
                <section
                  className={clsx(styles.fullTextSection, styles.center)}
                >
                  <a
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

              {bill?.legiscanCommitteeName && (
                <div className={styles.committeesSection}>
                  <h4>Committees</h4>
                  <CommitteeTag tag={{ text: bill.legiscanCommitteeName }} />
                </div>
              )}

              {bill?.sponsors && bill.sponsors.length > 0 && (
                <ColoredSection color="var(--blue)">
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
                </ColoredSection>
              )}
            </div>
          </FlagSection>
        </div>
      </Layout>
      <footer className={styles.supportOpposeMobileContainer}>
        {$supportOppose}
      </footer>
    </>
  );
}

export default BillPage;
