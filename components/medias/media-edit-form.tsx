"use client"

import type React from "react"
import { AuthorsTab } from "@/components/authors/authors-tab"
import type { Author } from "@/lib/types/authors"
import { useState, useEffect, useRef, useCallback } from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"
import type { Site } from "@/lib/db"
import { autoSaveSiteFields } from "@/lib/actions/sites"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, CheckIcon, Eye } from "lucide-react"
import Image from "next/image"
import { AVAILABLE_THEMES } from "@/lib/theme-resolver"

type SaveStatus = "idle" | "saving" | "saved"
type FieldSaveStatus = Record<string, SaveStatus>

type FormDataType = {
  name: string
  status: string
  description: string
  custom_domain: string
  language: string
  country: string
  ideology: string
  contact_email: string
  guideline_stylistic: string
  guideline_political: string
  thumbnail_image_url: string
  logo_url: string
  theme_layout: string
  theme_primary_color: string
  theme_accent_color: string
  not_found_message: string
  about_page_content: string
  privacy_page_content: string
  twitter_handle: string
  twitter_url: string
  twitter_api_key: string
  twitter_client_secret: string
  twitter_access_token: string
  twitter_access_token_secret: string
  twitter_callback_url: string
  twitter_proxy: string
}

type MediaEditFormProps = {
  media: Site
  authors: Author[]
}

function buildFormData(source: Site): FormDataType {
  return {
    name: source.name || "",
    status: source.status || "draft",
    description: source.description || "",
    custom_domain: source.custom_domain || "",
    language: source.language || "",
    country: source.country || "",
    ideology: source.ideology || "",
    contact_email: source.contact_email || "",
    guideline_stylistic: source.guideline_stylistic || "",
    guideline_political: source.guideline_political || "",
    thumbnail_image_url: source.thumbnail_image_url || "",
    logo_url: source.logo_url || "",
    theme_layout: source.theme_layout || "default",
    theme_primary_color: source.theme_primary_color || "#9333ea",
    theme_accent_color: source.theme_accent_color || "#a855f7",
    not_found_message: source.not_found_message || "",
    about_page_content: source.about_page_content || "",
    privacy_page_content: source.privacy_page_content || "",
    twitter_handle: source.twitter_handle || "",
    twitter_url: source.twitter_url || "",
    twitter_api_key: source.twitter_api_key || "",
    twitter_client_secret: source.twitter_client_secret || "",
    twitter_access_token: source.twitter_access_token || "",
    twitter_access_token_secret: source.twitter_access_token_secret || "",
    twitter_callback_url: source.twitter_callback_url || "",
    twitter_proxy: source.twitter_proxy || "",
  }
}

function FieldWrapper({ field, label, status, children }: {
  field: string
  label: string
  status: SaveStatus
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field}>{label}</Label>
        {status === "saving" && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
        {status === "saved" && (
          <span
            className="flex items-center gap-1.5 text-xs animate-in fade-in duration-200"
            style={{ color: "oklch(var(--success))" }}
          >
            <CheckIcon className="h-3 w-3" />
            Saved
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function MediaEditForm({ media, authors }: MediaEditFormProps) {
  const [fieldStatus, setFieldStatus] = useState<FieldSaveStatus>({})
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en-US"

  const [formData, setFormData] = useState<FormDataType>(() => buildFormData(media))

  // Always-current ref so the debounced callback reads fresh values
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  // Tracks what the server knows — avoids comparing against props that
  // can change due to revalidation in other parts of the app.
  const serverValues = useRef<FormDataType>(buildFormData(media))

  // Fields modified since the last flush
  const dirtyFields = useRef<Set<string>>(new Set())

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

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

    const result = await autoSaveSiteFields(media.id, updates)

    if (result.success) {
      for (const [field, value] of Object.entries(updates)) {
        serverValues.current[field as keyof FormDataType] = value
      }
      setFieldStatus((prev) => {
        const next = { ...prev }
        for (const f of savingFields) next[f] = "saved"
        return next
      })
      setLastSavedAt(new Date())

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

  // Flush pending saves when the component unmounts (e.g. navigation)
  useEffect(() => () => { flushSave.flush() }, [flushSave])

  const handleFieldChange = useCallback(
    (field: keyof FormDataType, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      dirtyFields.current.add(field)
      flushSave()
    },
    [flushSave],
  )

  // Select / discrete changes: save immediately without revalidation
  const handleSelectChange = useCallback(
    async (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setFieldStatus((prev) => ({ ...prev, [field]: "saving" }))

      const result = await autoSaveSiteFields(media.id, { [field]: value })

      if (result.success) {
        serverValues.current[field as keyof FormDataType] = value
        setFieldStatus((prev) => ({ ...prev, [field]: "saved" }))
        setLastSavedAt(new Date())
        setTimeout(() => {
          setFieldStatus((prev) => ({ ...prev, [field]: "idle" }))
        }, 2000)
      } else {
        setFieldStatus((prev) => ({ ...prev, [field]: "idle" }))
        toast.error("Error", {
          description: result.error || "Failed to save changes",
        })
      }
    },
    [media.id],
  )

  const handleImageUpload = useCallback(
    async (file: File, field: "thumbnail_image_url" | "logo_url") => {
      const setUploading = field === "thumbnail_image_url" ? setUploadingThumbnail : setUploadingLogo

      try {
        setUploading(true)
        const body = new FormData()
        body.append("file", file)

        const response = await fetch("/api/upload", { method: "POST", body })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()

        setFormData((prev) => ({ ...prev, [field]: data.url }))
        setFieldStatus((prev) => ({ ...prev, [field]: "saving" }))

        const result = await autoSaveSiteFields(media.id, { [field]: data.url })

        if (result.success) {
          serverValues.current[field] = data.url
          setFieldStatus((prev) => ({ ...prev, [field]: "saved" }))
          setLastSavedAt(new Date())
          setTimeout(() => {
            setFieldStatus((prev) => ({ ...prev, [field]: "idle" }))
          }, 2000)
        }
      } catch {
        toast.error("Error", { description: "Failed to upload image" })
      } finally {
        setUploading(false)
      }
    },
    [media.id],
  )

  const globalStatus = Object.values(fieldStatus).some((s) => s === "saving")
    ? "saving"
    : Object.values(fieldStatus).some((s) => s === "saved")
      ? "saved"
      : "idle"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="typography-small">Auto-save</span>
          {globalStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving changes...
            </span>
          )}
          {globalStatus === "saved" && lastSavedAt && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(var(--success))" }}>
              <CheckIcon className="h-3 w-3" />
              All changes saved
              <span className="text-muted-foreground">
                · {new Date(lastSavedAt).toLocaleTimeString(userLocale, { hour: "2-digit", minute: "2-digit" })}
              </span>
            </span>
          )}
          {globalStatus === "idle" && !lastSavedAt && (
            <span className="text-xs text-muted-foreground">Changes will be saved automatically</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information about your media site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="name" label="Site Name" status={fieldStatus["name"] || "idle"}>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Enter site name"
                />
              </FieldWrapper>

              <FieldWrapper field="status" label="Status" status={fieldStatus["status"] || "idle"}>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>

              <FieldWrapper field="description" label="Description (Meta Description)" status={fieldStatus["description"] || "idle"}>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Enter meta description for SEO"
                  rows={3}
                />
              </FieldWrapper>

              <FieldWrapper field="custom_domain" label="Custom Domain" status={fieldStatus["custom_domain"] || "idle"}>
                <Input
                  id="custom_domain"
                  value={formData.custom_domain}
                  onChange={(e) => handleFieldChange("custom_domain", e.target.value)}
                  placeholder="example.com"
                />
              </FieldWrapper>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldWrapper field="language" label="Language (ISO Code)" status={fieldStatus["language"] || "idle"}>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleFieldChange("language", e.target.value)}
                    placeholder="en, fr, es..."
                  />
                </FieldWrapper>

                <FieldWrapper field="country" label="Country (ISO Code)" status={fieldStatus["country"] || "idle"}>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    placeholder="US, FR, ES..."
                  />
                </FieldWrapper>
              </div>

              <FieldWrapper field="ideology" label="Ideology / Editorial Line" status={fieldStatus["ideology"] || "idle"}>
                <Input
                  id="ideology"
                  value={formData.ideology}
                  onChange={(e) => handleFieldChange("ideology", e.target.value)}
                  placeholder="Enter editorial ideology"
                />
              </FieldWrapper>

              <FieldWrapper field="contact_email" label="Public Contact Email" status={fieldStatus["contact_email"] || "idle"}>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </FieldWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Strategy</CardTitle>
              <CardDescription>Guidelines for AI-generated content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="guideline_stylistic" label="Stylistic Guidelines" status={fieldStatus["guideline_stylistic"] || "idle"}>
                <Textarea
                  id="guideline_stylistic"
                  value={formData.guideline_stylistic}
                  onChange={(e) => handleFieldChange("guideline_stylistic", e.target.value)}
                  placeholder="Define the writing style, tone, and format for AI-generated content..."
                  rows={8}
                />
                <p className="text-sm text-muted-foreground">
                  Describe the writing style, tone, vocabulary level, and formatting preferences
                </p>
              </FieldWrapper>

              <FieldWrapper field="guideline_political" label="Political / Ideological Guidelines" status={fieldStatus["guideline_political"] || "idle"}>
                <Textarea
                  id="guideline_political"
                  value={formData.guideline_political}
                  onChange={(e) => handleFieldChange("guideline_political", e.target.value)}
                  placeholder="Define the political stance and ideological approach..."
                  rows={8}
                />
                <p className="text-sm text-muted-foreground">
                  Specify the political perspective, biases to avoid or embrace, and editorial stance
                </p>
              </FieldWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your media site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme_layout">Theme Preset</Label>
                  {media.custom_domain && (
                    <a
                      href={`https://${media.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      Preview Site
                    </a>
                  )}
                </div>

                <FieldWrapper field="theme_layout" label="" status={fieldStatus["theme_layout"] || "idle"}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {AVAILABLE_THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => handleSelectChange("theme_layout", theme.value)}
                        className={`group relative flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 ${
                          formData.theme_layout === theme.value
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{theme.label}</h4>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{theme.description}</p>
                          </div>
                          {formData.theme_layout === theme.value && (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        {/* Theme preview indicator */}
                        <div className="mt-2 flex gap-1.5">
                          <div
                            className="h-2 w-full rounded-full"
                            style={{
                              backgroundColor:
                                theme.value === "modern"
                                  ? "#2563eb"
                                  : theme.value === "classic"
                                    ? "#1a1a1a"
                                    : theme.value === "magazine"
                                      ? "#dc2626"
                                      : theme.value === "minimalist"
                                        ? "#000000"
                                        : "#0ea5e9",
                            }}
                          />
                          <div
                            className="h-2 w-8 rounded-full"
                            style={{
                              backgroundColor:
                                theme.value === "modern"
                                  ? "#7c3aed"
                                  : theme.value === "classic"
                                    ? "#b91c1c"
                                    : theme.value === "magazine"
                                      ? "#ea580c"
                                      : theme.value === "minimalist"
                                        ? "#059669"
                                        : "#f59e0b",
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </FieldWrapper>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each theme includes professionally designed typography, spacing, and layout. Customize colors below
                    to match your brand while maintaining the theme's visual style.
                  </p>
                </div>
              </div>

              {/* Site Images */}
              <div className="space-y-3">
                <Label>Site Thumbnail (1200x630px)</Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {formData.thumbnail_image_url && (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-muted sm:w-64">
                      <Image
                        src={formData.thumbnail_image_url || "/placeholder.svg"}
                        alt="Site thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, "thumbnail_image_url")
                      }}
                      disabled={uploadingThumbnail}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <Label htmlFor="thumbnail-upload">
                      <Button type="button" variant="outline" size="sm" disabled={uploadingThumbnail} asChild>
                        <span className="cursor-pointer gap-2">
                          {uploadingThumbnail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload Thumbnail
                        </span>
                      </Button>
                    </Label>
                    <p className="typography-muted mt-2">Recommended: 1200x630px</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Site Logo</Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {formData.logo_url && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={formData.logo_url || "/placeholder.svg"}
                        alt="Site logo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, "logo_url")
                      }}
                      disabled={uploadingLogo}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload">
                      <Button type="button" variant="outline" size="sm" disabled={uploadingLogo} asChild>
                        <span className="cursor-pointer gap-2">
                          {uploadingLogo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload Logo
                        </span>
                      </Button>
                    </Label>
                    <p className="typography-muted mt-2">Square format recommended</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="space-y-2">
                  <h4 className="typography-small">Brand Colors</h4>
                  <p className="typography-muted">
                    Customize colors to match your brand. These colors will be applied to your selected theme preset.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldWrapper field="theme_primary_color" label="Primary Color" status={fieldStatus["theme_primary_color"] || "idle"}>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        id="theme_primary_color"
                        value={formData.theme_primary_color}
                        onChange={(e) => handleFieldChange("theme_primary_color", e.target.value)}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.theme_primary_color}
                        onChange={(e) => handleFieldChange("theme_primary_color", e.target.value)}
                        placeholder="#9333ea"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                    <p className="typography-muted">Main brand color for links, buttons, and accents</p>
                  </FieldWrapper>

                  <FieldWrapper field="theme_accent_color" label="Accent Color" status={fieldStatus["theme_accent_color"] || "idle"}>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        id="theme_accent_color"
                        value={formData.theme_accent_color}
                        onChange={(e) => handleFieldChange("theme_accent_color", e.target.value)}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.theme_accent_color}
                        onChange={(e) => handleFieldChange("theme_accent_color", e.target.value)}
                        placeholder="#a855f7"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                    <p className="typography-muted">Secondary color for highlights and CTAs</p>
                  </FieldWrapper>
                </div>

                {/* Enhanced color preview */}
                <div className="rounded-md border border-border bg-background p-4">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color Preview</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-md border border-border shadow-sm"
                          style={{ backgroundColor: formData.theme_primary_color }}
                        />
                        <span className="text-sm font-medium">Primary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-md border border-border shadow-sm"
                          style={{ backgroundColor: formData.theme_accent_color }}
                        />
                        <span className="text-sm font-medium">Accent</span>
                      </div>
                      <div className="ml-auto">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          style={{
                            backgroundColor: formData.theme_primary_color,
                            borderColor: formData.theme_primary_color,
                            color: "white",
                          }}
                        >
                          Sample Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <FieldWrapper field="not_found_message" label="Custom 404 Message" status={fieldStatus["not_found_message"] || "idle"}>
                <Textarea
                  id="not_found_message"
                  value={formData.not_found_message}
                  onChange={(e) => handleFieldChange("not_found_message", e.target.value)}
                  placeholder="Custom message for 404 page"
                  rows={3}
                />
              </FieldWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Static Pages</CardTitle>
              <CardDescription>Content for your static pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="about_page_content" label="About Page Content" status={fieldStatus["about_page_content"] || "idle"}>
                <Textarea
                  id="about_page_content"
                  value={formData.about_page_content}
                  onChange={(e) => handleFieldChange("about_page_content", e.target.value)}
                  placeholder="Enter content for the About page..."
                  rows={10}
                />
              </FieldWrapper>

              <FieldWrapper field="privacy_page_content" label="Privacy Policy Content" status={fieldStatus["privacy_page_content"] || "idle"}>
                <Textarea
                  id="privacy_page_content"
                  value={formData.privacy_page_content}
                  onChange={(e) => handleFieldChange("privacy_page_content", e.target.value)}
                  placeholder="Enter content for the Privacy Policy page..."
                  rows={10}
                />
              </FieldWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authors Management</CardTitle>
              <CardDescription>Manage authors for this media site</CardDescription>
            </CardHeader>
            <CardContent>
              <AuthorsTab authors={authors} siteId={media.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Profile</CardTitle>
              <CardDescription>Basic Twitter account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="twitter_handle" label="Twitter Username (without @)" status={fieldStatus["twitter_handle"] || "idle"}>
                <Input
                  id="twitter_handle"
                  value={formData.twitter_handle}
                  onChange={(e) => handleFieldChange("twitter_handle", e.target.value)}
                  placeholder="username"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_url" label="Twitter Profile URL" status={fieldStatus["twitter_url"] || "idle"}>
                <Input
                  id="twitter_url"
                  value={formData.twitter_url}
                  onChange={(e) => handleFieldChange("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </FieldWrapper>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twitter API Configuration</CardTitle>
              <CardDescription>API credentials for Twitter integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="twitter_api_key" label="API Key (Consumer Key)" status={fieldStatus["twitter_api_key"] || "idle"}>
                <Input
                  id="twitter_api_key"
                  type="password"
                  value={formData.twitter_api_key}
                  onChange={(e) => handleFieldChange("twitter_api_key", e.target.value)}
                  placeholder="Enter API key"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_client_secret" label="API Secret (Consumer Secret)" status={fieldStatus["twitter_client_secret"] || "idle"}>
                <Input
                  id="twitter_client_secret"
                  type="password"
                  value={formData.twitter_client_secret}
                  onChange={(e) => handleFieldChange("twitter_client_secret", e.target.value)}
                  placeholder="Enter API secret"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_access_token" label="Access Token" status={fieldStatus["twitter_access_token"] || "idle"}>
                <Input
                  id="twitter_access_token"
                  type="password"
                  value={formData.twitter_access_token}
                  onChange={(e) => handleFieldChange("twitter_access_token", e.target.value)}
                  placeholder="Enter access token"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_access_token_secret" label="Access Token Secret" status={fieldStatus["twitter_access_token_secret"] || "idle"}>
                <Input
                  id="twitter_access_token_secret"
                  type="password"
                  value={formData.twitter_access_token_secret}
                  onChange={(e) => handleFieldChange("twitter_access_token_secret", e.target.value)}
                  placeholder="Enter access token secret"
                />
              </FieldWrapper>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>Optional advanced settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldWrapper field="twitter_callback_url" label="Callback URL" status={fieldStatus["twitter_callback_url"] || "idle"}>
                <Input
                  id="twitter_callback_url"
                  value={formData.twitter_callback_url}
                  onChange={(e) => handleFieldChange("twitter_callback_url", e.target.value)}
                  placeholder="https://example.com/callback"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_proxy" label="Proxy (Optional)" status={fieldStatus["twitter_proxy"] || "idle"}>
                <Input
                  id="twitter_proxy"
                  value={formData.twitter_proxy}
                  onChange={(e) => handleFieldChange("twitter_proxy", e.target.value)}
                  placeholder="http://proxy.example.com:8080"
                />
              </FieldWrapper>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
