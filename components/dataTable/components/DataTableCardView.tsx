import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

export type AspectRatio = "square" | "video" | "portrait" | "auto" | string

interface DataTableCardViewProps<TData> {
  table: Table<TData>
  renderCard: (item: TData, renderActions?: () => React.ReactNode) => React.ReactNode
  columns?: number // Number of columns in grid (1-6)
  getRowActions?: (item: TData) => React.ReactNode
  cardWidth?: string // Custom width (e.g., "300px", "20rem")
  aspectRatio?: AspectRatio // Card aspect ratio (predefined or custom like "4/3", "16/10")
}

/**
 * DataTable Card View Component
 *
 * Renders data in a card grid layout using a custom card component
 * Supports rendering actions inside each card
 *
 * @param cardWidth - Custom width for cards (e.g., "300px", "20rem")
 * @param aspectRatio - Card aspect ratio: "square" (1:1), "video" (16:9), "portrait" (3:4), "auto" (content-based), or custom ratio (e.g., "4/3", "16/10")
 */
export function DataTableCardView<TData>({
  table,
  renderCard,
  columns = 3,
  getRowActions,
  cardWidth,
  aspectRatio = "auto",
}: DataTableCardViewProps<TData>) {
  const { t } = useTranslation()
  const rows = table.getRowModel().rows

  // Grid column classes based on column count
  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }

  // Predefined aspect ratio classes
  const predefinedAspectRatios: Record<string, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  }

  const gridClass = gridColsClasses[columns as keyof typeof gridColsClasses] || gridColsClasses[3]

  // Determine aspect ratio class - use predefined or create custom
  const aspectClass = predefinedAspectRatios[aspectRatio] ?? (aspectRatio !== 'auto' ? `aspect-[${aspectRatio}]` : '')

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center h-64 text-center text-muted-foreground">
        {t("table.noResults")}
      </div>
    )
  }

  return (
    <div className="h-full bg-card border border-border rounded-xl p-6 overflow-hidden">
      <div
        className={cardWidth ? 'flex flex-wrap gap-5 h-full content-start overflow-y-auto' : `h-full content-start overflow-y-auto grid gap-5 ${gridClass}`}
      >
        {rows.map((row) => {
          const item = row.original
          // Create a function that renders the actions for this specific item
          const renderActions = getRowActions ? () => getRowActions(item) : undefined

          return (
            <div
              key={row.id}
              className={aspectClass}
              style={cardWidth ? { width: cardWidth, flexShrink: 0, height: 'fit-content' } : undefined}
            >
              {renderCard(item, renderActions)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
