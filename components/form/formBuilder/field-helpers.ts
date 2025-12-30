import type { FormFieldConfig } from "./types"
import { MediaCategory } from "@/components/common/image-upload"

/**
 * Helper functions to create common field configurations for FormBuilder
 */

/**
 * Creates an image upload field configuration
 */
export function createImageUploadField(
  name: string,
  label: string,
  organizationId: string,
  options?: {
    required?: boolean
    description?: string
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
): FormFieldConfig {
  return {
    name,
    label,
    type: "image-upload",
    required: options?.required || false,
    description: options?.description,
    organizationId,
    mediaCategory: options?.mediaCategory || MediaCategory.PRODUCT,
    maxSize: options?.maxSize || 5,
    previewAlt: options?.previewAlt || "Image preview",
    onUpload: options?.onUpload,
  }
}

/**
 * Creates a currency select field that fetches currencies from backend
 * Note: You need to provide the axios instance or HTTP service in your implementation
 */
export function createCurrencySelectField(
  name: string,
  label: string,
  organizationId: string,
  options?: {
    required?: boolean
    description?: string
    placeholder?: string
    fetchFn?: (orgId: string) => Promise<any[]>
  }
): FormFieldConfig {
  return {
    name,
    label,
    type: "currency-select",
    required: options?.required || false,
    description: options?.description,
    placeholder: options?.placeholder || "Select currency"
  }
}

/**
 * Creates an inventory select field that fetches inventories from backend
 * Note: You need to provide the axios instance or HTTP service in your implementation
 */
export function createInventorySelectField(
  name: string,
  label: string,
  organizationId: string,
  options?: {
    required?: boolean
    description?: string
    placeholder?: string
    fetchFn?: (orgId: string) => Promise<any[]>
  }
): FormFieldConfig {
  return {
    name,
    label,
    type: "inventory-select",
    required: options?.required || false,
    description: options?.description,
    placeholder: options?.placeholder || "Select inventory"
  }
}

/**
 * Creates a weight unit select field that fetches weight units from backend
 * Note: You need to provide the axios instance or HTTP service in your implementation
 */
export function createWeightUnitSelectField(
  name: string,
  label: string,
  organizationId: string,
  options?: {
    required?: boolean
    description?: string
    placeholder?: string
    fetchFn?: (orgId: string) => Promise<any[]>
  }
): FormFieldConfig {
  return {
    name,
    label,
    type: "weight-unit-select",
    required: options?.required || false,
    description: options?.description,
    placeholder: options?.placeholder || "Select weight unit"
  }
}
