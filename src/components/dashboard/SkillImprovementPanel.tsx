"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

import type { SkillMetric } from "@/lib/dashboard-types"

type SkillImprovementPanelProps = {
  skills: SkillMetric[]
  focusSkill: string | null
}

function SkillSparkline({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({ index, value }))

  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SkillImprovementPanel({ skills, focusSkill }: SkillImprovementPanelProps) {
  return (
    <div className="product-panel h-full">
      <div className="product-panel-header">
        <h2 className="text-sm font-semibold">Skill Improvement</h2>
        <p className="text-xs text-muted-foreground">Weekly movement across coaching dimensions</p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {skills.map((skill) => (
          <div key={skill.id} className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{skill.name}</p>
              <span className="text-sm font-semibold tabular-nums">{skill.score}%</span>
            </div>
            <SkillSparkline data={skill.sparkline} />
            <p
              className={
                skill.weeklyChange >= 0
                  ? "product-metric-trend-up"
                  : "product-metric-trend-down"
              }
            >
              {skill.weeklyChange >= 0 ? "+" : ""}
              {skill.weeklyChange}% this week
            </p>
          </div>
        ))}
      </div>
      {focusSkill ? (
        <div className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
          Focus next: <span className="font-medium text-foreground">{focusSkill}</span>
        </div>
      ) : null}
    </div>
  )
}
