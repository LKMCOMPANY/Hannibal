"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { List } from "lucide-react"
import { useDictionary } from "@/lib/i18n"

type Heading = {
  id: string
  text: string
  level: number
}

type Props = {
  content: string
}

export function ArticleTableOfContents({ content }: Props) {
  const { t } = useDictionary()

  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headingElements = doc.querySelectorAll("h2, h3")

    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }
      return {
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.substring(1)),
      }
    })

    setHeadings(extractedHeadings)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-104px 0px -80% 0px" },
    )

    headingElements.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [content])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 104
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav aria-label="Table of contents">
      <div
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
            <List className="h-4 w-4" style={{ color: "var(--theme-current-primary)" }} />
          </div>
          <h2
            className="text-base font-bold tracking-tight"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-current-text-primary)",
            }}
          >
            {t("article.toc")}
          </h2>
        </div>
        <ScrollArea className="max-h-[400px]">
          <ul className="space-y-2.5">
            {headings.map((heading) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={cn("w-full text-left text-sm transition-colors leading-snug")}
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color:
                      activeId === heading.id ? "var(--theme-current-primary)" : "var(--theme-current-text-secondary)",
                    fontWeight: activeId === heading.id ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-primary)"
                  }}
                  onMouseLeave={(e) => {
                    if (activeId !== heading.id) {
                      e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                    }
                  }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </nav>
  )
}
