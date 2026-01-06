import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, FileQuestion } from "lucide-react"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description:
    "The page you're looking for doesn't exist or has been moved. Return to the homepage or search for content.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function SiteNotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="mb-6 h-20 w-20 text-muted-foreground" aria-hidden="true" />

      <h1 className="typography-h1 mb-4">404 - Page Not Found</h1>

      <p className="typography-lead mb-8 max-w-2xl">
        The page you're looking for doesn't exist or has been moved. It might have been removed, renamed, or is
        temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/search" className="gap-2">
            <Search className="h-4 w-4" />
            Search Articles
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p className="mb-2">You might also be interested in:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <span>•</span>
          <Link href="/sitemap.xml" className="hover:underline">
            Sitemap
          </Link>
        </div>
      </div>
    </div>
  )
}
