"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"
import { format } from "date-fns"

type PublicationsGraphProps = {
  data: Array<{
    source_type: string
    hour: string
    count: string
  }>
  range: string
}

// shadcn Chart config (keys MUST be lowercase)
const chartConfig = {
  manual: {
    label: "Manual",
    color: "hsl(217 91% 60%)",  // Blue
  },
  autonomous: {
    label: "Autonomous",
    color: "hsl(142 71% 45%)",  // Green
  },
  campaign: {
    label: "Campaign",
    color: "hsl(271 81% 56%)",  // Purple
  },
} satisfies ChartConfig

export function PublicationsGraph({ data, range }: PublicationsGraphProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const hours = Array.from(new Set(data.map(d => d.hour))).sort()
  
  const chartData = hours.map(hour => {
    const manualData = data.find(d => d.hour === hour && d.source_type === 'manual')
    const autonomousData = data.find(d => d.hour === hour && d.source_type === 'autonomous')
    const campaignData = data.find(d => d.hour === hour && d.source_type === 'campaign')
    
    return {
      time: format(new Date(hour), range === '3h' || range === '24h' ? 'HH:mm' : 'MMM d'),
      manual: Number(manualData?.count || 0),
      autonomous: Number(autonomousData?.count || 0),
      campaign: Number(campaignData?.count || 0),
    }
  })

  const totals = {
    manual: chartData.reduce((sum, d) => sum + d.manual, 0),
    autonomous: chartData.reduce((sum, d) => sum + d.autonomous, 0),
    campaign: chartData.reduce((sum, d) => sum + d.campaign, 0),
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
              <TrendingUp className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" aria-hidden="true" />
              Publications Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {(totals.manual + totals.autonomous + totals.campaign).toLocaleString()} total articles
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 text-xs sm:gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartConfig.manual.color }} aria-hidden="true" />
              <span className="font-medium text-foreground">{totals.manual.toLocaleString()}</span>
              <span className="hidden text-muted-foreground sm:inline">Manual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartConfig.autonomous.color }} aria-hidden="true" />
              <span className="font-medium text-foreground">{totals.autonomous.toLocaleString()}</span>
              <span className="hidden text-muted-foreground sm:inline">Autonomous</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartConfig.campaign.color }} aria-hidden="true" />
              <span className="font-medium text-foreground">{totals.campaign.toLocaleString()}</span>
              <span className="hidden text-muted-foreground sm:inline">Campaign</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 px-1 pt-4 sm:px-2 sm:pt-6 md:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full sm:h-[280px] lg:h-[320px]">
          <LineChart 
            data={chartData} 
            margin={{ 
              top: 5, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? -10 : 0, 
              bottom: 5 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              opacity={0.3} 
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={isMobile ? 20 : 32}
              tick={{ fontSize: isMobile ? 10 : 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: isMobile ? 10 : 11 }}
              width={isMobile ? 25 : 30}
              stroke="hsl(var(--muted-foreground))"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="manual"
              stroke="var(--color-manual)"
              strokeWidth={2}
              dot={{ fill: "var(--color-manual)", r: isMobile ? 2 : 3 }}
              activeDot={{ r: isMobile ? 4 : 5 }}
            />
            <Line
              type="monotone"
              dataKey="autonomous"
              stroke="var(--color-autonomous)"
              strokeWidth={2}
              dot={{ fill: "var(--color-autonomous)", r: isMobile ? 2 : 3 }}
              activeDot={{ r: isMobile ? 4 : 5 }}
            />
            <Line
              type="monotone"
              dataKey="campaign"
              stroke="var(--color-campaign)"
              strokeWidth={2}
              dot={{ fill: "var(--color-campaign)", r: isMobile ? 2 : 3 }}
              activeDot={{ r: isMobile ? 4 : 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
