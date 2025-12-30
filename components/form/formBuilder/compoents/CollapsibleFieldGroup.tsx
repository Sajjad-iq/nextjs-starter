import * as React from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CollapsibleFieldGroupProps {
  title: string
  description?: string
  defaultOpen?: boolean
  collapsible?: boolean
  children: React.ReactNode
}

export function CollapsibleFieldGroup({
  title,
  description,
  defaultOpen = false,
  collapsible = true,
  children,
}: CollapsibleFieldGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [height, setHeight] = React.useState<number | undefined>(defaultOpen ? undefined : 0)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!collapsible) return

    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      // Reset to auto after animation completes
      const timer = setTimeout(() => setHeight(undefined), 300)
      return () => clearTimeout(timer)
    } else {
      // First set to current height, then to 0 to trigger animation
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0)
        })
      })
    }
  }, [isOpen, collapsible])

  // If not collapsible, always render content without collapsible wrapper
  if (!collapsible) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant="default" className="h-5 text-xs">Required</Badge>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    )
  }

  return (
    <Card className={cn(
      "border-2 transition-all duration-300 overflow-hidden",
      isOpen
        ? "border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm"
        : "border-dashed border-muted-foreground/25 bg-muted/40 hover:border-muted-foreground/40 hover:bg-muted/50"
    )}>
      <CardContent className="p-0">
        {/* Collapsible Header */}
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between h-auto py-4 px-6 rounded-none",
            isOpen
              ? "bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/15"
              : "bg-transparent hover:bg-muted/60"
          )}
          variant="ghost"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              isOpen
                ? "bg-primary/15 shadow-sm ring-2 ring-primary/20"
                : "bg-muted-foreground/10 hover:bg-muted-foreground/15"
            )}>
              <Sparkles className={cn(
                "h-4 w-4 transition-all duration-300",
                isOpen ? "text-primary scale-110" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={cn(
                  "text-base font-semibold transition-colors",
                  isOpen && "text-primary"
                )}>{title}</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 text-xs font-medium transition-all duration-300",
                    isOpen
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  Optional
                </Badge>
              </div>
              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOpen && (
              <span className="text-xs text-primary font-medium animate-in fade-in slide-in-from-left-2 duration-200">
                Opened
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300 ease-out",
                isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        </Button>

        {/* Collapsible Content */}
        <div
          ref={contentRef}
          style={{ height }}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <div className={cn(
            "space-y-4 px-6 pb-6 pt-2",
            isOpen && "animate-in fade-in slide-in-from-top-2 duration-300"
          )}>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
