import { ColumnDef, Row } from "@tanstack/react-table";
import { SearchInput } from "components/SearchInput/SearchInput";
import { Select } from "components/Select/Select";
import { Table } from "components/Table/Table";
import { Box } from "components/Box/Box";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  BallotMeasureJurisdiction,
  BallotMeasureResult,
  BallotMeasureStatus,
  State,
  useBallotMeasureSearchQuery,
  useElectionsIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import states from "utils/states";
import styles from "./BallotMeasureSearch.module.scss";

function enumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const jurisdictionOptions = [
  { value: "any", label: "Any Jurisdiction" },
  { value: BallotMeasureJurisdiction.State, label: "State" },
  { value: BallotMeasureJurisdiction.County, label: "County" },
  { value: BallotMeasureJurisdiction.City, label: "City" },
  { value: BallotMeasureJurisdiction.SchoolDistrict, label: "School District" },
  {
    value: BallotMeasureJurisdiction.SpecialDistrict,
    label: "Special District",
  },
];

function BallotMeasureSearch() {
  const router = useRouter();
  const { user } = useAuth();
  const { query } = router;
  const {
    search = "",
    status = "any",
    jurisdiction = "any",
    year = "any",
    election = "any",
    selected = null,
  } = query;
  const savedState = user?.userProfile?.address?.state;
  const state =
    typeof query.state === "string" ? query.state : savedState || "any";

  const [searchValue, setSearchValue] = useState(search as string);
  const debouncedSearch = useDebounce<string>((search as string) || "", 350);

  const { data: electionsData } = useElectionsIndexQuery({ filter: {} });
  const elections = useMemo(
    () => electionsData?.elections ?? [],
    [electionsData?.elections],
  );

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        elections
          .map((election) => String(election.electionDate).slice(0, 4))
          .filter((value) => /^\d{4}$/.test(value)),
      ),
    ).sort((a, b) => b.localeCompare(a));
    return [
      { value: "any", label: "Any Year" },
      ...years.map((value) => ({ value, label: value })),
    ];
  }, [elections]);

  const electionOptions = useMemo(() => {
    const filtered = elections
      .filter((item) => {
        const matchesYear =
          year === "any" ||
          String(item.electionDate).startsWith(year as string);
        const matchesState =
          state === "any" || !item.state || item.state === state;
        return matchesYear && matchesState;
      })
      .sort((a, b) =>
        String(b.electionDate).localeCompare(String(a.electionDate)),
      );
    return [
      { value: "any", label: "Any Election" },
      ...filtered.map((item) => ({ value: item.id, label: item.title })),
    ];
  }, [elections, year, state]);

  const stateOptions = [
    { value: "any", label: "Any State" },
    ...Object.entries(states).map(([code, name]) => ({
      value: code,
      label: name,
    })),
  ];

  const statusOptions = [
    { value: "any", label: "Any Status" },
    ...Object.values(BallotMeasureStatus).map((value) => ({
      value,
      label: enumLabel(value),
    })),
  ];

  const replaceQuery = (
    next: Record<string, string | string[] | undefined>,
  ) => {
    void router.replace({ query: next }, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  const setFilter = (key: string, value: string) => {
    const next = { ...query };
    if (key === "state") {
      next.state = value;
      delete next.election;
    } else if (!value || value === "any") {
      delete next[key];
    } else {
      next[key] = value;
    }
    if (key === "year") delete next.election;
    replaceQuery(next);
  };

  const parsedYear =
    year !== "any" && /^\d{4}$/.test(year as string)
      ? parseInt(year as string, 10)
      : null;
  const statusFilter =
    status !== "any" ? (status as BallotMeasureStatus) : null;
  const jurisdictionFilter =
    jurisdiction !== "any" ? (jurisdiction as BallotMeasureJurisdiction) : null;
  const electionFilter = election !== "any" ? (election as string) : null;
  const stateFilter = state !== "any" ? (state as State) : null;

  const shouldFetch =
    !!debouncedSearch ||
    !!statusFilter ||
    !!jurisdictionFilter ||
    parsedYear != null ||
    !!electionFilter ||
    !!stateFilter;

  const { data, isLoading, error } = useBallotMeasureSearchQuery(
    {
      filter: {
        query: debouncedSearch || null,
        status: statusFilter,
        jurisdiction: jurisdictionFilter,
        year: parsedYear,
        electionId: electionFilter,
        state: stateFilter,
      },
    },
    {
      enabled: shouldFetch,
      refetchOnWindowFocus: false,
    },
  );

  const measures = useMemo(
    () =>
      (data?.ballotMeasures.edges.map((edge) => edge.node) ??
        []) as BallotMeasureResult[],
    [data],
  );

  const columns = useMemo<ColumnDef<BallotMeasureResult>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        size: 220,
      },
      {
        accessorKey: "ballotMeasureCode",
        header: "Code",
        size: 160,
      },
      {
        accessorKey: "county",
        header: "County",
        size: 140,
      },
      {
        accessorKey: "election.title",
        header: "Election",
        cell: (info) => info.row.original.election?.title,
        size: 180,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => enumLabel(String(info.getValue() ?? "")),
        size: 140,
      },
    ],
    [],
  );

  const onRowClick = (row: Row<BallotMeasureResult>) => {
    void router.replace(
      {
        query: { ...query, selected: row.original.id },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  return (
    <>
      <Box>
        <div className={styles.filters}>
          <SearchInput
            placeholder="Search ballot measures"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Select
            border="solid"
            accentColor="yellow"
            textColor="white"
            value={state}
            options={stateOptions}
            onChange={(event) => setFilter("state", event.target.value)}
          />
          <Select
            border="solid"
            accentColor="yellow"
            textColor="white"
            value={(status as string) || "any"}
            options={statusOptions}
            onChange={(event) => setFilter("status", event.target.value)}
          />
          <Select
            border="solid"
            accentColor="yellow"
            textColor="white"
            value={(jurisdiction as string) || "any"}
            options={jurisdictionOptions}
            onChange={(event) => setFilter("jurisdiction", event.target.value)}
          />
          <Select
            border="solid"
            accentColor="yellow"
            textColor="white"
            value={(year as string) || "any"}
            options={yearOptions}
            onChange={(event) => setFilter("year", event.target.value)}
          />
          <Select
            border="solid"
            accentColor="yellow"
            textColor="white"
            value={(election as string) || "any"}
            options={electionOptions}
            onChange={(event) => setFilter("election", event.target.value)}
          />
        </div>
      </Box>
      {shouldFetch && (
        <div className={styles.results}>
          {isLoading ? (
            <LoaderFlag />
          ) : error ? (
            <small>Something went wrong loading ballot measures.</small>
          ) : measures.length === 0 ? (
            <small>No results</small>
          ) : (
            <Table
              data={measures}
              columns={columns}
              theme="yellow"
              onRowClick={onRowClick}
              selectedRowId={selected as string}
              initialState={{
                pagination: {
                  pageSize: 10,
                },
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export { BallotMeasureSearch };
