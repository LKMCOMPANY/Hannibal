import type { Site } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Twitter, Mail, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function MediaCard({ media }: { media: Site }) {
  const statusColor = {
    active: "bg-success/10 text-success border-success/20",
    inactive: "bg-muted text-muted-foreground border-border",
    draft: "bg-primary/10 text-primary border-primary/20",
  }[media.status || "inactive"]

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start">
          {/* Logo/Thumbnail */}
          <div className="flex-shrink-0">
            {media.logo_url ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted transition-all group-hover:border-primary/30">
                <Image
                  src={media.logo_url || "/placeholder.svg"}
                  alt={`${media.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted transition-all group-hover:border-primary/30">
                <Globe className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="typography-h4 text-balance">{media.name}</h3>
                  <Badge variant="outline" className={statusColor}>
                    {media.status || "inactive"}
                  </Badge>
                </div>
                {media.custom_domain && (
                  <a
                    href={`https://${media.custom_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {media.custom_domain}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>

              <Link href={`/dashboard/medias/${media.id}`}>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Edit className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Button>
              </Link>
            </div>

            {media.description && <p className="typography-muted line-clamp-2 text-pretty">{media.description}</p>}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {media.country && (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span>{media.country}</span>
                </div>
              )}
              {media.language && (
                <Badge variant="secondary" className="text-xs">
                  {media.language.toUpperCase()}
                </Badge>
              )}
              {media.ideology && (
                <Badge variant="secondary" className="text-xs">
                  {media.ideology}
                </Badge>
              )}
            </div>

            {/* Social Links */}
            {(media.twitter_handle || media.contact_email) && (
              <div className="flex flex-wrap items-center gap-2">
                {media.twitter_handle && (
                  <a
                    href={media.twitter_url || `https://twitter.com/${media.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-accent hover:border-primary/30"
                  >
                    <Twitter className="h-3 w-3" aria-hidden="true" />@{media.twitter_handle}
                  </a>
                )}
                {media.contact_email && (
                  <a
                    href={`mailto:${media.contact_email}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-accent hover:border-primary/30"
                  >
                    <Mail className="h-3 w-3" aria-hidden="true" />
                    {media.contact_email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
