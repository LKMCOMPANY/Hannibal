"use client"

import { useEffect, useRef, useMemo } from "react"
import { sanitizeArticleContent } from "@/lib/utils/sanitize-html"

type Props = {
  content: string
}

export function ArticleContent({ content }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Sanitize content once on mount/update (memoized for performance)
  const sanitizedContent = useMemo(() => sanitizeArticleContent(content), [content])

  useEffect(() => {
    if (!contentRef.current) return

    // Add IDs to headings for table of contents
    const headings = contentRef.current.querySelectorAll("h2, h3")
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`
      }
    })

    // Optimize images with loading="lazy" and proper sizes
    const images = contentRef.current.querySelectorAll("img")
    images.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy")
      }
      if (!img.hasAttribute("decoding")) {
        img.setAttribute("decoding", "async")
      }
      const isFirstImage = img === images[0]
      if (isFirstImage && !img.hasAttribute("fetchpriority")) {
        img.setAttribute("fetchpriority", "high")
      }
      const radius = getComputedStyle(document.documentElement).getPropertyValue("--theme-radius-image").trim()
      if (radius) {
        img.style.borderRadius = radius
      }
    })

    const codeBlocks = contentRef.current.querySelectorAll("code")
    codeBlocks.forEach((code) => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue("--theme-radius-button").trim()
      if (radius && !code.parentElement?.tagName.toLowerCase().includes("pre")) {
        code.style.borderRadius = radius
      }
    })

    const preBlocks = contentRef.current.querySelectorAll("pre")
    preBlocks.forEach((pre) => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue("--theme-radius-card").trim()
      if (radius) {
        pre.style.borderRadius = radius
      }
    })
  }, [content])

  return (
    <div
      ref={contentRef}
      className="article-content prose prose-lg mx-auto max-w-none dark:prose-invert
        prose-headings:scroll-mt-20 prose-headings:font-[family-name:var(--theme-font-heading)] prose-headings:font-bold prose-headings:tracking-tight
        prose-p:text-pretty prose-p:leading-relaxed
        prose-a:font-medium prose-a:text-[var(--theme-current-primary)] prose-a:no-underline prose-a:transition-colors hover:prose-a:underline
        prose-strong:font-semibold prose-strong:text-[var(--theme-current-text-primary)]
        prose-code:bg-[var(--theme-current-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm
        prose-pre:border prose-pre:border-[var(--theme-current-border)]
        prose-hr:border-[var(--theme-current-border)]
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--theme-current-primary)] prose-blockquote:bg-[var(--theme-current-surface)] prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic"
      style={{
        fontFamily: "var(--theme-font-body)",
        color: "var(--theme-current-text-primary)",
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
