import { Box, Button, Layout, LoaderFlag } from "components";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { DashboardTopNav } from "../../..";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import {
  EmbedResult,
  EmbedType,
  PoliticianResult,
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
import styles from "../../../../../../components/Dashboard/Dashboard.module.scss";
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
  const { data: raceData, isLoading: isRaceLoading } = useRaceByIdQuery({
    id: data?.embedById?.race?.id as string,
  });
  const candidates = raceData?.raceById?.candidates || [];
  const title = data?.embedById.race?.title as string;
  const candidateGuideId = data?.embedById.candidateGuide?.id as string;
  const intakeLinkMutation = useGenerateCandidateGuideIntakeLinkMutation();

  const handleCopyIntakeLink = (politicianId: string) => {
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
  };

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
            onClick={() => handleCopyIntakeLink(row.getValue() as string)}
          />
        ),
      },
      {
        header: "Last Emailed",
        accessorKey: "lastEmailedAt",
      },
      {
        header: "Responded",
        accessorKey: "respondedAt",
      },
    ],
    []
  );

  if (isEmbedLoading || isRaceLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedHeader title={title} embedType={EmbedType.CandidateGuide} />
      <EmbedPageTabs
        embedType={EmbedType.CandidateGuide}
        selectedTab="Manage"
      />
      <section>
        <h3>Preview</h3>
        <Box>
          <CandidateGuideEmbed
            embedId={id as string}
            candidateGuideId={candidateGuideId}
            origin={window.location.origin}
          />
        </Box>
      </section>
      <section className={styles.container}>
        <div className={styles.flexBetween}>
          <h3>Candidates</h3>
          <div className={styles.flexBetween}>
            <Button label="Export All Data" size="medium" variant="primary" />
            <Button label="Email All" size="medium" variant="primary" />
          </div>
        </div>
        <Table
          data={candidates}
          // @ts-ignore
          columns={candidateColumns}
          initialState={{}}
          paginate={false}
        />
      </section>
      <section className={styles.container}>
        <h3>Embed Code</h3>
        <EmbedCodeBlock id={id as string} />
      </section>
      <section className={styles.container}>
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
