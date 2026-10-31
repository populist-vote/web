import { EmbedIndex, Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  EmbedResult,
  EmbedType,
  useBallotMeasureEmbedsByOrganizationQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import styles from "styles/modules/dashboard.module.scss";

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
        ["auth", "common"],
        nextI18nextConfig,
      )),
    },
  };
}

export default function BallotMeasureEmbedsIndex({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    },
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  useAuth({
    redirectTo: "/login",
    organizationId: currentOrganizationId,
  });
  const { data, isLoading } = useBallotMeasureEmbedsByOrganizationQuery(
    {
      id: currentOrganizationId as string,
    },
    {
      enabled: !!currentOrganizationId,
    },
  );

  const columns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "ballotMeasure.title",
        header: "Title",
        cell: (info) => info.row.original.ballotMeasure?.title,
        size: 180,
      },
      {
        accessorKey: "ballotMeasure.description",
        header: "Description",
        cell: (info) => (
          <span className={styles.elipsis}>
            {info.row.original.ballotMeasure?.description}
          </span>
        ),
        size: 280,
      },
      {
        accessorKey: "ballotMeasure.ballotMeasureCode",
        header: "Code",
        cell: (info) => info.row.original.ballotMeasure?.ballotMeasureCode,
        size: 160,
      },
      {
        accessorKey: "ballotMeasure.election.title",
        header: "Election",
        cell: (info) => info.row.original.ballotMeasure?.election?.title,
        size: 180,
      },
    ],
    [],
  );

  const embeds = (data?.embedsByOrganization || []) as EmbedResult[];

  return (
    <EmbedIndex
      isLoading={isLoading}
      slug={dashboardSlug}
      title="Ballot Measure Embeds"
      embeds={embeds}
      columns={columns}
      embedType={EmbedType.BallotMeasure}
    />
  );
}

BallotMeasureEmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
