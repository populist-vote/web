import { CSSProperties, useState } from "react";

import styles from "./Table.module.scss";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { Button } from "components/Button/Button";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import clsx from "clsx";
import { BillResult } from "generated";

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

type TableTheme = "green" | "yellow" | "orange" | "aqua" | "violet";

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

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  initialState: InitialTableState;
  metaRight?: React.ReactNode;
  theme?: TableTheme;
  onRowClick?: (row: Row<T>) => void;
  selectedRowId?: string;
  globalFilter?: string;
};

function Table<T extends object>({
  data,
  columns,
  initialState,
  metaRight,
  theme = "yellow",
  onRowClick,
  selectedRowId,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState.sorting || []
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();
  const { search } = router.query;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: search,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState,
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

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
          border: "var(--green-dark)",
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
    return (
      <div className={styles.pageIndex}>
        <div>
          <Button
            theme="blue"
            size={"small"}
            variant="text"
            label="Previous"
            hideLabel
            icon={<FaChevronLeft />}
            iconPosition="before"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
        </div>
        <span className={styles.pageDots}>
          {[...Array(table.getPageCount())].map((_, i) => (
            <FaCircle
              size={"0.5em"}
              key={i}
              color={
                i === table.getState().pagination.pageIndex
                  ? getTheme().index.selected
                  : getTheme().index.unselected
              }
              onClick={() => table.setPageIndex(i)}
            />
          ))}
        </span>
        <div>
          <Button
            theme="blue"
            size={"small"}
            variant="text"
            label="Previous"
            hideLabel
            icon={<FaChevronRight />}
            iconPosition="after"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageIndex />
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
                        width: header.getSize(),
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
                      (row.original as BillResult).id === selectedRowId,
                  })}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
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
            {table.getRowModel().rows.length +
              " " +
              "Row" +
              `${table.getRowModel().rows.length > 1 ? "s," : ","}`}{" "}
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </small>
          {metaRight}
        </div>
      </div>
    </>
  );
}

export { Table };
