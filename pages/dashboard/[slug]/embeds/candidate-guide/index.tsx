import { EmbedIndex, Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  BillResult,
  EmbedResult,
  EmbedType,
  useEmbedsByOrganizationQuery,
} from "generated";
import { getRelativeTimeString } from "utils/dates";
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

export default function CandidateGuideEmbedIndex({ slug }: { slug: string }) {
  const { user } = useAuth({ redirectTo: "/login" });
  const { data, isLoading } = useEmbedsByOrganizationQuery({
    id: user?.organizationId as string,
    filter: {
      embedType: EmbedType.CandidateGuide,
    },
  });

  const candidateGuideColumns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "race.title",
        header: "Race",
        size: 300,
        cell: (info) => {
          return ((info.getValue() as BillResult[]) || [])
            .map((b) => b.billNumber)
            .join(", ");
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        size: 100,
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 110,
      },
    ],
    []
  );

  const embeds = (data?.embedsByOrganization || []) as EmbedResult[];

  return (
    <EmbedIndex
      isLoading={isLoading}
      slug={slug}
      title={"Candidate Guide Embeds"}
      embeds={embeds}
      columns={candidateGuideColumns}
      embedType={EmbedType.CandidateGuide}
    />
  );
}

CandidateGuideEmbedIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
