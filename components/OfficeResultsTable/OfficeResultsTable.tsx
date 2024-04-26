import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import {
  OfficeResult,
  PoliticalScope,
  State,
  useOfficeIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { Theme } from "hooks/useTheme";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styles from "components/Table/Table.module.scss";
import { BsPlusCircleFill } from "react-icons/bs";

export function OfficeResultsTable({ theme = "yellow" }: { theme?: Theme }) {
  const router = useRouter();
  const { query } = router;
  const { state = null, search = null, scope = null, selected = null } = query;

  const shouldFetchOfficeResults = !!search || !!state;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data } = useOfficeIndexQuery(
    {
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope as PoliticalScope,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetchOfficeResults,
    }
  );

  const officeResults = data?.offices.edges.map((edge) => edge.node) as
    | OfficeResult[]
    | [];

  const columns = useMemo<ColumnDef<OfficeResult>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "subtitle",
        header: "Subtitle",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "state",
        header: "State",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "politicalScope",
        header: "Scope",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "actions",
        header: "",
        cell: () => {
          const isDashboard = router.pathname.includes("embeds");
          if (!isDashboard) return null;

          return (
            <BsPlusCircleFill
              color="var(--blue-light)"
              size={20}
              className={styles.addButton}
            />
          );
        },
        size: 10,
      },
    ],
    [router.pathname]
  );

  if (!shouldFetchOfficeResults) return null;

  if (officeResults?.length === 0)
    return <small className={styles.noResults}>No results</small>;

  return (
    <Table
      data={officeResults || []}
      columns={columns}
      initialState={{
        pagination: {
          pageSize: 7,
        },
      }}
      theme={theme}
      onRowClick={() => {}}
      selectedRowId={selected as string}
    />
  );
}
