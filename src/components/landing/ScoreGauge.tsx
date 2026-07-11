"use client"

import { cn } from "@/lib/utils"

type ScoreGaugeProps = {
  score: number
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function getScoreColor(score: number) {
  if (score >= 70) return { stroke: "#34d399", text: "text-emerald-400" }
  if (score >= 60) return { stroke: "#fbbf24", text: "text-amber-400" }
  return { stroke: "#f87171", text: "text-red-400" }
}

const SIZES = {
  sm: { box: 72, stroke: 5, font: "text-lg", label: "text-[10px]" },
  md: { box: 96, stroke: 6, font: "text-2xl", label: "text-xs" },
  lg: { box: 120, stroke: 7, font: "text-3xl", label: "text-sm" },
} as const

export function ScoreGauge({
  score,
  label,
  size = "md",
  className,
}: ScoreGaugeProps) {
  const { box, stroke, font, label: labelSize } = SIZES[size]
  const radius = (box - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const colors = getScoreColor(score)
  const center = box / 2

  return (
    <div
      className={cn("relative inline-flex flex-col items-center gap-1", className)}
      role="img"
      aria-label={`Score ${score}${label ? `, ${label}` : ""}`}
    >
      <svg width={box} height={box} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/60"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold tabular-nums text-foreground", font)}>
          {score}
        </span>
        {label ? (
          <span className={cn("font-medium", labelSize, colors.text)}>
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}
