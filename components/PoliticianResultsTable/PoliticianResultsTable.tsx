import { ColumnDef, Row } from "@tanstack/react-table";
import { PartyAvatar } from "components/Avatar/Avatar";
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

  const politicianResults = useMemo(
    () =>
      data?.politicians.edges.map((edge) => edge.node) as
        | PoliticianResult[]
        | [],
    [data]
  );

  const columns = useMemo<ColumnDef<PoliticianResult>[]>(
    () => [
      {
        accessorKey: "assets.thumbnailImage160",
        header: "",
        cell: (info) => (
          <PartyAvatar
            src={info.getValue() as string}
            alt={info.row.getValue("fullName")}
            party={info.row.getValue("party")}
            size={50}
          />
        ),
        size: 25,
      },
      {
        accessorKey: "fullName",
        header: "Name",
        size: 80,
      },
      {
        accessorKey: "homeState",
        header: "State",
      },
      {
        accessorKey: "party",
        header: "Party",
      },
      {
        accessorKey: "currentOffice.title",
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
        columnVisibility: {
          party: false,
        },
      }}
      theme="aqua"
      onRowClick={onRowClick}
      selectedRowId={selected as string}
    />
  );
}

export { PoliticianResultsTable };
