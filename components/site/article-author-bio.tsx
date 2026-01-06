import Image from "next/image"
import { Mail } from "lucide-react"
import { getDictionary, getLocaleFromSite } from "@/lib/i18n"

type Props = {
  authorName: string
  authorBio?: string
  authorEmail?: string
  authorAvatar?: string
  siteId: number
  siteLanguage?: string
}

export async function ArticleAuthorBio({
  authorName,
  authorBio,
  authorEmail,
  authorAvatar,
  siteId,
  siteLanguage,
}: Props) {
  if (!authorBio && !authorEmail) return null

  const locale = getLocaleFromSite(siteLanguage)
  const dict = await getDictionary(locale)

  return (
    <div
      className="mt-12 border p-6"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        borderColor: "var(--theme-current-border)",
        borderRadius: "var(--theme-radius-card)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex shrink-0 items-center justify-center text-xl font-bold"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 15%, transparent)",
            color: "var(--theme-current-primary)",
            borderRadius: "var(--theme-radius-button)",
            width: "4rem",
            height: "4rem",
          }}
        >
          {authorAvatar ? (
            <Image
              src={authorAvatar || "/placeholder.svg"}
              alt={authorName}
              width={64}
              height={64}
              style={{
                borderRadius: "var(--theme-radius-button)",
                objectFit: "cover",
              }}
            />
          ) : (
            authorName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h3
            className="font-semibold"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-current-text-primary)",
            }}
          >
            {authorName}
          </h3>

          {authorBio && (
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-secondary)",
              }}
            >
              {authorBio}
            </p>
          )}

          {authorEmail && (
            <a
              href={`mailto:${authorEmail}`}
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--theme-current-primary)]"
              style={{
                fontFamily: "var(--theme-font-body)",
                color: "var(--theme-current-text-secondary)",
              }}
            >
              <Mail className="h-4 w-4" />
              {dict.article.contactAuthor}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
