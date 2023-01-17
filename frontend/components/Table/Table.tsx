import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getPaginationRowModel,
  InitialTableState,
} from "@tanstack/react-table";
import styles from "./Table.module.scss";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { Button } from "components/Button/Button";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  initialState: InitialTableState;
  metaRight?: React.ReactNode;
};

function Table<T extends object>({
  data,
  columns,
  initialState,
  metaRight,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState.sorting || []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    initialState,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

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
                  ? "var(--green)"
                  : "var(--blue-dark)"
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

      <div className={styles.container}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
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
                            asc: <AiFillCaretUp color="var(--green)" />,
                            desc: <AiFillCaretDown color="var(--green)" />,
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
            {table
              .getRowModel()
              .rows // .rows.slice(0, 10)
              .map((row) => {
                return (
                  <tr key={row.id}>
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
          <small>{table.getRowModel().rows.length} Rows</small>
          {metaRight}
        </div>
      </div>
    </>
  );
}

export { Table };
