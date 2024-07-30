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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { IssueTagsTableCell } from "components/IssueTags/IssueTagsTableCell";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { GrChapterAdd, GrEdit } from "react-icons/gr";
import { Modal } from "components/Modal/Modal";
import { toast } from "react-toastify";
import { GiWorld } from "react-icons/gi";
import { Tooltip } from "components/Tooltip/Tooltip";
import { SupportedLocale } from "types/global";
import { LANGUAGES } from "utils/constants";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideEmbedPageSubmissions() {
  const router = useRouter();
  const { dashboardSlug, id } = router.query;
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

  const candidates = embed?.race?.candidates;

  const submissions = useMemo(() => {
    const subs =
      submissionsData?.candidateGuideById.questions?.find(
        (question) => question.id === selectedQuestion
      )?.submissionsByRace || [];

    const nonSubs =
      candidates
        ?.filter(
          (candidate) =>
            !subs.find(
              (submission) => submission.politician?.id === candidate.id
            )
        )
        .map((candidate) => ({
          politician: candidate,
          question: { id: selectedQuestion },
          response: null,
          updatedAt: null,
        })) || [];

    return [...subs, ...nonSubs];
  }, [selectedQuestion, submissionsData, candidates]);

  const handleSelectedQuestion = async (questionId: string) => {
    await router.push(
      `/dashboard/${router.query.dashboardSlug}/embeds/candidate-guide/${id}/submissions?selected=${questionId}`,
      undefined,
      {
        scroll: false,
      }
    );
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
        size: 150,
      },
      {
        header: "Response",
        accessorKey: "response",
        size: 350,
        cell: (info) => info.getValue(),
      },
      {
        header: "Editorial",
        accessorKey: "editorial",
        size: 350,
        cell: (info) => info.getValue(),
      },
      {
        header: "Last Submitted At",
        accessorKey: "updatedAt",
        size: 150,
        cell: (info) => {
          // Only show date if response exists
          return info.getValue() && !!info.row.original.response
            ? new Date(info.getValue() as string).toLocaleDateString()
            : null;
        },
      },
      {
        header: "Actions",
        accessorKey: "id",
        size: 25,
        cell: (info) => (
          <div className={styles.flexEvenly} style={{ gap: "1rem" }}>
            <ResponseEditAction
              row={info as CellContext<QuestionSubmissionResult, unknown>}
            />
            <EditorialEditAction
              row={info as CellContext<QuestionSubmissionResult, unknown>}
            />
            <TranslationsManagementAction
              row={info as CellContext<QuestionSubmissionResult, unknown>}
            />
          </div>
        ),
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
        backLink={`/dashboard/${dashboardSlug}/candidate-guides/${candidateGuide?.id}`}
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
        {!selectedQuestion ? (
          <Box>
            <span className={styles.noResults}>Select a question</span>
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

function ResponseEditAction({
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
      response: row.row.original.response as string,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { response: string }) => {
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original?.id || null,
            questionId: row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: data.response,
            shouldTranslate: false,
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
      toast.error(`Form submission error`);
    } finally {
      if (!upsertQuestionSubmission.isPending) setIsOpen(false);
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
      <Tooltip content="Edit Submission">
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <GrEdit />
        </button>
      </Tooltip>
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

function EditorialEditAction({
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
  } = useForm<{ editorial: string }>({
    defaultValues: {
      editorial: row.row.original.editorial as string,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { editorial: string }) => {
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original?.id || null,
            questionId: row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: row.row.original.response || "",
            editorial: data.editorial,
            shouldTranslate: false,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["CandidateGuideSubmissionsByRaceId"],
            });
            toast.success("Editorial updated successfully");
          },
          onError: () => {
            toast.error("Failed to update editorial");
          },
        }
      );
    } catch (error) {
      toast.error(`Form submission error`);
    } finally {
      if (upsertQuestionSubmission.isSuccess) setIsOpen(false);
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
      <Tooltip content="Edit Editorial">
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <GrChapterAdd />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>Edit Editorial</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <TextInput
              name="editorial"
              label="Editorial"
              textarea
              register={register}
              control={control}
              errors={errors?.editorial?.message}
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

function TranslationsManagementAction({
  row,
}: {
  row: CellContext<QuestionSubmissionResult, unknown>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, control, handleSubmit, formState } = useForm<{
    translations: Record<string, string>;
  }>({
    defaultValues: {
      translations: row.row.original.translations,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { translations: Record<string, string> }) => {
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original.id,
            questionId: row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: row.row.original.response,
            translations: data.translations,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["CandidateGuideSubmissionsByRaceId"],
            });
            toast.success("Translations updated successfully");
          },
          onError: () => {
            toast.error("Failed to update translations");
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
    <>
      <Tooltip content="Manage translations">
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <GiWorld />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>Translations</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {LANGUAGES.filter((l) => l.code !== "en").map((locale) => {
              const label = locale.display;
              return (
                <TextInput
                  key={locale.code}
                  name={`translations.${locale.code}`}
                  textarea
                  label={label}
                  register={register}
                  control={control}
                  style={{ marginBottom: "1rem" }}
                />
              );
            })}
            <Button
              label="Save"
              size="medium"
              variant="primary"
              disabled={!formState.isDirty}
            />
          </form>
        </div>
      </Modal>
    </>
  );
}

CandidateGuideEmbedPageSubmissions.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
