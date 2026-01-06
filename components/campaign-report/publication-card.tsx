import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, FileText, ExternalLink, Clock } from "lucide-react"
import { XLogo } from "@/components/site/icons/x-logo"

type PublicationCardProps = {
  publication: any
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const isPending = !publication.generated_article_id
  const articleUrl = publication.custom_domain && publication.article_slug
    ? `https://${publication.custom_domain}/article/${publication.article_slug}`
    : null

  const twitterUrl = publication.twitter_handle
    ? `https://x.com/${publication.twitter_handle}`
    : null

  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        <div className="grid gap-4 p-4 md:grid-cols-3 md:gap-6 md:p-6">
          {/* MEDIA (30%) */}
          <div className="space-y-3 md:border-r md:border-border md:pr-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{publication.site_name}</p>
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    @{publication.twitter_handle}
                  </a>
                )}
              </div>
            </div>
            {publication.custom_domain && (
              <a
                href={`https://${publication.custom_domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {publication.custom_domain}
              </a>
            )}
            <Badge variant="secondary" className={isPending ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" : "bg-green-500/10 text-green-700 dark:text-green-400"}>
              {isPending ? "Processing" : "Published"}
            </Badge>
          </div>

          {/* ARTICLE (40%) */}
          <div className="space-y-3 md:border-r md:border-border md:pr-6">
            {isPending ? (
              <div className="flex min-h-[100px] items-center justify-center rounded-md border border-dashed bg-muted/30">
                <div className="text-center">
                  <Clock className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">Article being generated...</p>
                </div>
              </div>
            ) : (
              <>
                {publication.featured_image_url && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-md border">
                    <Image
                      src={publication.featured_image_url}
                      alt={publication.article_title || "Article"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="line-clamp-2 text-sm font-semibold">{publication.article_title}</p>
                  {articleUrl && (
                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <FileText className="h-3 w-3" />
                      Read article
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* TWEET (30%) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
                <XLogo className="h-3 w-3 text-background" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{publication.site_name}</p>
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    @{publication.twitter_handle}
                  </a>
                )}
              </div>
            </div>
            {isPending ? (
              <div className="rounded-md border border-dashed bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Tweet will be posted after article</p>
              </div>
            ) : publication.x_post ? (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-foreground">{publication.x_post}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No tweet scheduled</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
