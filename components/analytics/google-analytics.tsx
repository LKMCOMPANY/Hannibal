"use client"

import { useEffect } from "react"
import Script from "next/script"

type Props = {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: Props) {
  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = (url: string) => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("config", measurementId, {
          page_path: url,
        })
      }
    }

    // Listen for route changes
    window.addEventListener("popstate", () => handleRouteChange(window.location.pathname))

    return () => {
      window.removeEventListener("popstate", () => handleRouteChange(window.location.pathname))
    }
  }, [measurementId])

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  )
}
