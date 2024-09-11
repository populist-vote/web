/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Divider,
  Layout,
  LoaderFlag,
  PartyAvatar,
  TextInput,
} from "components";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedType,
  QuestionResult,
  QuestionSubmissionResult,
  useCandidateGuideEmbedByIdQuery,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useOrganizationBySlugQuery,
  useUpsertQuestionSubmissionMutation,
  useExistingQuestionSubmissionQuery,
  useCopyQuestionSubmissionMutation,
  PoliticalParty,
} from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { GrEdit, GrInfo } from "react-icons/gr";
import { Modal } from "components/Modal/Modal";
import { toast } from "react-toastify";
import { Tooltip } from "components/Tooltip/Tooltip";
import { SupportedLocale } from "types/global";
import { LANGUAGES } from "utils/constants";
import { useAuth } from "hooks/useAuth";
import { AiFillWarning } from "react-icons/ai";
import useOrganizationStore from "hooks/useOrganizationStore";
import { getRelativeTimeString } from "utils/dates";
import Link from "next/link";
import clsx from "clsx";
import useStreamResponse from "hooks/useStreamResponse";
import { HiOutlineSparkles } from "react-icons/hi";

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
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;

  useAuth({
    organizationId: currentOrganizationId,
    redirectTo: `/login?next=dashboard/${dashboardSlug}/embeds/candidate-guide/${id}/manage`,
  });

  const { data, isLoading: isEmbedLoading } = useCandidateGuideEmbedByIdQuery({
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

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    router.query.selected as string
  );

  const selectedQuestion = useMemo(
    () =>
      questions?.find(
        (q) => q.id === selectedQuestionId
      ) as Partial<QuestionResult>,
    [selectedQuestionId, questions]
  );

  const candidates = embed?.race?.candidates;

  const submissions = useMemo(() => {
    const subs =
      submissionsData?.candidateGuideById.questions?.find(
        (question) => question.id === selectedQuestionId
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
          id: undefined,
          politician: candidate,
          question: { id: selectedQuestionId },
          response: null,
          updatedAt: null,
        })) || [];

    return [...subs, ...nonSubs];
  }, [selectedQuestionId, submissionsData, candidates]);

  const handleSelectedQuestion = async (questionId: string) => {
    await router.push(
      `/dashboard/${router.query.dashboardSlug}/embeds/candidate-guide/${id}/submissions?selected=${questionId}`,
      undefined,
      {
        scroll: false,
      }
    );
    setSelectedQuestionId(questionId);
  };

  const questionColumns = useMemo<ColumnDef<Partial<QuestionResult>>[]>(
    () => [
      {
        header: "Prompt",
        accessorKey: "prompt",
      },
    ],
    []
  );

  const submissionsColumns = useMemo<
    ColumnDef<Partial<QuestionSubmissionResult>>[]
  >(
    () => [
      {
        id: "fullName",
        header: "Candidate",
        accessorKey: "politician.fullName",
        size: 170,
      },
      {
        header: "Response",
        accessorKey: "response",
        size: 350,
        cell: (info) => (
          <span className={styles.clamp}>{info.getValue() as string}</span>
        ),
      },
      {
        header: "Editorial",
        accessorKey: "editorial",
        size: 350,
        cell: (info) => (
          <span className={styles.clamp}>{info.getValue() as string}</span>
        ),
      },
      {
        header: "Last Update",
        accessorKey: "updatedAt",
        size: 180,
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
              selectedQuestion={selectedQuestion}
            />
            <EditorialEditAction
              row={info as CellContext<QuestionSubmissionResult, unknown>}
              selectedQuestion={selectedQuestion}
            />
            {!info.row.original.id && (
              <ExistingQuestionSubmission
                candidateId={info.row.original.politician?.id as string}
                questionId={selectedQuestion.id as string}
              />
            )}
          </div>
        ),
      },
    ],
    [selectedQuestion]
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
          selectedRowId={selectedQuestionId}
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
            initialState={{
              sorting: [
                {
                  id: "fullName",
                  desc: false,
                },
              ],
            }}
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
  selectedQuestion,
}: {
  row: CellContext<QuestionSubmissionResult, unknown>;
  selectedQuestion: Partial<QuestionResult>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<{
    response: string;
    translations: Record<string, string>;
  }>({
    defaultValues: {
      response: row.row.original.response as string,
      translations: row.row.original.translations,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: {
    response: string;
    translations: Record<string, string>;
  }) => {
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original?.id || null,
            questionId: selectedQuestion.id ?? row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: data.response,
            translations: data.translations,
            editorial: row.row.original.editorial,
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
        <h2 style={{ textAlign: "center" }}>Edit Response</h2>

        <div style={{ padding: "0 1.5rem", width: "45rem" }}>
          <h3>{selectedQuestion.prompt ?? row.row.original.question.prompt}</h3>
          <form
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <TextInput
              name="response"
              label="Response"
              textarea
              register={register}
              control={control}
              errors={errors?.response?.message}
              charLimit={row.row.original.question.responseCharLimit as number}
              style={{ minHeight: "15rem" }}
            />
            <Divider />

            <h3 style={{ textAlign: "center", margin: 0 }}>Translations</h3>
            {LANGUAGES.filter((l) => l.code !== "en").map((locale) => {
              return (
                <TranslationFormField
                  key={locale.code}
                  locale={locale}
                  charLimit={
                    row.row.original.question.responseCharLimit as number
                  }
                  register={register}
                  control={control}
                  originalResponse={row.row.original.response as string}
                  setValue={setValue}
                />
              );
            })}
          </form>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              label="Cancel"
              size="medium"
              variant="secondary"
              onClick={(e) => {
                e?.preventDefault;
                setIsOpen(false);
              }}
            />
            <Button
              label="Save"
              size="medium"
              variant="primary"
              type="submit"
              onClick={() => handleSubmit(onSubmit)()}
              disabled={upsertQuestionSubmission.isPending || !isDirty}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TranslationFormField({
  locale,
  originalResponse,
  register,
  control,
  setValue,
  charLimit,
}: {
  locale: { display: string; code: string };
  originalResponse: string;
  register: any;
  control: any;
  setValue: any;
  charLimit: number;
}) {
  const [sentence, setSentence] = useState<string>("");
  const { startStream, isLoading } = useStreamResponse({
    streamCallback: setSentence,
  });

  useEffect(() => {
    if (sentence) {
      setValue(`translations.response.${locale.code}`, sentence, {
        shouldDirty: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence]);

  const label = locale.display;
  return (
    <div key={locale.code}>
      <TextInput
        name={`translations.response.${locale.code}`}
        textarea
        charLimit={charLimit}
        label={label}
        register={register}
        control={control}
        style={{ minHeight: "15rem" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Button
          label="Translate"
          icon={<HiOutlineSparkles color="white" />}
          size="medium"
          variant="primary"
          onClick={(e) => {
            e?.preventDefault();
            startStream("Translate this to " + label + ": " + originalResponse);
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

function EditorialEditAction({
  row,
  selectedQuestion,
}: {
  row: CellContext<QuestionSubmissionResult, unknown>;
  selectedQuestion: Partial<QuestionResult>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<{ editorial: string; translations: Record<string, string> }>({
    defaultValues: {
      editorial: row.row.original.editorial as string,
      translations: row.row.original.translations,
    },
  });

  const upsertQuestionSubmission = useUpsertQuestionSubmissionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: {
    editorial: string;
    translations: Record<string, string>;
  }) => {
    try {
      upsertQuestionSubmission.mutate(
        {
          questionSubmissionInput: {
            id: row.row.original?.id || null,
            questionId: selectedQuestion.id ?? row.row.original.question.id,
            candidateId: row.row.original.politician?.id,
            response: row.row.original.response || "",
            editorial: data.editorial,
            translations: data.translations,
            shouldTranslate: false,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["CandidateGuideSubmissionsByRaceId"],
            });
            toast.success("Editorial updated successfully");
            setIsOpen(false);
          },
          onError: () => {
            toast.error("Failed to update editorial");
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
      <Tooltip content="Edit Editorial">
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <GrInfo />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 style={{ textAlign: "center" }}>Edit Editorial</h2>
        <div style={{ padding: "0 1.5rem", width: "45rem" }}>
          <h3>{selectedQuestion.prompt ?? row.row.original.question.prompt}</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <TextInput
              name="editorial"
              label="Editorial"
              markdown
              textarea
              register={register}
              control={control}
              errors={errors?.editorial?.message}
              style={{ minHeight: "10rem" }}
            />
            <Divider />
            <h3 style={{ textAlign: "center", margin: 0 }}>Translations</h3>
            {LANGUAGES.filter((l) => l.code !== "en").map((locale) => {
              const label = locale.display;
              return (
                <TextInput
                  key={locale.code}
                  name={`translations.editorial.${locale.code}`}
                  markdown
                  textarea
                  label={label}
                  register={register}
                  control={control}
                />
              );
            })}
          </form>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              label="Cancel"
              size="medium"
              variant="secondary"
              onClick={(e) => {
                e?.preventDefault;
                setIsOpen(false);
              }}
            />
            <Button
              label="Save"
              size="medium"
              variant="primary"
              type="submit"
              onClick={() => handleSubmit(onSubmit)()}
              disabled={upsertQuestionSubmission.isPending || !isDirty}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ExistingQuestionSubmission({
  candidateId,
  questionId,
}: {
  candidateId: string;
  questionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { organizationId } = useOrganizationStore();
  const { data, isLoading, isError } = useExistingQuestionSubmissionQuery(
    {
      candidateId,
      questionId,
      organizationId: organizationId as string,
    },
    {
      enabled: !!(candidateId && questionId && organizationId),
      staleTime: 1000 * 60 * 20,
    }
  );

  const queryClient = useQueryClient();

  const copyQuestionSubmissionMutation = useCopyQuestionSubmissionMutation();
  if (isLoading) return null;

  const submission = data?.relatedQuestionSubmissionByCandidateAndQuestion;

  const handleCopy = async () => {
    await copyQuestionSubmissionMutation.mutateAsync(
      {
        questionSubmissionId: submission?.id as string,
        targetQuestionId: questionId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["CandidateGuideSubmissionsByRaceId"],
          });
          toast.success("Submission copied successfully");
          setIsOpen(false);
        },
        onError: () => toast.error("Failed to copy submission"),
      }
    );
  };

  if (!submission || isError) return null;

  return (
    <>
      <Tooltip content="Existing Submission">
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <AiFillWarning />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 style={{ textAlign: "center" }}>Existing Submission</h2>
        <div style={{ padding: "0 1.5rem", width: "45rem" }}>
          <p>
            We found a submission for this candidate and question on another
            candidate guide.{" "}
            <strong>Would you like to use it for this guide?</strong>
          </p>
          <Box key={submission.id}>
            <div className={styles.flexRight}>
              <small
                className={styles.flexBetween}
                style={{ gap: "1rem", color: "var(--blue-text-light)" }}
              >
                {getRelativeTimeString(new Date(submission.updatedAt))}
              </small>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 7fr",
                gap: "1rem",
              }}
            >
              <div className={styles.centered}>
                <Link href={`/politicians/${submission.politician?.slug}`}>
                  <div className={styles.avatarContainer}>
                    <PartyAvatar
                      theme={"dark"}
                      size={80}
                      iconSize="1.25rem"
                      party={submission.politician?.party as PoliticalParty}
                      src={
                        submission.politician?.assets
                          ?.thumbnailImage160 as string
                      }
                      alt={submission.politician?.fullName as string}
                      target={"_blank"}
                      rel={"noopener noreferrer"}
                    />
                    <span
                      className={clsx(styles.link, styles.avatarName)}
                      style={{ color: "white" }}
                    >
                      {submission.politician?.fullName}
                    </span>
                  </div>
                </Link>
              </div>
              <div>
                <div className={styles.flexBetween}>
                  <p
                    style={{
                      color: "var(--blue-text-light)",
                      fontSize: "1em",
                    }}
                  >
                    {submission.question.prompt}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "1.2em",
                  }}
                >
                  {submission?.response}
                </p>
              </div>
            </div>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "100%",
              margin: "1.5rem 0 0",
            }}
          >
            <Button
              variant="secondary"
              label="Cancel"
              onClick={() => setIsOpen(false)}
            />
            <Button
              variant="primary"
              label="Use Submission"
              onClick={handleCopy}
              disabled={copyQuestionSubmissionMutation.isPending}
            />
          </div>
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
