import type { Table } from "@tanstack/react-table"
import { DataTableColumnVisibility } from "./DataTableColumnVisibility"
import { DataTableViewSwitcher, type ViewMode } from "./DataTableViewSwitcher"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  toolbar?: (table: Table<TData>) => React.ReactNode
  actions?: (table: Table<TData>) => React.ReactNode
  enableViewSwitcher?: boolean
  view?: ViewMode
  onViewChange?: (view: ViewMode) => void
}

/**
 * DataTable Toolbar Component
 *
 * Contains custom toolbar slot, column visibility, and custom actions
 */
export function DataTableToolbar<TData>({
  table,
  toolbar,
  actions,
  enableViewSwitcher = false,
  view = 'table',
  onViewChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
        {/* Custom toolbar slot */}
        {toolbar?.(table)}
      </div>

      <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
        {/* View Switcher */}
        {enableViewSwitcher && onViewChange && (
          <DataTableViewSwitcher view={view} onViewChange={onViewChange} />
        )}

        {/* Column visibility - only show in table view */}
        {view === 'table' && <DataTableColumnVisibility table={table} />}

        {/* Custom actions slot */}
        {actions?.(table)}
      </div>
    </div>
  )
}
