import * as React from "react"
import { DynamicSelectField } from "./DynamicSelectField"
import type { FormFieldConfig } from "../types"
import { weightUnitService } from "@/routes/system-units/weight-units/services/weightUnitService"

interface WeightUnitSelectFieldProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
  isLoading: boolean
}

export function WeightUnitSelectField({
  field,
  value,
  onChange,
  isLoading,
}: WeightUnitSelectFieldProps) {
  const [options, setOptions] = React.useState<{ label: string; value: string | number }[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  React.useEffect(() => {
    const loadWeightUnits = async () => {
      setLoadingOptions(true)
      try {
        // Uses X-Organization-ID header from http interceptor
        const result = await weightUnitService.getWeightUnitsByOrganization()
        if (result.success && result.data) {
          const unitOptions = result.data
            .filter((unit) => unit.active)
            .map((unit) => ({
              label: `${unit.symbol} - ${unit.name}`,
              value: unit.symbol,
            }))
          setOptions(unitOptions)
        }
      } catch (error) {
        console.error("Failed to load weight units:", error)
        setOptions([])
      } finally {
        setLoadingOptions(false)
      }
    }

    loadWeightUnits()
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
