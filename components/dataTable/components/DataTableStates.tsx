import { useTranslation } from "react-i18next"
import { AlertTriangle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * DataTable Error State - generic localized error display
 */
export function DataTableError({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation('table')

  return (
    <div className="h-full bg-card border border-border rounded-xl flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <p className="text-sm text-destructive mb-2">{t('error')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('retry')}
        </Button>
      )}
    </div>
  )
}

/**
 * DataTable Empty State - generic localized empty message
 */
export function DataTableEmpty() {
  const { t } = useTranslation('table')

  return (
    <div className="h-full bg-card border border-border rounded-xl flex flex-col items-center justify-center text-center">
      <Inbox className="h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground">{t('empty')}</p>
    </div>
  )
}
