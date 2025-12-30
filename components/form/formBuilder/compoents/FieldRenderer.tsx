import * as React from "react"
import type { Control, UseFormWatch } from "react-hook-form"
import { FormField } from "@/components/ui/form"

// Import field components
import { TextInputField } from "../fields/TextInputField"
import { CheckboxField } from "../fields/CheckboxField"
import { SwitchField } from "../fields/SwitchField"
import { RadioGroupField } from "../fields/RadioGroupField"
import { PhoneInputField } from "../fields/PhoneInputField"
import { ImageUploadField } from "../fields/ImageUploadField"
import { CurrencySelectField } from "../fields/CurrencySelectField"
import { CategorySelectField } from "../fields/CategorySelectField"
import { InventorySelectField } from "../fields/InventorySelectField"
import { WeightUnitSelectField } from "../fields/WeightUnitSelectField"
import { GeneratedTextField } from "../fields/GeneratedTextField"
import { DatePickerField } from "../fields/DatePickerField"

// Import types
import type { FormFieldConfig, PhoneFieldConfig } from "../types"

interface FieldRendererProps {
    field: FormFieldConfig
    control: Control<Record<string, any>>
    isLoading: boolean
    isFieldVisible: (field: FormFieldConfig) => boolean
    handlePhoneInput: (
        data: { phoneCode: string; phone: string; isValid: boolean },
        field: PhoneFieldConfig
    ) => void
    watch: UseFormWatch<Record<string, any>>
    children?: React.ReactNode & {
        [key: string]: any
    }
}

/**
 * Renders a single form field based on its type configuration
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    control,
    isLoading,
    isFieldVisible,
    handlePhoneInput,
    watch,
    children,
}) => {
    // Check visibility
    if (!isFieldVisible(field)) {
        return null
    }

    // Custom field slot
    const customSlot = children?.[`field-${field.name}` as keyof typeof children]
    if (customSlot && typeof customSlot === "function") {
        return (
            <div key={field.name} className={field.containerClass}>
                {customSlot({ field, isLoading })}
            </div>
        )
    }

    // Image upload field
    if (field.type === "image-upload") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <ImageUploadField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Currency select field
    if (field.type === "currency-select") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <CurrencySelectField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Category select field
    if (field.type === "category-select") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <CategorySelectField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Inventory select field
    if (field.type === "inventory-select") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <InventorySelectField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Weight unit select field
    if (field.type === "weight-unit-select") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <WeightUnitSelectField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Generated text field
    if (field.type === "generated-text") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <GeneratedTextField field={fieldProps} config={field} />
                    )}
                />
            </div>
        )
    }

    // Date picker field
    if (field.type === "date-picker") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <DatePickerField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Checkbox field
    if (field.type === "checkbox") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <CheckboxField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Switch field
    if (field.type === "switch") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <SwitchField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Radio group field
    if (field.type === "radio") {
        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <RadioGroupField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Phone input field
    if (field.type === "phone") {
        const phoneField = field as PhoneFieldConfig
        const phoneCodeValue = phoneField.phoneCodeField
            ? watch(phoneField.phoneCodeField)
            : undefined

        return (
            <div key={field.name} className={field.containerClass}>
                <FormField
                    control={control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                        <PhoneInputField
                            field={phoneField}
                            value={fieldProps.value}
                            phoneCode={phoneCodeValue}
                            onChange={fieldProps.onChange}
                            onPhoneChange={(data) => handlePhoneInput(data, phoneField)}
                            isLoading={isLoading}
                        />
                    )}
                />
            </div>
        )
    }

    // Custom field type
    if (field.type === "custom") {
        const customFieldSlot = children?.[`custom-${field.name}` as keyof typeof children]
        if (customFieldSlot && typeof customFieldSlot === "function") {
            return (
                <div key={field.name} className={field.containerClass}>
                    <FormField
                        control={control}
                        name={field.name}
                        render={({ field: fieldProps }) => (
                            <>
                                {customFieldSlot({
                                    field,
                                    isLoading,
                                    value: fieldProps.value,
                                    onChange: fieldProps.onChange,
                                })}
                            </>
                        )}
                    />
                </div>
            )
        }
        return null
    }

    // Regular fields (text, email, password, number, textarea, select) - use TextInputField
    return (
        <div key={field.name} className={field.containerClass}>
            <FormField
                control={control}
                name={field.name}
                render={({ field: fieldProps }) => {
                    // Check for custom input slot
                    const customInput = children?.[`input-${field.name}` as keyof typeof children]
                    const customInputNode =
                        customInput && typeof customInput === "function"
                            ? customInput({
                                field,
                                isLoading,
                                value: fieldProps.value,
                                onChange: fieldProps.onChange,
                            })
                            : undefined

                    return (
                        <TextInputField
                            field={field}
                            value={fieldProps.value}
                            onChange={fieldProps.onChange}
                            isLoading={isLoading}
                            customInput={customInputNode}
                        />
                    )
                }}
            />
        </div>
    )
}
