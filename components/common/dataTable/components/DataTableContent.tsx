import type { Table, ColumnDef } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslation } from "react-i18next"

interface DataTableContentProps<TData, TValue> {
  table: Table<TData>
  columns: ColumnDef<TData, TValue>[]
  isRTL?: boolean
}

/**
 * DataTable Content Component
 *
 * Renders the table with headers, rows, and empty state
 */
export function DataTableContent<TData, TValue>({
  table,
  columns,
  isRTL = false,
}: DataTableContentProps<TData, TValue>) {
  const { t } = useTranslation()

  return (
    <div className="h-full bg-card border border-border rounded-xl overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="h-full overflow-scroll">
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="bg-muted/90 sticky top-0 z-10 border-b-2 border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="border-b border-border transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={isRTL ? 'text-right' : 'text-left'}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
