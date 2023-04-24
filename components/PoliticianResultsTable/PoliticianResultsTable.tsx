import { ColumnDef, Row } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import {
  PoliticalScope,
  PoliticianResult,
  usePoliticianIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import { useMemo } from "react";

function PoliticianResultsTable() {
  const router = useRouter();
  const { query } = router;
  const { search, scope, selected } = query;
  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );
  const { data } = usePoliticianIndexQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        politicalScope: scope as PoliticalScope,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const politicianResults = data?.politicians.edges.map((edge) => edge.node) as
    | PoliticianResult[]
    | [];

  const columns = useMemo<ColumnDef<PoliticianResult>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        size: 80,
      },
      {
        accessorKey: "currentOffice.name",
        header: "Office",
      },
    ],
    []
  );

  const onRowClick = (row: Row<PoliticianResult>) => {
    void router.replace(
      {
        query: { ...query, selected: row.original.id },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  };

  return (
    <Table
      data={politicianResults || []}
      columns={columns}
      initialState={{
        pagination: {
          pageSize: 10,
        },
      }}
      onRowClick={onRowClick}
      selectedRowId={selected as string}
    />
  );
}

export { PoliticianResultsTable };
