"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, ImageIcon, Upload, Search, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useImageSearch } from "@/hooks/use-image-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

type CampaignImageSelectorProps = {
  selectedImages: string[]
  onImagesChange: (images: string[]) => void
  sourceArticleImage?: string | null
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export function CampaignImageSelector({
  selectedImages,
  onImagesChange,
  sourceArticleImage,
}: CampaignImageSelectorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"upload" | "search">("upload")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { images: searchResults, isLoading, error, hasMore, search, reset } = useImageSearch()

  useEffect(() => {
    if (sourceArticleImage && !selectedImages.includes(sourceArticleImage)) {
      onImagesChange([sourceArticleImage, ...selectedImages])
    }
  }, [sourceArticleImage])

  const allImages = selectedImages

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name}. Maximum size is 10MB.`
    }
    return null
  }

  const uploadFilesToBlob = async (files: File[]): Promise<void> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Add uploaded URLs to selected images
      const newImages = uploadedUrls.filter((url) => !allImages.includes(url))
      if (newImages.length > 0) {
        onImagesChange([...allImages, ...newImages])
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload images")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      setUploadError(null)

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) {
        setUploadError("No valid image files found. Please drop image files only.")
        return
      }

      const validationErrors: string[] = []
      const validFiles: File[] = []

      imageFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          validationErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (validationErrors.length > 0) {
        setUploadError(validationErrors.join(" "))
      }

      if (validFiles.length > 0) {
        await uploadFilesToBlob(validFiles)
      }
    },
    [allImages, onImagesChange],
  )

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setUploadError(null)
      const files = Array.from(e.target.files || [])
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) {
        setUploadError("No valid image files selected.")
        return
      }

      const validationErrors: string[] = []
      const validFiles: File[] = []

      imageFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          validationErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (validationErrors.length > 0) {
        setUploadError(validationErrors.join(" "))
      }

      if (validFiles.length > 0) {
        await uploadFilesToBlob(validFiles)
      }

      // Reset input value to allow re-uploading the same file
      e.target.value = ""
    },
    [allImages, onImagesChange],
  )

  const removeImage = useCallback(
    (imageUrl: string) => {
      onImagesChange(allImages.filter((url) => url !== imageUrl))
    },
    [allImages, onImagesChange],
  )

  const toggleImageSelection = useCallback(
    (imageUrl: string) => {
      if (selectedImages.includes(imageUrl)) {
        onImagesChange(selectedImages.filter((url) => url !== imageUrl))
      } else {
        onImagesChange([...selectedImages, imageUrl])
      }
    },
    [selectedImages, onImagesChange],
  )

  const addImageFromSearch = useCallback(
    async (imageUrl: string) => {
      if (allImages.includes(imageUrl)) {
        return
      }

      setIsUploading(true)
      setUploadError(null)

      try {
        // Download and upload to Blob
        const response = await fetch("/api/upload/image-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: imageUrl }),
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()

        // Add the Blob URL to selected images
        if (!allImages.includes(data.url)) {
          onImagesChange([...allImages, data.url])
        }
      } catch (error) {
        console.error("[v0] Failed to add image from search:", error)
        setUploadError(error instanceof Error ? error.message : "Failed to add image")
      } finally {
        setIsUploading(false)
      }
    },
    [allImages, onImagesChange],
  )

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (searchQuery.trim()) {
        await search(searchQuery, 1)
      }
    },
    [searchQuery, search],
  )

  useEffect(() => {
    if (activeTab === "upload") {
      reset()
      setSearchQuery("")
    } else {
      setUploadError(null)
    }
  }, [activeTab, reset])

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "search")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Search Images
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "opacity-50 pointer-events-none",
            )}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileInput}
              className="sr-only"
              aria-label="Upload images"
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{isUploading ? "Uploading..." : "Drag and drop images here"}</p>
                <p className="text-xs text-muted-foreground">
                  {isUploading ? "Please wait" : "or click to browse files"}
                </p>
                <p className="text-xs text-muted-foreground">Max 10MB • JPEG, PNG, WebP, GIF</p>
              </div>
              {!isUploading && (
                <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent">
                  <ImageIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  Select Images
                </Button>
              )}
            </label>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search for images from news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              minLength={2}
              maxLength={500}
              disabled={isUploading}
            />
            <Button
              type="submit"
              disabled={isLoading || isUploading || !searchQuery.trim() || searchQuery.trim().length < 2}
            >
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
          </form>

          {/* Error Display */}
          {(error || uploadError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Uploading Indicator */}
          {isUploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Uploading image to storage...</AlertDescription>
            </Alert>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Search Results ({searchResults.length})</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {searchResults.map((result, index) => {
                  const isAlreadyAdded = allImages.includes(result.url)

                  return (
                    <Card
                      key={`${result.url}-${index}`}
                      className={cn(
                        "group relative overflow-hidden transition-all duration-200 hover:shadow-md",
                        isAlreadyAdded && "opacity-50",
                      )}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={result.url || "/placeholder.svg"}
                            alt={result.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            unoptimized={true}
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                          {/* Add Button */}
                          {!isAlreadyAdded && (
                            <Button
                              type="button"
                              size="sm"
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => addImageFromSearch(result.url)}
                              disabled={isUploading}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Add
                            </Button>
                          )}
                          {/* Already Added Badge */}
                          {isAlreadyAdded && (
                            <Badge
                              variant="secondary"
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                              Added
                            </Badge>
                          )}
                          {/* Source Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-xs text-white line-clamp-1" title={result.title}>
                              {result.title}
                            </p>
                            <p className="text-xs text-white/70">{result.source}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Load More */}
              {hasMore && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => search(searchQuery, Math.floor(searchResults.length / 20) + 1)}
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading More
                    </>
                  ) : (
                    "Load More Images"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && searchResults.length === 0 && searchQuery && !error && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Search className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No images found</p>
              <p className="text-xs text-muted-foreground">Try a different search query</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Grid */}
      {allImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected Images ({selectedImages.length}/{allImages.length})
            </p>
            {allImages.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onImagesChange([])}
                className="h-8 text-xs"
                disabled={isUploading}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allImages.map((imageUrl, index) => {
              const isSourceImage = imageUrl === sourceArticleImage
              const isSelected = selectedImages.includes(imageUrl)

              return (
                <Card
                  key={`${imageUrl}-${index}`}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-200 hover:shadow-md",
                    isSelected && "ring-2 ring-primary ring-offset-2",
                  )}
                >
                  <CardContent className="p-0">
                    <div
                      className="relative aspect-square cursor-pointer"
                      onClick={() => !isUploading && toggleImageSelection(imageUrl)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (!isUploading && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault()
                          toggleImageSelection(imageUrl)
                        }
                      }}
                      aria-label={`${isSelected ? "Deselect" : "Select"} image ${index + 1}`}
                    >
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Campaign image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      {/* Overlay */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
                          isSelected && "opacity-100 bg-primary/20",
                        )}
                      />
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(imageUrl)
                        }}
                        disabled={isUploading}
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                      {/* Source Badge */}
                      {isSourceImage && (
                        <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                          Source
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Click on images to select/deselect them. Selected images will be randomly used for published articles.
          </p>
        </div>
      )}
    </div>
  )
}
