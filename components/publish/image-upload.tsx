"use client"

import { useState } from "react"
import { Upload, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { toast } from "sonner"

type ImageUploadProps = {
  value?: string
  onValueChange: (value: string | undefined) => void
  label: string
  description?: string
}

export function ImageUpload({ value, onValueChange, label, description }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onValueChange(data.url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {description && <p className="typography-muted">{description}</p>}

      <div className="flex flex-col gap-3">
        {value && (
          <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={value || "/placeholder.svg"} alt={label} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => onValueChange(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            disabled={uploading}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <Label htmlFor={`image-upload-${label}`}>
            <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
              <span className="cursor-pointer gap-2">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {value ? "Change Image" : "Upload Image"}
              </span>
            </Button>
          </Label>
        </div>
      </div>
    </div>
  )
}
