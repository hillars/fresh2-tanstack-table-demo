// islands/TableIsland.tsx
import { useMemo } from "preact/hooks";
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import { flexRender, usePreactTable } from "../preactAdapter.ts";

export type Bond = { core: Core; bond: BondFacet };

type Core = {
  v: 1;
  type: "stock" | "bond" | "etf" | "future" | "option" | string;
  isin: string;
  name: string;
  currency: string;
  ticker?: string;
};

type BondFacet = {
  v: 1;
  bondSegment: string;
  issueDate: Date;
  maturityDate: Date;
  lastTradingDay: Date;
  noOfSecurities: number;
  nominal: number;
  couponRate: number; // e.g. 3.75
  accruedInterest: number;
  market?: string;
  bidClean?: number;
  askClean?: number;
  turnoverEur?: number;
  trades?: number;
};

export default function TableIsland(props: { data: Bond[] }) {
  const columns = useMemo<ColumnDef<Bond>[]>(() => [
    { header: "Market segment", accessorKey: "bond.bondSegment" },
    { header: "Name", accessorKey: "core.name" },
    { header: "ISIN", accessorKey: "core.isin" },
    { header: "Ticker", accessorKey: "core.ticker" },
    { header: "Nominal", accessorKey: "bond.nominal" },
    { header: "Coupon rate", accessorKey: "bond.couponRate" },
    { header: "Accrued interest", accessorKey: "bond.accruedInterest" },
    { header: "Bid clean", accessorKey: "bond.bidClean" },
    { header: "Ask clean", accessorKey: "bond.askClean" },
  ], []);

  const table = usePreactTable<Bond>({
    data: props.data,
    columns,
    // enable features
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // optional initial state
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div class="space-y-3 p-4">
      {/* Global filter example */}
      <input
        class="border rounded px-2 py-1 input input-primary"
        placeholder="Search..."
        value={table.getState().globalFilter ?? ""}
        onInput={(e) =>
          table.setGlobalFilter((e.currentTarget as HTMLInputElement).value)}
      />

      <table class="w-full border-collapse table table-xs table-zebra">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr>
              {hg.headers.map((h) => (
                <th
                  class="bg-base-200 lg:py-3 cursor-pointer select-none"
                  colSpan={h.colSpan}
                  onClick={h.column.getCanSort()
                    ? () => h.column.toggleSorting()
                    : undefined}
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === "asc" && " 🔼"}
                  {h.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr class="border-b">
              {row.getVisibleCells().map((cell) => (
                <td class="py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination UI */}
      <div class="flex items-center gap-2">
        <button
          class="btn btn-primary"
          type="button"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Prev
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          class="btn btn-primary"
          type="button"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </button>

        <select
          title="Rows on page"
          class="select-md select-secondary"
          value={table.getState().pagination.pageSize}
          onChange={(e) =>
            table.setPageSize(
              Number((e.currentTarget as HTMLSelectElement).value),
            )}
        >
          {[10, 20, 30, 40, 50].map((n) => <option value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  );
}
