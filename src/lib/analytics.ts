import type { Timestamp } from 'firebase-admin/firestore'

import type { EvaluationResult } from '@/types/interview'

export type AttemptSummary = {
  id: string
  interviewId: string
  status: string
  evaluation: EvaluationResult | null
  startedAt: Timestamp | null
  completedAt: Timestamp | null
  createdAt: Timestamp | null
}

export type ProgressMetrics = {
  totalInterviews: number
  totalAttempts: number
  completedAttempts: number
  completionRate: number
  avgScore: number
  scoreTrend: { date: string; score: number }[]
  strongestSkill: string | null
  weakestSkill: string | null
  streak: number
  heatmap: { date: string; count: number }[]
}

function toDateKey(value: Timestamp | null | undefined): string | null {
  if (!value) return null
  const date = value.toDate()
  return date.toISOString().slice(0, 10)
}

function countByKey(items: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1)
  }
  return counts
}

function topKey(counts: Map<string, number>): string | null {
  let best: string | null = null
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key
      bestCount = count
    }
  }
  return best
}

export function computeStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const unique = [...new Set(completedDates)].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  if (unique[0] !== today && unique[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86_400_000)
    if (diffDays === 1) streak++
    else break
  }
  return streak
}

export function computeProgressMetrics(
  attempts: AttemptSummary[],
  totalInterviews: number
): ProgressMetrics {
  const completed = attempts.filter((a) => a.status === 'COMPLETE' && a.evaluation)
  const scores = completed.map((a) => a.evaluation!.percentageScore)
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0

  const scoreTrend = completed
    .map((a) => ({
      date: toDateKey(a.completedAt ?? a.startedAt) ?? '',
      score: a.evaluation!.percentageScore,
    }))
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date))

  const strengths = completed.flatMap((a) => a.evaluation!.strengths)
  const weaknesses = completed.flatMap((a) => a.evaluation!.areasForImprovement)

  const completedDates = completed
    .map((a) => toDateKey(a.completedAt ?? a.startedAt))
    .filter((d): d is string => Boolean(d))

  const heatmapCounts = countByKey(completedDates)
  const heatmap = [...heatmapCounts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const started = attempts.filter((a) => a.status !== 'PENDING').length

  return {
    totalInterviews,
    totalAttempts: attempts.length,
    completedAttempts: completed.length,
    completionRate: started > 0 ? Math.round((completed.length / started) * 100) : 0,
    avgScore,
    scoreTrend,
    strongestSkill: topKey(countByKey(strengths)),
    weakestSkill: topKey(countByKey(weaknesses)),
    streak: computeStreak(completedDates),
    heatmap,
  }
}
