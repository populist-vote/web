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
  useEmbedsByOrganizationQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import { getRelativeTimeString } from "utils/dates";

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

export default function EmbedsIndex({ slug }: { slug: string }) {
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: slug as string,
    },
    {
      enabled: !!slug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  useAuth({ redirectTo: "/login", organizationId: currentOrganizationId });
  const { data, isLoading } = useEmbedsByOrganizationQuery({
    id: currentOrganizationId as string,
    filter: {
      embedType: EmbedType.Race,
    },
  });
  const columns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "race.title",
        header: "Title",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        size: 50,
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 50,
      },
    ],
    []
  );

  const embeds = (data?.embedsByOrganization || []) as EmbedResult[];

  return (
    <EmbedIndex
      isLoading={isLoading}
      slug={slug}
      title={"Race Embeds"}
      embeds={embeds}
      columns={columns}
      embedType={EmbedType.Race}
    />
  );
}

EmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
