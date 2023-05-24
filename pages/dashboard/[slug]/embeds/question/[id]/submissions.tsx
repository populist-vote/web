import { Layout, LoaderFlag } from "components";
import {
  QuestionSubmissionResult,
  useEmbedByIdQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import { Table } from "components/Table/Table";
import { getRelativeTimeString } from "utils/dates";
import { useTheme } from "hooks/useTheme";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { Box } from "components/Box/Box";
import styles from "components/PollMetrics/PollMetrics.module.scss";
import { SubmissionsOverTimeLineChart } from "components/PollMetrics/PollMetrics";
import { BsCircleFill } from "react-icons/bs";

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

  const submissions = data?.embedById?.question?.submissions || [];
  const submissionCountByDate =
    data?.embedById?.question?.submissionCountByDate || [];

  return organizationQuery.isLoading || isLoading || !user || embedLoading ? (
    <LoaderFlag />
  ) : (
    <>
      <h2>Question Embed</h2>
      <EmbedPageTabs embedType="question" />
      <div className={styles.container}>
        <Box width="fit-content">
          <div className={styles.responseCount}>
            <h1>{submissions.length}</h1>
            <h4>Responses</h4>
          </div>
        </Box>
        <div style={{ width: "100%" }}>
          <div className={styles.lineChartHeader}>
            <h3>Activity Over Time</h3>
            <div className={styles.flexBetween}>
              <BsCircleFill color="#006586" />
              <h5>Responses</h5>
            </div>
          </div>
          <Box flexDirection="row">
            <div className={styles.flexChild}>
              <SubmissionsOverTimeLineChart
                submissionCountByDate={submissionCountByDate}
              />
            </div>
          </Box>
        </div>
      </div>
      <QuestionSubmissionsTable submissions={submissions} />
    </>
  );
}

function QuestionSubmissionsTable({
  submissions,
}: {
  submissions: QuestionSubmissionResult[];
}) {
  const { theme } = useTheme();
  const columns = useMemo<ColumnDef<QuestionSubmissionResult>[]>(
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
