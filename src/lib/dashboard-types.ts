import type { ProgressMetrics } from '@/lib/analytics'

export type DashboardInterview = {
  id: string
  role: string
  difficulty: 'junior' | 'mid' | 'senior' | 'staff'
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  techStack: string[]
  progressPercent: number
  lastAttemptScore?: number
  completedAt?: string
  interviewType?: string
}

export type InProgressAttempt = {
  id: string
  interviewId: string
  role: string
  progressPercent: number
  questionIndex: number
  totalQuestions: number
  elapsedMinutes: number
  startedLabel: string
}

export type SkillMetric = {
  id: string
  name: string
  score: number
  weeklyChange: number
  sparkline: number[]
}

export type DashboardInsights = {
  interviewsThisWeek: number
  interviewsLastWeek: number
  avgScoreChange: number
  scoreTrendLabel: string
  nextSuggestedPractice: string
  focusSkill: string | null
  weeklyActivity: { day: string; minutes: number }[]
  skills: SkillMetric[]
}

export type DashboardData = {
  interviews: DashboardInterview[]
  metrics: ProgressMetrics
  inProgressAttempt: InProgressAttempt | null
  insights: DashboardInsights
}
