"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { toast } from "sonner"
import { updateAuthorField } from "@/lib/actions/authors"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckIcon } from "lucide-react"
import type { Author } from "@/lib/types/authors"

type SaveStatus = "idle" | "saving" | "saved"
type FieldSaveStatus = Record<string, SaveStatus>

type AuthorFormProps = {
  author: Author
  siteId: number
}

export function AuthorForm({ author, siteId }: AuthorFormProps) {
  const [fieldStatus, setFieldStatus] = useState<FieldSaveStatus>({})
  const [formData, setFormData] = useState({
    first_name: author.first_name || "",
    last_name: author.last_name || "",
    email: author.email || "",
    twitter_link: author.twitter_link || "",
    bio: author.bio || "",
    style: author.style || "",
  })

  const [debouncedFirstName] = useDebounce(formData.first_name, 1000)
  const [debouncedLastName] = useDebounce(formData.last_name, 1000)
  const [debouncedEmail] = useDebounce(formData.email, 1000)
  const [debouncedTwitterLink] = useDebounce(formData.twitter_link, 1000)
  const [debouncedBio] = useDebounce(formData.bio, 1000)
  const [debouncedStyle] = useDebounce(formData.style, 1000)

  useEffect(() => {
    if (debouncedFirstName !== author.first_name && debouncedFirstName.trim()) {
      handleAutoSave("first_name", debouncedFirstName)
    }
  }, [debouncedFirstName])

  useEffect(() => {
    if (debouncedLastName !== author.last_name && debouncedLastName.trim()) {
      handleAutoSave("last_name", debouncedLastName)
    }
  }, [debouncedLastName])

  useEffect(() => {
    if (debouncedEmail !== author.email && debouncedEmail.trim()) {
      handleAutoSave("email", debouncedEmail)
    }
  }, [debouncedEmail])

  useEffect(() => {
    if (debouncedTwitterLink !== author.twitter_link) {
      handleAutoSave("twitter_link", debouncedTwitterLink)
    }
  }, [debouncedTwitterLink])

  useEffect(() => {
    if (debouncedBio !== author.bio) {
      handleAutoSave("bio", debouncedBio)
    }
  }, [debouncedBio])

  useEffect(() => {
    if (debouncedStyle !== author.style) {
      handleAutoSave("style", debouncedStyle)
    }
  }, [debouncedStyle])

  const handleAutoSave = async (field: string, value: any) => {
    setFieldStatus((prev) => ({ ...prev, [field]: "saving" }))

    const result = await updateAuthorField(author.id, siteId, field, value)
    if (result.success) {
      setFieldStatus((prev) => ({ ...prev, [field]: "saved" }))
      setTimeout(() => {
        setFieldStatus((prev) => ({ ...prev, [field]: "idle" }))
      }, 2000)
    } else {
      setFieldStatus((prev) => ({ ...prev, [field]: "idle" }))
      toast.error("Error", {
        description: result.error || "Failed to save changes",
      })
    }
  }

  const FieldWrapper = ({
    field,
    label,
    required,
    children,
  }: { field: string; label: string; required?: boolean; children: React.ReactNode }) => {
    const status = fieldStatus[field] || "idle"
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${author.id}-${field}`}>
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldWrapper field="first_name" label="First Name" required>
          <Input
            id={`${author.id}-first_name`}
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="John"
          />
        </FieldWrapper>

        <FieldWrapper field="last_name" label="Last Name" required>
          <Input
            id={`${author.id}-last_name`}
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Doe"
          />
        </FieldWrapper>
      </div>

      <FieldWrapper field="email" label="Email" required>
        <Input
          id={`${author.id}-email`}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@example.com"
        />
      </FieldWrapper>

      <FieldWrapper field="twitter_link" label="Twitter Link">
        <Input
          id={`${author.id}-twitter_link`}
          value={formData.twitter_link}
          onChange={(e) => setFormData({ ...formData, twitter_link: e.target.value })}
          placeholder="https://twitter.com/username"
        />
      </FieldWrapper>

      <FieldWrapper field="bio" label="Biography">
        <Textarea
          id={`${author.id}-bio`}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Brief biography of the author..."
          rows={4}
        />
      </FieldWrapper>

      <FieldWrapper field="style" label="Writing Style">
        <Textarea
          id={`${author.id}-style`}
          value={formData.style}
          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          placeholder="Describe the author's writing style, tone, and approach..."
          rows={4}
        />
      </FieldWrapper>
    </div>
  )
}
