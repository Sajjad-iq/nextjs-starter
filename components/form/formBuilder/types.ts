import type z from "zod"


// base form config used with the component and logic
export interface FormConfig {
  /** Array of individual form field configurations. Use this for simple flat forms. */
  fields?: FormFieldConfig[]

  /** Array of field groups for organizing fields into sections. Use this for complex forms with multiple sections. */
  fieldGroups?: FieldGroup[]

  /** Zod validation schema for form validation. Optional - validation can be handled by parent form. */
  validationSchema?: z.ZodTypeAny

  /** Default values to populate the form on initial render. Updates to this object will reset the form. */
  initialValues?: Record<string, any>

  /** Required callback function invoked when form is submitted. Can be async for API calls. */
  onSubmit: (values: Record<string, any>) => Promise<void> | void

  /** Optional callback invoked whenever any field value changes. Useful for auto-save or live validation. */
  onChange?: (values: Record<string, any>) => void

  /** Optional callback invoked when the cancel button is clicked. */
  onCancel?: () => void

  /** CSS class names to apply to the form element. */
  formClass?: string

  /** CSS class names to apply to the actions/buttons container. */
  actionsClass?: string

  /** Custom text for the submit button. Defaults to "Submit". */
  submitText?: string

  /** Text displayed on submit button while form is submitting. Defaults to "Loading...". */
  loadingText?: string

  /** Custom text for the cancel button. Defaults to "Cancel". */
  cancelButtonText?: string

  /** Whether to display the cancel button. Defaults to false. */
  showCancelButton?: boolean

  /** Whether to hide the entire actions section (submit/cancel buttons). Useful for custom button placement. */
  hideActions?: boolean

  /** Whether the submit button should be disabled. Useful for conditional form submission. */
  submitDisabled?: boolean

  /** Visual variant for the submit button. Affects color and styling. */
  submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

  /** Additional CSS class names to apply to the submit button. */
  submitButtonClass?: string

  /** Render only fields without form wrapper. Use when embedding fields in an existing form. */
  asFields?: boolean
}


// builder component props
export interface FormBuilderProps {
  /** Form configuration object containing fields, validation, callbacks, and styling options. */
  config: FormConfig

  /** External loading state. When true, disables form submission. Useful for parent component loading states. */
  loading?: boolean

  /** Optional override for the onSubmit callback defined in config. Takes precedence over config.onSubmit. */
  onSubmit?: (values: Record<string, any>) => void

  /** Optional override for the onCancel callback defined in config. Takes precedence over config.onCancel. */
  onCancel?: () => void

  /** Optional error handler called when form submission fails. Receives the error object. */
  onError?: (error: any) => void

  /** 
   * Optional children for custom rendering and action placement.
   * Can include:
   * - beforeActions: Content rendered before the submit/cancel buttons
   * - afterActions: Content rendered after the submit/cancel buttons
   * - actions: Custom render function for complete control over action buttons
   */
  children?: React.ReactNode & {
    /** Content to render before the default action buttons. */
    beforeActions?: React.ReactNode

    /** Content to render after the default action buttons. */
    afterActions?: React.ReactNode

    /** Custom render function for action buttons. Receives isLoading state and handleCancel function. */
    actions?: (props: { isLoading: boolean; handleCancel: () => void }) => React.ReactNode

    /** Allow any additional properties for flexibility. */
    [key: string]: any
  }
}


// Base field configuration with common properties
export interface BaseFieldConfig {
  name: string
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  containerClass?: string
  visibleWhen?: (values: Record<string, any>) => boolean
}

// Text input field types
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "textarea" | "hidden"
  rows?: number
}

// Number input field
export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number"
  min?: number
  max?: number
  step?: number
}

// Regular select field
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select"
  options?: { label: string; value: string | number }[]
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>
}

// Phone input field
export interface PhoneFieldConfig extends BaseFieldConfig {
  type: "phone"
  defaultCountry?: string
  phoneCodeField?: string
}

// Checkbox field
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox"
}

// Switch field
export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch"
}

// Radio group field
export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio"
  options?: { label: string; value: string | number }[]
}

// Image upload field
export interface ImageUploadFieldConfig extends BaseFieldConfig {
  type: "image-upload"
  organizationId?: string
  mediaCategory?: MediaCategory
  maxSize?: number
  previewAlt?: string
  onUpload?: (
    file: File,
    category: MediaCategory,
    organizationId: string,
    entityId?: string
  ) => Promise<{ success: boolean; data?: { url: string }; error?: string }>
}


// Date picker field
export interface DatePickerFieldConfig extends BaseFieldConfig {
  type: "date-picker"
  minDate?: Date
  maxDate?: Date
  dateFormat?: string // 'iso' for YYYY-MM-DD format, or default locale format
}

// Custom field type for custom implementations
export interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom"
}

// Union type of all field configurations
export type FormFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | PhoneFieldConfig
  | CheckboxFieldConfig
  | SwitchFieldConfig
  | RadioFieldConfig
  | ImageUploadFieldConfig
  | DatePickerFieldConfig
  | CustomFieldConfig

// Field group configuration for collapsible sections
export interface FieldGroup {
  id: string
  title: string
  description?: string
  fields: FormFieldConfig[]
  defaultOpen?: boolean
  collapsible?: boolean
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
}

export enum MediaCategory {
  PROFILE = 'PROFILE',
  PRODUCT = 'PRODUCT',
  ORGANIZATION = 'ORGANIZATION',
  INVOICE = 'INVOICE',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}