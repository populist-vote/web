import { Layout, LoaderFlag } from "components";
import { EmbedResult, useEmbedsByOrganizationQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { toast } from "react-toastify";
import { getRelativeTimeString } from "utils/dates";

import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "..";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/router";

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

function EmbedsIndex({ slug }: { slug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isLoading } = useEmbedsByOrganizationQuery(
    {
      id: user?.organizationId as string,
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );

  const embeds = data?.embedsByOrganization as EmbedResult[];

  const columns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
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

  const onRowClick = (row: Row<EmbedResult>) =>
    router.push(`/dashboard/${slug}/embeds/${row.original.id}`);

  if (isLoading) return <LoaderFlag />;

  return embeds?.length === 0 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <small>You don't have any embeds yet.</small>
    </div>
  ) : (
    <Table
      data={embeds || []}
      columns={columns}
      initialState={{}}
      onRowClick={onRowClick}
    />
  );
}

EmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedsIndex;
