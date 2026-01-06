"use client"

import Image from "next/image"
import type { PublicArticle } from "@/lib/data/public-articles"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Printer } from "lucide-react"
import { ArticleShare } from "./article-share"
import { ArticleActions } from "./article-actions"
import { FontSizeControl } from "./font-size-control"
import { Button } from "@/components/ui/button"
import { useDictionary, formatRelativeTime } from "@/lib/i18n"

type Props = {
  article: PublicArticle
  siteUrl: string
}

export function ArticleHeader({ article, siteUrl }: Props) {
  const { t, locale } = useDictionary()

  // Calculate reading time (average 200 words per minute)
  const wordCount = article.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  const articleUrl = `${siteUrl}/article/${article.slug}`

  return (
    <header className="mb-12">
      {article.category && (
        <Badge
          variant="secondary"
          className="mb-4"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 15%, transparent)",
            color: "var(--theme-current-primary)",
            borderRadius: "var(--theme-radius-button)",
          }}
        >
          {t(`category.${article.category.toLowerCase().replace(/\s+/g, "")}`, { fallback: article.category })}
        </Badge>
      )}

      <h1 className="typography-h1 mb-6 text-balance">{article.title}</h1>

      {article.excerpt && <p className="typography-lead mb-6 text-pretty">{article.excerpt}</p>}

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {article.author_name && (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center text-sm font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 15%, transparent)",
                color: "var(--theme-current-primary)",
                borderRadius: "var(--theme-radius-button)",
                width: "2.5rem",
                height: "2.5rem",
              }}
            >
              {article.author_name.charAt(0).toUpperCase()}
            </div>
            <span
              className="font-medium"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-primary)",
              }}
            >
              {article.author_name}
            </span>
          </div>
        )}

        {article.published_at && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <time
              dateTime={article.published_at.toISOString()}
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-secondary)",
              }}
            >
              {formatRelativeTime(article.published_at, locale)}
            </time>
          </>
        )}

        <Separator orientation="vertical" className="h-4" />
        <div
          className="flex items-center gap-1.5"
          style={{
            fontFamily: "var(--theme-font-body)",
            color: "var(--theme-current-text-secondary)",
          }}
        >
          <Clock className="h-4 w-4" />
          <span>{t("time.minRead", { count: readingTime.toString() })}</span>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ArticleShare title={article.title} url={articleUrl} />
        <ArticleActions articleId={article.id} articleSlug={article.slug} />
        <FontSizeControl />
        <Button
          variant="ghost"
          size="icon"
          className="no-print"
          style={{
            borderRadius: "var(--theme-radius-button)",
            width: "2.25rem",
            height: "2.25rem",
          }}
          onClick={() => window.print()}
          aria-label={t("action.print")}
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      {article.featured_image_url && (
        <figure className="mb-8">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "var(--theme-radius-image)",
            }}
          >
            <Image
              src={article.featured_image_url || "/placeholder.svg"}
              alt={article.featured_image_alt || article.title}
              width={1200}
              height={630}
              className="w-full object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          {article.featured_image_caption && (
            <figcaption
              className="mt-3 text-center text-sm italic"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-muted)",
              }}
            >
              {article.featured_image_caption}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  )
}
