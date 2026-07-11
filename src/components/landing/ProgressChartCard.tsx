"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { PROGRESS_DATA } from "./landing-data"
import { FeatureCard } from "./FeatureCard"

export function ProgressChartCard() {
  return (
    <FeatureCard title="Track your progress">
      <div className="min-h-[180px] w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height={180} minWidth={0}>
          <LineChart
            data={[...PROGRESS_DATA]}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.24 0.03 250)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "oklch(0.58 0.03 250)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[50, 75]}
              tick={{ fill: "oklch(0.58 0.03 250)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.15 0.04 260)",
                border: "1px solid oklch(0.24 0.03 250)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.98 0.01 240)" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: "#34d399", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </FeatureCard>
  )
}
