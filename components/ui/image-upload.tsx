"use client"

import * as React from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MediaCategory } from "@/components/form/formBuilder/types"

export interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  organizationId?: string
  category?: MediaCategory
  maxSize?: number
  previewAlt?: string
  disabled?: boolean
  onUpload?: (
    file: File,
    category: MediaCategory,
    organizationId: string,
    entityId?: string
  ) => Promise<{ success: boolean; data?: { url: string }; error?: string }>
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  organizationId = "",
  category = MediaCategory.PRODUCT,
  maxSize = 5,
  previewAlt = "Image preview",
  disabled = false,
  onUpload,
  className,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      if (onUpload) {
        const result = await onUpload(file, category, organizationId)
        if (result.success && result.data?.url) {
          onChange(result.data.url)
        } else {
          setError(result.error || "Upload failed")
        }
      } else {
        // Fallback: create a local URL for preview
        const url = URL.createObjectURL(file)
        onChange(url)
      }
    } catch (err) {
      setError("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt={previewAlt}
            className="max-w-[200px] max-h-[200px] rounded-lg border object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isLoading}
          onClick={() => inputRef.current?.click()}
          className="h-32 w-full border-dashed"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">Max size: {maxSize}MB</span>
              </>
            )}
          </div>
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
