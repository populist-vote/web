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
  useOrganizationBySlugQuery,
  useUpsertQuestionMutation,
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
import { Tooltip } from "components/Tooltip/Tooltip";
import { GrEdit, GrTrash } from "react-icons/gr";
import { GiWorld } from "react-icons/gi";
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
      dashboardSlug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideManagePage() {
  const router = useRouter();
  const { dashboardSlug, id } = router.query as {
    dashboardSlug: string;
    id: string;
  };
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const organizationId = organizationData?.organizationBySlug?.id as string;
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
      "Are you sure you want to delete this candidate guide? All associated data——INCLUDING SUBMISSIONS TO QUESTIONS AND ALL EMBEDS——will be destroyed permanently."
    );
    await deleteCandidateGuideMutation.mutateAsync({ id });
    await router.push(`/dashboard/${dashboardSlug}/embeds/candidate-guide`);
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader
        title={candidateGuide?.name || "Untitled"}
        backLink={`/dashboard/${dashboardSlug}/embeds/candidate-guide`}
        embedType={EmbedType.CandidateGuide}
      />
      <div className={styles.sections}>
        <CandidateGuideConfiguration
          candidateGuide={candidateGuide}
          organizationId={organizationId}
        />
        <QuestionsSection candidateGuide={candidateGuide} />
        <RacesSection
          slug={dashboardSlug}
          candidateGuide={candidateGuide}
          organizationId={organizationId}
        />
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
  organizationId,
}: {
  candidateGuide: CandidateGuideResult;
  organizationId: string;
}) {
  const queryClient = useQueryClient();
  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();

  const onSubmit = async (data: Partial<UpsertCandidateGuideInput>) => {
    await upsertCandidateGuideMutation.mutate(
      {
        input: { id: candidateGuide?.id, name: data.name, organizationId },
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
          <SubmissionsManagement
            candidateGuide={candidateGuide}
            organizationId={organizationId}
          />
        </div>
      </Box>
    </section>
  );
}

function SubmissionsManagement({
  candidateGuide,
  organizationId,
}: {
  candidateGuide: CandidateGuideResult;
  organizationId: string;
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
          organizationId,
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
          toast.success("All submissions have been opened.");
        },
      }
    );
  };

  const handleDateSave = (data: Partial<UpsertCandidateGuideInput>) => {
    upsertCandidateGuideMutation.mutate(
      {
        input: {
          id: candidateGuide?.id,
          organizationId,
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
            modalId="closeDate"
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

function ManageQuestionTranslations({ row }: { row: Row<QuestionResult> }) {
  const [isOpen, setIsOpen] = useState(false);

  const { register, control, handleSubmit, formState } = useForm<{
    translations: Record<string, string>;
  }>({
    defaultValues: {
      translations: row.original.translations,
    },
  });

  const upsertQuestion = useUpsertQuestionMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { translations: Record<string, string> }) => {
    try {
      upsertQuestion.mutate(
        {
          input: {
            id: row.original.id,
            prompt: row.original.prompt,
            responseCharLimit: row.original.responseCharLimit,
            responsePlaceholderText: row.original.responsePlaceholderText,
            allowAnonymousResponses: row.original.allowAnonymousResponses,
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
    <Tooltip content="Manage translations">
      <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
        <GiWorld color={"var(--blue-text-light)"} />
      </button>
      <Modal
        modalId="manageTranslations"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>Translations</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {LANGUAGES.filter((l) => l.code !== "en").map((locale) => {
              const label = locale.display;
              return (
                <TextInput
                  key={label}
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
    </Tooltip>
  );
}

function QuestionsSection({
  candidateGuide,
}: {
  candidateGuide: CandidateGuideResult;
}) {
  const router = useRouter();
  const { dashboardSlug } = router.query as { dashboardSlug: string };
  const questions = useMemo(() => candidateGuide?.questions, [candidateGuide]);
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
        size: 400,
      },
      {
        id: "Actions",
        cell: (info) => {
          return (
            <div className={styles.flexRight}>
              <Tooltip content="Edit Question">
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    router
                      .push(
                        `/dashboard/${dashboardSlug}/candidate-guides/${candidateGuide.id}?isModalOpen=true&questionId=${info.row.original.id}`
                      )
                      .catch((e: Error) => toast.error(e.message))
                      .finally(() => setIsModalOpen(true));
                  }}
                >
                  <GrEdit color="var(--blue-text-light)" />
                </button>
              </Tooltip>
              <ManageQuestionTranslations row={info.row} />
              <Tooltip content="Delete Question">
                <button
                  className={styles.iconButton}
                  onClick={() =>
                    window.confirm(
                      "Are you sure you want to delete this question?"
                    ) && handleDeleteQuestion(info.row.original.id)
                  }
                >
                  <GrTrash color="var(--blue-text-light)" />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [handleDeleteQuestion, candidateGuide.id, router, dashboardSlug]
  );

  const [isModalOpen, setIsModalOpen] = useState(
    router.query.isModalOpen == "true" || false
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    void router.push(
      `/dashboard/${dashboardSlug}/candidate-guides/${candidateGuide.id}`,
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
        <Modal modalId="questionForm" isOpen={isModalOpen} onClose={closeModal}>
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
  organizationId,
}: {
  candidateGuide: CandidateGuideResult;
  slug: string;
  organizationId: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const embeds = candidateGuide?.embeds || [];
  const selectedRaceIds = embeds.map((embed) => embed.race?.id) as string[];
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
    setSearchValue("");
  };
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push(
      {
        query: { ...router.query, state: e.target.value },
      },
      undefined,
      {
        shallow: true,
      }
    );
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push(
      {
        query: { ...router.query, year: e.target.value },
      },
      undefined,
      {
        shallow: true,
      }
    );
  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();

  const selectedRowArray = (selectedRows as string)?.split(",");

  const handleSelectedRows = () => {
    upsertCandidateGuideMutation.mutate(
      {
        input: {
          id: candidateGuide.id,
          organizationId,
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
        <Modal
          modalId="raceSearch"
          isOpen={isModalOpen}
          onClose={closeModal}
          width={"920px"}
        >
          <h2>Add Races</h2>
          <Divider style={{ marginBottom: 0 }} />
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
              searchId="raceSearch"
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
        <div>
          <CandidateGuideEmbedTable
            candidateGuideId={candidateGuide.id}
            embeds={embeds}
          />
        </div>
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
  const { dashboardSlug, search } = router.query as {
    dashboardSlug: string;
    search: string | null;
  };
  const queryClient = useQueryClient();
  const removeRace = useRemoveCandidateGuideRaceMutation();
  const deleteEmbed = useDeleteEmbedMutation();
  const [searchValue, setSearchValue] = useState(search as string);

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
    void router.push(
      `/dashboard/${dashboardSlug}/embeds/candidate-guide/${row.id}`
    );

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
              <Tooltip content="Remove Race">
                <button
                  className={styles.iconButton}
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
                >
                  <GrTrash color="var(--blue-text-light)" />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [handleRemoveRace]
  );

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Box>
          <SearchInput
            placeholder="Search for existing candidate guide races"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchId="candidateGuideEmbeds"
          />
        </Box>
      </div>
      <Table
        columns={columns}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        data={embeds}
        theme="blue"
        onRowClick={handleRowClick}
        useSearchQueryAsFilter={true}
        targetSearchId="candidateGuideEmbeds"
      />
    </div>
  );
}

CandidateGuideManagePage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
