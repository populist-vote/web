import { Box, Button, Layout, LoaderFlag, TextInput } from "components";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedResult,
  EmbedType,
  PoliticianResult,
  Role,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useEmbedByIdQuery,
  useGenerateCandidateGuideIntakeLinkMutation,
  useRaceByIdQuery,
  useUpdatePoliticianMutation,
  useUpsertEmbedMutation,
} from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";
import { EmbedCodeBlock } from "components/EmbedCodeBlock/EmbedCodeBlock";
import { EmbedDeployments } from "components/EmbedPage/EmbedPage";
import { GrEdit } from "react-icons/gr";
import { Modal } from "components/Modal/Modal";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useAuth } from "hooks/useAuth";

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

export default function CandidateGuideEmbedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading: isEmbedLoading } = useEmbedByIdQuery({
    id: id as string,
  });

  const candidateGuide = data?.embedById?.candidateGuide;
  const raceId = data?.embedById?.race?.id as string;
  const { data: raceData, isLoading: isRaceLoading } = useRaceByIdQuery(
    {
      id: raceId,
    },
    {
      enabled: !!raceId,
    }
  );

  const { data: submissionsData } = useCandidateGuideSubmissionsByRaceIdQuery(
    {
      candidateGuideId: candidateGuide?.id as string,
      raceId: raceId,
    },
    {
      enabled: !!(candidateGuide?.id && raceId),
    }
  );

  const allSubmissions = submissionsData?.candidateGuideById.questions?.flatMap(
    (question) => question.submissionsByRace
  );

  const candidates = useMemo(
    () => raceData?.raceById?.candidates || [],
    [raceData]
  );
  const title = data?.embedById.race?.title as string;
  const candidateGuideId = data?.embedById.candidateGuide?.id as string;
  const intakeLinkMutation = useGenerateCandidateGuideIntakeLinkMutation();

  const handleCopyIntakeLink = useCallback(
    (politicianId: string, candidateGuideId: string) => {
      intakeLinkMutation.mutate(
        {
          candidateGuideId,
          politicianId,
        },
        {
          onSuccess: (data) => {
            void navigator.clipboard.writeText(data.generateIntakeTokenLink);
            toast.success("Copied to clipboard!");
          },
        }
      );
    },
    [intakeLinkMutation]
  );

  const candidateRespondedAt = useCallback(
    (politicianId: string) => {
      const updatedAt = allSubmissions?.find(
        (s) => s.politician?.id === politicianId
      )?.updatedAt;
      return updatedAt ? new Date(updatedAt).toLocaleDateString() : "No";
    },
    [allSubmissions]
  );

  const getIntakeLink = useCallback(
    async (politicianId: string) => {
      return new Promise<string>((resolve, reject) => {
        intakeLinkMutation.mutate(
          {
            candidateGuideId,
            politicianId,
          },
          {
            onSuccess: (data) => {
              resolve(data.generateIntakeTokenLink);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    [intakeLinkMutation, candidateGuideId]
  );

  const [isExportLoading, setIsExportLoading] = useState(false);

  const generateCsvData = useCallback(async () => {
    const csvData = [["Candidate", "Email", "Form Link", "Last Response"]];

    for (const candidate of candidates) {
      const formLink = await getIntakeLink(candidate.id as string);
      csvData.push([
        candidate.fullName,
        candidate.email || "",
        formLink,
        candidateRespondedAt(candidate.id as string),
      ]);
    }

    return csvData;
  }, [candidates, candidateRespondedAt, getIntakeLink]);

  const handleTableExport = useCallback(async () => {
    setIsExportLoading(true);
    try {
      const csvData = await generateCsvData();
      const csv = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "candidate-guide-data.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportLoading(false);
    }
  }, [generateCsvData]);

  const { slug } = router.query;

  const candidateColumns = useMemo<ColumnDef<PoliticianResult>[]>(
    () => [
      {
        header: "Candidate",
        accessorKey: "fullName",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (row) => <EmailCell row={row} />,
      },
      {
        header: "Form Link",
        accessorKey: "id",
        cell: (row) => (
          <FaCopy
            onClick={() =>
              handleCopyIntakeLink(row.getValue() as string, candidateGuideId)
            }
          />
        ),
      },
      {
        header: "Last Submitted At",
        cell: (info) => candidateRespondedAt(info.row.original.id as string),
      },
    ],
    [candidateRespondedAt, candidateGuideId, handleCopyIntakeLink]
  );

  const queryClient = useQueryClient();

  const renderOptions = data?.embedById.attributes.renderOptions;

  const { register, control, handleSubmit, formState } = useForm<{
    height: number;
  }>({
    defaultValues: {
      height: renderOptions?.height || 700,
    },
  });

  const upsertEmbed = useUpsertEmbedMutation();

  const handleRenderOptionsSave = ({ height }: { height: number }) => {
    upsertEmbed.mutate(
      {
        input: {
          id: data?.embedById.id,
          organizationId: user.organizationId,
          name: data?.embedById.name,
          embedType: EmbedType.CandidateGuide,
          attributes: {
            ...data?.embedById.attributes,
            renderOptions: {
              height,
            },
          },
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["EmbedById", { id: data?.embedById.id }],
          });
        },
        onError: (error) => {
          toast((error as Error).message, { type: "error" });
        },
      }
    );
  };

  if (isEmbedLoading || isRaceLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader
        title={title}
        embedType={EmbedType.CandidateGuide}
        backLink={`/dashboard/${slug}/candidate-guides/${candidateGuide?.id}`}
      />
      <EmbedPageTabs
        embedType={EmbedType.CandidateGuide}
        selectedTab="Manage"
      />
      <section className={styles.section}>
        <div className={styles.flexBetween}>
          <h3>Candidates</h3>
          <div className={styles.flexBetween}>
            <Button
              label="Export All Data"
              size="medium"
              variant="primary"
              onClick={handleTableExport}
              disabled={isExportLoading}
            />
            <Button
              label="Email All"
              size="medium"
              variant="primary"
              disabled
            />
          </div>
        </div>
        <Table
          data={candidates}
          // @ts-expect-error react-table
          columns={candidateColumns}
          theme="aqua"
          initialState={{}}
          paginate={false}
        />
      </section>
      <section className={clsx(styles.section, styles.grid2)}>
        <div>
          <h3>Preview</h3>
          <Box width="fit-content">
            <CandidateGuideEmbed
              embedId={id as string}
              candidateGuideId={candidateGuideId}
              origin={window.location.origin}
              renderOptions={renderOptions}
            />
          </Box>
        </div>
        <div style={{ width: "auto" }}>
          <div>
            <h3>Options</h3>
            <Box>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  justifyContent: "space-evenly",
                  alignItems: "baseline",
                }}
              >
                <span style={{ width: "16rem" }}>Fixed height (px)</span>
                <TextInput
                  hideLabel
                  register={register}
                  control={control}
                  name="height"
                  size="small"
                  rules={{
                    pattern: {
                      value:
                        /^(600|6[0-9]{2}|7[0-9]{2}|8[0-9]{2}|9[0-9]{2}|1[0-4][0-9]{2}|1500)$/,
                      message: "Enter a value between 600 and 1500",
                    },
                  }}
                  errors={formState.errors.height?.message}
                  useToastError
                />
                <Button
                  variant="primary"
                  onClick={() => handleSubmit(handleRenderOptionsSave)()}
                  label="Save"
                  size="medium"
                  disabled={upsertEmbed.isPending || !formState.isDirty}
                />
              </div>
            </Box>
          </div>
          <div>
            <h3>Embed Code</h3>
            <EmbedCodeBlock id={id as string} />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <EmbedDeployments embed={data?.embedById as EmbedResult} />
      </section>
    </>
  );
}

function EmailCell({ row }: { row: CellContext<PoliticianResult, unknown> }) {
  const { user } = useAuth();
  const canEdit = user.role == Role.Staff || user.role == Role.Superuser;
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: row.getValue() as string,
    },
  });

  const upsertPolitician = useUpdatePoliticianMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { email: string }) => {
    try {
      upsertPolitician.mutate(
        {
          input: {
            id: row.row.original.id,
            email: data.email as string,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["RaceById"] });
            toast.success("Email updated successfully");
          },
          onError: () => {
            toast.error("Failed to update email");
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
      }}
    >
      {!!row.getValue() && (
        <span style={{ marginRight: "1rem" }}>{row.getValue() as string}</span>
      )}
      {canEdit && <GrEdit onClick={() => setIsOpen(true)} />}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>Update email for {row.row.original.fullName}</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <TextInput
              name="email"
              label="Email"
              register={register}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              }}
              control={control}
              errors={errors?.email?.message}
            />
            <Button
              label="Save"
              size="medium"
              variant="primary"
              type="submit"
              disabled={upsertPolitician.isPending}
            />
          </form>
        </div>
      </Modal>
    </div>
  );
}

CandidateGuideEmbedPage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
