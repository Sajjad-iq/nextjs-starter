import * as React from "react"
import { DynamicSelectField } from "./DynamicSelectField"
import type { FormFieldConfig } from "../types"
import { currencyService } from "@/routes/system-units/currencies/services/currencyService"

interface CurrencySelectFieldProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
  isLoading: boolean
}

export function CurrencySelectField({
  field,
  value,
  onChange,
  isLoading,
}: CurrencySelectFieldProps) {
  const [options, setOptions] = React.useState<{ label: string; value: string | number }[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  React.useEffect(() => {
    const loadCurrencies = async () => {
      setLoadingOptions(true)
      try {
        // Uses X-Organization-ID header from http interceptor
        const result = await currencyService.getCurrenciesByOrganization()
        if (result.success && result.data) {
          const currencyOptions = result.data
            .filter((currency) => currency.active)
            .map((currency) => ({
              label: `${currency.code} - ${currency.name}`,
              value: currency.code, // Use currency code
            }))
          setOptions(currencyOptions)
        }
      } catch (error) {
        console.error("Failed to load currencies:", error)
        setOptions([])
      } finally {
        setLoadingOptions(false)
      }
    }

    loadCurrencies()
  }, [])

  return (
    <DynamicSelectField
      field={field}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      options={options}
      loadingOptions={loadingOptions}
    />
  )
}
