import * as React from "react"
import type {
  VisibilityState,
  SortingState,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import {
  DataTableToolbar,
  DataTableContent,
  DataTablePagination,
  DataTableCardView,
  DataTableLoading,
  DataTableError,
  DataTableEmpty,
  type ViewMode,
  type AspectRatio,
} from "./components"

// Server-side pagination state
export interface ServerPaginationState {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// Pagination change event
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
  // Card view options
  enableCardView?: boolean
  renderCard?: (item: TData, renderActions?: () => React.ReactNode) => React.ReactNode
  cardColumns?: number
  defaultView?: ViewMode
  getRowActions?: (item: TData) => React.ReactNode
  cardWidth?: string // Custom width for cards (e.g., "300px", "20rem")
  cardAspectRatio?: AspectRatio // Card aspect ratio
  // Server-side pagination props
  serverPagination?: ServerPaginationState
  onPaginate?: (event: PaginationChangeEvent) => void
  isLoading?: boolean
  onRetry?: () => void
}

/**
 * DataTable Component
 *
 * A fully-featured data table with:
 * - Sorting
 * - Column visibility
 * - Pagination (client or server-side)
 * - Row selection
 * - Custom toolbar and actions
 * - Table/Card view switching
 */
export function DataTable<TData, TValue>({
  data,
  columns,
  initialColumnVisibility = {},
  toolbar,
  actions,
  enableCardView = false,
  renderCard,
  cardColumns = 3,
  defaultView = 'table',
  getRowActions,
  cardWidth,
  cardAspectRatio = 'auto',
  // Server pagination
  serverPagination,
  onPaginate,
  isLoading = false,
  onRetry,
}: DataTableProps<TData, TValue>) {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  // Determine if using server-side pagination
  const isServerPagination = !!serverPagination && !!onPaginate

  // View state
  const [view, setView] = React.useState<ViewMode>(defaultView)

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialColumnVisibility
  )
  const [rowSelection, setRowSelection] = React.useState({})

  // Client-side pagination state (when not using server pagination)
  const [clientPagination, setClientPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Only use client-side pagination when not in server mode
    ...(isServerPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: isServerPagination ? undefined : setClientPagination,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      ...(isServerPagination
        ? { pagination: { pageIndex: serverPagination.page, pageSize: serverPagination.size } }
        : { pagination: clientPagination }
      ),
    },
    // For server-side pagination, we need to set these
    ...(isServerPagination ? {
      manualPagination: true,
      pageCount: serverPagination.totalPages,
    } : {}),
  })

  // Pagination handlers for server-side
  const handlePageChange = React.useCallback((pageIndex: number) => {
    if (isServerPagination && onPaginate) {
      onPaginate({ page: pageIndex })
    }
  }, [isServerPagination, onPaginate])

  const handlePageSizeChange = React.useCallback((newSize: number) => {
    if (isServerPagination && onPaginate) {
      onPaginate({ size: newSize })
    } else {
      setClientPagination(prev => ({ ...prev, pageIndex: 0, pageSize: newSize }))
    }
  }, [isServerPagination, onPaginate])

  // Calculate total elements for display
  const totalElements = isServerPagination
    ? serverPagination.totalElements
    : data.length

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Toolbar - Fixed at top */}
      <div className="flex-shrink-0">
        <DataTableToolbar
          table={table}
          toolbar={toolbar}
          actions={actions}
          enableViewSwitcher={enableCardView}
          view={view}
          onViewChange={setView}
        />
      </div>

      {/* Content - Scrollable area */}
      <div className="flex-1 min-h-0 relative">
        {isLoading && data.length === 0 ? (
          <DataTableLoading />
        ) : data.length === 0 && onRetry ? (
          <DataTableError onRetry={onRetry} />
        ) : data.length === 0 ? (
          <DataTableEmpty />
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            {view === 'table' ? (
              <DataTableContent
                table={table}
                columns={columns}
                isRTL={isRTL}
              />
            ) : renderCard ? (
              <DataTableCardView
                table={table}
                renderCard={renderCard}
                columns={cardColumns}
                getRowActions={getRowActions}
                cardWidth={cardWidth}
                aspectRatio={cardAspectRatio}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-center text-muted-foreground">
                Card view is enabled but no renderCard function provided
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination - Fixed at bottom */}
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
