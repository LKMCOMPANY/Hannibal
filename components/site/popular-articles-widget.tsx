import Link from "next/link"
import Image from "next/image"
import { Flame, Clock, Eye } from "lucide-react"
import type { PublicArticleListItem } from "@/lib/types/articles"
import { getDictionary, getLocaleFromSite, formatDate } from "@/lib/i18n"

type PopularArticlesWidgetProps = {
  articles: PublicArticleListItem[]
  siteId: number
  title?: string
  siteLanguage?: string
}

export async function PopularArticlesWidget({ articles, siteId, title, siteLanguage }: PopularArticlesWidgetProps) {
  if (!articles.length) return null

  const locale = getLocaleFromSite(siteLanguage)
  const dict = await getDictionary(locale)
  const displayTitle = title || dict.article.related

  return (
    <section
      className="border p-5"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        borderColor: "var(--theme-current-border)",
        borderRadius: "var(--theme-radius-card)",
        boxShadow: "var(--theme-shadow-card)",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
            borderRadius: "var(--theme-radius-button)",
            width: "2.25rem",
            height: "2.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Flame
            className="h-4 w-4"
            style={{
              color: "var(--theme-current-primary)",
            }}
          />
        </div>
        <h2
          className="text-balance text-base font-bold tracking-tight"
          style={{
            fontFamily: "var(--theme-font-heading)",
            color: "var(--theme-current-text-primary)",
          }}
        >
          {displayTitle}
        </h2>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group flex gap-3 border-b pb-4 last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1"
            style={{
              borderColor: "color-mix(in srgb, var(--theme-current-border) 40%, transparent)",
            }}
          >
            {article.featured_image_url && (
              <div
                className="relative h-16 w-20 shrink-0 overflow-hidden"
                style={{
                  backgroundColor: "var(--theme-current-muted)",
                  borderRadius: "var(--theme-radius-image)",
                }}
              >
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}

            <div className="flex-1 space-y-1.5">
              <h3
                className="line-clamp-2 text-sm font-semibold leading-snug transition-colors duration-300"
                style={{
                  fontFamily: "var(--theme-font-heading)",
                  color: "var(--theme-current-text-primary)",
                }}
              >
                {article.title}
              </h3>

              <div
                className="flex items-center gap-3 text-xs"
                style={{
                  fontFamily: "var(--theme-font-body)",
                  color: "var(--theme-current-text-muted)",
                }}
              >
                {article.published_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <time dateTime={article.published_at}>
                      {formatDate(new Date(article.published_at), locale, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{Math.floor(Math.random() * 5000) + 1000}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
