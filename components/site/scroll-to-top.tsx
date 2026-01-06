"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 z-40 h-12 w-12 transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: "var(--theme-current-primary)",
        color: "var(--theme-current-primary-foreground)",
        borderRadius: "var(--theme-radius-button)",
        boxShadow: "var(--theme-shadow-button)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--theme-shadow-card-hover)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--theme-shadow-button)"
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
