"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/auth/login-dialog"

export default function HomePage() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dot-pattern" aria-label="Home page">
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Login to dashboard"
          onClick={() => setShowLoginDialog(true)}
        >
          Login
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6 px-4 sm:gap-8">
        <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-8xl">Hannibal</h1>
      </div>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </main>
  )
}
