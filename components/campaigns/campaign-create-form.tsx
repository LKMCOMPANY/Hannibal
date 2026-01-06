"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, FileText, Globe, CheckCircle2, Clock, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ArticleListItem } from "@/lib/types/articles"
import type { Site } from "@/lib/types/sites"
import type { CampaignCreateInput } from "@/lib/types/campaigns"
import { createCampaignAction } from "@/lib/actions/campaigns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CampaignImageSelector } from "@/components/campaigns/campaign-image-selector"

type CampaignCreateFormProps = {
  articles: ArticleListItem[]
  sites: Site[]
}

export function CampaignCreateForm({ articles, sites }: CampaignCreateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articleSearch, setArticleSearch] = useState("")
  const [siteSearch, setSiteSearch] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedIdeology, setSelectedIdeology] = useState<string>("all")

  const [formData, setFormData] = useState<Partial<CampaignCreateInput>>({
    name: "",
    source_article_id: undefined,
    target_site_ids: [],
    custom_instructions: "",
    campaign_images: [],
    deployment_speed_minutes: 60,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !articleSearch ||
      article.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      article.site_name?.toLowerCase().includes(articleSearch.toLowerCase())
    return matchesSearch
  })

  const selectedArticle = articles.find((a) => a.id === formData.source_article_id)
  const sourceSiteId = selectedArticle?.site_id

  useEffect(() => {
    if (sourceSiteId && formData.target_site_ids?.includes(sourceSiteId)) {
      setFormData((prev) => ({
        ...prev,
        target_site_ids: prev.target_site_ids?.filter((id) => id !== sourceSiteId) || [],
      }))
    }
  }, [sourceSiteId])

  const filteredSites = sites.filter((site) => {
    // Exclude source site from destination list
    if (sourceSiteId && site.id === sourceSiteId) {
      return false
    }

    const matchesSearch =
      !siteSearch ||
      site.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
      site.custom_domain?.toLowerCase().includes(siteSearch.toLowerCase())
    const matchesLanguage = selectedLanguage === "all" || site.language === selectedLanguage
    const matchesIdeology = selectedIdeology === "all" || site.ideology === selectedIdeology
    return matchesSearch && matchesLanguage && matchesIdeology
  })

  const languages = Array.from(new Set(sites.map((s) => s.language).filter(Boolean))) as string[]
  const ideologies = Array.from(new Set(sites.map((s) => s.ideology).filter(Boolean))) as string[]

  const toggleSite = (siteId: number) => {
    setFormData((prev) => ({
      ...prev,
      target_site_ids: prev.target_site_ids?.includes(siteId)
        ? prev.target_site_ids.filter((id) => id !== siteId)
        : [...(prev.target_site_ids || []), siteId],
    }))
  }

  const handleSelectAll = () => {
    const allFilteredSiteIds = filteredSites.map((site) => site.id)
    const allSelected = allFilteredSiteIds.every((id) => formData.target_site_ids?.includes(id))

    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        target_site_ids: prev.target_site_ids?.filter((id) => !allFilteredSiteIds.includes(id)) || [],
      }))
    } else {
      const newSelectedIds = Array.from(new Set([...(formData.target_site_ids || []), ...allFilteredSiteIds]))
      setFormData((prev) => ({
        ...prev,
        target_site_ids: newSelectedIds,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Campaign name is required"
    }
    if (!formData.source_article_id) {
      newErrors.source_article_id = "Source article is required"
    }
    if (!formData.target_site_ids || formData.target_site_ids.length === 0) {
      newErrors.target_site_ids = "At least one target site is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createCampaignAction(formData as CampaignCreateInput)

      if (result.success && result.campaignId) {
        toast.success("Campaign created successfully")
        router.push(`/dashboard/campaigns/${result.campaignId}`)
      } else {
        toast.error("Failed to create campaign", {
          description: result.error,
        })
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("An error occurred while creating campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  const estimatedCompletionMinutes = (formData.target_site_ids?.length || 0) * (formData.deployment_speed_minutes || 60)
  const estimatedHours = Math.floor(estimatedCompletionMinutes / 60)
  const estimatedMinutes = estimatedCompletionMinutes % 60

  const isSourceSiteInList = sourceSiteId && sites.some((site) => site.id === sourceSiteId)

  return (
    <div className="space-y-6">
      {/* Campaign Information */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">Campaign Information</CardTitle>
          <CardDescription className="text-pretty">Basic details about your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Campaign Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter campaign name"
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive flex items-center gap-1.5" role="alert">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deployment_speed" className="text-sm font-medium">
              Deployment Speed
            </Label>
            <Select
              value={String(formData.deployment_speed_minutes)}
              onValueChange={(value) => setFormData({ ...formData, deployment_speed_minutes: Number(value) })}
            >
              <SelectTrigger id="deployment_speed" aria-label="Select deployment speed">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute (Fast)</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour (Recommended)</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="720">12 hours</SelectItem>
                <SelectItem value="1440">24 hours (Slow)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Time between each publication. Slower speeds appear more natural.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Source Article */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">
            Source Article <span className="text-destructive">*</span>
          </CardTitle>
          <CardDescription className="text-pretty">
            Select the manually uploaded article to distribute across your media network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-tight">Manual Articles Only</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Showing the 10 most recent manually uploaded articles. Only user-created content can be used as campaign
                sources.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search articles..."
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              className="pl-9"
              aria-label="Search articles"
            />
          </div>

          {selectedArticle && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold leading-tight text-balance">{selectedArticle.title}</h4>
                    {selectedArticle.excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                        {selectedArticle.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.site_name && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedArticle.site_name}
                        </Badge>
                      )}
                      {selectedArticle.site_language && (
                        <Badge variant="outline" className="text-xs">
                          {selectedArticle.site_language}
                        </Badge>
                      )}
                      {selectedArticle.category && (
                        <Badge variant="outline" className="text-xs">
                          {selectedArticle.category}
                        </Badge>
                      )}
                      <Badge variant="default" className="text-xs">
                        Manual
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <ScrollArea className="h-[300px] rounded-lg border">
            <div className="space-y-2 p-4">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-sm",
                    formData.source_article_id === article.id && "border-primary bg-primary/5",
                  )}
                  onClick={() => {
                    setFormData({ ...formData, source_article_id: article.id })
                    setErrors({ ...errors, source_article_id: "" })
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-medium leading-tight text-balance">{article.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          {article.site_name && (
                            <Badge variant="secondary" className="text-xs">
                              {article.site_name}
                            </Badge>
                          )}
                          {article.site_language && (
                            <Badge variant="outline" className="text-xs">
                              {article.site_language}
                            </Badge>
                          )}
                          {article.published_at && (
                            <Badge variant="outline" className="text-xs">
                              {new Date(article.published_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredArticles.length === 0 && (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">No manual articles found</p>
                    <p className="text-sm text-muted-foreground">
                      Upload articles manually to use them as campaign sources
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {errors.source_article_id && (
            <p className="text-sm text-destructive flex items-center gap-1.5" role="alert">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.source_article_id}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Target Media Sites */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">
            Target Media Sites <span className="text-destructive">*</span>
          </CardTitle>
          <CardDescription className="text-pretty">
            Select sites to distribute to ({formData.target_site_ids?.length || 0} selected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSourceSiteInList && (
            <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
              <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-tight">Source Site Excluded</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The source article's site ({selectedArticle?.site_name}) is automatically excluded from the
                  destination list to prevent duplicate publications.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search sites..."
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                className="pl-9"
                aria-label="Search sites"
              />
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by language">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedIdeology} onValueChange={setSelectedIdeology}>
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by ideology">
                <SelectValue placeholder="All Ideologies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ideologies</SelectItem>
                {ideologies.map((ideology) => (
                  <SelectItem key={ideology} value={ideology}>
                    {ideology}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {filteredSites.length} site{filteredSites.length !== 1 ? "s" : ""} available
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredSites.length === 0}
              className="h-8 bg-transparent"
            >
              {filteredSites.every((site) => formData.target_site_ids?.includes(site.id))
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          <ScrollArea className="h-[400px] rounded-lg border">
            <div className="space-y-2 p-4">
              {filteredSites.map((site) => (
                <div
                  key={site.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:bg-accent/50 hover:border-primary/30",
                    formData.target_site_ids?.includes(site.id) && "border-primary bg-primary/5",
                  )}
                >
                  <Checkbox
                    id={`site-${site.id}`}
                    checked={formData.target_site_ids?.includes(site.id)}
                    onCheckedChange={() => toggleSite(site.id)}
                    className="mt-1"
                    aria-label={`Select ${site.name}`}
                  />
                  <label htmlFor={`site-${site.id}`} className="flex-1 cursor-pointer space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm font-medium leading-tight">{site.name}</p>
                    </div>
                    {site.custom_domain && <p className="text-xs text-muted-foreground">{site.custom_domain}</p>}
                    <div className="flex flex-wrap gap-2">
                      {site.language && (
                        <Badge variant="outline" className="text-xs">
                          {site.language}
                        </Badge>
                      )}
                      {site.country && (
                        <Badge variant="outline" className="text-xs">
                          {site.country}
                        </Badge>
                      )}
                      {site.ideology && (
                        <Badge variant="secondary" className="text-xs">
                          {site.ideology}
                        </Badge>
                      )}
                    </div>
                  </label>
                </div>
              ))}
              {filteredSites.length === 0 && (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">No sites found</p>
                    <p className="text-sm text-muted-foreground">
                      {sourceSiteId
                        ? "Try adjusting your filters or select a different source article"
                        : "Try adjusting your search filters"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {errors.target_site_ids && (
            <p className="text-sm text-destructive flex items-center gap-1.5" role="alert">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.target_site_ids}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Custom Instructions */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">Custom Instructions</CardTitle>
          <CardDescription className="text-pretty">Optional instructions to guide AI adaptation</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.custom_instructions}
            onChange={(e) => setFormData({ ...formData, custom_instructions: e.target.value })}
            placeholder="Add any special instructions for adapting the article to different media sites..."
            rows={6}
            className="resize-none leading-relaxed"
            aria-label="Custom instructions"
          />
        </CardContent>
      </Card>

      {/* Campaign Images */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">Campaign Images</CardTitle>
          <CardDescription className="text-pretty">
            Add images to be randomly used across published articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignImageSelector
            selectedImages={formData.campaign_images || []}
            onImagesChange={(images) => setFormData({ ...formData, campaign_images: images })}
            sourceArticleImage={selectedArticle?.featured_image_url}
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-balance">Summary</CardTitle>
          <CardDescription className="text-pretty">Review your campaign before launching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Campaign Name</p>
              <p className="font-medium leading-tight">{formData.name || "Not set"}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Source Article</p>
              <p className="line-clamp-1 font-medium leading-tight">{selectedArticle?.title || "Not selected"}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Target Sites</p>
              <p className="font-medium">{formData.target_site_ids?.length || 0} sites selected</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Deployment Speed</p>
              <p className="font-medium">
                {formData.deployment_speed_minutes === 1
                  ? "1 minute"
                  : formData.deployment_speed_minutes! < 60
                    ? `${formData.deployment_speed_minutes} minutes`
                    : `${formData.deployment_speed_minutes! / 60} hour${formData.deployment_speed_minutes! / 60 > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {formData.target_site_ids && formData.target_site_ids.length > 0 && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">Estimated Completion Time:</span>
                <span className="text-muted-foreground">
                  {estimatedHours > 0 && `${estimatedHours}h `}
                  {estimatedMinutes > 0 && `${estimatedMinutes}m`}
                  {estimatedHours === 0 && estimatedMinutes === 0 && "Less than 1 minute"}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" onClick={() => router.push("/dashboard/campaigns")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating...
                </>
              ) : (
                "Launch Campaign"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
