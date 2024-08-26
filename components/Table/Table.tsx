import { CSSProperties, useEffect, useState } from "react";

import styles from "./Table.module.scss";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { Button } from "components/Button/Button";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import clsx from "clsx";

import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
  InitialTableState,
  Row,
  SortingState,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import { useRouter } from "next/router";
import { RiMoreLine } from "react-icons/ri";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

type TableTheme =
  | "default"
  | "green"
  | "yellow"
  | "orange"
  | "aqua"
  | "violet"
  | "blue";

interface TableThemeColors {
  background: string;
  color: string;
  selectedRow: string;
  border: string;
  index: {
    selected: string;
    unselected: string;
  };
}

type TableProps<T extends object & { id?: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  initialState: InitialTableState;
  metaRight?: React.ReactNode;
  theme?: TableTheme;
  onRowClick?: (row: Row<T>) => void;
  selectedRowId?: string | null;
  globalFilter?: string;
  useSearchQueryAsFilter?: boolean;
  targetSearchId?: string;
  paginate?: boolean;
};

function Table<T extends object & { id?: string }>({
  data,
  columns,
  initialState = {},
  metaRight,
  theme = "yellow",
  onRowClick,
  selectedRowId,
  useSearchQueryAsFilter = false,
  targetSearchId,
  paginate = true,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState.sorting || []
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();
  const { search, searchId } = router.query;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter:
        useSearchQueryAsFilter && searchId == targetSearchId ? search : null,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      ...initialState,
      pagination: {
        ...initialState.pagination,
        pageSize: paginate
          ? initialState?.pagination?.pageSize || 10
          : data.length,
      },
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  // Use useEffect to dynamically update pageSize based on paginate prop
  useEffect(() => {
    const pageSize = paginate
      ? table.getState().pagination.pageSize
      : data.length;
    table.setPageSize(pageSize);
  }, [paginate, data.length, table]);

  // Set all selected rows in comma separated query parameter
  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows.map((row) => row.id);
    if (selectedRows.length) {
      void router.push(
        {
          query: {
            ...router.query,
            selectedRows: selectedRows.join(","),
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      const { selectedRows: _, ...queryWithoutSelectedRows } = router.query;
      void router.push(
        {
          query: queryWithoutSelectedRows,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [table.getSelectedRowModel().rows]);

  // This has a runtime cost, should ultimately move this into SCSS file and handle using theme classes
  const getTheme = (): TableThemeColors => {
    switch (theme) {
      case "yellow":
        return {
          background: "var(--blue-darker)",
          color: "var(--yellow)",
          selectedRow: "rgba(255, 228, 92, 0.05)",
          border: "var(--blue-dark)",
          index: {
            selected: "var(--blue)",
            unselected: "var(--blue-dark)",
          },
        };
      case "green":
        return {
          background: "rgba(142 234 120 / 0.05)",
          color: "var(--green)",
          selectedRow: "rgba(142 234 120 / 0.1)",
          border: "rgba(142 234 120 / 0.15)",
          index: {
            selected: "var(--green)",
            unselected: "var(--green-dark)",
          },
        };
      case "orange":
        return {
          background: "var(--blue-darker)",
          color: "var(--orange)",
          selectedRow: "rgba(255, 228, 92, 0.05)",
          border: "var(--blue-dark)",
          index: {
            selected: "var(--blue)",
            unselected: "var(--blue-dark)",
          },
        };

      case "aqua":
        return {
          background: "rgba(0 255 255 / 0.05)",
          color: "var(--aqua)",
          selectedRow: "rgba(255, 228, 92, 0.05)",
          border: "var(--blue-dark)",
          index: {
            selected: "var(--aqua)",
            unselected: "var(--aqua-dark)",
          },
        };
      case "violet":
        return {
          background: "var(--blue-darker)",
          color: "var(--violet)",
          selectedRow: "rgba(255, 228, 92, 0.05)",
          border: "var(--blue-dark)",
          index: {
            selected: "var(--violet)",
            unselected: "var(--violet-dark)",
          },
        };
      default:
        return {
          background: "var(--blue-darker)",
          color: "var(--blue-text-light)",
          selectedRow: "rgba(255, 228, 92, 0.05)",
          border: "var(--blue-dark)",
          index: {
            selected: "var(--aqua)",
            unselected: "var(--blue-dark)",
          },
        };
    }
  };

  const styleVars: CSSProperties & {
    "--background-color": string;
    "--border-color": string;
    "--text-color": string;
    "--selected-row-color": string;
  } = {
    [`--background-color`]: getTheme().background,
    [`--border-color`]: getTheme().border,
    [`--text-color`]: getTheme().color,
    [`--selected-row-color`]: getTheme().selectedRow,
  };

  const PageIndex = () => {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    const maxDots = 16;

    const startPage = Math.max(
      0,
      Math.min(currentPage - 2, pageCount - maxDots)
    );
    const endPage = Math.min(pageCount - 1, startPage + maxDots - 1);

    return (
      <div className={styles.pageIndex}>
        <Button
          theme="blue"
          size="small"
          variant="text"
          label="Previous"
          hideLabel
          icon={<FaChevronLeft />}
          iconPosition="before"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />

        <span className={styles.pageDots}>
          {startPage > 0 && pageCount > maxDots && (
            <RiMoreLine color={getTheme().index.unselected} />
          )}

          {[...Array(endPage - startPage + 1)].map((_, i) => {
            const pageIndex = startPage + i;
            return (
              <FaCircle
                size="0.5em"
                key={pageIndex}
                color={
                  pageIndex === currentPage
                    ? getTheme().index.selected
                    : getTheme().index.unselected
                }
                onClick={() => table.setPageIndex(pageIndex)}
              />
            );
          })}

          {endPage < pageCount - 1 && pageCount > maxDots && (
            <RiMoreLine color={getTheme().index.unselected} />
          )}
        </span>

        <Button
          theme="blue"
          size="small"
          variant="text"
          label="Next"
          hideLabel
          icon={<FaChevronRight />}
          iconPosition="after"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {paginate && <PageIndex />}
      <div className={styles.container} style={styleVars}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width:
                          header.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? styles.sortableHeader
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <AiFillCaretUp color={getTheme().color} />,
                            desc: <AiFillCaretDown color={getTheme().color} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={clsx({
                    [styles.selected as string]:
                      selectedRowId && row.original.id === selectedRowId,
                  })}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width:
                            cell.column.getSize() === Number.MAX_SAFE_INTEGER
                              ? "auto"
                              : cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.tableMeta}>
          <small>
            {!!table.getSelectedRowModel().rows.length && (
              <span style={{ color: "var(--blue-text-light)" }}>
                {table.getSelectedRowModel().rows.length + " " + "Selected of "}
              </span>
            )}
            <small>
              Showing {table.getRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} Results{" "}
              <span style={{ margin: "0 0.5rem", color: "var(--blue-text)" }}>
                /
              </span>{" "}
              {data.length} Total{" "}
              <span style={{ margin: "0 0.5rem", color: "var(--blue-text)" }}>
                /
              </span>{" "}
            </small>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </small>
          {metaRight}
        </div>
      </div>
    </div>
  );
}

export { Table };
