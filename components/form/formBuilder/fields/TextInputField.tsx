import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormFieldConfig } from "../types"

interface TextInputFieldProps {
  field: FormFieldConfig
  value: any
  onChange: (value: any) => void
  isLoading: boolean
  customInput?: React.ReactNode
}

export function TextInputField({
  field,
  value,
  onChange,
  isLoading,
  customInput
}: TextInputFieldProps) {
  return (
    <FormItem className={field.hidden ? "hidden" : ""}>
      {field.label && !field.hidden && (
        <FormLabel>
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <FormControl>
        {customInput ? (
          customInput
        ) : field.type === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            disabled={isLoading || field.disabled}
          />
        ) : field.type === "select" ? (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger disabled={isLoading || field.disabled}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(field.options || []).map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : field.type === "number" ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type="number"
            placeholder={field.placeholder}
            disabled={isLoading || field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={field.type}
            placeholder={field.placeholder}
            disabled={isLoading || field.disabled}
          />
        )}
      </FormControl>
      {field.description && <FormDescription>{field.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
