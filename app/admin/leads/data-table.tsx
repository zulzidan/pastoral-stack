"use client"

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 20 } },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Filter by name…"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-xs bg-white/10 border-white/20 text-white placeholder:text-white/35 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]"
        />
        <Input
          placeholder="Filter by email…"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
          className="max-w-xs bg-white/10 border-white/20 text-white placeholder:text-white/35 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]"
        />
        <span className="ml-auto text-xs text-white/30">
          {table.getFilteredRowModel().rows.length} row{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="border border-white/10 rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/10 hover:bg-transparent bg-white/[0.03]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={`border-white/5 hover:bg-white/[0.04] transition-colors ${
                    i % 2 !== 0 ? "bg-white/[0.015]" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white/30">
                  No leads yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-white/30">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-white/15 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-white/15 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}
