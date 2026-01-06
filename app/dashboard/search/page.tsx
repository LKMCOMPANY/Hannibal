"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  Globe,
  Filter,
  Loader2,
  ExternalLink,
  MapPin,
  TrendingUp,
  ChevronDown,
  X,
  Building2,
  Tag,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Slider } from "@/components/ui/slider"
import type { ArticleInfo, EventInfo, Language, SortBy } from "@/lib/types/newsapi"

interface FilterState {
  // Basic filters
  searchQuery: string
  language: Language
  sortBy: SortBy
  dateRange: "today" | "week" | "month" | "year" | "custom"
  dateStart?: string
  dateEnd?: string

  // Content filters
  conceptUri?: string
  categoryUri?: string
  keywordLoc: "body,title" | "body" | "title"
  keywordOper: "and" | "or"
  ignoreKeyword?: string

  // Source filters
  sourceUri?: string
  sourceLocationUri?: string
  sourceGroupUri?: string
  authorUri?: string
  ignoreSourceUri?: string
  ignoreSourceLocationUri?: string
  ignoreSourceGroupUri?: string
  ignoreSourceLang?: string

  // Quality filters
  startSourceRankPercentile?: number
  endSourceRankPercentile?: number
  minSentiment?: number
  maxSentiment?: number

  // Article-specific filters
  isDuplicateFilter?: "skipDuplicates" | "keepOnlyDuplicates"
  hasDuplicateFilter?: "skipHasDuplicates" | "keepOnlyHasDuplicates"
  dataType?: string[]

  // Event-specific filters
  minArticlesInEvent?: number
  maxArticlesInEvent?: number
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "events">("articles")
  const [isLoading, setIsLoading] = useState(false)
  const [articles, setArticles] = useState<ArticleInfo[]>([])
  const [events, setEvents] = useState<EventInfo[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    language: "all",
    sortBy: "date",
    dateRange: "week",
    keywordLoc: "body,title",
    keywordOper: "and",
  })

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilter = (key: keyof FilterState) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const activeAdvancedFiltersCount = [
    filters.conceptUri,
    filters.categoryUri,
    filters.sourceUri,
    filters.sourceLocationUri,
    filters.authorUri,
    filters.ignoreKeyword,
    filters.ignoreSourceUri,
    filters.startSourceRankPercentile,
    filters.minSentiment,
    filters.isDuplicateFilter,
    filters.minArticlesInEvent,
  ].filter(Boolean).length

  const handleSearch = async () => {
    if (!filters.searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        query: filters.searchQuery,
        lang: filters.language === "all" ? "" : filters.language,
        sortBy: filters.sortBy,
        dateRange: filters.dateRange,
        page: currentPage.toString(),
        type: activeTab,
        keywordLoc: filters.keywordLoc,
        keywordOper: filters.keywordOper,
      })

      if (filters.dateStart) params.append("dateStart", filters.dateStart)
      if (filters.dateEnd) params.append("dateEnd", filters.dateEnd)
      if (filters.conceptUri) params.append("conceptUri", filters.conceptUri)
      if (filters.categoryUri) params.append("categoryUri", filters.categoryUri)
      if (filters.sourceUri) params.append("sourceUri", filters.sourceUri)
      if (filters.sourceLocationUri) params.append("sourceLocationUri", filters.sourceLocationUri)
      if (filters.sourceGroupUri) params.append("sourceGroupUri", filters.sourceGroupUri)
      if (filters.authorUri) params.append("authorUri", filters.authorUri)
      if (filters.ignoreKeyword) params.append("ignoreKeyword", filters.ignoreKeyword)
      if (filters.ignoreSourceUri) params.append("ignoreSourceUri", filters.ignoreSourceUri)
      if (filters.ignoreSourceLocationUri) params.append("ignoreSourceLocationUri", filters.ignoreSourceLocationUri)
      if (filters.ignoreSourceGroupUri) params.append("ignoreSourceGroupUri", filters.ignoreSourceGroupUri)
      if (filters.ignoreSourceLang) params.append("ignoreSourceLang", filters.ignoreSourceLang)
      if (filters.startSourceRankPercentile !== undefined)
        params.append("startSourceRankPercentile", filters.startSourceRankPercentile.toString())
      if (filters.endSourceRankPercentile !== undefined)
        params.append("endSourceRankPercentile", filters.endSourceRankPercentile.toString())
      if (filters.minSentiment !== undefined) params.append("minSentiment", filters.minSentiment.toString())
      if (filters.maxSentiment !== undefined) params.append("maxSentiment", filters.maxSentiment.toString())
      if (filters.isDuplicateFilter) params.append("isDuplicateFilter", filters.isDuplicateFilter)
      if (filters.hasDuplicateFilter) params.append("hasDuplicateFilter", filters.hasDuplicateFilter)
      if (filters.dataType) params.append("dataType", filters.dataType.join(","))
      if (filters.minArticlesInEvent !== undefined)
        params.append("minArticlesInEvent", filters.minArticlesInEvent.toString())
      if (filters.maxArticlesInEvent !== undefined)
        params.append("maxArticlesInEvent", filters.maxArticlesInEvent.toString())

      const response = await fetch(`/api/newsapi/search?${params}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error.message)
        return
      }

      if (activeTab === "articles" && data.data?.articles) {
        setArticles(data.data.articles.results || [])
        setTotalResults(data.data.articles.totalResults || 0)
      } else if (activeTab === "events" && data.data?.events) {
        setEvents(data.data.events.results || [])
        setTotalResults(data.data.events.totalResults || 0)
      }
    } catch (err) {
      setError("Failed to perform search. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setArticles([])
    setEvents([])
    setTotalResults(0)
    setCurrentPage(1)
  }, [activeTab])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="typography-h1 text-balance">News Search</h1>
          <p className="typography-muted text-pretty">Search for articles and events from global news sources</p>
        </div>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Parameters
          </CardTitle>
          <CardDescription>Configure your search criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <div className="flex gap-2">
              <Input
                id="search-query"
                placeholder="Enter keywords, topics, or concepts..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading || !filters.searchQuery.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Basic Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </Label>
              <Select value={filters.language} onValueChange={(value) => updateFilter("language", value as Language)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="spa">Spanish</SelectItem>
                  <SelectItem value="fra">French</SelectItem>
                  <SelectItem value="deu">German</SelectItem>
                  <SelectItem value="ita">Italian</SelectItem>
                  <SelectItem value="por">Portuguese</SelectItem>
                  <SelectItem value="rus">Russian</SelectItem>
                  <SelectItem value="ara">Arabic</SelectItem>
                  <SelectItem value="zho">Chinese</SelectItem>
                  <SelectItem value="jpn">Japanese</SelectItem>
                  <SelectItem value="kor">Korean</SelectItem>
                  <SelectItem value="hin">Hindi</SelectItem>
                  <SelectItem value="tur">Turkish</SelectItem>
                  <SelectItem value="pol">Polish</SelectItem>
                  <SelectItem value="nld">Dutch</SelectItem>
                  <SelectItem value="swe">Swedish</SelectItem>
                  <SelectItem value="dan">Danish</SelectItem>
                  <SelectItem value="nor">Norwegian</SelectItem>
                  <SelectItem value="fin">Finnish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value as any)}>
                <SelectTrigger id="date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-by" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Sort By
              </Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value as SortBy)}>
                <SelectTrigger id="sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rel">Relevance</SelectItem>
                  <SelectItem value="sourceImportance">Source Importance</SelectItem>
                  <SelectItem value="socialScore">Social Score</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword-location">Keyword Location</Label>
              <Select value={filters.keywordLoc} onValueChange={(value) => updateFilter("keywordLoc", value as any)}>
                <SelectTrigger id="keyword-location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="body,title">Title & Body</SelectItem>
                  <SelectItem value="title">Title Only</SelectItem>
                  <SelectItem value="body">Body Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Date Range */}
          {filters.dateRange === "custom" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date-start">Start Date</Label>
                <Input
                  id="date-start"
                  type="date"
                  value={filters.dateStart || ""}
                  onChange={(e) => updateFilter("dateStart", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-end">End Date</Label>
                <Input
                  id="date-end"
                  type="date"
                  value={filters.dateEnd || ""}
                  onChange={(e) => updateFilter("dateEnd", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Sparkles className="mr-2 h-4 w-4" />
                Advanced Filters
                {activeAdvancedFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeAdvancedFiltersCount}
                  </Badge>
                )}
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-6">
              {/* Content Filters */}
              <div className="space-y-4">
                <h4 className="typography-h4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Content Filters
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="concept-uri">Concept URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="concept-uri"
                        placeholder="e.g., http://en.wikipedia.org/wiki/..."
                        value={filters.conceptUri || ""}
                        onChange={(e) => updateFilter("conceptUri", e.target.value)}
                      />
                      {filters.conceptUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("conceptUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-uri">Category URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="category-uri"
                        placeholder="e.g., news/Business"
                        value={filters.categoryUri || ""}
                        onChange={(e) => updateFilter("categoryUri", e.target.value)}
                      />
                      {filters.categoryUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("categoryUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ignore-keyword">Ignore Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ignore-keyword"
                        placeholder="Keywords to exclude..."
                        value={filters.ignoreKeyword || ""}
                        onChange={(e) => updateFilter("ignoreKeyword", e.target.value)}
                      />
                      {filters.ignoreKeyword && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("ignoreKeyword")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyword-operator">Keyword Operator</Label>
                    <Select
                      value={filters.keywordOper}
                      onValueChange={(value) => updateFilter("keywordOper", value as any)}
                    >
                      <SelectTrigger id="keyword-operator">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="and">AND (all keywords)</SelectItem>
                        <SelectItem value="or">OR (any keyword)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Source Filters */}
              <div className="space-y-4">
                <h4 className="typography-h4 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Source Filters
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="source-uri">Source URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="source-uri"
                        placeholder="e.g., bbc.co.uk"
                        value={filters.sourceUri || ""}
                        onChange={(e) => updateFilter("sourceUri", e.target.value)}
                      />
                      {filters.sourceUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("sourceUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-location">Source Location URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="source-location"
                        placeholder="e.g., http://en.wikipedia.org/wiki/United_States"
                        value={filters.sourceLocationUri || ""}
                        onChange={(e) => updateFilter("sourceLocationUri", e.target.value)}
                      />
                      {filters.sourceLocationUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("sourceLocationUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author-uri">Author URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="author-uri"
                        placeholder="Author identifier..."
                        value={filters.authorUri || ""}
                        onChange={(e) => updateFilter("authorUri", e.target.value)}
                      />
                      {filters.authorUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("authorUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ignore-source">Ignore Source URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ignore-source"
                        placeholder="Sources to exclude..."
                        value={filters.ignoreSourceUri || ""}
                        onChange={(e) => updateFilter("ignoreSourceUri", e.target.value)}
                      />
                      {filters.ignoreSourceUri && (
                        <Button variant="ghost" size="icon" onClick={() => clearFilter("ignoreSourceUri")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Filters */}
              <div className="space-y-4">
                <h4 className="typography-h4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Quality Filters
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Source Rank Percentile ({filters.startSourceRankPercentile || 0}% -{" "}
                      {filters.endSourceRankPercentile || 100}%)
                    </Label>
                    <div className="flex gap-4 items-center">
                      <span className="text-sm text-muted-foreground w-12">Min</span>
                      <Slider
                        value={[filters.startSourceRankPercentile || 0]}
                        onValueChange={([value]) => updateFilter("startSourceRankPercentile", value)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">Max</span>
                      <Slider
                        value={[filters.endSourceRankPercentile || 100]}
                        onValueChange={([value]) => updateFilter("endSourceRankPercentile", value)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Sentiment Range ({(filters.minSentiment || -1).toFixed(1)} to{" "}
                      {(filters.maxSentiment || 1).toFixed(1)})
                    </Label>
                    <div className="flex gap-4 items-center">
                      <span className="text-sm text-muted-foreground w-12">Min</span>
                      <Slider
                        value={[((filters.minSentiment || -1) + 1) * 50]}
                        onValueChange={([value]) => updateFilter("minSentiment", value / 50 - 1)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">Max</span>
                      <Slider
                        value={[((filters.maxSentiment || 1) + 1) * 50]}
                        onValueChange={([value]) => updateFilter("maxSentiment", value / 50 - 1)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Article-Specific Filters */}
              {activeTab === "articles" && (
                <div className="space-y-4">
                  <h4 className="typography-h4">Article Filters</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duplicate-filter">Duplicate Filter</Label>
                      <Select
                        value={filters.isDuplicateFilter || "none"}
                        onValueChange={(value) =>
                          updateFilter("isDuplicateFilter", value === "none" ? undefined : (value as any))
                        }
                      >
                        <SelectTrigger id="duplicate-filter">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Filter</SelectItem>
                          <SelectItem value="skipDuplicates">Skip Duplicates</SelectItem>
                          <SelectItem value="keepOnlyDuplicates">Only Duplicates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="has-duplicate-filter">Has Duplicate Filter</Label>
                      <Select
                        value={filters.hasDuplicateFilter || "none"}
                        onValueChange={(value) =>
                          updateFilter("hasDuplicateFilter", value === "none" ? undefined : (value as any))
                        }
                      >
                        <SelectTrigger id="has-duplicate-filter">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Filter</SelectItem>
                          <SelectItem value="skipHasDuplicates">Skip Has Duplicates</SelectItem>
                          <SelectItem value="keepOnlyHasDuplicates">Only Has Duplicates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Event-Specific Filters */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <h4 className="typography-h4">Event Filters</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-articles">Minimum Articles in Event</Label>
                      <Input
                        id="min-articles"
                        type="number"
                        min="1"
                        placeholder="e.g., 5"
                        value={filters.minArticlesInEvent || ""}
                        onChange={(e) =>
                          updateFilter(
                            "minArticlesInEvent",
                            e.target.value ? Number.parseInt(e.target.value) : undefined,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-articles">Maximum Articles in Event</Label>
                      <Input
                        id="max-articles"
                        type="number"
                        min="1"
                        placeholder="e.g., 100"
                        value={filters.maxArticlesInEvent || ""}
                        onChange={(e) =>
                          updateFilter(
                            "maxArticlesInEvent",
                            e.target.value ? Number.parseInt(e.target.value) : undefined,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "articles" | "events")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          {totalResults > 0 && (
            <p className="text-sm text-muted-foreground">{totalResults.toLocaleString()} results found</p>
          )}
        </div>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          {articles.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No articles found. Try a different search query.</p>
              </CardContent>
            </Card>
          )}

          {articles.map((article) => (
            <Card key={article.uri} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="text-xl leading-tight">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{article.source.title}</span>
                      <span>•</span>
                      <time dateTime={article.dateTime}>{new Date(article.dateTime).toLocaleDateString()}</time>
                      <span>•</span>
                      <Badge variant="secondary">{article.lang.toUpperCase()}</Badge>
                    </div>
                  </div>
                  {article.image && (
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-24 w-24 shrink-0 rounded-md object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3 text-sm text-foreground/80">{article.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {article.sentiment !== undefined && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Sentiment: {article.sentiment > 0 ? "Positive" : article.sentiment < 0 ? "Negative" : "Neutral"}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      Read More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {events.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events found. Try a different search query.</p>
              </CardContent>
            </Card>
          )}

          {events.map((event) => (
            <Card key={event.uri} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="text-xl leading-tight">
                      {event.title.eng || Object.values(event.title)[0]}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <time dateTime={event.eventDate}>{new Date(event.eventDate).toLocaleDateString()}</time>
                      {event.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location.label.eng || Object.values(event.location.label)[0]}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <Badge variant="secondary">{event.totalArticleCount} articles</Badge>
                    </div>
                  </div>
                  {event.images && event.images.length > 0 && (
                    <img
                      src={event.images[0] || "/placeholder.svg"}
                      alt={event.title.eng || "Event"}
                      className="h-24 w-24 shrink-0 rounded-md object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3 text-sm text-foreground/80">
                  {event.summary.eng || Object.values(event.summary)[0]}
                </p>
                {event.categories && event.categories.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {event.categories.slice(0, 3).map((category) => (
                      <Badge key={category.uri} variant="outline">
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {event.sentiment !== undefined && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Sentiment: {event.sentiment > 0 ? "Positive" : event.sentiment < 0 ? "Negative" : "Neutral"}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalResults > 20 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1))
              handleSearch()
            }}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalResults / 20)}
          </span>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPage((p) => p + 1)
              handleSearch()
            }}
            disabled={currentPage >= Math.ceil(totalResults / 20) || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
