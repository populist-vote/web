import { EmbedResult } from "generated";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/router";
// import { Badge } from "components/Badge/Badge";
// import Link from "next/link";
import { useTheme } from "hooks/useTheme";

function EmbedIndex({
  slug,
  title,
  embedType,
  embeds,
  columns,
}: {
  slug: string;
  title: string;
  embedType: "legislation" | "multi-legislation" | "politician";
  embeds: EmbedResult[];
  columns: ColumnDef<EmbedResult>[];
}) {
  const router = useRouter();
  const { theme } = useTheme();

  const onRowClick = (row: Row<EmbedResult>) =>
    router.push(`/dashboard/${slug}/embeds/${embedType}/${row.original.id}`);
  return (
    <div>
      {/* <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link href={`/dashboard/${slug}/embeds/legislation`}>
          <Badge
            theme="yellow"
            clickable
            label="Legislation"
            selected={router.asPath.includes("/legislation")}
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
      </div> */}
      <h2>{title}</h2>
      {embeds?.length === 0 ? (
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
          theme={theme}
        />
      )}
    </div>
  );
}

export { EmbedIndex };
