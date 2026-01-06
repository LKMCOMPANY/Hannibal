"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type XPostInputProps = {
  value?: string
  onValueChange: (value: string) => void
  slug?: string
  customDomain?: string
  hostname?: string // Added hostname prop for fallback
  disabled?: boolean
  error?: string
}

const X_MAX_CHARS = 280

export function XPostInput({
  value = "",
  onValueChange,
  slug,
  customDomain,
  hostname,
  disabled,
  error,
}: XPostInputProps) {
  const [publicUrl, setPublicUrl] = useState("")
  const [availableChars, setAvailableChars] = useState(X_MAX_CHARS)
  const [currentLength, setCurrentLength] = useState(0)

  // Calculate public URL and available characters
  useEffect(() => {
    if (slug && (customDomain || hostname)) {
      const domain = customDomain || hostname
      const url = `https://${domain}/article/${slug}`
      setPublicUrl(url)
      // URL + 1 space before it
      const urlWithSpace = url.length + 1
      setAvailableChars(X_MAX_CHARS - urlWithSpace)
    } else {
      setPublicUrl("")
      // Reserve space for a typical URL (estimate 30 chars)
      setAvailableChars(X_MAX_CHARS - 30)
    }
  }, [slug, customDomain, hostname])

  // Update current length
  useEffect(() => {
    setCurrentLength(value.length)
  }, [value])

  const remainingChars = availableChars - currentLength
  const isOverLimit = remainingChars < 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="x_post" className="text-sm font-medium">
          X Post (Twitter)
        </Label>
        <span
          className={cn(
            "typography-muted text-xs",
            isOverLimit && "text-destructive font-medium",
            remainingChars <= 20 && remainingChars >= 0 && "text-warning font-medium",
          )}
        >
          {currentLength}/{availableChars} characters
        </span>
      </div>

      <Textarea
        id="x_post"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Write an engaging post for X/Twitter (the article URL will be added automatically)"
        rows={3}
        maxLength={availableChars}
        disabled={disabled}
        className={cn(
          "resize-none leading-relaxed",
          error && "border-destructive focus-visible:ring-destructive",
          isOverLimit && "border-destructive focus-visible:ring-destructive",
        )}
      />

      {publicUrl && (
        <p className="typography-muted text-xs">
          The URL <span className="font-mono text-foreground">{publicUrl}</span> will be automatically appended to your
          post.
        </p>
      )}

      {!publicUrl && slug && (
        <p className="typography-muted text-xs">
          The article URL will be automatically appended once the site domain is configured.
        </p>
      )}

      {!slug && (
        <p className="typography-muted text-xs">
          The article URL will be generated from the title and appended automatically.
        </p>
      )}

      {error && <p className="typography-muted text-destructive text-xs">{error}</p>}

      {isOverLimit && (
        <p className="typography-muted text-destructive text-xs">
          Text exceeds available character limit. Please shorten your post.
        </p>
      )}

      {remainingChars <= 20 && remainingChars >= 0 && (
        <p className="typography-muted text-warning text-xs">{remainingChars} characters remaining</p>
      )}
    </div>
  )
}
