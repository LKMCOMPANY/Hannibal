/**
 * Performance utilities for optimizing the media site
 */

/**
 * Debounce function to limit how often a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to ensure a function is called at most once per specified time period
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  if (typeof document === "undefined") return

  const link = document.createElement("link")
  link.rel = "preload"
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

/**
 * Lazy load component with intersection observer
 */
export function lazyLoadComponent(element: HTMLElement, callback: () => void, options?: IntersectionObserverInit) {
  if (!("IntersectionObserver" in window)) {
    callback()
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
        observer.unobserve(element)
      }
    })
  }, options)

  observer.observe(element)
}

/**
 * Get optimal image size based on viewport
 */
export function getOptimalImageSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 1200, height: 630 }
  }

  const width = window.innerWidth
  if (width < 640) {
    return { width: 640, height: 336 }
  } else if (width < 1024) {
    return { width: 1024, height: 538 }
  } else {
    return { width: 1200, height: 630 }
  }
}

/**
 * Measure and log performance metrics
 */
export function measurePerformance(name: string, fn: () => void) {
  if (typeof performance === "undefined") {
    fn()
    return
  }

  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`[v0] ${name} took ${(end - start).toFixed(2)}ms`)
}
