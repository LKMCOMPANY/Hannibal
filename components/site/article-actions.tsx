"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useDictionary } from "@/lib/i18n"

type Props = {
  articleId: number
  articleSlug: string
}

export function ArticleActions({ articleId, articleSlug }: Props) {
  const { t } = useDictionary()

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Check if article is saved in localStorage
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]")
    setIsSaved(savedArticles.includes(articleId))
  }, [articleId])

  const toggleSave = () => {
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]")

    if (isSaved) {
      const filtered = savedArticles.filter((id: number) => id !== articleId)
      localStorage.setItem("savedArticles", JSON.stringify(filtered))
      setIsSaved(false)
    } else {
      savedArticles.push(articleId)
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles))
      setIsSaved(true)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleSave}
      className="gap-2 bg-transparent"
      style={{
        borderColor: "var(--theme-current-border)",
        color: isSaved ? "var(--theme-current-primary)" : "var(--theme-current-text-secondary)",
      }}
      aria-label={isSaved ? t("aria.removeBookmark") : t("aria.bookmarkArticle")}
    >
      {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      <span className="hidden sm:inline">{isSaved ? t("action.saved") : t("action.save")}</span>
    </Button>
  )
}
