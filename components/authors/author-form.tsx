"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"
import { autoSaveAuthorFields } from "@/lib/actions/authors"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckIcon } from "lucide-react"
import type { Author } from "@/lib/types/authors"

type SaveStatus = "idle" | "saving" | "saved"
type FieldSaveStatus = Record<string, SaveStatus>

type FormDataType = {
  first_name: string
  last_name: string
  email: string
  twitter_link: string
  bio: string
  style: string
}

type AuthorFormProps = {
  author: Author
  siteId: number
}

function buildFormData(author: Author): FormDataType {
  return {
    first_name: author.first_name || "",
    last_name: author.last_name || "",
    email: author.email || "",
    twitter_link: author.twitter_link || "",
    bio: author.bio || "",
    style: author.style || "",
  }
}

function AuthorFieldWrapper({ field, htmlId, label, required, status, children }: {
  field: string
  htmlId: string
  label: string
  required?: boolean
  status: SaveStatus
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlId}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {status === "saving" && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
          </span>
        )}
        {status === "saved" && (
          <span
            className="flex items-center gap-1.5 text-xs animate-in fade-in duration-200"
            style={{ color: "oklch(var(--success))" }}
          >
            <CheckIcon className="h-3 w-3" />
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function AuthorForm({ author, siteId }: AuthorFormProps) {
  const [fieldStatus, setFieldStatus] = useState<FieldSaveStatus>({})
  const [formData, setFormData] = useState<FormDataType>(() => buildFormData(author))

  const formDataRef = useRef(formData)
  formDataRef.current = formData

  const serverValues = useRef<FormDataType>(buildFormData(author))
  const dirtyFields = useRef<Set<string>>(new Set())

  const flushSave = useDebouncedCallback(async () => {
    const fields = [...dirtyFields.current]
    dirtyFields.current.clear()

    const current = formDataRef.current
    const updates: Record<string, string> = {}

    for (const field of fields) {
      const key = field as keyof FormDataType
      if (current[key] !== serverValues.current[key]) {
        updates[field] = current[key]
      }
    }

    if (Object.keys(updates).length === 0) return

    const savingFields = Object.keys(updates)
    setFieldStatus((prev) => {
      const next = { ...prev }
      for (const f of savingFields) next[f] = "saving"
      return next
    })

    const result = await autoSaveAuthorFields(author.id, updates)

    if (result.success) {
      for (const [field, value] of Object.entries(updates)) {
        serverValues.current[field as keyof FormDataType] = value
      }
      setFieldStatus((prev) => {
        const next = { ...prev }
        for (const f of savingFields) next[f] = "saved"
        return next
      })

      setTimeout(() => {
        setFieldStatus((prev) => {
          const next = { ...prev }
          for (const f of savingFields) next[f] = "idle"
          return next
        })
      }, 2000)
    } else {
      for (const f of savingFields) dirtyFields.current.add(f)
      setFieldStatus((prev) => {
        const next = { ...prev }
        for (const f of savingFields) next[f] = "idle"
        return next
      })
      toast.error("Error", {
        description: result.error || "Failed to save changes",
      })
    }
  }, 1000, { maxWait: 5000 })

  useEffect(() => () => { flushSave.flush() }, [flushSave])

  const handleFieldChange = useCallback(
    (field: keyof FormDataType, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      dirtyFields.current.add(field)
      flushSave()
    },
    [flushSave],
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <AuthorFieldWrapper field="first_name" htmlId={`${author.id}-first_name`} label="First Name" required status={fieldStatus["first_name"] || "idle"}>
          <Input
            id={`${author.id}-first_name`}
            value={formData.first_name}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            placeholder="John"
          />
        </AuthorFieldWrapper>

        <AuthorFieldWrapper field="last_name" htmlId={`${author.id}-last_name`} label="Last Name" required status={fieldStatus["last_name"] || "idle"}>
          <Input
            id={`${author.id}-last_name`}
            value={formData.last_name}
            onChange={(e) => handleFieldChange("last_name", e.target.value)}
            placeholder="Doe"
          />
        </AuthorFieldWrapper>
      </div>

      <AuthorFieldWrapper field="email" htmlId={`${author.id}-email`} label="Email" required status={fieldStatus["email"] || "idle"}>
        <Input
          id={`${author.id}-email`}
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          placeholder="john.doe@example.com"
        />
      </AuthorFieldWrapper>

      <AuthorFieldWrapper field="twitter_link" htmlId={`${author.id}-twitter_link`} label="Twitter Link" status={fieldStatus["twitter_link"] || "idle"}>
        <Input
          id={`${author.id}-twitter_link`}
          value={formData.twitter_link}
          onChange={(e) => handleFieldChange("twitter_link", e.target.value)}
          placeholder="https://twitter.com/username"
        />
      </AuthorFieldWrapper>

      <AuthorFieldWrapper field="bio" htmlId={`${author.id}-bio`} label="Biography" status={fieldStatus["bio"] || "idle"}>
        <Textarea
          id={`${author.id}-bio`}
          value={formData.bio}
          onChange={(e) => handleFieldChange("bio", e.target.value)}
          placeholder="Brief biography of the author..."
          rows={4}
        />
      </AuthorFieldWrapper>

      <AuthorFieldWrapper field="style" htmlId={`${author.id}-style`} label="Writing Style" status={fieldStatus["style"] || "idle"}>
        <Textarea
          id={`${author.id}-style`}
          value={formData.style}
          onChange={(e) => handleFieldChange("style", e.target.value)}
          placeholder="Describe the author's writing style, tone, and approach..."
          rows={4}
        />
      </AuthorFieldWrapper>
    </div>
  )
}
