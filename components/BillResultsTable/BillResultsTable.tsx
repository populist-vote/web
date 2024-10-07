import { ColumnDef, Row } from "@tanstack/react-table";
import { BillStatusBadge } from "components/BillStatusBadge/BillStatusBadge";
import { Table } from "components/Table/Table";
import {
  BallotMeasureResult,
  BallotMeasureStatus,
  BillResult,
  BillStatus,
  PoliticalScope,
  PopularitySort,
  State,
  useBallotMeasuresIndexQuery,
  useBillIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { Theme } from "hooks/useTheme";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useMemo } from "react";
import { getYear } from "utils/dates";
import styles from "components/Table/Table.module.scss";
import { BsPlusCircleFill } from "react-icons/bs";
import { IssueTagsTableCell } from "components/IssueTags/IssueTagsTableCell";
import clsx from "clsx";

function BillResultsTable({
  theme = "yellow",
  setSelectedBills,
}: {
  theme: Theme;
  setSelectedBills?: Dispatch<
    SetStateAction<
      {
        id: string;
        billNumber: string;
      }[]
    >
  >;
}) {
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
      pageSize: 20,
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

  const { data: ballotMeasureData } = useBallotMeasuresIndexQuery({
    pageSize: 20,
    filter: {
      query: debouncedSearchQuery || null,
      state: state as State,
      politicalScope: scope as PoliticalScope,
      year: parseInt(year as string),
      status: status as BallotMeasureStatus,
      issueTag: issue as string,
    },
    sort: {
      popularity: popularity as PopularitySort,
    },
  });

  const billResults = useMemo(
    () => (data?.bills.edges.map((edge) => edge.node) as BillResult[]) || [],
    [data]
  );

  const ballotMeasureResults = useMemo(
    () =>
      (ballotMeasureData?.ballotMeasures.edges.map(
        (edge) => edge.node
      ) as BallotMeasureResult[]) || [],
    [ballotMeasureData]
  );

  const allResults = useMemo(
    () => [...billResults, ...ballotMeasureResults],
    [billResults, ballotMeasureResults]
  );

  const columns = useMemo<ColumnDef<BillResult | BallotMeasureResult>[]>(
    () => [
      {
        accessorFn: (row) =>
          "billNumber" in row ? row.billNumber : row.ballotMeasureCode,
        header: "Code",
        size: 80,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 270,
        cell: (info) =>
          "populistTitle" in info.row.original &&
          info.row.original?.populistTitle
            ? info.row.original.populistTitle
            : (info.getValue() as string),
      },
      {
        accessorFn: (row) =>
          "session" in row
            ? row.session?.startDate
            : "election" in row
              ? row.election?.electionDate
              : null,
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
        size: 100,
      },
      {
        accessorKey: "issueTags",
        header: "Issues",
        cell: (info) => IssueTagsTableCell({ info }),
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

  const onRowClick = (row: Row<BillResult | BallotMeasureResult>) => {
    router.pathname === "/bills"
      ? void router.push(`/bills/${row.original.slug}`)
      : router.pathname.includes("/embeds/legislation-tracker/") &&
          setSelectedBills
        ? setSelectedBills((prev) => {
            return [
              ...prev,
              {
                id: row.original.id,
                billNumber:
                  "billNumber" in row.original
                    ? row.original.billNumber
                    : row.original.ballotMeasureCode,
              },
            ];
          })
        : void router.replace(
            {
              query: {
                ...query,
                selected: row.original.id,
                selectedType:
                  "billNumber" in row.original ? "billId" : "ballotMeasureId",
              },
            },
            undefined,
            {
              scroll: false,
              shallow: true,
            }
          );
  };

  if (!shouldFetchBillResults) return null;

  if (allResults?.length === 0)
    return (
      <small
        className={clsx(styles.noResults, styles.centered)}
        style={{ height: "15rem" }}
      >
        No results
      </small>
    );

  return (
    <Table
      data={allResults}
      columns={columns}
      initialState={{
        pagination: {
          pageSize: 7,
        },
      }}
      theme={theme}
      onRowClick={onRowClick}
      selectedRowId={selected as string}
    />
  );
}

export { BillResultsTable };
