import type { UseFormReturn } from "react-hook-form"
import type { FormFieldConfig, PhoneFieldConfig } from "./types"

/**
 * Handles phone input changes and updates both phone and phoneCode fields
 */
export const handlePhoneInput = (
    data: { phoneCode: string; phone: string; isValid: boolean },
    field: PhoneFieldConfig,
    form: UseFormReturn<Record<string, any>>
) => {
    form.setValue(field.name, data.phone)
    if (field.phoneCodeField) {
        const phoneCodeWithPrefix = data.phoneCode.startsWith("+")
            ? data.phoneCode
            : "+" + data.phoneCode
        form.setValue(field.phoneCodeField, phoneCodeWithPrefix)
    }
}

/**
 * Checks if a field should be visible based on its visibleWhen condition
 */
export const isFieldVisible = (
    field: FormFieldConfig,
    formValues: Record<string, any>
): boolean => {
    if (!field.visibleWhen) return true
    return field.visibleWhen(formValues)
}

/**
 * Compares two objects by stringifying them to detect deep changes
 * Used to prevent unnecessary form resets when initialValues reference changes
 */
export const hasValuesChanged = (
    currentValues: Record<string, any> | undefined,
    previousValuesString: string
): boolean => {
    if (!currentValues) return false
    const currentValuesString = JSON.stringify(currentValues)
    return currentValuesString !== previousValuesString
}

/**
 * Creates the imperative handle methods for the FormBuilder ref
 */
export const createFormBuilderHandle = (
    form: UseFormReturn<Record<string, any>>,
    handleSubmit: (values: Record<string, any>) => Promise<void>
) => ({
    /** Resets the form to its initial values */
    resetForm: () => form.reset(),

    /** Sets a single field value */
    setFieldValue: (name: string, value: any) => form.setValue(name, value),

    /** Sets multiple field values at once */
    setValues: (values: Record<string, any>) => form.reset(values),

    /** Manually triggers validation and returns results */
    validate: async () => {
        const result = await form.trigger()
        return { valid: result, errors: form.formState.errors }
    },

    /** Gets current form values */
    values: form.getValues(),

    /** Gets current form errors */
    errors: form.formState.errors,

    /** Programmatically submits the form */
    submit: async () => await form.handleSubmit(handleSubmit)(),
})
