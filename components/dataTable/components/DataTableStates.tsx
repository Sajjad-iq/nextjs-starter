import { useTranslation } from "react-i18next"
import { AlertTriangle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * DataTable Loading State - generic localized loading indicator
 */
export function DataTableLoading() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
      <p className="text-sm text-muted-foreground">{t("table.loading")}</p>
    </div>
  )
}

/**
 * DataTable Error State - generic localized error display
 */
export function DataTableError({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <p className="text-sm text-destructive mb-2">{t("table.error")}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("table.retry")}
        </Button>
      )}
    </div>
  )
}

/**
 * DataTable Empty State - generic localized empty message
 */
export function DataTableEmpty() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground">{t("table.empty")}</p>
    </div>
  )
}
