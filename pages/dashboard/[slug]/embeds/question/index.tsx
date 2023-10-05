import { EmbedIndex, Layout, LoaderFlag } from "components";
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
} from "generated";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
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
  const { user } = useAuth();
  const { data, isLoading } = useEmbedsByOrganizationQuery(
    {
      id: user?.organizationId as string,
      filter: {
        embedType: EmbedType.Question,
      },
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );
  const columns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "question.prompt",
        header: "Prompt",
        size: 400,
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
        size: 100,
      },
    ],
    []
  );

  if (isLoading) return <LoaderFlag />;

  const embeds = (data?.embedsByOrganization || []) as EmbedResult[];

  return (
    <EmbedIndex
      slug={slug}
      title={"Question Embeds"}
      embeds={embeds}
      columns={columns}
      embedType={EmbedType.Question}
    />
  );
}

EmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);