import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DataCardProps {
  title: string
  description?: string
  metadata?: Array<{
    label: string
    value: React.ReactNode
    icon?: React.ElementType
  }>
  status?: {
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  actions?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  variant?: "default" | "elevated" | "bordered"
}

/**
 * DataCard Component
 *
 * A stylish, modern card with subtle gradients
 * Perfect for inventory, stock, packaging, and other business data
 */
export function DataCard({
  title,
  description,
  metadata = [],
  status,
  actions,
  footer,
  className,
  variant = "default",
}: DataCardProps) {
  const variantStyles = {
    default: "border hover:border-primary/50 hover:shadow-lg transition-all duration-300",
    elevated: "border shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300",
    bordered: "border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all duration-300",
  }

  return (
    <Card className={cn(
      "relative overflow-hidden h-full group bg-card",
      variantStyles[variant],
      className
    )}>
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Header */}
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold mb-1 truncate">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              {actions}
            </div>
          )}
        </div>

        {status && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <Badge variant={status.variant || "default"} className="text-xs font-medium">
              {status.label}
            </Badge>
          </div>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="relative space-y-2 pb-5">
        {metadata.length > 0 && (
          <div className="space-y-2">
            {metadata.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {Icon && (
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                      </div>
                    )}
                    <span className="text-sm font-medium text-muted-foreground truncate">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-sm font-semibold shrink-0 px-2.5 py-1 rounded-md bg-background border border-border">
                    {item.value}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {footer && (
          <div className="mt-4 pt-4 border-t border-border/50">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
