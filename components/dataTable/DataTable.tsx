import type { VisibilityState, ColumnDef } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { Inbox } from "lucide-react"
import { EmptyState, ErrorState } from "@/components/common"
import {
  DataTableToolbar,
  DataTableContent,
  DataTablePagination,
} from "./components"

export interface ServerPaginationState {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  initialColumnVisibility?: VisibilityState
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  actions?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  isLoading?: boolean
  onRetry?: () => void
  pagination?: ServerPaginationState
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  initialColumnVisibility = {},
  toolbar,
  actions,
  isLoading = false,
  onRetry,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('table')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0,
    state: {
      columnVisibility: initialColumnVisibility,
      pagination: {
        pageIndex: pagination?.page ?? 0,
        pageSize: pagination?.size ?? 20,
      },
    },
  })

  const renderContent = () => {
    if (!isLoading && data.length === 0 && onRetry) {
      return (
        <div className="h-full flex items-center justify-center">
          <ErrorState error={t('error')} onRetry={onRetry} retryLabel={t('retry')} variant="compact" />
        </div>
      )
    }
    if (!isLoading && data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <EmptyState icon={Inbox} title={t('empty')} iconSize="md" />
        </div>
      )
    }
    return <DataTableContent table={table} columns={columns} isLoading={isLoading} />
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <DataTableToolbar table={table} toolbar={toolbar} actions={actions} />
      </div>
      <div className="flex-1 min-h-0">
        {renderContent()}
      </div>
      <div className="flex-shrink-0">
        <DataTablePagination
          table={table}
          totalElements={pagination?.totalElements ?? 0}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}
