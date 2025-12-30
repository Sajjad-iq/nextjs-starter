import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { DataTablePageSize } from "./DataTablePageSize"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalElements: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function DataTablePagination<TData>({
  table,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('table')

  const currentPage = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < totalPages - 1

  const paginationText = totalElements === 0
    ? t("noItems")
    : totalElements === 1
      ? t("item")
      : t("totalItems", { count: totalElements })

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-3 px-4 rounded-lg border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="font-medium">{paginationText}</span>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            {t("rowsSelected", {
              count: table.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length
            })}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <DataTablePageSize table={table} onPageSizeChange={onPageSizeChange} />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={() => onPageChange?.(0)}
            className="h-8"
          >
            {t("first")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="h-8"
          >
            {t("previous")}
          </Button>
          <span className="text-sm font-medium px-3 py-1 rounded-md bg-muted">
            {t("pageInfo", {
              current: currentPage + 1,
              total: totalPages || 1
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!canNextPage}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="h-8"
          >
            {t("next")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canNextPage}
            onClick={() => onPageChange?.(totalPages - 1)}
            className="h-8"
          >
            {t("last")}
          </Button>
        </div>
      </div>
    </div>
  )
}
