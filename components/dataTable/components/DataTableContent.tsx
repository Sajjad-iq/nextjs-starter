import type { Table, ColumnDef } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"

interface DataTableContentProps<TData, TValue> {
  table: Table<TData>
  columns: ColumnDef<TData, TValue>[]
  isLoading?: boolean
}

export function DataTableContent<TData, TValue>({ table, columns, isLoading }: DataTableContentProps<TData, TValue>) {
  const { t } = useTranslation('table')
  const rows = table.getRowModel().rows
  const showSkeleton = isLoading && rows.length === 0

  return (
    <div className="h-full bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full caption-bottom text-sm h-full">
          <TableHeader className="bg-muted/90 sticky top-0 z-10 border-b-2 border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-full">
            {showSkeleton ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-border">
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-${i}-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b border-border transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-0 h-full">
                <TableCell colSpan={columns.length} className="h-full text-center text-muted-foreground align-middle">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
