"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type KeyboardShortcutsProps = {
  onSearchOpen?: () => void
}

export function KeyboardShortcuts({ onSearchOpen }: KeyboardShortcutsProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onSearchOpen?.()
      }

      // Home shortcut: Cmd/Ctrl + H
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault()
        router.push("/")
      }

      // Escape to close modals/dialogs
      if (e.key === "Escape") {
        // Let the default behavior handle this
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onSearchOpen, router])

  return null
}
