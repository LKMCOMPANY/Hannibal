"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Globe, ExternalLink, Calendar, Trash2, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { useState } from "react"
import { deleteArticle } from "@/lib/actions/articles"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { CampaignPublicationExtended } from "@/lib/types/campaigns"

type CampaignPublicationsProps = {
  publications: CampaignPublicationExtended[]
}

export function CampaignPublications({ publications }: CampaignPublicationsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [publicationToDelete, setPublicationToDelete] = useState<CampaignPublicationExtended | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (publication: CampaignPublicationExtended) => {
    setPublicationToDelete(publication)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!publicationToDelete?.generated_article_id) return

    setIsDeleting(true)
    try {
      const result = await deleteArticle(publicationToDelete.generated_article_id)
      if (result.success) {
        toast.success("Article deleted successfully")
        setShowDeleteDialog(false)
        setPublicationToDelete(null)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete article")
      }
    } catch (error) {
      toast.error("Failed to delete article")
    } finally {
      setIsDeleting(false)
    }
  }

  if (publications.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <Globe className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">No publications found</p>
          <p className="mt-1 text-sm text-muted-foreground">Publications will appear here once the campaign runs</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge
            variant="outline"
            className="gap-1.5 border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-500"
          >
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Published
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="gap-1.5 border-destructive/20 bg-destructive/10 text-destructive">
            <XCircle className="h-3 w-3" aria-hidden="true" />
            Failed
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="gap-1.5 border-primary/20 bg-primary/10 text-primary">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Processing
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="gap-1.5 border-border bg-muted text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            Pending
          </Badge>
        )
    }
  }

  const getArticlePublicUrl = (pub: CampaignPublicationExtended) => {
    if (!pub.generated_article_id || !pub.generated_article_slug) return null

    const customDomain = pub.target_site_custom_domain
    const siteId = pub.target_site_id
    const slug = pub.generated_article_slug

    return customDomain
      ? `https://${customDomain}/article/${slug}`
      : `${process.env.NEXT_PUBLIC_APP_URL || ""}/site/${siteId}/article/${slug}`
  }

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {publications.length} {publications.length === 1 ? "publication" : "publications"} found
        </p>
        <div className="space-y-4">
          {publications.map((pub) => {
            const publicUrl = getArticlePublicUrl(pub)

            return (
              <Card
                key={pub.id}
                className="group overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start">
                    {/* Logo/Thumbnail */}
                    <div className="flex-shrink-0">
                      {pub.generated_article_image ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted transition-all group-hover:border-primary/30">
                          <Image
                            src={pub.generated_article_image || "/placeholder.svg"}
                            alt={pub.generated_article_image_alt || pub.generated_article_title || "Article image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted transition-all group-hover:border-primary/30">
                          <Globe className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-balance text-lg font-semibold leading-tight">
                              {pub.generated_article_title || "Untitled Article"}
                            </h3>
                            {getStatusBadge(pub.status)}
                          </div>
                          {publicUrl && pub.status === "published" && (
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              {pub.target_site_custom_domain || `Site ${pub.target_site_id}`}
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}
                        </div>

                        {pub.generated_article_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteClick(pub)}
                            title="Delete article"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Delete
                          </Button>
                        )}
                      </div>

                      {pub.generated_article_excerpt && (
                        <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {pub.generated_article_excerpt}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-4 w-4" aria-hidden="true" />
                          <span>{pub.target_site_name || "Unknown Site"}</span>
                        </div>
                        {pub.generated_article_language && (
                          <Badge variant="secondary" className="text-xs">
                            {pub.generated_article_language.toUpperCase()}
                          </Badge>
                        )}
                        {pub.generated_article_category && (
                          <Badge variant="secondary" className="text-xs">
                            {pub.generated_article_category}
                          </Badge>
                        )}
                        {pub.generated_article_status && (
                          <Badge variant="secondary" className="text-xs">
                            {pub.generated_article_status}
                          </Badge>
                        )}
                      </div>

                      {/* Error message */}
                      {pub.error_message && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                          <p className="text-sm leading-relaxed text-destructive">{pub.error_message}</p>
                        </div>
                      )}

                      {/* Date info */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {pub.published_at && <span>Published {format(new Date(pub.published_at), "PPp")}</span>}
                          {!pub.published_at && <span>Created {format(new Date(pub.created_at), "PPp")}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription className="text-pretty">
              Are you sure you want to delete "{publicationToDelete?.generated_article_title}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
