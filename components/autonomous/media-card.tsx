"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Clock, MapPin, Calendar } from "lucide-react"
import { TimelineSelector } from "./timeline-selector"
import { updateAutonomousScheduleAction } from "@/lib/actions/autonomous"
import { toast } from "sonner"

type MediaCardProps = {
  siteId: number
  siteName: string
  domain: string
  timezone: string
  country: string
  language: string
  hours: number[]
  isActive: boolean
}

export function MediaCard({ siteId, siteName, domain, timezone, country, language, hours, isActive }: MediaCardProps) {
  const [localHours, setLocalHours] = useState<number[]>(hours)
  const [localIsActive, setLocalIsActive] = useState(isActive)
  const [isPending, startTransition] = useTransition()

  const handleHoursChange = async (newHours: number[]) => {
    setLocalHours(newHours)

    startTransition(async () => {
      const result = await updateAutonomousScheduleAction(siteId, newHours, localIsActive)

      if (!result.success) {
        toast.error(result.error || "Failed to update schedule")
        setLocalHours(hours)
      } else {
        toast.success("Schedule updated successfully")
      }
    })
  }

  const handleActiveToggle = async (checked: boolean) => {
    setLocalIsActive(checked)

    startTransition(async () => {
      const result = await updateAutonomousScheduleAction(siteId, localHours, checked)

      if (!result.success) {
        toast.error(result.error || "Failed to toggle autonomous mode")
        setLocalIsActive(isActive)
      } else {
        toast.success(`Autonomous mode ${checked ? "enabled" : "disabled"}`)
      }
    })
  }

  return (
    <Card className="group w-full overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-balance text-xl font-semibold tracking-tight">{siteName}</CardTitle>
              <Badge variant={localIsActive ? "default" : "secondary"} className="shrink-0">
                {localIsActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                {domain}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {country} • {language.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {timezone}
              </span>
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Label htmlFor={`active-${siteId}`} className="text-sm font-medium">
              Enable
            </Label>
            <Switch
              id={`active-${siteId}`}
              checked={localIsActive}
              onCheckedChange={handleActiveToggle}
              disabled={isPending}
              aria-label={`Toggle autonomous mode for ${siteName}`}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">Media Information</h3>
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Publication Slots
                </span>
                <span className="font-semibold text-foreground">{localHours.length} active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Timezone
                </span>
                <span className="font-medium text-foreground">{timezone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  Status
                </span>
                <Badge variant={localIsActive ? "default" : "secondary"} className="text-xs">
                  {localIsActive ? "Autonomous Mode" : "Disabled"}
                </Badge>
              </div>
            </div>
            {localIsActive && localHours.length > 0 && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Articles will be automatically fetched from News API and published at the selected hours in {timezone}{" "}
                timezone.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">Publication Schedule</h3>
            <TimelineSelector hours={localHours} onChange={handleHoursChange} disabled={!localIsActive || isPending} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
