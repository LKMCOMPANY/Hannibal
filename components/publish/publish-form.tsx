"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaSelector } from "@/components/publish/media-selector"
import { AuthorSelector } from "@/components/publish/author-selector"
import { CategorySelector } from "@/components/publish/category-selector"
import { ImageUpload } from "@/components/publish/image-upload"
import { TagsInput } from "@/components/publish/tags-input"
import { XPostInput } from "@/components/publish/x-post-input"
import { AIAssistant } from "@/components/publish/ai-assistant"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Site } from "@/lib/db"
import type { Author } from "@/lib/types/authors"
import type { PublishArticleInput } from "@/lib/types/publisher"
import { createArticle, scheduleArticle } from "@/lib/actions/publisher"
import { getAuthorsBySiteIdAction } from "@/lib/actions/authors"
import { getDateFnsLocale } from "@/lib/i18n/utils/format-date"

const TiptapEditor = dynamic(() => import("@/components/publish/tiptap-editor").then((mod) => mod.TiptapEditor), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] space-y-3 p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
})

type PublishFormProps = {
  sites: Site[]
}

export function PublishForm({ sites }: PublishFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [loadingAuthors, setLoadingAuthors] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [selectedSite, setSelectedSite] = useState<Site | undefined>()

  const [formData, setFormData] = useState<Partial<PublishArticleInput>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    meta_description: "",
    x_post: "",
    tags: [],
    category: "",
    featured_image_url: "",
    featured_image_caption: "",
    featured_image_alt: "",
    status: "draft",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formData.site_id) {
      const site = sites.find((s) => s.id === formData.site_id)
      setSelectedSite(site)

      setLoadingAuthors(true)
      getAuthorsBySiteIdAction(formData.site_id)
        .then((result) => {
          if (result.success && result.data) {
            setAuthors(result.data)
            if (formData.author_id && !result.data.find((a) => a.id === formData.author_id)) {
              setFormData((prev) => ({ ...prev, author_id: undefined }))
            }
          } else {
            toast.error("Failed to load authors")
            setAuthors([])
          }
        })
        .catch(() => {
          toast.error("Failed to load authors")
          setAuthors([])
        })
        .finally(() => setLoadingAuthors(false))
    } else {
      setAuthors([])
      setSelectedSite(undefined)
      setFormData((prev) => ({ ...prev, author_id: undefined }))
    }
  }, [formData.site_id, sites])

  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title])

  const validateForm = (status: "draft" | "published" | "scheduled"): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.site_id) {
      newErrors.site_id = "Media selection is required"
    }

    if (status === "published" || status === "scheduled") {
      if (!formData.content?.trim()) {
        newErrors.content = "Content is required for publication"
      }
      if (!formData.author_id) {
        newErrors.author_id = "Author is required for publication"
      }
      if (!formData.excerpt?.trim()) {
        newErrors.excerpt = "Excerpt is required for publication"
      }
      if (!formData.category?.trim()) {
        newErrors.category = "Category is required for publication"
      }
    }

    if (status === "scheduled" && !scheduledDate) {
      newErrors.scheduled_date = "Scheduled date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    if (!validateForm("draft")) {
      toast.error("Please fill in required fields", {
        description: Object.values(errors).join(", "),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createArticle({
        ...formData,
        status: "draft",
      } as PublishArticleInput)

      if (result.success && result.data) {
        toast.success("Draft saved successfully")
        router.push("/dashboard/articles")
      } else {
        toast.error("Failed to save draft", {
          description: result.error,
        })
      }
    } catch (error) {
      console.error("[v0] Error saving draft:", error)
      toast.error("An error occurred while saving")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async () => {
    if (!validateForm("published")) {
      toast.error("Please fill in all required fields", {
        description: Object.values(errors).join(", "),
      })
      return
    }

    setIsSubmitting(true)
    try {
      let completeXPost = formData.x_post || ""
      if (completeXPost && formData.slug && selectedSite) {
        const domain = selectedSite.custom_domain || selectedSite.hostname
        const publicUrl = `https://${domain}/article/${formData.slug}`
        completeXPost = `${completeXPost} ${publicUrl}`
      }

      const result = await createArticle({
        ...formData,
        x_post: completeXPost,
        status: "published",
        published_at: new Date().toISOString(),
      } as PublishArticleInput)

      if (result.success && result.data) {
        toast.success("Article published successfully")
        router.push("/dashboard/articles")
      } else {
        const detail = result.validationErrors
          ? Object.values(result.validationErrors).join(", ")
          : result.error
        toast.error("Failed to publish article", { description: detail })
      }
    } catch (error) {
      console.error("[v0] Error publishing article:", error)
      toast.error("An error occurred while publishing")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSchedule = async () => {
    if (!validateForm("scheduled")) {
      toast.error("Please fill in all required fields", {
        description: Object.values(errors).join(", "),
      })
      return
    }

    setIsSubmitting(true)
    try {
      let completeXPost = formData.x_post || ""
      if (completeXPost && formData.slug && selectedSite) {
        const domain = selectedSite.custom_domain || selectedSite.hostname
        const publicUrl = `https://${domain}/article/${formData.slug}`
        completeXPost = `${completeXPost} ${publicUrl}`
      }

      const result = await scheduleArticle(
        {
          ...formData,
          x_post: completeXPost,
          status: "scheduled",
        } as PublishArticleInput,
        scheduledDate!,
      )

      if (result.success && result.data) {
        toast.success("Article scheduled successfully")
        router.push("/dashboard/articles")
      } else {
        const detail = result.validationErrors
          ? Object.values(result.validationErrors).join(", ")
          : result.error
        toast.error("Failed to schedule article", { description: detail })
      }
    } catch (error) {
      console.error("[v0] Error scheduling article:", error)
      toast.error("An error occurred while scheduling")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMetadataUpdate = (metadata: {
    title?: string
    excerpt?: string
    metaDescription?: string
    tags?: string[]
    xPost?: string
  }) => {
    setFormData((prev) => {
      const updates: any = {
        ...prev,
        ...(metadata.title && { title: metadata.title }),
        ...(metadata.excerpt && { excerpt: metadata.excerpt }),
        ...(metadata.metaDescription && { meta_description: metadata.metaDescription }),
        ...(metadata.tags && { tags: metadata.tags }),
        ...(metadata.xPost !== undefined && { x_post: metadata.xPost }),
      }

      // Auto-generate slug if title was updated by AI
      if (metadata.title) {
        updates.slug = metadata.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      }

      return updates
    })
  }

  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en"
  const dateFnsLocale = getDateFnsLocale(userLocale.split("-")[0] as any)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Article Information</CardTitle>
          <CardDescription className="text-pretty">Basic information about your article</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title"
              className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.title && <p className="typography-muted text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug (URL)
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              placeholder="auto-generated-from-title"
              disabled
              className="bg-muted/50"
            />
            <p className="typography-muted">Auto-generated from title</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Media <span className="text-destructive">*</span>
              </Label>
              <MediaSelector
                value={formData.site_id}
                onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                sites={sites}
              />
              {errors.site_id && <p className="typography-muted text-destructive">{errors.site_id}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Author{" "}
                {(formData.status === "published" || formData.status === "scheduled") && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <AuthorSelector
                value={formData.author_id}
                onValueChange={(value) => setFormData({ ...formData, author_id: value })}
                authors={authors}
                disabled={!formData.site_id || loadingAuthors}
              />
              {loadingAuthors && <p className="typography-muted">Loading authors...</p>}
              {!formData.site_id && <p className="typography-muted">Select a media first</p>}
              {errors.author_id && <p className="typography-muted text-destructive">{errors.author_id}</p>}
            </div>
          </div>

          <CategorySelector
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required={formData.status === "published" || formData.status === "scheduled"}
            error={errors.category}
          />
        </CardContent>
      </Card>

      <AIAssistant
        content={formData.content || ""}
        siteId={formData.site_id}
        authorId={formData.author_id}
        slug={formData.slug}
        onContentUpdate={(content) => setFormData({ ...formData, content })}
        onMetadataUpdate={handleMetadataUpdate}
        disabled={isSubmitting}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Content</CardTitle>
          <CardDescription className="text-pretty">Main article content</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "rounded-lg border bg-background overflow-hidden",
              errors.content && "border-destructive ring-2 ring-destructive/20",
            )}
          >
            <TiptapEditor
              initialContent={formData.content}
              onUpdate={(content) => setFormData({ ...formData, content })}
              placeholder="Write your article content here..."
              className="min-h-[400px]"
            />
          </div>
          {errors.content && <p className="typography-muted text-destructive">{errors.content}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">SEO and Metadata</CardTitle>
          <CardDescription className="text-pretty">Optimize for search engines and social sharing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-sm font-medium">
              Excerpt{" "}
              {(formData.status === "published" || formData.status === "scheduled") && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the article"
              rows={3}
              className={cn(
                "resize-none leading-relaxed",
                errors.excerpt && "border-destructive focus-visible:ring-destructive",
              )}
            />
            {errors.excerpt && <p className="typography-muted text-destructive">{errors.excerpt}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description" className="text-sm font-medium">
              Meta Description
            </Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="SEO meta description (160 characters max)"
              rows={3}
              maxLength={160}
              className="resize-none leading-relaxed"
            />
            <p className="typography-muted">{formData.meta_description?.length || 0}/160 characters</p>
          </div>

          <TagsInput
            value={formData.tags || []}
            onValueChange={(tags) => setFormData({ ...formData, tags })}
            label="Tags"
            placeholder="Type and press Enter"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Featured Image</CardTitle>
          <CardDescription className="text-pretty">Main image for the article</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            value={formData.featured_image_url}
            onValueChange={(value) => setFormData({ ...formData, featured_image_url: value })}
            label="Featured Image"
            description="Recommended: 1200x630px"
          />

          {formData.featured_image_url && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="image_caption" className="text-sm font-medium">
                  Image Caption
                </Label>
                <Input
                  id="image_caption"
                  value={formData.featured_image_caption}
                  onChange={(e) => setFormData({ ...formData, featured_image_caption: e.target.value })}
                  placeholder="Caption for the image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_alt" className="text-sm font-medium">
                  Alt Text
                </Label>
                <Input
                  id="image_alt"
                  value={formData.featured_image_alt}
                  onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                  placeholder="Descriptive alt text for accessibility"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">X (Twitter)</CardTitle>
          <CardDescription className="text-pretty">Social media post for article promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <XPostInput
            value={formData.x_post}
            onValueChange={(value) => setFormData({ ...formData, x_post: value })}
            slug={formData.slug}
            customDomain={selectedSite?.custom_domain || undefined}
            hostname={selectedSite?.hostname} // Pass hostname for fallback
            disabled={isSubmitting}
            error={errors.x_post}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Publication</CardTitle>
          <CardDescription className="text-pretty">Manage publication status and timing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule Publication</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {scheduledDate ? format(scheduledDate, "PPP", { locale: dateFnsLocale }) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.scheduled_date && <p className="typography-muted text-destructive">{errors.scheduled_date}</p>}
            <p className="typography-muted">Optional: Schedule for future publication</p>
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>

            {scheduledDate ? (
              <Button onClick={handleSchedule} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Article"
                )}
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Publishing...
                  </>
                ) : (
                  "Publish Now"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
