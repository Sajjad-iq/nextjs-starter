import * as React from "react"
import { DynamicSelectField } from "./DynamicSelectField"
import type { FormFieldConfig } from "../types"
import { inventoryService } from "@/routes/system-units/inventory/services/inventoryService"

interface InventorySelectFieldProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
  isLoading: boolean
}

export function InventorySelectField({
  field,
  value,
  onChange,
  isLoading,
}: InventorySelectFieldProps) {
  const [options, setOptions] = React.useState<{ label: string; value: string | number }[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  React.useEffect(() => {
    const loadInventories = async () => {
      setLoadingOptions(true)
      try {
        // Uses X-Organization-ID header from http interceptor
        const result = await inventoryService.getActiveInventories()
        if (result.success && result.data) {
          const inventoryOptions = result.data.map((inventory) => ({
            label: inventory.name,
            value: inventory.id,
          }))
          setOptions(inventoryOptions)
        }
      } catch (error) {
        console.error("Failed to load inventories:", error)
        setOptions([])
      } finally {
        setLoadingOptions(false)
      }
    }

    loadInventories()
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
