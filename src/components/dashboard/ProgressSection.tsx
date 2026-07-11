"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import type { ProgressMetrics } from "@/lib/analytics"
import { Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"

type ProgressSectionProps = {
  metrics: ProgressMetrics
}

const lineConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig

const donutConfig = {
  score: { label: "Average", color: "var(--chart-1)" },
  remaining: { label: "Remaining", color: "var(--chart-3)" },
} satisfies ChartConfig

function HeatmapCalendar({ heatmap }: { heatmap: ProgressMetrics["heatmap"] }) {
  const maxCount = Math.max(1, ...heatmap.map((d) => d.count))
  const recent = heatmap.slice(-28)

  return (
    <div className="grid grid-cols-7 gap-1" aria-label="Practice activity heatmap">
      {recent.map((day) => {
        const intensity = day.count / maxCount
        return (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} session${day.count === 1 ? "" : "s"}`}
            className="aspect-square rounded-sm border border-border/50"
            style={{
              backgroundColor:
                day.count === 0
                  ? "var(--muted)"
                  : `color-mix(in oklch, var(--chart-1) ${Math.round(intensity * 100)}%, var(--muted))`,
            }}
          />
        )
      })}
    </div>
  )
}

export function ProgressSection({ metrics }: ProgressSectionProps) {
  const donutData = [
    { name: "score", value: metrics.avgScore },
    { name: "remaining", value: Math.max(0, 100 - metrics.avgScore) },
  ]

  return (
    <section aria-labelledby="progress-heading" className="flex flex-col gap-4">
      <div>
        <h2 id="progress-heading" className="text-lg font-semibold">
          Your Progress
        </h2>
        <p className="text-sm text-muted-foreground">
          Analytics from your completed interview attempts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total interviews</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{metrics.totalInterviews}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{metrics.totalAttempts} attempts</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average score</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={donutConfig} className="mx-auto aspect-square max-h-[140px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={60}
                  strokeWidth={0}
                >
                  <Cell fill="var(--color-score)" />
                  <Cell fill="var(--color-remaining)" />
                </Pie>
              </PieChart>
            </ChartContainer>
            <p className="text-center text-2xl font-bold tabular-nums">{metrics.avgScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice streak</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{metrics.streak} days</CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapCalendar heatmap={metrics.heatmap} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion rate</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{metrics.completionRate}%</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Progress value={metrics.completionRate} aria-label={`${metrics.completionRate}% completion rate`} />
            <p className="text-xs text-muted-foreground">
              {metrics.completedAttempts} of {metrics.totalAttempts} attempts completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Score trend</CardTitle>
            <CardDescription>Performance over completed attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.scoreTrend.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Complete an interview to see your score trend.
              </p>
            ) : (
              <ChartContainer config={lineConfig} className="aspect-2/1 w-full">
                <LineChart data={metrics.scoreTrend}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill highlights</CardTitle>
            <CardDescription>From evaluator feedback</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Strongest</p>
              {metrics.strongestSkill ? (
                <Badge>{metrics.strongestSkill}</Badge>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Needs work</p>
              {metrics.weakestSkill ? (
                <Badge variant="outline">{metrics.weakestSkill}</Badge>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
