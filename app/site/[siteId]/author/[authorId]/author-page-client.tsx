"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import { Mail, Twitter, Calendar, FileText } from "lucide-react"
import type { getSitePublicData } from "@/lib/site-resolver"
import type { getAuthorById } from "@/lib/data/authors"
import type { getPublishedArticlesByAuthor } from "@/lib/data/public-articles"
import { getThemeComponents } from "@/lib/theme-resolver"
import { useDictionary } from "@/lib/i18n"

type Props = {
  site: Awaited<ReturnType<typeof getSitePublicData>>
  author: Awaited<ReturnType<typeof getAuthorById>>
  articles: Awaited<ReturnType<typeof getPublishedArticlesByAuthor>>
}

export default function AuthorPageClient({ site, author, articles }: Props) {
  const { locale, t } = useDictionary()

  if (!site || !author || author.site_id !== Number(site?.id)) {
    notFound()
  }

  const authorName = `${author.first_name} ${author.last_name}`.trim()
  const initials = `${author.first_name?.charAt(0) || ""}${author.last_name?.charAt(0) || ""}`

  const { ArticleGrid } = getThemeComponents(site.theme_layout)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto mb-16 max-w-4xl">
        <div
          className="rounded-2xl border p-8 shadow-sm md:p-12"
          style={{
            background: `color-mix(in srgb, var(--theme-current-primary) 3%, var(--theme-current-surface))`,
            borderColor: "var(--theme-current-border)",
          }}
        >
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Author Avatar */}
            <div
              className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full shadow-lg md:h-40 md:w-40"
              style={{
                border: "4px solid var(--theme-current-background)",
              }}
            >
              {author.avatar_url ? (
                <Image src={author.avatar_url || "/placeholder.svg"} alt={authorName} fill className="object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background: "var(--theme-current-primary)",
                    color: "var(--theme-current-background)",
                  }}
                >
                  <span className="text-4xl font-bold md:text-5xl" style={{ fontFamily: "var(--theme-font-heading)" }}>
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1
                className="mb-3 text-balance text-3xl font-bold tracking-tight md:text-4xl"
                style={{
                  fontFamily: "var(--theme-font-heading)",
                  color: "var(--theme-current-text)",
                }}
              >
                {authorName}
              </h1>

              {author.bio && (
                <p
                  className="mb-6 text-pretty text-lg"
                  style={{
                    lineHeight: "1.7",
                    color: "var(--theme-current-text-muted)",
                    fontFamily: "var(--theme-font-body)",
                  }}
                >
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" style={{ color: "var(--theme-current-primary)" }} />
                  <span className="font-semibold" style={{ color: "var(--theme-current-text)" }}>
                    {articles.length}
                  </span>
                  <span style={{ color: "var(--theme-current-text-muted)" }}>Articles</span>
                </div>
                {author.created_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" style={{ color: "var(--theme-current-primary)" }} />
                    <span style={{ color: "var(--theme-current-text-muted)" }}>
                      Joined{" "}
                      {new Date(author.created_at).toLocaleDateString(locale, { month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300"
                    style={{
                      background: "var(--theme-current-background)",
                      borderColor: "var(--theme-current-border)",
                      color: "var(--theme-current-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--theme-current-primary)"
                      e.currentTarget.style.color = "var(--theme-current-primary)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--theme-current-border)"
                      e.currentTarget.style.color = "var(--theme-current-text)"
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                )}
                {author.twitter_link && (
                  <a
                    href={author.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300"
                    style={{
                      background: "var(--theme-current-background)",
                      borderColor: "var(--theme-current-border)",
                      color: "var(--theme-current-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--theme-current-primary)"
                      e.currentTarget.style.color = "var(--theme-current-primary)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--theme-current-border)"
                      e.currentTarget.style.color = "var(--theme-current-text)"
                    }}
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Articles */}
      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2
            className="text-2xl font-bold tracking-tight md:text-3xl"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-current-text)",
            }}
          >
            Latest Articles
          </h2>
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(to right, var(--theme-current-border), transparent)`,
            }}
          />
        </div>

        {articles.length > 0 ? (
          <ArticleGrid articles={articles} />
        ) : (
          <div
            className="rounded-xl border p-12 text-center"
            style={{
              background: `color-mix(in srgb, var(--theme-current-surface) 30%, transparent)`,
              borderColor: "var(--theme-current-border)",
            }}
          >
            <FileText
              className="mx-auto mb-4 h-16 w-16"
              style={{
                color: `color-mix(in srgb, var(--theme-current-text-muted) 50%, transparent)`,
              }}
            />
            <p className="text-lg font-medium" style={{ color: "var(--theme-current-text-muted)" }}>
              {t("author.noArticles")}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--theme-current-text-muted)" }}>
              {t("author.noArticlesDescription")}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
