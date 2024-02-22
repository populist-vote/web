import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import styles from "./BillTrackerWidget.module.scss";
import { BillResult, BillStatus, useBillsByIdsQuery } from "generated";
import { BillStatusBadge } from "components/BillStatusBadge/BillStatusBadge";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { splitAtDigitAndJoin } from "utils/strings";

export interface BillTrackerWidgetRenderOptions {
  tbd: boolean;
}

export function BillTrackerWidget({
  billIds,
  embedId,
  origin,
  renderOptions,
}: {
  billIds: string[];
  embedId: string;
  origin: string;
  renderOptions: BillTrackerWidgetRenderOptions;
}) {
  const { data, isLoading, error } = useBillsByIdsQuery({ ids: billIds });
  const bills = (data?.billsByIds || []) as Partial<BillResult>[];

  useEmbedResizer({ origin, embedId });

  const { tbd: _tbd } = renderOptions; // What render options do we want to make available?

  const columns = useMemo<ColumnDef<Partial<BillResult>>[]>(
    () => [
      {
        accessorKey: "billNumber",
        header: "Code",
        cell: (info) => (
          <>
            {info.row.original.state || "U.S."} -{" "}
            {splitAtDigitAndJoin(info.getValue() as string)}
          </>
        ),
        meta: { className: styles.codeColumn },
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <div className={styles.titleCell}>{info.getValue() as string}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <BillStatusBadge
            status={info.getValue() as BillStatus}
            theme="light"
          />
        ),
        meta: { className: styles.statusColumn },
      },
      {
        accessorKey: "legiscanLastActionDate",
        header: "Last Action",
        cell: (info) =>
          info.getValue() &&
          new Date(info.getValue() as string).toLocaleDateString(),
        meta: { className: styles.activityColumn },
      },
    ],
    []
  );

  const initialState = {
    sorting: [{ id: "updatedAt", desc: true }],
  };

  const [sorting, setSorting] = useState<SortingState>(
    initialState.sorting || []
  );

  const table = useReactTable<Partial<BillResult>>({
    data: bills,
    columns,
    state: {
      sorting,
    },
    initialState,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const handleRowClick = (billSlug: string) => {
    window.open(`/bills/${billSlug}`, "_blank");
  };

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this bill tracker.</div>;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
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
                          asc: <AiFillCaretUp color={"var(--blue)"} />,
                          desc: <AiFillCaretDown color={"var(--blue)"} />,
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
                onClick={() => handleRowClick(row.original.slug as string)}
                style={{ cursor: "pointer" }}
                className={styles.row}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { className: string })
                          ?.className ?? ""
                      }
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
      <WidgetFooter />
    </div>
  );
}
