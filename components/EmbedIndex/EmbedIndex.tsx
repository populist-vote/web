import { LoaderFlag } from "components";
import { EmbedResult, useEmbedsByOrganizationQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { getRelativeTimeString } from "utils/dates";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { Badge } from "components/Badge/Badge";
import Link from "next/link";

function EmbedsIndex({ slug, title }: { slug: string; title: string }) {
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
    <>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link href={`/dashboard/${slug}/embeds/legislation`}>
          <Badge
            theme="yellow"
            clickable
            label="Legislation"
            selected={router.asPath.includes("/legislation")}
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/multi-legislation`}>
          <Badge
            theme="orange"
            clickable
            label="Multi Legislation"
            selected={router.asPath.includes("/multi-legislation")}
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/politician`}>
          <Badge
            theme="aqua"
            clickable
            label="Politician"
            selected={router.asPath.includes("/politician")}
          />
        </Link>
      </div>
      <h2>{title}</h2>
      <Table
        data={embeds || []}
        columns={columns}
        initialState={{}}
        onRowClick={onRowClick}
      />
    </>
  );
}

export { EmbedsIndex };
