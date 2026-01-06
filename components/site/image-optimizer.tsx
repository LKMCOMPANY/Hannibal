"use client"

import { useEffect } from "react"

export function ImageOptimizer() {
  useEffect(() => {
    // Lazy load images that are not in viewport
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute("data-src")
                imageObserver.unobserve(img)
              }
            }
          })
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        },
      )

      // Observe all images with data-src attribute
      const lazyImages = document.querySelectorAll("img[data-src]")
      lazyImages.forEach((img) => imageObserver.observe(img))

      return () => {
        imageObserver.disconnect()
      }
    }
  }, [])

  return null
}
