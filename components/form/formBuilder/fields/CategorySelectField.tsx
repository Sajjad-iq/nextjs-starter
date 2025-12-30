import * as React from "react"
import { DynamicSelectField } from "./DynamicSelectField"
import type { FormFieldConfig } from "../types"
import { categoryService } from "@/routes/system-units/categories/services/categoryService"

interface CategorySelectFieldProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
  isLoading: boolean
}

export function CategorySelectField({
  field,
  value,
  onChange,
  isLoading,
}: CategorySelectFieldProps) {
  const [options, setOptions] = React.useState<{ label: string; value: string | number }[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  React.useEffect(() => {
    const loadCategories = async () => {
      setLoadingOptions(true)
      try {
        // Uses X-Organization-ID header from http interceptor
        const result = await categoryService.getCategoriesByOrganization(true) // activeOnly
        if (result.success && result.data) {
          const categoryOptions = result.data.map((category) => ({
            label: category.name,
            value: category.id,
          }))
          setOptions(categoryOptions)
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
        setOptions([])
      } finally {
        setLoadingOptions(false)
      }
    }

    loadCategories()
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
