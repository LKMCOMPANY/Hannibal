"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Déconnexion réussie")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Erreur lors de la déconnexion")
      }
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
      console.error("Logout error:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-4 md:px-6">
          <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
          <div className="flex flex-1 items-center justify-between gap-2">
            <h1 className="truncate text-base font-semibold sm:text-lg">Dashboard</h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main id="main-content" className="flex flex-1 flex-col gap-4 p-3 sm:p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
