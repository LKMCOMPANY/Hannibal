"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Site error:", error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="mb-6 h-16 w-16 text-destructive" />
      <h1 className="typography-h1 mb-4">Something went wrong</h1>
      <p className="typography-large mb-8 text-muted-foreground">
        We encountered an error while loading this page. Please try again.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline" size="lg">
          Go Home
        </Button>
      </div>
    </div>
  )
}
