"use client"

import { useState, useEffect } from "react"
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDictionary } from "@/lib/i18n"

type Props = {
  title: string
  url: string
}

export function ArticleShare({ title, url }: Props) {
  const { t } = useDictionary()
  const [copied, setCopied] = useState(false)
  const [supportsWebShare, setSupportsWebShare] = useState(false)

  useEffect(() => {
    setSupportsWebShare(typeof navigator !== "undefined" && "share" in navigator)
  }, [])

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const handleNativeShare = async () => {
    if (!supportsWebShare) return

    try {
      await navigator.share({
        title,
        url,
      })
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err)
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (supportsWebShare) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent"
        style={{
          borderColor: "var(--theme-current-border)",
          color: "var(--theme-current-text-secondary)",
        }}
        onClick={handleNativeShare}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("action.share")}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          style={{
            borderColor: "var(--theme-current-border)",
            color: "var(--theme-current-text-secondary)",
          }}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t("action.share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            {t("social.shareOn", { platform: t("social.twitter") })}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            {t("social.shareOn", { platform: t("social.facebook") })}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            {t("social.shareOn", { platform: t("social.linkedin") })}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? t("social.linkCopied") : t("social.copyLink")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
