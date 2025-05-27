"use client"

import {
  ColumnDef,
  Table as TanstackTable,
} from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { DataTablePagination } from "@/components/ui/paginated-table"
import { ScrollableTableWrapper } from "@/components/ui/scroll-table"
import React from "react"
import { isEqual } from "lodash"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  table: TanstackTable<TData>
  isFetching?: boolean
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  table,
  isFetching,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { pagination, sorting, columnFilters } = table.getState()

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [pagination.pageIndex, sorting, columnFilters])

  // Reset to page 0 only if filters *actually* change
  const prevFiltersRef = React.useRef(columnFilters)
  React.useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const prevFilters = prevFiltersRef.current
    if (!isEqual(prevFilters, currentFilters)) {
      table.setPageIndex(0)
      prevFiltersRef.current = currentFilters
    }
  }, [columnFilters])

  return (
    <div className="flex flex-col h-full justify-between">
      <ScrollableTableWrapper ref={scrollRef} isFetching={isFetching}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-accent rounded-lg rounded-r-0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className="font-mono"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-1/2 text-center p-4">
                  No results. Select a account type
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollableTableWrapper>
      {/* <DataTablePagination table={table} /> */}
    </div>
  )
}