import { ColumnDef, Row } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { RaceResult, useRaceIndexQuery } from "generated";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { dateString } from "utils/dates";
import { titleCase } from "utils/strings";

export function RaceResultsTable() {
  const router = useRouter();
  const { query } = router;
  const { search, selected } = query;
  const shouldFetchRaceResults = !!search;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );
  const { data } = useRaceIndexQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetchRaceResults,
    }
  );

  const raceResults = useMemo(
    () => data?.races.edges.map((edge) => edge.node) || [],
    [data?.races.edges]
  ) as RaceResult[];

  const columns = useMemo<ColumnDef<RaceResult>[]>(
    () => [
      {
        accessorKey: "office.title",
        header: "Office",
      },
      {
        accessorKey: "office.subtitle",
        header: "Location",
      },
      {
        accessorKey: "raceType",
        header: "Type",
        cell: (info) => {
          const raceType = info.getValue() as string;
          const party = info.row.getValue("party") as string;
          return titleCase(`${raceType} ${party ? "- " + party : ""}`);
        },
      },
      {
        accessorKey: "party",
        header: "Party",
      },
      {
        accessorKey: "electionDate",
        header: "Date",
        cell: (info) => dateString(info.getValue() as string, true),
      },
    ],
    []
  );

  const onRowClick = (row: Row<RaceResult>) => {
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
      data={raceResults}
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
