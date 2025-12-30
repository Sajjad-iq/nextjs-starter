import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

// Import components
import { CollapsibleFieldGroup } from "./compoents/CollapsibleFieldGroup"
import { FieldRenderer } from "./compoents/FieldRenderer"

// Import types
import type {
  FormFieldConfig,
  FormBuilderProps,
} from "./types"

// Import helpers
import {
  isFieldVisible as isFieldVisibleHelper,
  createFormBuilderHandle,
} from "./helpers"

// Import custom hooks
import {
  useFormInitialValues,
  useFormChangeWatcher,
} from "./hooks"


export const FormBuilder = React.forwardRef<
  {
    resetForm: () => void
    setFieldValue: (name: string, value: any) => void
    setValues: (values: Record<string, any>) => void
    validate: () => Promise<{ valid: boolean; errors: any }>
    values: Record<string, any>
    errors: any
    submit: () => Promise<void>
  },
  FormBuilderProps
>(({ config, loading = false, onSubmit, onCancel, onError, children }, ref) => {
  const { t } = useTranslation('form')

  const form = useForm<Record<string, any>>({
    // @ts-ignore - zodResolver type compatibility with optional schema
    resolver: config.validationSchema ? zodResolver(config.validationSchema) : undefined,
    defaultValues: config.initialValues || {},
  })

  // TanStack Query mutation for form submission
  const submitMutation = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      console.log("=== FORM SUBMIT HANDLER ===")
      console.log("Values to submit:", values)
      console.log("Form errors:", form.formState.errors)
      console.log("Form is valid:", form.formState.isValid)
      console.log("===========================")

      await config.onSubmit(values)
      return values
    },
    onSuccess: (values) => {
      onSubmit?.(values)
    },
    onError: (error) => {
      console.error("=== SUBMIT ERROR ===")
      console.error("Error:", error)
      console.error("====================")
      onError?.(error)
    },
  })

  // Combine external loading state with mutation loading state
  const isLoading = loading || submitMutation.isPending

  // Sync form values when initialValues change
  useFormInitialValues(form, config.initialValues)

  // Watch for form changes and call onChange callback
  useFormChangeWatcher(form, config.onChange)

  // Submit handler - delegates to mutation
  const handleSubmit = async (values: Record<string, any>) => {
    await submitMutation.mutateAsync(values)
  }

  // Cancel handler
  const handleCancel = () => {
    config.onCancel?.()
    onCancel?.()
  }

  // Check if field should be visible - delegates to helper
  const isFieldVisible = (field: FormFieldConfig) => {
    return isFieldVisibleHelper(field, form.getValues())
  }

  // Expose methods via ref - uses helper to create handle
  React.useImperativeHandle(ref, () => createFormBuilderHandle(form, handleSubmit))

  // Render field based on type - delegates to FieldRenderer component
  const renderField = (field: FormFieldConfig, index: number) => {
    return (
      <FieldRenderer
        key={field.name + "_" + index}
        field={field}
        control={form.control}
        isLoading={isLoading}
        isFieldVisible={isFieldVisible}
        children={children}
      />
    )
  }

  // Render field groups if provided
  const renderFieldGroups = () => {
    if (!config.fieldGroups) return null

    return config.fieldGroups.map((group) => (
      <CollapsibleFieldGroup
        key={group.id}
        title={group.title}
        description={group.description}
        defaultOpen={group.defaultOpen}
        collapsible={group.collapsible}
      >
        <div className={config.formClass || "space-y-4"}>
          {group.fields.map((field, index) => renderField(field, index))}
        </div>
      </CollapsibleFieldGroup>
    ))
  }

  // Fields content
  const fieldsContent = (
    <>
      {/* Render field groups */}
      {config.fieldGroups && renderFieldGroups()}

      {/* Render standalone fields */}
      {config.fields && config.fields.map((field, index) => renderField(field, index))}

      {/* Before actions slot */}
      {children?.beforeActions}

      {/* Form actions */}
      {!config.hideActions && (
        <div className={config.actionsClass || "flex justify-end gap-2 pt-4"}>
          {children?.actions && typeof children.actions === "function" ? (
            children.actions({ isLoading, handleCancel })
          ) : (
            <>
              {config.showCancelButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {config.cancelButtonText || t("cancel")}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading || config.submitDisabled}
                variant={config.submitVariant || "default"}
                className={config.submitButtonClass}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {config.loadingText || t("loading")}
                  </span>
                ) : (
                  config.submitText || t("submit")
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {/* After actions slot */}
      {children?.afterActions}
    </>
  )


  // Render with form wrapper
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleSubmit,
          (errors) => {
            console.error("=== FORM VALIDATION FAILED ===")
            console.error("Validation errors:", errors)
            console.error("Form values:", form.getValues())
            console.error("==============================")
            onError?.(errors)
          }
        )}
        className={config.formClass || "space-y-4"}
      >
        {fieldsContent}
      </form>
    </Form>
  )
})

FormBuilder.displayName = "FormBuilder"
