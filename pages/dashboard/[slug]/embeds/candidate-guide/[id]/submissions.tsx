import { Box, Layout, LoaderFlag } from "components";
import { useRouter } from "next/router";
import { ReactNode, useMemo, useState } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedType,
  QuestionResult,
  QuestionSubmissionResult,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useEmbedByIdQuery,
} from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { IssueTagsTableCell } from "components/IssueTags/IssueTagsTableCell";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";

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

export default function CandidateGuideEmbedPageSubmissions() {
  const router = useRouter();
  const { slug, id } = router.query;
  const { data, isLoading: isEmbedLoading } = useEmbedByIdQuery({
    id: id as string,
  });
  const title = data?.embedById.race?.title as string;
  const embed = data?.embedById;
  const candidateGuide = embed?.candidateGuide;
  const questions = candidateGuide?.questions;

  const { data: submissionsData, isLoading: isSubmissionsDataLoading } =
    useCandidateGuideSubmissionsByRaceIdQuery(
      {
        candidateGuideId: candidateGuide?.id as string,
        raceId: embed?.race?.id as string,
      },
      {
        enabled: !!(candidateGuide?.id && embed?.race?.id),
      }
    );

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
    router.query.selected as string
  );

  const submissions = useMemo(() => {
    return (
      submissionsData?.candidateGuideById.questions?.find(
        (question) => question.id === selectedQuestion
      )?.submissionsByRace || []
    );
  }, [selectedQuestion, submissionsData]);

  const handleSelectedQuestion = (questionId: string) => {
    setSelectedQuestion(questionId);
    void router.push(
      `/dashboard/${router.query.slug}/embeds/candidate-guide/${id}/submissions?selected=${questionId}`
    );
  };

  const questionColumns = useMemo<ColumnDef<Partial<QuestionResult>>[]>(
    () => [
      {
        header: "Prompt",
        accessorKey: "prompt",
      },
      {
        header: "Issue",
        accessorKey: "issueTags",
        cell: (info) => IssueTagsTableCell({ info }),
      },
    ],
    []
  );

  const submissionsColumns = useMemo<
    ColumnDef<Partial<QuestionSubmissionResult>>[]
  >(
    () => [
      {
        header: "Candidate",
        accessorKey: "politician.fullName",
      },
      {
        header: "Response",
        accessorKey: "response",
      },
      {
        header: "Last Submitted At",
        accessorKey: "updatedAt",
        cell: (info) => {
          return new Date(info.getValue() as string).toLocaleDateString();
        },
      },
    ],
    []
  );

  // Count the number of unique candidates that have submitted
  const numSubmissions = submissionsData?.candidateGuideById.questions
    ?.flatMap((question) => question.submissionsByRace)
    .filter((submission, index, self) => {
      return (
        self.findIndex(
          (s) => s.politician?.id === submission.politician?.id
        ) === index
      );
    }).length;
  const numCandidates = embed?.race?.candidates.length;

  if (isEmbedLoading || isSubmissionsDataLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader
        title={title}
        embedType={EmbedType.CandidateGuide}
        backLink={`/dashboard/${slug}/candidate-guides/${candidateGuide?.id}`}
      />
      <EmbedPageTabs
        embedType={EmbedType.CandidateGuide}
        selectedTab="Submissions"
      />
      <section>
        <Box>
          <h2>
            {numSubmissions}
            <span style={{ color: "var(--blue-text)", margin: "0 1rem" }}>
              /
            </span>
            {numCandidates}{" "}
            <span style={{ fontSize: "0.75em" }}>
              candidates have submitted
            </span>
          </h2>
        </Box>
      </section>
      <section className={styles.section}>
        <h3>Questions</h3>
        <Table
          // @ts-expect-error react-table
          columns={questionColumns}
          data={questions || []}
          initialState={{}}
          onRowClick={(row) => handleSelectedQuestion(row.original.id)}
          selectedRowId={selectedQuestion}
          paginate={false}
          theme="aqua"
        />
      </section>
      <section className={styles.section}>
        <h3>Responses</h3>
        {submissions?.length === 0 ? (
          <Box>
            <span className={styles.noResults}>
              {!selectedQuestion ? "Select a question" : "No responses"}
            </span>
          </Box>
        ) : (
          <Table
            // @ts-expect-error react-table
            columns={submissionsColumns}
            data={submissions}
            initialState={{}}
            paginate={false}
          />
        )}
      </section>
    </>
  );
}

CandidateGuideEmbedPageSubmissions.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
