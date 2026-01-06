"use client"

import { useEffect, useState } from "react"

export function ArticleProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--theme-current-primary)",
          }}
        />
      </div>
    </div>
  )
}
