import { Card, CardContent } from "@/components/ui/card"

// X Logo Component
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function XPublisherLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground">
          <XLogo className="h-6 w-6 text-background" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Left side skeleton */}
                <div className="w-full border-b bg-muted/30 p-6 md:w-1/4 md:border-b-0 md:border-r">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>

                {/* Right side skeleton */}
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="grid gap-3 border-t pt-4 sm:grid-cols-2">
                      <div className="h-16 animate-pulse rounded-md bg-muted" />
                      <div className="h-16 animate-pulse rounded-md bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
