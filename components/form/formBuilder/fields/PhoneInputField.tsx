import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PhoneInput } from "@/components/ui/phone-input"
import type { PhoneFieldConfig } from "../types"

interface PhoneInputFieldProps {
  field: PhoneFieldConfig
  value: string
  phoneCode?: string
  onChange: (value: string) => void
  onPhoneChange: (data: { phoneCode: string; phone: string; isValid: boolean }) => void
  isLoading: boolean
}

export function PhoneInputField({
  field,
  value,
  phoneCode,
  onChange,
  onPhoneChange,
  isLoading
}: PhoneInputFieldProps) {
  return (
    <FormItem>
      {field.label && (
        <FormLabel>
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <PhoneInput
          value={value}
          phoneCode={phoneCode}
          onChange={onChange}
          onPhoneChange={onPhoneChange}
          disabled={isLoading || field.disabled}
          placeholder={field.placeholder}
          defaultCountry={field.defaultCountry || "IQ"}
        />
      </FormControl>
      {field.description && <FormDescription>{field.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
