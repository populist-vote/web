import {
  Button,
  Divider,
  Layout,
  LoaderFlag,
  SearchInput,
  Select,
  TextInput,
} from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  EmbedType,
  QuestionResult,
  useDeleteQuestionMutation,
  useCandidateGuideByIdQuery,
  CandidateGuideResult,
  useUpsertCandidateGuideMutation,
  UpsertCandidateGuideInput,
  useRemoveCandidateGuideRaceMutation,
  EmbedResult,
  useDeleteEmbedMutation,
  useDeleteCandidateGuideMutation,
  useDownloadAllCandidateGuideDataMutation,
  PoliticianResult,
  useOpenAllCandidateGuideSubmissionsMutation,
} from "generated";

import { Box } from "components/Box/Box";
import styles from "components/EmbedIndex/EmbedIndex.module.scss";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { Modal } from "components/Modal/Modal";
import clsx from "clsx";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { useQueryClient } from "@tanstack/react-query";
import { QuestionForm } from "components/QuestionForm/QuestionForm";
import { useForm } from "react-hook-form";
import { RaceResultsTable } from "components/RaceResultsTable/RaceResultsTable";
import { PoliticalScopeFilters } from "components/PoliticianFilters/PoliticianFilters";
import { confirmDialog } from "utils/messages";
import { toast } from "react-toastify";
import { downloadCsv } from "utils/strings";
import { useAuth } from "hooks/useAuth";
import { renderSubmissionState } from "utils/dates";

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

export default function CandidateGuideManagePage() {
  const router = useRouter();
  const { slug, id } = router.query as { slug: string; id: string };
  const { data, isLoading } = useCandidateGuideByIdQuery(
    { id },
    {
      staleTime: 1000 * 60 * 5,
    }
  );
  const candidateGuide = data?.candidateGuideById as CandidateGuideResult;
  const deleteCandidateGuideMutation = useDeleteCandidateGuideMutation();

  const handleDeleteCandidateGuide = async () => {
    await confirmDialog(
      "Are you sure you want to delete this candidate guide? All associated data and embeds will be destroyed permanently."
    );
    await deleteCandidateGuideMutation.mutateAsync({ id });
    await router.push(`/dashboard/${slug}/embeds/candidate-guide`);
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader
        title={candidateGuide?.name || "Untitled"}
        backLink={`/dashboard/${slug}/embeds/candidate-guide`}
        embedType={EmbedType.CandidateGuide}
      />
      <div className={styles.sections}>
        <CandidateGuideConfiguration candidateGuide={candidateGuide} />
        <QuestionsSection candidateGuide={candidateGuide} />
        <RacesSection slug={slug} candidateGuide={candidateGuide} />
        <section>
          <h3>Danger Zone</h3>
          <Button
            theme="red"
            variant="primary"
            size="medium"
            label="Delete Candidate Guide"
            onClick={handleDeleteCandidateGuide}
          />
        </section>
      </div>

      <div className={styles.flexBetween}></div>
    </>
  );
}

function CandidateGuideConfiguration({
  candidateGuide,
}: {
  candidateGuide: CandidateGuideResult;
}) {
  const queryClient = useQueryClient();
  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();

  const onSubmit = async (data: Partial<UpsertCandidateGuideInput>) => {
    await upsertCandidateGuideMutation.mutate(
      {
        input: { id: candidateGuide?.id, name: data.name },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useCandidateGuideByIdQuery.getKey({
              id: candidateGuide?.id as string,
            }),
          });
        },
      }
    );
  };

  const { register, control, handleSubmit, formState } = useForm<
    Partial<UpsertCandidateGuideInput>
  >({
    mode: "onChange",
    defaultValues: {
      name: candidateGuide?.name || "",
    },
  });

  return (
    <section>
      <div className={styles.flexBetween}>
        <h3>Configuration</h3>
        <div
          className={styles.flexBetween}
          style={{ color: "var(--blue-text)", fontWeight: 500 }}
        >
          <span>
            Created {new Date(candidateGuide?.createdAt).toLocaleString()}
          </span>
          <Divider vertical />
          <span>
            Last Updated {new Date(candidateGuide?.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
      <Box>
        <div className={styles.flexBetween}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
              gap: "1rem",
              minWidth: "16rem",
              width: "40%",
            }}
          >
            <TextInput
              name="name"
              label="Name"
              placeholder="Untitled"
              size="small"
              register={register}
              control={control}
            />
            {formState.isDirty && formState.isValid && (
              <Button
                theme="blue"
                variant="primary"
                type="submit"
                size="medium"
                label="Save"
              />
            )}
          </form>
          <Divider vertical height="4rem" />
          <SubmissionsManagement candidateGuide={candidateGuide} />
        </div>
      </Box>
    </section>
  );
}

function SubmissionsManagement({
  candidateGuide,
}: {
  candidateGuide: CandidateGuideResult;
}) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeDate = candidateGuide?.submissionsCloseAt;
  const areSubmissionsOpen = !closeDate || new Date(closeDate) > new Date();
  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();
  const { register, handleSubmit } = useForm<
    Partial<UpsertCandidateGuideInput>
  >({
    mode: "onChange",
    defaultValues: {
      submissionsCloseAt: candidateGuide?.submissionsCloseAt
        ? new Date(candidateGuide.submissionsCloseAt)
            .toISOString()
            .split("T", 1)[0]
        : "",
    },
  });

  const handleCloseAll = () => {
    upsertCandidateGuideMutation.mutate(
      {
        input: {
          id: candidateGuide?.id,
          submissionsCloseAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useCandidateGuideByIdQuery.getKey({
              id: candidateGuide?.id as string,
            }),
          });
          toast.success("All submissions have been closed.");
        },
      }
    );
  };

  const openAllMutation = useOpenAllCandidateGuideSubmissionsMutation();

  const handleOpenAll = () => {
    openAllMutation.mutate(
      {
        candidateGuideId: candidateGuide?.id as string,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useCandidateGuideByIdQuery.getKey({
              id: candidateGuide?.id as string,
            }),
          });
          toast.success("All submissions have been closed.");
        },
      }
    );
  };

  const handleDateSave = (data: Partial<UpsertCandidateGuideInput>) => {
    upsertCandidateGuideMutation.mutate(
      {
        input: {
          id: candidateGuide?.id,
          submissionsCloseAt: new Date(data.submissionsCloseAt).toISOString(),
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useCandidateGuideByIdQuery.getKey({
              id: candidateGuide?.id as string,
            }),
          });
          toast.success("Close date has been set.");
        },
        onSettled: () => setIsModalOpen(false),
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "0.5rem",
        width: "100%",
      }}
    >
      <span style={{ paddingBottom: "0.5rem", fontWeight: 500 }}>
        Submissions
      </span>
      <div
        className={styles.flexBetween}
        style={{ width: "100%", justifyContent: "flex-end" }}
      >
        {renderSubmissionState(closeDate)}
        <div
          className={styles.flexBetween}
          style={{ width: "100%", justifyContent: "flex-end" }}
        >
          {areSubmissionsOpen && (
            <Button
              variant="primary"
              size="small"
              label="Close All"
              onClick={handleCloseAll}
            />
          )}
          {!areSubmissionsOpen && (
            <Button
              variant="primary"
              size="small"
              label="Open All"
              onClick={handleOpenAll}
            />
          )}
          <Divider vertical />
          <Button
            variant="secondary"
            size="small"
            label="Set Close Date"
            onClick={() => setIsModalOpen(true)}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            width="36rem"
          >
            <form onSubmit={handleSubmit(handleDateSave)}>
              <h2>Set Close Date</h2>
              <div className={styles.flexColumn}>
                <label htmlFor="submissionsCloseAt">
                  Last day for responses to be submitted
                </label>
                <input
                  id="submissionsCloseAt"
                  type="date"
                  {...register("submissionsCloseAt")}
                />
              </div>
              <Divider />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <Button
                  variant="primary"
                  size="medium"
                  label="Save"
                  type="submit"
                />
                <Button
                  size="medium"
                  label="Cancel"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
            </form>
          </Modal>
          <Button
            variant="secondary"
            size="small"
            label="Clear Date"
            onClick={handleOpenAll}
            disabled={!closeDate}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionsSection({
  candidateGuide,
}: {
  candidateGuide: CandidateGuideResult;
}) {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const questions = candidateGuide?.questions;
  const queryClient = useQueryClient();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      await deleteQuestionMutation.mutateAsync({ id: questionId });
      void queryClient.invalidateQueries({
        queryKey: ["CandidateGuideById"],
      });
    },
    [deleteQuestionMutation, queryClient]
  );

  const questionColumns = useMemo<ColumnDef<QuestionResult>[]>(
    () => [
      {
        header: "Prompt",
        accessorKey: "prompt",
      },
      {
        id: "Actions",
        cell: (info) => {
          return (
            <div className={styles.flexRight}>
              <Button
                theme="blue"
                variant="secondary"
                size="small"
                label="Edit"
                onClick={() => {
                  router
                    .push(
                      `/dashboard/${slug}/candidate-guides/${candidateGuide.id}?isModalOpen=true&questionId=${info.row.original.id}`
                    )
                    .catch((e: Error) => toast.error(e.message))
                    .finally(() => setIsModalOpen(true));
                }}
              />
              <Button
                theme="blue"
                variant="secondary"
                size="small"
                label="Delete"
                onClick={() =>
                  window.confirm(
                    "Are you sure you want to delete this question?"
                  ) && handleDeleteQuestion(info.row.original.id)
                }
              />
            </div>
          );
        },
      },
    ],
    [handleDeleteQuestion, candidateGuide.id, router, slug]
  );

  const [isModalOpen, setIsModalOpen] = useState(
    router.query.isModalOpen == "true" || false
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    void router.push(
      `/dashboard/${slug}/candidate-guides/${candidateGuide.id}`,
      undefined,
      {
        shallow: true,
      }
    );
    setIsModalOpen(false);
  };

  const handleNewQuestionSuccess = () => {
    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: useCandidateGuideByIdQuery.getKey({ id: candidateGuide.id }),
      }),
      queryClient.invalidateQueries({
        queryKey: ["QuestionById"],
      }),
    ]);
    closeModal();
  };

  return (
    <section>
      <div className={clsx(styles.flexBetween, styles.inlineHeading)}>
        <h3>Questions</h3>
        <Button
          theme="blue"
          variant="primary"
          size="small"
          label="Add Question"
          onClick={openModal}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <QuestionForm
            candidateGuideId={candidateGuide?.id as string}
            onSuccess={handleNewQuestionSuccess}
            allowAnonymousResponsesToggle={false}
          />
        </Modal>
      </div>

      {!!questions?.length && (
        <Table
          columns={questionColumns}
          initialState={{}}
          data={questions || []}
          theme={"aqua"}
          paginate={false}
        />
      )}

      {!questions?.length && (
        <Box>
          <small className={styles.noResults}>No Questions</small>
        </Box>
      )}
    </section>
  );
}

function RacesSection({
  candidateGuide,
  slug,
}: {
  candidateGuide: CandidateGuideResult;
  slug: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear().toString();
  const defaultState = user?.userProfile?.address?.state || null;
  const {
    state = defaultState,
    search,
    year = currentYear,
    selectedRows,
  } = router.query;
  const [searchValue, setSearchValue] = useState(search as string);
  const [isModalOpen, setIsModalOpen] = useState(
    router.query.isModalOpen == "true" || false
  );
  const embeds = candidateGuide?.embeds || [];
  const selectedRaceIds = embeds.map((embed) => embed.race?.id) as string[];
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    void router.push(
      `/dashboard/${slug}/candidate-guides/${candidateGuide.id}`,
      undefined,
      {
        shallow: false,
      }
    );
    setIsModalOpen(false);
    setSearchValue("");
  };
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push({
      query: { ...router.query, state: e.target.value },
    });
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push({
      query: { ...router.query, year: e.target.value },
    });
  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();

  const selectedRowArray = (selectedRows as string)?.split(",");

  const handleSelectedRows = () => {
    upsertCandidateGuideMutation.mutate(
      {
        input: {
          id: candidateGuide.id,
          raceIds: selectedRowArray.filter(
            (id) => !selectedRaceIds.includes(id)
          ),
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useCandidateGuideByIdQuery.getKey({
              id: candidateGuide.id,
            }),
          });
          closeModal();
        },
      }
    );
  };

  const exportMutation = useDownloadAllCandidateGuideDataMutation();

  const handleDataExport = () => {
    exportMutation.mutate(
      { candidateGuideId: candidateGuide.id },
      {
        onSuccess: (data) => downloadCsv(data.downloadAllCandidateGuideData),
        onError: (error) => toast.error((error as Error).message),
      }
    );
  };

  return (
    <section>
      <div className={clsx(styles.flexBetween, styles.inlineHeading)}>
        <h3>Races</h3>
        <div className={styles.flexBetween}>
          <Button
            theme="blue"
            variant="primary"
            size="small"
            label="Export All Data"
            onClick={handleDataExport}
          />
          <Button
            theme="blue"
            variant="primary"
            size="small"
            label="Add Race"
            onClick={openModal}
          />
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} width={"920px"}>
          <h2>Add Races</h2>
          <Divider />
          <div className={styles.flexBetween}>
            <h3>Search races</h3>
            <div className={styles.flexBetween}>
              <Select
                textColor="white"
                backgroundColor={"blue"}
                value={state as string}
                options={[
                  { value: "", label: "All States" },
                  { value: "CO", label: "Colorado" },
                  { value: "MN", label: "Minnesota" },
                ]}
                onChange={handleStateChange}
              />
              <Select
                textColor="white"
                backgroundColor={"blue"}
                value={year as string}
                options={[
                  { value: "2024", label: "2024" },
                  { value: "2023", label: "2023" },
                  { value: "2022", label: "2022" },
                ]}
                onChange={handleYearChange}
              />
            </div>
          </div>
          <div className={styles.flex}>
            <SearchInput
              placeholder="School board"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <PoliticalScopeFilters />
          </div>
          <Divider />
          <RaceResultsTable
            multiSelect
            theme="blue"
            selectedRows={selectedRaceIds}
          />
          {selectedRows && selectedRows?.length > 0 && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                theme="blue"
                variant="primary"
                size="medium"
                label="Add Selected Races"
                onClick={handleSelectedRows}
                disabled={upsertCandidateGuideMutation.isPending}
              />
            </div>
          )}
        </Modal>
      </div>
      {!!embeds.length && (
        <CandidateGuideEmbedTable
          candidateGuideId={candidateGuide.id}
          embeds={embeds}
        />
      )}
      {!embeds.length && (
        <Box>
          <span className={styles.noResults}>No Races</span>
        </Box>
      )}
    </section>
  );
}

function CandidateGuideEmbedTable({
  candidateGuideId,
  embeds,
}: {
  candidateGuideId: string;
  embeds: EmbedResult[];
}) {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const queryClient = useQueryClient();
  const removeRace = useRemoveCandidateGuideRaceMutation();
  const deleteEmbed = useDeleteEmbedMutation();

  const handleRemoveRace = useCallback(
    async (embedId: string, raceId: string) => {
      await removeRace
        .mutateAsync({
          candidateGuideId: candidateGuideId,
          raceId,
        })
        .then(() => {
          deleteEmbed.mutate({ id: embedId });
        });
      void queryClient.invalidateQueries({
        queryKey: useCandidateGuideByIdQuery.getKey({ id: candidateGuideId }),
      });
    },
    [candidateGuideId, deleteEmbed, queryClient, removeRace]
  );

  const handleRowClick = (row: Row<EmbedResult>) =>
    void router.push(`/dashboard/${slug}/embeds/candidate-guide/${row.id}`);

  const columns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        header: "Race Title",
        accessorKey: "race.title",
        size: 800,
      },
      {
        header: "Candidates",
        accessorKey: "race.candidates",
        cell: (info) => (info.getValue() as PoliticianResult[]).length,
        size: 5,
      },
      {
        header: "Submissions",
        accessorKey: "candidateGuideSubmissionCountByRace",
        size: 5,
      },
      {
        id: "Actions",
        cell: (info) => {
          return (
            <div className={styles.flexRight}>
              <Button
                theme="blue"
                variant="secondary"
                size="small"
                label="Delete"
                onClick={async (e) => {
                  e?.stopPropagation();
                  await confirmDialog(
                    "Are you sure you want to remove this race from this guide?"
                  ).then(() =>
                    handleRemoveRace(
                      info.row.original.id,
                      info.row.original.race?.id as string
                    )
                  );
                }}
              />
            </div>
          );
        },
      },
    ],
    [handleRemoveRace]
  );

  return (
    <Table
      columns={columns}
      initialState={{}}
      data={embeds}
      theme="blue"
      paginate={false}
      onRowClick={handleRowClick}
    />
  );
}

CandidateGuideManagePage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
