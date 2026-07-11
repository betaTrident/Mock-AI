import {
  BarChart3Icon,
  CalendarIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

import { MetricCard } from "@/components/shared/MetricCard"
import type { DashboardInsights } from "@/lib/dashboard-types"
import type { ProgressMetrics } from "@/lib/analytics"

type DashboardKpiStripProps = {
  metrics: ProgressMetrics
  insights: DashboardInsights
}

export function DashboardKpiStrip({ metrics, insights }: DashboardKpiStripProps) {
  const weekTrend =
    insights.interviewsLastWeek > 0
      ? Math.round(
          ((insights.interviewsThisWeek - insights.interviewsLastWeek) /
            insights.interviewsLastWeek) *
            100
        )
      : insights.interviewsThisWeek > 0
        ? 100
        : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Interviews this week"
        value={insights.interviewsThisWeek}
        icon={<CalendarIcon className="size-4" />}
        trend={{
          direction: weekTrend >= 0 ? "up" : "down",
          label: `${weekTrend >= 0 ? "+" : ""}${weekTrend}% vs last week`,
        }}
      />
      <MetricCard
        label="Average score"
        value={`${metrics.avgScore}%`}
        icon={<BarChart3Icon className="size-4" />}
        trend={{
          direction: insights.avgScoreChange >= 0 ? "up" : "down",
          label: `${insights.avgScoreChange >= 0 ? "+" : ""}${insights.avgScoreChange}% vs last week`,
        }}
      />
      <MetricCard
        label="Score trend"
        value={insights.scoreTrendLabel}
        icon={<TrendingUpIcon className="size-4" />}
        trend={{
          direction: "neutral",
          label: insights.scoreTrendLabel === "Upward" ? "Great progress!" : "Keep practicing",
        }}
      />
      <MetricCard
        label="Next suggested practice"
        value={insights.nextSuggestedPractice}
        icon={<TargetIcon className="size-4" />}
        trend={{
          direction: "neutral",
          label: "Based on your goals",
        }}
      />
    </div>
  )
}
