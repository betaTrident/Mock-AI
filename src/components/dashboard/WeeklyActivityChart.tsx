"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { DashboardInsights } from "@/lib/dashboard-types"

type WeeklyActivityChartProps = {
  activity: DashboardInsights["weeklyActivity"]
}

export function WeeklyActivityChart({ activity }: WeeklyActivityChartProps) {
  const average =
    activity.length > 0
      ? Math.round(activity.reduce((sum, day) => sum + day.minutes, 0) / activity.length)
      : 0

  return (
    <div className="product-panel flex h-full flex-col">
      <div className="product-panel-header">
        <h2 className="text-sm font-semibold">Weekly Practice Activity</h2>
        <p className="text-xs text-muted-foreground">Minutes spent practicing each day</p>
      </div>
      <div className="product-panel-body min-h-[220px] flex-1">
        {activity.every((day) => day.minutes === 0) ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Complete a session this week to see activity.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value} min`, "Practice"]}
              />
              {average > 0 ? (
                <ReferenceLine
                  y={average}
                  stroke="var(--primary)"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg ${average}m`,
                    position: "insideTopRight",
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                  }}
                />
              ) : null}
              <Bar dataKey="minutes" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
