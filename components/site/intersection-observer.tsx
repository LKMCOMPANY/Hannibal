"use client"

import { useEffect, useRef, type ReactNode } from "react"

type IntersectionObserverWrapperProps = {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  animationClass?: string
}

export function IntersectionObserverWrapper({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  animationClass = "animate-fade-in-up",
}: IntersectionObserverWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [threshold, rootMargin, animationClass])

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  )
}
