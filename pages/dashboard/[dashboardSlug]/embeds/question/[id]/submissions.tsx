import { Layout, LoaderFlag } from "components";
import {
  EmbedType,
  QuestionSubmissionResult,
  Sentiment,
  useOrganizationBySlugQuery,
  useQuestionEmbedByIdQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import { Table } from "components/Table/Table";
import { getRelativeTimeString } from "utils/dates";
import { useTheme } from "hooks/useTheme";
import { ColumnDef } from "@tanstack/react-table";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { Box } from "components/Box/Box";
import styles from "components/PollMetrics/PollMetrics.module.scss";
import {
  CountOverTimeLineChart,
} from "components/PollMetrics/PollMetrics";
import { BsCircleFill } from "react-icons/bs";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { Badge } from "components/Badge/Badge";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: {
    dashboardSlug: string;
    id: string;
  };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      id: query.id,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function EmbedById({
  dashboardSlug,
  id,
}: {
  dashboardSlug: string;
  id: string;
}) {
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      retry: false,
      enabled: !!dashboardSlug,
    }
  );

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
    redirectTo: `/login?redirect=${encodeURIComponent(
      `/dashboard/${dashboardSlug}/embeds/question/${id}/submission`
    )}`,
  });

  const { data, isLoading: embedLoading } = useQuestionEmbedByIdQuery({
    id,
  });

  const question = data?.embedById?.question;
  const prompt = question?.prompt || "";
  const submissions = question?.submissions || [];
  const submissionCountByDate = question?.submissionCountByDate || [];
  const commonWords = question?.commonWords || [];
  const sentimentCounts = question?.sentimentCounts.filter(
    (s) => s.sentiment !== Sentiment.Unknown
  );
  const generalSentiment = sentimentCounts?.[0]?.sentiment;

  const renderSentimentBadge = () => {
    switch (generalSentiment) {
      case Sentiment.Positive:
        return (
          <Badge size="small" theme="green-support">
            Positive
          </Badge>
        );
      case Sentiment.Negative:
        return (
          <Badge size="small" theme="red">
            Negative
          </Badge>
        );
      case Sentiment.Neutral:
        return (
          <Badge size="small" theme="yellow">
            Neutral
          </Badge>
        );
    }
  };

  return organizationQuery.isLoading || isLoading || !user || embedLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <EmbedHeader title={prompt} embedType={EmbedType.Question} />
      <EmbedPageTabs embedType={EmbedType.Question} selectedTab="Submissions" />
      <div className={styles.container}>
        <section className={styles.basics}>
          <Box width="fit-content">
            <div className={styles.responseCount}>
              <h1>{submissions.length}</h1>
              <h4>Responses</h4>
            </div>
          </Box>
          <div style={{ width: "100%" }}>
            <div className={styles.lineChartHeader}>
              <h3 className={styles.heading}>Activity Over Time</h3>
              <div className={styles.flexBetween}>
                <BsCircleFill color="#006586" />
                <h5>Responses</h5>
              </div>
            </div>
            <Box flexDirection="row">
              <div className={styles.flexChild}>
                <CountOverTimeLineChart countByDate={submissionCountByDate} />
              </div>
            </Box>
          </div>
        </section>
        <section>
          <h3 className={styles.heading}>Insights</h3>
          <div className={styles.flexBetween}>
            <Box>
              <div
                className={styles.flexBetween}
                style={{ marginTop: "0.5rem" }}
              >
                <h4>Popular words</h4>
                <div className={styles.flexBetween}>
                  {commonWords.length > 0 ? (
                    commonWords.slice(0, 3).map(({ word }) => (
                      <Badge size="small" key={word} theme="blue">
                        {word}
                      </Badge>
                    ))
                  ) : (
                    <small style={{ color: "var(--blue-text)" }}>
                      Not enough data
                    </small>
                  )}
                </div>
              </div>
            </Box>
            <Box>
              <div
                className={styles.flexBetween}
                style={{ marginTop: "0.5rem" }}
              >
                <h4>General sentiment</h4>
                {!!generalSentiment ? (
                  renderSentimentBadge()
                ) : (
                  <small style={{ color: "var(--blue-text)" }}>
                    Not enough data
                  </small>
                )}
              </div>
            </Box>
          </div>
        </section>

        {submissions?.length > 0 && (
          <section>
            <h3 className={styles.heading}>Responses</h3>
            <QuestionSubmissionsTable submissions={submissions} />
          </section>
        )}
      </div>
    </>
  );
}

function QuestionSubmissionsTable({
  submissions,
}: {
  submissions: Partial<QuestionSubmissionResult>[];
}) {
  const { theme } = useTheme();
  const columns = useMemo<ColumnDef<Partial<QuestionSubmissionResult>>[]>(
    () => [
      {
        header: "Response",
        accessorKey: "response",
      },
      {
        header: "Name",
        accessorKey: "respondent.name",
      },
      {
        header: "Email",
        accessorKey: "respondent.email",
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 100,
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      initialState={{}}
      data={submissions}
      theme={theme}
    />
  );
}

EmbedById.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedById;
