import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, Globe2, Languages, Target } from "lucide-react"

type ReportStatsProps = {
  stats: {
    totalSites: number
    activeMedias: number
    activeCountries: number
    activeLanguages: number
  }
}

export function ReportStats({ stats }: ReportStatsProps) {
  const statCards = [
    {
      label: "Target Sites",
      value: stats.totalSites,
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Medias",
      value: stats.activeMedias,
      icon: Newspaper,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Countries",
      value: stats.activeCountries,
      icon: Globe2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Languages",
      value: stats.activeLanguages,
      icon: Languages,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid gap-2 grid-cols-2 sm:gap-3 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="overflow-hidden border-border">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`shrink-0 rounded ${stat.bgColor} p-1.5 ${stat.color}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
