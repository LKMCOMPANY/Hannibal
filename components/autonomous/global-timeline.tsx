"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { convertHourToBrowserTimezone, getUserTimezone, formatTimezoneAbbr } from "@/lib/utils/timezone"
import type { TimelineEvent } from "@/lib/types/autonomous"
import { useMemo } from "react"

type GlobalTimelineProps = {
  events: TimelineEvent[]
}

export function GlobalTimeline({ events }: GlobalTimelineProps) {
  const userTimezone = useMemo(() => getUserTimezone(), [])
  const userTimezoneAbbr = useMemo(() => formatTimezoneAbbr(userTimezone), [userTimezone])

  const convertedEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      convertedHour: convertHourToBrowserTimezone(event.hour, event.timezone),
      localHour: event.hour, // Keep original for tooltip
    }))
  }, [events])

  const eventsByHour = convertedEvents.reduce(
    (acc, event) => {
      const hour = event.convertedHour
      if (!acc[hour]) {
        acc[hour] = []
      }
      acc[hour].push(event)
      return acc
    },
    {} as Record<number, typeof convertedEvents>,
  )

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-balance">Global Publication Timeline</CardTitle>
          </div>
          <Badge variant="secondary" className="w-fit">
            {events.length} scheduled
          </Badge>
        </div>
        <CardDescription className="text-pretty">
          Consolidated view of all autonomous publication times across all media outlets
        </CardDescription>
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Times shown in your timezone:</span>
          <span className="font-medium text-foreground">{userTimezone}</span>
          <Badge variant="outline" className="ml-1 font-mono text-xs">
            {userTimezoneAbbr}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="relative overflow-x-auto">
            <div className="grid min-w-[800px] grid-cols-24 gap-1">
              {hours.map((hour) => {
                const hourEvents = eventsByHour[hour] || []
                const hasEvents = hourEvents.length > 0

                return (
                  <div key={hour} className="group relative">
                    <div
                      className={cn(
                        "relative h-12 rounded-md border transition-all duration-200",
                        hasEvents
                          ? "border-primary/30 bg-primary/10 hover:border-primary/50 hover:bg-primary/20"
                          : "border-border bg-muted/30 hover:border-border hover:bg-muted/50",
                      )}
                    >
                      {hasEvents && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Badge variant="secondary" className="px-1.5 py-0 text-xs font-semibold">
                            {hourEvents.length}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 text-center">
                      <span className="font-mono text-xs text-muted-foreground">
                        {hour.toString().padStart(2, "0")}
                      </span>
                    </div>

                    {hasEvents && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
                        <div className="w-64 rounded-lg border bg-popover p-3 shadow-lg">
                          <p className="mb-2 flex items-center justify-between text-xs font-semibold text-popover-foreground">
                            <span>
                              {hour.toString().padStart(2, "0")}:00 {userTimezoneAbbr}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Your time
                            </Badge>
                          </p>
                          <div className="space-y-2">
                            {hourEvents.map((event, idx) => (
                              <div
                                key={idx}
                                className="space-y-1 rounded-md border-l-2 bg-muted/50 py-1.5 pl-2 pr-1.5"
                                style={{ borderLeftColor: event.color }}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: event.color }}
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-popover-foreground text-xs">{event.site_name}</span>
                                </div>
                                <div className="ml-4 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Local: {event.localHour.toString().padStart(2, "0")}:00</span>
                                  <span className="text-[10px]">{formatTimezoneAbbr(event.timezone)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-primary/30 bg-primary/10" aria-hidden="true" />
              <span>Has publications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-border bg-muted/30" aria-hidden="true" />
              <span>No publications</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
