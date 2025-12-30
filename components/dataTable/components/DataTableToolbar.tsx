import type { Table } from "@tanstack/react-table"
import { DataTableColumnVisibility } from "./DataTableColumnVisibility"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  toolbar?: (table: Table<TData>) => React.ReactNode
  actions?: (table: Table<TData>) => React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  toolbar,
  actions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
        {toolbar?.(table)}
      </div>
      <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
        <DataTableColumnVisibility table={table} />
        {actions?.(table)}
      </div>
    </div>
  )
}
