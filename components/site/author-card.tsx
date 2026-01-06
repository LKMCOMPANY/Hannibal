"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Twitter } from "lucide-react"
import type { Author } from "@/lib/types/authors"
import { useDictionary } from "@/lib/i18n"

type AuthorCardProps = {
  author: Author
  articleCount?: number
  siteId: number
}

export function AuthorCard({ author, articleCount = 0, siteId }: AuthorCardProps) {
  const { t } = useDictionary()
  const authorName = `${author.first_name} ${author.last_name}`.trim()
  const initials = `${author.first_name?.charAt(0) || ""}${author.last_name?.charAt(0) || ""}`

  return (
    <Link
      href={`/author/${author.id}`}
      className="group block p-6"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        border: "1px solid color-mix(in srgb, var(--theme-current-primary) 15%, transparent)",
        borderRadius: "var(--theme-radius-card)",
        boxShadow: "var(--theme-shadow-card)",
        transition: "var(--theme-transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--theme-current-primary) 50%, transparent)"
        e.currentTarget.style.boxShadow = "var(--theme-shadow-card-hover)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--theme-current-primary) 15%, transparent)"
        e.currentTarget.style.boxShadow = "var(--theme-shadow-card)"
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
            borderRadius: "var(--theme-radius-button)",
            width: "4rem",
            height: "4rem",
          }}
        >
          {author.avatar_url ? (
            <Image src={author.avatar_url || "/placeholder.svg"} alt={authorName} fill className="object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xl font-bold"
              style={{
                color: "var(--theme-current-primary)",
                fontFamily: "var(--theme-font-heading)",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 space-y-2">
          <h3
            className="text-lg font-bold tracking-tight transition-colors duration-300"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-current-text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--theme-current-primary)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--theme-current-text-primary)"
            }}
          >
            {authorName}
          </h3>

          {author.bio && (
            <p
              className="line-clamp-2 text-sm"
              style={{
                lineHeight: "1.6",
                color: "var(--theme-current-text-secondary)",
                fontFamily: "var(--theme-font-body)",
              }}
            >
              {author.bio}
            </p>
          )}

          {/* Stats and Social */}
          <div className="flex items-center gap-4 pt-2">
            <span
              className="text-xs font-medium"
              style={{
                color: "var(--theme-current-text-secondary)",
                fontFamily: "var(--theme-font-body)",
              }}
            >
              {articleCount === 1
                ? t("author.articleCount", { count: articleCount.toString() })
                : t("author.articleCountPlural", { count: articleCount.toString() })}
            </span>

            <div className="flex items-center gap-2">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="transition-colors duration-300"
                  style={{ color: "var(--theme-current-text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-primary)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                  }}
                  aria-label={`Email ${authorName}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {author.twitter_link && (
                <a
                  href={author.twitter_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="transition-colors duration-300"
                  style={{ color: "var(--theme-current-text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-primary)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                  }}
                  aria-label={`${authorName} on Twitter`}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
