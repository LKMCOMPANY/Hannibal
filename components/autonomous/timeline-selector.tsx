"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TimelineSelectorProps = {
  hours: number[]
  onChange: (hours: number[]) => void
  disabled?: boolean
}

export function TimelineSelector({ hours, onChange, disabled = false }: TimelineSelectorProps) {
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set(hours))

  const toggleHour = (hour: number) => {
    if (disabled) return

    const newSelectedHours = new Set(selectedHours)

    if (newSelectedHours.has(hour)) {
      newSelectedHours.delete(hour)
    } else {
      newSelectedHours.add(hour)
    }

    setSelectedHours(newSelectedHours)
    onChange(Array.from(newSelectedHours).sort((a, b) => a - b))
  }

  const allHours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Select publication hours (24h format)</p>
        <Badge variant="outline" className="text-xs font-semibold">
          {selectedHours.size} selected
        </Badge>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {allHours.map((hour) => {
          const isSelected = selectedHours.has(hour)
          return (
            <Button
              key={hour}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleHour(hour)}
              disabled={disabled}
              className={cn(
                "h-10 font-mono text-sm transition-all duration-200",
                isSelected && "shadow-sm",
                !isSelected && "hover:border-primary/50 hover:bg-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
              aria-label={`Toggle hour ${hour.toString().padStart(2, "0")}:00`}
            >
              {hour.toString().padStart(2, "0")}:00
            </Button>
          )
        })}
      </div>

      {selectedHours.size > 0 && (
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Articles will be fetched and published at the selected hours in the media's timezone
          </p>
        </div>
      )}
    </div>
  )
}
