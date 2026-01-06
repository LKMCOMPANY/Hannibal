"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return

    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log("[v0] LCP:", lastEntry.renderTime || lastEntry.loadTime)
        })
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            console.log("[v0] FID:", entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ type: "first-input", buffered: true })

        // Cumulative Layout Shift (CLS)
        let clsScore = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value
              console.log("[v0] CLS:", clsScore)
            }
          }
        })
        clsObserver.observe({ type: "layout-shift", buffered: true })

        return () => {
          lcpObserver.disconnect()
          fidObserver.disconnect()
          clsObserver.disconnect()
        }
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }, [])

  return null
}
