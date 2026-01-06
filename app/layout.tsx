import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SkipLink } from "@/components/skip-link"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Hannibal",
  description: "Advanced Multi-Tenant Media Management Platform",
  keywords: ["media", "publishing", "cms", "multi-tenant", "content management"],
  authors: [{ name: "Hannibal Team" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <SkipLink />
        <ThemeProvider attribute="class" defaultTheme="light" forceTheme="light" disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
