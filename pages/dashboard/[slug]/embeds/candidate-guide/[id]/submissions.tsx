import { Box, Button, Layout, LoaderFlag, TextInput } from "components";
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
  useUpsertQuestionSubmissionMutation,
} from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { IssueTagsTableCell } from "components/IssueTags/IssueTagsTableCell";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { GrEdit } from "react-icons/gr";
import { Modal } from "components/Modal/Modal";
import { toast } from "react-toastify";

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
        staleTime: 1000 * 60 * 5,
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

  const handleSelectedQuestion = async (questionId: string) => {
    // await router.push(
    //   `/dashboard/${router.query.slug}/embeds/candidate-guide/${id}/submissions?selected=${questionId}`,
    //   undefined,
    //   {
    //     scroll: false,
    //   }
    // );
    setSelectedQuestion(questionId);
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
        size: 100,
      },
      {
        header: "Response",
        accessorKey: "response",
        size: 500,
        cell: (info) => (
          <ResponseCell
            row={info as CellContext<QuestionSubmissionResult, unknown>}
          />
        ),
      },
      {
        header: "Last Submitted At",
        accessorKey: "updatedAt",
        size: 25,
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
          theme="blue"
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
            theme="blue"
          />
        )}
      </section>
    </>
  );
}

function ResponseCell({
  row,
}: {
  row: CellContext<QuestionSubmissionResult, unknown>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ response: string }>({
    defaultValues: {
      response: row.getValue() as string,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { response: string }) => {
    console.log(row.row.original);
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original.id,
            questionId: row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: data.response,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["CandidateGuideSubmissionsByRaceId"],
            });
            toast.success("Submission updated successfully");
          },
          onError: () => {
            toast.error("Failed to update submission");
          },
        }
      );
    } catch (error) {
      toast.error("Form submission error");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
      }}
    >
      {!!row.getValue() && (
        <span style={{ marginRight: "1rem" }}>{row.getValue() as string}</span>
      )}
      <GrEdit onClick={() => setIsOpen(true)} />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>Edit Response</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <TextInput
              name="response"
              label="Response"
              textarea
              register={register}
              control={control}
              errors={errors?.response?.message}
              style={{ minHeight: "10rem" }}
            />
            <Button
              label="Save"
              size="medium"
              variant="primary"
              type="submit"
              disabled={upsertQuestionSubmission.isPending}
            />
          </form>
        </div>
      </Modal>
    </div>
  );
}

CandidateGuideEmbedPageSubmissions.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
