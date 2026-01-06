"use client"

import type React from "react"
import { AuthorsTab } from "@/components/authors/authors-tab"
import type { Author } from "@/lib/types/authors"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { toast } from "sonner"
import type { Site } from "@/lib/db"
import { updateSiteField } from "@/lib/actions/sites"
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

type MediaEditFormProps = {
  media: Site
  authors: Author[]
}

export function MediaEditForm({ media, authors }: MediaEditFormProps) {
  const [fieldStatus, setFieldStatus] = useState<FieldSaveStatus>({})
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en-US"

  const [formData, setFormData] = useState({
    name: media.name || "",
    status: media.status || "draft",
    description: media.description || "",
    custom_domain: media.custom_domain || "",
    language: media.language || "",
    country: media.country || "",
    ideology: media.ideology || "",
    contact_email: media.contact_email || "",

    guideline_stylistic: media.guideline_stylistic || "",
    guideline_political: media.guideline_political || "",

    thumbnail_image_url: media.thumbnail_image_url || "",
    logo_url: media.logo_url || "",
    theme_layout: media.theme_layout || "default",
    theme_primary_color: media.theme_primary_color || "#9333ea",
    theme_accent_color: media.theme_accent_color || "#a855f7",
    not_found_message: media.not_found_message || "",

    about_page_content: media.about_page_content || "",
    privacy_page_content: media.privacy_page_content || "",

    twitter_handle: media.twitter_handle || "",
    twitter_url: media.twitter_url || "",
    twitter_api_key: media.twitter_api_key || "",
    twitter_client_secret: media.twitter_client_secret || "",
    twitter_access_token: media.twitter_access_token || "",
    twitter_access_token_secret: media.twitter_access_token_secret || "",
    twitter_callback_url: media.twitter_callback_url || "",
    twitter_proxy: media.twitter_proxy || "",
  })

  const [debouncedName] = useDebounce(formData.name, 1000)
  const [debouncedDescription] = useDebounce(formData.description, 1000)
  const [debouncedCustomDomain] = useDebounce(formData.custom_domain, 1000)
  const [debouncedLanguage] = useDebounce(formData.language, 1000)
  const [debouncedCountry] = useDebounce(formData.country, 1000)
  const [debouncedIdeology] = useDebounce(formData.ideology, 1000)
  const [debouncedContactEmail] = useDebounce(formData.contact_email, 1000)
  const [debouncedGuidelineStylistic] = useDebounce(formData.guideline_stylistic, 1000)
  const [debouncedGuidelinePolitical] = useDebounce(formData.guideline_political, 1000)
  const [debouncedNotFoundMessage] = useDebounce(formData.not_found_message, 1000)
  const [debouncedAboutPage] = useDebounce(formData.about_page_content, 1000)
  const [debouncedPrivacyPage] = useDebounce(formData.privacy_page_content, 1000)
  const [debouncedTwitterHandle] = useDebounce(formData.twitter_handle, 1000)
  const [debouncedTwitterUrl] = useDebounce(formData.twitter_url, 1000)
  const [debouncedTwitterApiKey] = useDebounce(formData.twitter_api_key, 1000)
  const [debouncedTwitterClientSecret] = useDebounce(formData.twitter_client_secret, 1000)
  const [debouncedTwitterAccessToken] = useDebounce(formData.twitter_access_token, 1000)
  const [debouncedTwitterAccessTokenSecret] = useDebounce(formData.twitter_access_token_secret, 1000)
  const [debouncedTwitterCallbackUrl] = useDebounce(formData.twitter_callback_url, 1000)
  const [debouncedTwitterProxy] = useDebounce(formData.twitter_proxy, 1000)

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    if (debouncedName !== media.name && debouncedName.trim()) {
      handleAutoSave("name", debouncedName)
    }
  }, [debouncedName])

  useEffect(() => {
    if (debouncedDescription !== media.description) {
      handleAutoSave("description", debouncedDescription)
    }
  }, [debouncedDescription])

  useEffect(() => {
    if (debouncedCustomDomain !== media.custom_domain) {
      handleAutoSave("custom_domain", debouncedCustomDomain)
    }
  }, [debouncedCustomDomain])

  useEffect(() => {
    if (debouncedLanguage !== media.language) {
      handleAutoSave("language", debouncedLanguage)
    }
  }, [debouncedLanguage])

  useEffect(() => {
    if (debouncedCountry !== media.country) {
      handleAutoSave("country", debouncedCountry)
    }
  }, [debouncedCountry])

  useEffect(() => {
    if (debouncedIdeology !== media.ideology) {
      handleAutoSave("ideology", debouncedIdeology)
    }
  }, [debouncedIdeology])

  useEffect(() => {
    if (debouncedContactEmail !== media.contact_email) {
      handleAutoSave("contact_email", debouncedContactEmail)
    }
  }, [debouncedContactEmail])

  useEffect(() => {
    if (debouncedGuidelineStylistic !== media.guideline_stylistic) {
      handleAutoSave("guideline_stylistic", debouncedGuidelineStylistic)
    }
  }, [debouncedGuidelineStylistic])

  useEffect(() => {
    if (debouncedGuidelinePolitical !== media.guideline_political) {
      handleAutoSave("guideline_political", debouncedGuidelinePolitical)
    }
  }, [debouncedGuidelinePolitical])

  useEffect(() => {
    if (debouncedNotFoundMessage !== media.not_found_message) {
      handleAutoSave("not_found_message", debouncedNotFoundMessage)
    }
  }, [debouncedNotFoundMessage])

  useEffect(() => {
    if (debouncedAboutPage !== media.about_page_content) {
      handleAutoSave("about_page_content", debouncedAboutPage)
    }
  }, [debouncedAboutPage])

  useEffect(() => {
    if (debouncedPrivacyPage !== media.privacy_page_content) {
      handleAutoSave("privacy_page_content", debouncedPrivacyPage)
    }
  }, [debouncedPrivacyPage])

  useEffect(() => {
    if (debouncedTwitterHandle !== media.twitter_handle) {
      handleAutoSave("twitter_handle", debouncedTwitterHandle)
    }
  }, [debouncedTwitterHandle])

  useEffect(() => {
    if (debouncedTwitterUrl !== media.twitter_url) {
      handleAutoSave("twitter_url", debouncedTwitterUrl)
    }
  }, [debouncedTwitterUrl])

  useEffect(() => {
    if (debouncedTwitterApiKey !== media.twitter_api_key) {
      handleAutoSave("twitter_api_key", debouncedTwitterApiKey)
    }
  }, [debouncedTwitterApiKey])

  useEffect(() => {
    if (debouncedTwitterClientSecret !== media.twitter_client_secret) {
      handleAutoSave("twitter_client_secret", debouncedTwitterClientSecret)
    }
  }, [debouncedTwitterClientSecret])

  useEffect(() => {
    if (debouncedTwitterAccessToken !== media.twitter_access_token) {
      handleAutoSave("twitter_access_token", debouncedTwitterAccessToken)
    }
  }, [debouncedTwitterAccessToken])

  useEffect(() => {
    if (debouncedTwitterAccessTokenSecret !== media.twitter_access_token_secret) {
      handleAutoSave("twitter_access_token_secret", debouncedTwitterAccessTokenSecret)
    }
  }, [debouncedTwitterAccessTokenSecret])

  useEffect(() => {
    if (debouncedTwitterCallbackUrl !== media.twitter_callback_url) {
      handleAutoSave("twitter_callback_url", debouncedTwitterCallbackUrl)
    }
  }, [debouncedTwitterCallbackUrl])

  useEffect(() => {
    if (debouncedTwitterProxy !== media.twitter_proxy) {
      handleAutoSave("twitter_proxy", debouncedTwitterProxy)
    }
  }, [debouncedTwitterProxy])

  const handleAutoSave = async (field: string, value: any) => {
    setFieldStatus((prev) => ({ ...prev, [field]: "saving" }))

    const result = await updateSiteField(media.id, field, value)
    if (result.success) {
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
  }

  const handleSelectChange = async (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    await handleAutoSave(field, value)
  }

  const handleColorChange = async (field: "theme_primary_color" | "theme_accent_color", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    await handleAutoSave(field, value)
  }

  const handleImageUpload = async (file: File, field: "thumbnail_image_url" | "logo_url") => {
    const setUploading = field === "thumbnail_image_url" ? setUploadingThumbnail : setUploadingLogo

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

      setFormData((prev) => ({ ...prev, [field]: data.url }))
      await handleAutoSave(field, data.url)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to upload image",
      })
    } finally {
      setUploading(false)
    }
  }

  const FieldWrapper = ({ field, label, children }: { field: string; label: string; children: React.ReactNode }) => {
    const status = fieldStatus[field] || "idle"
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
              <FieldWrapper field="name" label="Site Name">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter site name"
                />
              </FieldWrapper>

              <FieldWrapper field="status" label="Status">
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

              <FieldWrapper field="description" label="Description (Meta Description)">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter meta description for SEO"
                  rows={3}
                />
              </FieldWrapper>

              <FieldWrapper field="custom_domain" label="Custom Domain">
                <Input
                  id="custom_domain"
                  value={formData.custom_domain}
                  onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                  placeholder="example.com"
                />
              </FieldWrapper>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldWrapper field="language" label="Language (ISO Code)">
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="en, fr, es..."
                  />
                </FieldWrapper>

                <FieldWrapper field="country" label="Country (ISO Code)">
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="US, FR, ES..."
                  />
                </FieldWrapper>
              </div>

              <FieldWrapper field="ideology" label="Ideology / Editorial Line">
                <Input
                  id="ideology"
                  value={formData.ideology}
                  onChange={(e) => setFormData({ ...formData, ideology: e.target.value })}
                  placeholder="Enter editorial ideology"
                />
              </FieldWrapper>

              <FieldWrapper field="contact_email" label="Public Contact Email">
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
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
              <FieldWrapper field="guideline_stylistic" label="Stylistic Guidelines">
                <Textarea
                  id="guideline_stylistic"
                  value={formData.guideline_stylistic}
                  onChange={(e) => setFormData({ ...formData, guideline_stylistic: e.target.value })}
                  placeholder="Define the writing style, tone, and format for AI-generated content..."
                  rows={8}
                />
                <p className="text-sm text-muted-foreground">
                  Describe the writing style, tone, vocabulary level, and formatting preferences
                </p>
              </FieldWrapper>

              <FieldWrapper field="guideline_political" label="Political / Ideological Guidelines">
                <Textarea
                  id="guideline_political"
                  value={formData.guideline_political}
                  onChange={(e) => setFormData({ ...formData, guideline_political: e.target.value })}
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

                <FieldWrapper field="theme_layout" label="">
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
                  <FieldWrapper field="theme_primary_color" label="Primary Color">
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        id="theme_primary_color"
                        value={formData.theme_primary_color}
                        onChange={(e) => handleColorChange("theme_primary_color", e.target.value)}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.theme_primary_color}
                        onChange={(e) => handleColorChange("theme_primary_color", e.target.value)}
                        placeholder="#9333ea"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                    <p className="typography-muted">Main brand color for links, buttons, and accents</p>
                  </FieldWrapper>

                  <FieldWrapper field="theme_accent_color" label="Accent Color">
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        id="theme_accent_color"
                        value={formData.theme_accent_color}
                        onChange={(e) => handleColorChange("theme_accent_color", e.target.value)}
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.theme_accent_color}
                        onChange={(e) => handleColorChange("theme_accent_color", e.target.value)}
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

              <FieldWrapper field="not_found_message" label="Custom 404 Message">
                <Textarea
                  id="not_found_message"
                  value={formData.not_found_message}
                  onChange={(e) => setFormData({ ...formData, not_found_message: e.target.value })}
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
              <FieldWrapper field="about_page_content" label="About Page Content">
                <Textarea
                  id="about_page_content"
                  value={formData.about_page_content}
                  onChange={(e) => setFormData({ ...formData, about_page_content: e.target.value })}
                  placeholder="Enter content for the About page..."
                  rows={10}
                />
              </FieldWrapper>

              <FieldWrapper field="privacy_page_content" label="Privacy Policy Content">
                <Textarea
                  id="privacy_page_content"
                  value={formData.privacy_page_content}
                  onChange={(e) => setFormData({ ...formData, privacy_page_content: e.target.value })}
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
              <FieldWrapper field="twitter_handle" label="Twitter Username (without @)">
                <Input
                  id="twitter_handle"
                  value={formData.twitter_handle}
                  onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                  placeholder="username"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_url" label="Twitter Profile URL">
                <Input
                  id="twitter_url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
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
              <FieldWrapper field="twitter_api_key" label="API Key (Consumer Key)">
                <Input
                  id="twitter_api_key"
                  type="password"
                  value={formData.twitter_api_key}
                  onChange={(e) => setFormData({ ...formData, twitter_api_key: e.target.value })}
                  placeholder="Enter API key"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_client_secret" label="API Secret (Consumer Secret)">
                <Input
                  id="twitter_client_secret"
                  type="password"
                  value={formData.twitter_client_secret}
                  onChange={(e) => setFormData({ ...formData, twitter_client_secret: e.target.value })}
                  placeholder="Enter API secret"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_access_token" label="Access Token">
                <Input
                  id="twitter_access_token"
                  type="password"
                  value={formData.twitter_access_token}
                  onChange={(e) => setFormData({ ...formData, twitter_access_token: e.target.value })}
                  placeholder="Enter access token"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_access_token_secret" label="Access Token Secret">
                <Input
                  id="twitter_access_token_secret"
                  type="password"
                  value={formData.twitter_access_token_secret}
                  onChange={(e) => setFormData({ ...formData, twitter_access_token_secret: e.target.value })}
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
              <FieldWrapper field="twitter_callback_url" label="Callback URL">
                <Input
                  id="twitter_callback_url"
                  value={formData.twitter_callback_url}
                  onChange={(e) => setFormData({ ...formData, twitter_callback_url: e.target.value })}
                  placeholder="https://example.com/callback"
                />
              </FieldWrapper>

              <FieldWrapper field="twitter_proxy" label="Proxy (Optional)">
                <Input
                  id="twitter_proxy"
                  value={formData.twitter_proxy}
                  onChange={(e) => setFormData({ ...formData, twitter_proxy: e.target.value })}
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
