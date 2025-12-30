import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { DataTablePageSize } from "./DataTablePageSize"

// Server-side pagination state
interface ServerPaginationState {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  dataLength: number
  // Server pagination props
  serverPagination?: ServerPaginationState
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

/**
 * DataTable Pagination Component
 *
 * Contains row count info, page size selector, and pagination controls
 * Supports both client-side and server-side pagination
 */
export function DataTablePagination<TData>({
  table,
  dataLength,
  serverPagination,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('table')

  // Determine if using server-side pagination
  const isServerPagination = !!serverPagination && !!onPageChange

  // Get current page info
  const currentPage = isServerPagination
    ? serverPagination.page
    : table.getState().pagination.pageIndex

  const totalPages = isServerPagination
    ? serverPagination.totalPages
    : table.getPageCount()

  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < totalPages - 1

  // Handlers
  const handleFirstPage = React.useCallback(() => {
    if (isServerPagination && onPageChange) {
      onPageChange(0)
    } else {
      table.setPageIndex(0)
    }
  }, [isServerPagination, onPageChange, table])

  const handlePreviousPage = React.useCallback(() => {
    if (isServerPagination && onPageChange) {
      onPageChange(currentPage - 1)
    } else {
      table.previousPage()
    }
  }, [isServerPagination, onPageChange, currentPage, table])

  const handleNextPage = React.useCallback(() => {
    if (isServerPagination && onPageChange) {
      onPageChange(currentPage + 1)
    } else {
      table.nextPage()
    }
  }, [isServerPagination, onPageChange, currentPage, table])

  const handleLastPage = React.useCallback(() => {
    if (isServerPagination && onPageChange) {
      onPageChange(totalPages - 1)
    } else {
      table.setPageIndex(totalPages - 1)
    }
  }, [isServerPagination, onPageChange, totalPages, table])

  const paginationText = React.useMemo(() => {
    const total = dataLength
    if (total === 0) return t("noItems")
    if (total === 1) return t("item")
    return t("totalItems", { count: total })
  }, [dataLength, t])

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-3 px-4 rounded-lg border bg-card/50 backdrop-blur-sm">
      {/* Row count info */}
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

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Page size selector */}
        <DataTablePageSize
          table={table}
          onPageSizeChange={onPageSizeChange}
        />

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={handleFirstPage}
            className="h-8"
          >
            {t("first")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
            className="h-8"
          >
            {t("next")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canNextPage}
            onClick={handleLastPage}
            className="h-8"
          >
            {t("last")}
          </Button>
        </div>
      </div>
    </div>
  )
}
