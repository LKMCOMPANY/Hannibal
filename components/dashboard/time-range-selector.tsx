"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TimeRange } from "@/lib/data/dashboard"
import { Clock } from "lucide-react"

type TimeRangeSelectorProps = {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

const timeRanges = [
  { value: "3h" as TimeRange, label: "3H", fullLabel: "Last 3 Hours" },
  { value: "24h" as TimeRange, label: "24H", fullLabel: "Last 24 Hours" },
  { value: "7d" as TimeRange, label: "7D", fullLabel: "Last 7 Days" },
  { value: "30d" as TimeRange, label: "30D", fullLabel: "Last 30 Days" },
]

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
        <Clock className="hidden h-4 w-4 sm:block" aria-hidden="true" />
        <span className="hidden text-xs font-medium sm:inline sm:text-sm">Period:</span>
      </div>
      <Tabs value={value} onValueChange={(v) => onChange(v as TimeRange)} className="flex-1">
        <TabsList className="grid h-9 w-full grid-cols-4 gap-1 p-1">
          {timeRanges.map((range) => (
            <TabsTrigger
              key={range.value}
              value={range.value}
              className="h-full text-[11px] font-medium data-[state=active]:shadow-sm sm:text-xs md:text-sm"
              title={range.fullLabel}
            >
              <span className="sm:hidden">{range.label}</span>
              <span className="hidden sm:inline">{range.fullLabel}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

