import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "components/Badge/Badge";
import { BillStatusBadge } from "components/BillStatusBadge/BillStatusBadge";
import { Table } from "components/Table/Table";
import {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticalScope,
  PopularitySort,
  State,
  useBillIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { getYear } from "utils/dates";

function BillResultsTable() {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    year = null,
    scope = null,
    issue = null,
    popularity = null,
    selected = null,
  } = query;

  const shouldFetchBillResults =
    !!search || !!state || !!status || !!year || !!popularity || !!issue;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data } = useBillIndexQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope as PoliticalScope,
        year: parseInt(year as string),
        status: status as BillStatus,
        issueTag: issue as string,
      },
      sort: {
        popularity: popularity as PopularitySort,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetchBillResults,
    }
  );

  const billResults = data?.bills.edges.map((edge) => edge.node) as
    | BillResult[]
    | [];

  const columns = useMemo<ColumnDef<BillResult>[]>(
    () => [
      {
        accessorKey: "billNumber",
        header: "Leg. Code",
        size: 80,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 500,
      },
      {
        accessorKey: "session.startDate",
        header: "Year",
        cell: (info) => getYear(info.getValue() as string),
        size: 60,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <BillStatusBadge status={info.getValue() as BillStatus} />
        ),
      },
      {
        accessorKey: "issueTags",
        header: "Issues",
        cell: (info) =>
          (info.getValue() as IssueTagResult[]).map((tag: IssueTagResult) => (
            <Badge key={tag.id} size="small" color="white">
              {tag.name}
            </Badge>
          )),
      },
    ],
    []
  );

  const onRowClick = (row: Row<BillResult>) => {
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

  if (!shouldFetchBillResults) return null;

  return (
    <Table
      data={billResults || []}
      columns={columns}
      initialState={{
        pagination: {
          pageSize: 7,
        },
      }}
      onRowClick={onRowClick}
      selectedRowId={selected as string}
    />
  );
}

export { BillResultsTable };
