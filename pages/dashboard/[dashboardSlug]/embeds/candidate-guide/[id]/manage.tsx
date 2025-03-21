import {
  Box,
  Button,
  Divider,
  Layout,
  LoaderFlag,
  Select,
  TextInput,
} from "components";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedResult,
  EmbedType,
  PoliticianResult,
  SystemRoleType,
  useCandidateGuideEmbedByIdQuery,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useDownloadAllCandidateGuideDataMutation,
  useGenerateCandidateGuideIntakeLinkMutation,
  useOrganizationBySlugQuery,
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
import { FaCopy, FaExternalLinkSquareAlt } from "react-icons/fa";
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
import { downloadCsv, titleCase } from "utils/strings";
import { Tooltip } from "components/Tooltip/Tooltip";
import { LanguageCode, LANGUAGES } from "utils/constants";

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

export default function CandidateGuideEmbedPage({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;

  const router = useRouter();
  const { id } = router.query;

  useAuth({
    organizationId: currentOrganizationId,
    redirectTo: `/login?next=dashboard/${dashboardSlug}/embeds/candidate-guide/${id}/manage`,
  });

  const { data, isLoading: isEmbedLoading } = useCandidateGuideEmbedByIdQuery(
    {
      id: id as string,
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const embed = data?.embedById;
  const previewUrl = `${window.location.origin}/embeds/preview/${embed?.id}`;

  const candidateGuide = embed?.candidateGuide;
  const raceId = embed?.race?.id as string;
  const { data: raceData, isLoading: isRaceLoading } = useRaceByIdQuery(
    {
      id: raceId,
    },
    {
      enabled: !!raceId,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: submissionsData } = useCandidateGuideSubmissionsByRaceIdQuery(
    {
      candidateGuideId: candidateGuide?.id as string,
      raceId: raceId,
    },
    {
      enabled: !!(candidateGuide?.id && raceId),
      staleTime: 1000 * 60 * 5,
    }
  );

  const allSubmissions = submissionsData?.candidateGuideById.questions?.flatMap(
    (question) => question.submissionsByRace
  );

  const availableLanguageCodes = submissionsData?.candidateGuideById.questions
    .flatMap((q) => q.submissionsByRace)
    .flatMap((sub) =>
      Object.entries(sub?.translations?.response || {}).filter(([, v]) => !!v)
    )
    .map(([k]) => k);

  const availableLanguages = LANGUAGES.filter(
    (lang) => availableLanguageCodes?.includes(lang.code) || lang.code === "en"
  );
  const renderOptions = embed?.attributes.renderOptions;

  const candidates = useMemo(
    () => raceData?.raceById?.candidates || [],
    [raceData]
  );
  const title = embed?.race?.title as string;
  const candidateGuideId = embed?.candidateGuide?.id as string;
  const intakeLinkMutation = useGenerateCandidateGuideIntakeLinkMutation();

  const handleCopyIntakeLink = useCallback(
    (politicianId: string, candidateGuideId: string) => {
      intakeLinkMutation.mutate(
        {
          candidateGuideId,
          politicianId,
          raceId,
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

  const exportMutation = useDownloadAllCandidateGuideDataMutation();

  const handleDataExport = () => {
    exportMutation.mutate(
      { candidateGuideId, raceId },
      {
        onSuccess: (data) => downloadCsv(data.downloadAllCandidateGuideData),
        onError: (error) => toast.error((error as Error).message),
      }
    );
  };

  const candidateColumns = useMemo<ColumnDef<PoliticianResult>[]>(
    () => [
      {
        header: "Candidate",
        accessorKey: "fullName",
        size: 150,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (row) => <ContactCell row={row} contactType="email" />,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        cell: (row) => <ContactCell row={row} contactType="phone" />,
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

  if (isEmbedLoading || isRaceLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader
        title={title}
        embedType={EmbedType.CandidateGuide}
        backLink={`/dashboard/${dashboardSlug}/candidate-guides/${candidateGuide?.id}`}
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
              onClick={handleDataExport}
              disabled={exportMutation.isPending}
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
      <section className={clsx(styles.section, styles.content)}>
        <div
          style={{
            width: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <OptionsForm
            embed={embed as EmbedResult}
            currentOrganizationId={currentOrganizationId as string}
            availableLanguages={availableLanguages}
          />
          <div>
            <h3>Embed Code</h3>
            <EmbedCodeBlock id={id as string} />
          </div>
          <div>
            <h3>Public Preview</h3>
            <Box>
              <div className={styles.flexBetween}>
                <a
                  href={previewUrl}
                  key={previewUrl}
                  className={clsx(styles.flexLeft, styles.flexBetween)}
                >
                  <FaExternalLinkSquareAlt /> {previewUrl}
                </a>
                <Tooltip content="Copy Preview URL">
                  <button
                    className={styles.iconButton}
                    onClick={() => {
                      void navigator.clipboard.writeText(previewUrl);
                      toast.success("Copied to clipboard!", {
                        position: "bottom-right",
                      });
                    }}
                  >
                    <FaCopy
                      style={{ cursor: "pointer" }}
                      color="var(--blue-text-light)"
                    />
                  </button>
                </Tooltip>
              </div>
            </Box>
          </div>
        </div>
        <div className={styles.cgPreview}>
          <h3>Preview</h3>
          <Box>
            <CandidateGuideEmbed
              embedId={id as string}
              candidateGuideId={candidateGuideId}
              origin={window.location.origin}
              renderOptions={renderOptions}
            />
          </Box>
        </div>
      </section>
      <section className={styles.section}>
        <EmbedDeployments embedId={embed?.id as string} />
      </section>
    </>
  );
}

function OptionsForm({
  embed,
  currentOrganizationId,
  availableLanguages,
}: {
  embed: EmbedResult;
  currentOrganizationId: string;
  availableLanguages: { code: string; display: string }[];
}) {
  const queryClient = useQueryClient();
  const renderOptions = embed?.attributes.renderOptions;

  const { register, control, handleSubmit, formState } = useForm<{
    height: number;
  }>({
    defaultValues: {
      height: renderOptions?.height || "auto",
    },
  });

  const upsertEmbed = useUpsertEmbedMutation();

  const handleRenderOptionsSave = ({ height }: { height: number }) => {
    upsertEmbed.mutate(
      {
        input: {
          id: embed?.id,
          organizationId: currentOrganizationId as string,
          name: embed?.name,
          embedType: EmbedType.CandidateGuide,
          attributes: {
            ...embed?.attributes,
            renderOptions: {
              height,
            },
          },
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["CandidateGuideEmbedById", { id: embed?.id }],
          });
          toast.success("Embed options saved successfully");
        },
        onError: (error) => {
          toast((error as Error).message, { type: "error" });
        },
      }
    );
  };

  const handleDefaultLanguageChange = (language: string) => {
    upsertEmbed.mutate(
      {
        input: {
          id: embed?.id,
          organizationId: currentOrganizationId as string,
          name: embed?.name,
          embedType: EmbedType.CandidateGuide,
          attributes: {
            ...embed?.attributes,
            renderOptions: {
              ...embed?.attributes?.renderOptions,
              defaultLanguage: language,
            },
          },
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["CandidateGuideEmbedById", { id: embed?.id }],
          });
        },
        onError: (error) => {
          toast((error as Error).message, { type: "error" });
        },
      }
    );
  };
  return (
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
        <Divider />
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span>Default language</span>
          <Select
            backgroundColor="blue"
            value={embed?.attributes?.renderOptions?.defaultLanguage || "en"}
            options={availableLanguages.map((l: LanguageCode) => ({
              value: l.code,
              label: l.display,
            }))}
            onChange={(e) => handleDefaultLanguageChange(e.target.value)}
          />
        </div>
      </Box>
    </div>
  );
}

function ContactCell({
  row,
  contactType,
}: {
  row: CellContext<PoliticianResult, unknown>;
  contactType: "email" | "phone";
}) {
  const { user } = useAuth();
  const canEdit =
    user?.systemRole == SystemRoleType.Staff ||
    user?.systemRole == SystemRoleType.Superuser;
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; phone: string }>({
    defaultValues: {
      email: row.row.original.email as string,
      phone: row.row.original.phone as string,
    },
  });

  const upsertPolitician = useUpdatePoliticianMutation();

  const queryClient = useQueryClient();

  const onSubmit = (data: { email?: string; phone?: string }) => {
    const email = data.email?.trim() === "" ? null : data.email?.trim();
    const phone = data.phone?.trim() === "" ? null : data.phone?.trim();
    try {
      upsertPolitician.mutate(
        {
          intakeToken: "",
          slug: "",
          input: {
            id: row.row.original.id,
            email,
            phone,
          },
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["RaceById"] });
            toast.success(`${titleCase(contactType)} updated successfully`);
          },
          onError: () => {
            toast.error(`Failed to update ${contactType}`);
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
      {canEdit && (
        <Tooltip content={`Edit ${titleCase(contactType)}`}>
          <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
            <GrEdit />
          </button>
        </Tooltip>
      )}
      <Modal
        modalId="contactInput"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div style={{ padding: "1.5rem", width: "32rem" }}>
          <h3>
            Update {contactType} for {row.row.original.fullName}
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            {contactType === "email" && (
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
            )}
            {contactType === "phone" && (
              <TextInput
                name="phone"
                label="Phone"
                register={register}
                rules={{
                  pattern: {
                    value: /^\+?[0-9]{1,15}$/,
                    message: "Invalid phone number",
                  },
                }}
                control={control}
                errors={errors?.phone?.message}
              />
            )}
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
