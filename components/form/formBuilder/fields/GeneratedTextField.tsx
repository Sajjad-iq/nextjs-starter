import * as React from "react"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GeneratedTextFieldProps {
  field: any
  config: {
    name: string
    label?: string
    placeholder?: string
    description?: string
    required?: boolean
    disabled?: boolean
    generateFn?: () => string
    generateButtonText?: string
  }
}

export function GeneratedTextField({ field, config }: GeneratedTextFieldProps) {
  const {
    label,
    placeholder,
    description,
    required,
    disabled,
    generateFn,
    generateButtonText = "Generate",
  } = config

  const handleGenerate = () => {
    if (generateFn) {
      const generated = generateFn()
      field.onChange(generated)
    }
  }

  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {!required && <span className="text-muted-foreground text-sm ml-1">(optional)</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className="flex gap-2">
          <Input
            {...field}
            value={field.value || ""}
            placeholder={placeholder}
            disabled={disabled}
          />
          {generateFn && (
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generateButtonText}
            </Button>
          )}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
