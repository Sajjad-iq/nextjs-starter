import type { Table } from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>
}

/**
 * DataTable Column Visibility Component
 *
 * Dropdown menu to toggle column visibility
 */
export function DataTableColumnVisibility<TData>({
  table,
}: DataTableColumnVisibilityProps<TData>) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">{t("table.columns")}</span>
          <span className="sm:hidden">{t("table.cols")}</span>
          <ChevronDown className="ms-1 sm:ms-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            // Get the column header text
            // Priority: meta.label > string header > column.id
            const meta = column.columnDef.meta as { label?: string } | undefined
            const header = column.columnDef.header

            let headerText = column.id
            if (meta?.label) {
              headerText = meta.label
            } else if (typeof header === 'string') {
              headerText = header
            }

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerText}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
