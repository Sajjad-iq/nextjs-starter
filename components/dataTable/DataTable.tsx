import type { VisibilityState, ColumnDef } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
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

export interface PaginationChangeEvent {
  page?: number
  size?: number
}

export interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  initialColumnVisibility?: VisibilityState
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  actions?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  serverPagination?: ServerPaginationState
  onPaginate?: (event: PaginationChangeEvent) => void
  isLoading?: boolean
  onRetry?: () => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  initialColumnVisibility = {},
  toolbar,
  actions,
  serverPagination,
  onPaginate,
  isLoading = false,
  onRetry,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('table')
  const isServerPagination = !!serverPagination && !!onPaginate

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isServerPagination ? undefined : getPaginationRowModel(),
    manualPagination: isServerPagination,
    pageCount: isServerPagination ? serverPagination.totalPages : undefined,
    initialState: {
      columnVisibility: initialColumnVisibility,
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    state: isServerPagination ? {
      pagination: { pageIndex: serverPagination.page, pageSize: serverPagination.size },
    } : undefined,
  })

  const handlePageChange = (page: number) => onPaginate?.({ page })
  const handlePageSizeChange = (size: number) => {
    if (isServerPagination) {
      onPaginate?.({ size })
    } else {
      table.setPageSize(size)
    }
  }

  const totalElements = isServerPagination ? serverPagination.totalElements : data.length

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
          dataLength={totalElements}
          serverPagination={serverPagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}
