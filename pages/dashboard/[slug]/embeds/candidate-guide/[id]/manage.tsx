import { Box, Button, Layout, LoaderFlag } from "components";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedResult,
  EmbedType,
  PoliticianResult,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useEmbedByIdQuery,
  useGenerateCandidateGuideIntakeLinkMutation,
  useRaceByIdQuery,
} from "generated";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../../../../../../components/EmbedPage/EmbedPage.module.scss";
import { EmbedCodeBlock } from "components/EmbedCodeBlock/EmbedCodeBlock";
import { EmbedDeployments } from "components/EmbedPage/EmbedPage";

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
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading: isEmbedLoading } = useEmbedByIdQuery({
    id: id as string,
  });

  const candidateGuide = data?.embedById?.candidateGuide;
  const raceId = data?.embedById?.race?.id as string;
  const { data: raceData, isLoading: isRaceLoading } = useRaceByIdQuery({
    id: raceId,
  });

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
        backLink={`/dashboard/${slug}/candidate-guides/${candidateGuide?.id}`}
      />
      <EmbedPageTabs
        embedType={EmbedType.CandidateGuide}
        selectedTab="Manage"
      />
      <section className={styles.section}>
        <h3>Preview</h3>
        <Box width="fit-content">
          <CandidateGuideEmbed
            embedId={id as string}
            candidateGuideId={candidateGuideId}
            origin={window.location.origin}
          />
        </Box>
      </section>
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
          initialState={{}}
          paginate={false}
        />
      </section>
      <section className={styles.section}>
        <h3>Embed Code</h3>
        <EmbedCodeBlock id={id as string} />
      </section>
      <section className={styles.section}>
        <EmbedDeployments embed={data?.embedById as EmbedResult} />
      </section>
    </>
  );
}

CandidateGuideEmbedPage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
