"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Trash2, Calendar, Tag, Globe } from "lucide-react"
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
import { toast } from "sonner"
import { deleteArticle } from "@/lib/actions/articles"
import type { ArticleListItem } from "@/lib/types/articles"

type ArticleCardProps = {
  article: ArticleListItem
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteArticle(article.id)

    if (result.success) {
      toast.success("Article deleted successfully")
      setShowDeleteDialog(false)
    } else {
      toast.error(result.error || "Failed to delete article")
      setIsDeleting(false)
    }
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not published"

  const statusColor = {
    published: "bg-success/10 text-success border-success/20",
    draft: "bg-primary/10 text-primary border-primary/20",
    archived: "bg-muted text-muted-foreground border-border",
  }[article.status || "draft"]

  const articleUrl = article.site_custom_domain
    ? `https://${article.site_custom_domain}/article/${article.slug}`
    : `${process.env.NEXT_PUBLIC_APP_URL || ""}/site/${article.site_id}/article/${article.slug}`

  return (
    <>
      <Card className="group overflow-hidden border-border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-6 sm:flex-row">
            {/* Image */}
            {article.featured_image_url ? (
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-muted transition-all duration-200 group-hover:border-primary/30 sm:h-28 sm:w-40">
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.featured_image_alt || article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 160px"
                />
              </div>
            ) : (
              <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-lg border border-border bg-muted transition-all duration-200 group-hover:border-primary/30 sm:h-28 sm:w-40">
                <Globe className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3">
              {/* Title and excerpt */}
              <div className="space-y-1.5">
                <h3 className="line-clamp-2 text-balance font-semibold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                {/* Media Link */}
                {article.site_name && (
                  <Link
                    href={`/dashboard/medias/${article.site_id}`}
                    className="font-medium text-foreground transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {article.site_name}
                  </Link>
                )}

                {/* Source Type & Status */}
                <div className="flex items-center gap-2">
                  {article.source_type && (
                    <Badge variant="secondary" className="text-xs">
                      {article.source_type}
                    </Badge>
                  )}
                  <Badge variant="outline" className={statusColor}>
                    {article.status || "draft"}
                  </Badge>
                </div>

                {/* Country & Language */}
                {article.site_country && (
                  <span className="flex items-center gap-1.5">
                    <span>{article.site_country}</span>
                    {article.site_language && <span className="text-muted-foreground/60">•</span>}
                    {article.site_language && <span>{article.site_language.toUpperCase()}</span>}
                  </span>
                )}

                {/* Author */}
                {article.author_name && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span>{article.author_name}</span>
                  </>
                )}

                {/* Date */}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  {article.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{article.tags.length - 4}</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-start gap-2 sm:flex-col">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 transition-colors duration-200 hover:bg-accent hover:text-primary"
                asChild
                title="View published article"
              >
                <a href={articleUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View article</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                title="Delete article"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete article</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription className="text-pretty">
              Are you sure you want to delete "{article.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
