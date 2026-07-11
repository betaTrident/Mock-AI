import { cn } from "@/lib/utils"

export type ScoreLevel = "strong" | "good" | "fair" | "weak"

type ScoreChipProps = {
  score: number
  level?: ScoreLevel
  className?: string
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) return "strong"
  if (score >= 70) return "good"
  if (score >= 60) return "fair"
  return "weak"
}

const levelClass: Record<ScoreLevel, string> = {
  strong: "product-score-chip--strong",
  good: "product-score-chip--good",
  fair: "product-score-chip--fair",
  weak: "product-score-chip--weak",
}

export function ScoreChip({ score, level, className }: ScoreChipProps) {
  const resolvedLevel = level ?? getScoreLevel(score)

  return (
    <span className={cn("product-score-chip", levelClass[resolvedLevel], className)}>
      {score}%
    </span>
  )
}
