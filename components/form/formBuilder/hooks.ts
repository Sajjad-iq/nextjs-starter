import * as React from "react"
import type { UseFormReturn } from "react-hook-form"
import { hasValuesChanged } from "./helpers"

/**
 * Custom hook to sync form values when initialValues change
 * Uses deep comparison to prevent unnecessary resets
 */
export const useFormInitialValues = (
    form: UseFormReturn<Record<string, any>>,
    initialValues?: Record<string, any>
) => {
    const prevInitialValuesRef = React.useRef<string>('')

    React.useEffect(() => {
        if (hasValuesChanged(initialValues, prevInitialValuesRef.current)) {
            form.reset(initialValues)
            prevInitialValuesRef.current = JSON.stringify(initialValues)
        }
    }, [initialValues, form])
}

/**
 * Custom hook to watch form changes and trigger onChange callback
 */
export const useFormChangeWatcher = (
    form: UseFormReturn<Record<string, any>>,
    onChange?: (values: Record<string, any>) => void
) => {
    React.useEffect(() => {
        if (onChange) {
            const subscription = form.watch((values) => {
                onChange(values as Record<string, any>)
            })
            return () => subscription.unsubscribe()
        }
    }, [form, onChange])
}
