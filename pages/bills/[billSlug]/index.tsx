import { useMemo, useCallback } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import ReactMarkdown from "react-markdown";
import { BsChevronLeft } from "react-icons/bs";

import {
  IssueTags,
  Candidate,
  FlagSection,
  Layout,
  LoaderFlag,
  LegislationStatusBox,
  Button,
  SupportOppose,
} from "components";
import { CommitteeTag } from "components/PoliticianPage/CommitteesSection/CommitteesSection";
import { SupportedLocale } from "types/global";

import {
  PoliticianResult,
  useBillBySlugQuery,
  IssueTagResult,
} from "generated";

import styles from "../BillBySlug.module.scss";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as SupportedLocale;
  return {
    props: {
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
  const slug = router.query.billSlug as string;

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
        <FlagSection
          label={bill?.session?.name ?? ""}
          hideFlagForMobile
          style={{ marginTop: "9rem" }}
        >
          <div className={styles.billContainer}>
            <header>
              <h3>{bill?.billNumber}</h3>
              <h1>{bill?.title}</h1>
              {bill?.issueTags && (
                <IssueTags tags={bill.issueTags as IssueTagResult[]} />
              )}
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
              <section className={styles.center}>
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
      <footer className={styles.supportOpposeMobileContainer}>
        {$supportOppose}
      </footer>
    </>
  );
}

export default BillPage;
