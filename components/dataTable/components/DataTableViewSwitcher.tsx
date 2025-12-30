import { LayoutGrid, Table as TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ViewMode = 'table' | 'card'

interface DataTableViewSwitcherProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

/**
 * DataTable View Switcher Component
 *
 * Toggle between table and card view modes
 */
export function DataTableViewSwitcher({
  view,
  onViewChange,
}: DataTableViewSwitcherProps) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn(
          "rounded-none rounded-s-md",
          view === 'table' && "bg-muted"
        )}
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('card')}
        className={cn(
          "rounded-none rounded-e-md",
          view === 'card' && "bg-muted"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  )
}
