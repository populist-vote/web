import { Box, Layout } from "components";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
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
  const { data } = useEmbedByIdQuery({
    id: id as string,
  });
  const title = data?.embedById.race?.title as string;
  const embed = data?.embedById;
  const candidateGuide = embed?.candidateGuide;
  const questions = candidateGuide?.questions;
  // need to query for submissions by raceId

  const { data: submissionsData } = useCandidateGuideSubmissionsByRaceIdQuery(
    {
      candidateGuideId: candidateGuide?.id as string,
      raceId: embed?.race?.id as string,
    },
    {
      enabled: !!(candidateGuide?.id && embed?.race?.id),
    }
  );
  const submissions = submissionsData?.candidateGuideById.questions?.find(
    (question) => question.id === router.query.selected
  )?.submissionsByRace;

  const handleSelectedQuestion = (questionId: string) => {
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
        header: "Submitted",
        accessorKey: "createdAt",
        cell: (info) => {
          return new Date(info.getValue() as string).toLocaleDateString();
        },
      },
    ],
    []
  );

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
            4
            <span style={{ color: "var(--blue-text)", margin: "0 1rem" }}>
              /
            </span>
            5 <span style={{ fontSize: "0.75em" }}>submissions</span>
          </h2>
        </Box>
      </section>
      <section>
        <h3>Questions</h3>
        <Table
          // @ts-ignore
          columns={questionColumns}
          data={questions || []}
          initialState={{}}
          onRowClick={(row) => handleSelectedQuestion(row.original.id)}
          selectedRowId={router.query.selected as string}
        />
      </section>
      <section>
        <h3>Responses</h3>
        <Table
          // @ts-ignore
          columns={submissionsColumns}
          data={submissions || []}
          initialState={{}}
        />
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
