import { adminDb } from '@/lib/firebase-admin'
import { computeProgressMetrics, type AttemptSummary } from '@/lib/analytics'
import type {
  DashboardData,
  DashboardInsights,
  DashboardInterview,
  InProgressAttempt,
  SkillMetric,
} from '@/lib/dashboard-types'
import type { EvaluationResult } from '@/types/interview'

export type { DashboardData, DashboardInterview, InProgressAttempt } from '@/lib/dashboard-types'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const SKILL_DEFINITIONS = [
  { id: 'communication', name: 'Communication', keywords: ['communication', 'clarity', 'explain'] },
  { id: 'technical', name: 'Technical Depth', keywords: ['technical', 'depth', 'fundamentals', 'trade-off'] },
  { id: 'structure', name: 'Structure', keywords: ['structure', 'organized', 'star', 'framework'] },
  { id: 'confidence', name: 'Confidence', keywords: ['confidence', 'concise', 'pause', 'delivery'] },
] as const

function startOfWeek(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function toMillis(value: { toMillis?: () => number } | null | undefined) {
  return value?.toMillis?.() ?? 0
}

function formatStartedLabel(value: { toDate?: () => Date } | null | undefined) {
  if (!value?.toDate) return 'Recently'
  return value.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function countAttemptsInRange(attempts: AttemptSummary[], startMs: number, endMs: number) {
  return attempts.filter((attempt) => {
    const ms = toMillis(attempt.startedAt ?? attempt.createdAt)
    return ms >= startMs && ms < endMs
  }).length
}

function computeWeeklyActivity(attempts: AttemptSummary[]): DashboardInsights['weeklyActivity'] {
  const weekStart = startOfWeek(new Date())
  const buckets = DAY_LABELS.map((day) => ({ day, minutes: 0 }))

  for (const attempt of attempts) {
    const started = attempt.startedAt?.toDate?.() ?? attempt.createdAt?.toDate?.()
    if (!started) continue

    const attemptWeekStart = startOfWeek(started)
    if (attemptWeekStart.getTime() !== weekStart.getTime()) continue

    const dayIndex = started.getDay() === 0 ? 6 : started.getDay() - 1
    const completedMs = toMillis(attempt.completedAt)
    const startedMs = toMillis(attempt.startedAt ?? attempt.createdAt)
    const durationMinutes =
      completedMs > startedMs
        ? Math.max(5, Math.round((completedMs - startedMs) / 60_000))
        : 30

    buckets[dayIndex].minutes += durationMinutes
  }

  return buckets
}

function scoreFromKeywordMatch(text: string, keywords: readonly string[]) {
  const lower = text.toLowerCase()
  return keywords.some((keyword) => lower.includes(keyword)) ? 1 : 0
}

function computeSkillMetrics(
  evaluations: EvaluationResult[],
  avgScore: number
): SkillMetric[] {
  if (evaluations.length === 0) {
    return SKILL_DEFINITIONS.map((skill, index) => ({
      id: skill.id,
      name: skill.name,
      score: 0,
      weeklyChange: 0,
      sparkline: [0, 0, 0, 0, 0],
    }))
  }

  const recent = evaluations.slice(-5)

  return SKILL_DEFINITIONS.map((skill) => {
    const strengthHits = evaluations.reduce((sum, evaluation) => {
      return (
        sum +
        evaluation.strengths.reduce(
          (inner, item) => inner + scoreFromKeywordMatch(item, skill.keywords),
          0
        )
      )
    }, 0)

    const weaknessHits = evaluations.reduce((sum, evaluation) => {
      return (
        sum +
        evaluation.areasForImprovement.reduce(
          (inner, item) => inner + scoreFromKeywordMatch(item, skill.keywords),
          0
        )
      )
    }, 0)

    const adjustment = Math.min(12, strengthHits * 2) - Math.min(12, weaknessHits * 2)
    const score = Math.max(0, Math.min(100, avgScore + adjustment))

    const sparkline = recent.map((evaluation, index) => {
      const base = evaluation.percentageScore
      const variance = (index % 3) - 1
      return Math.max(0, Math.min(100, base + variance * 3 + adjustment / 2))
    })

    const weeklyChange =
      recent.length >= 2
        ? Math.round(recent[recent.length - 1].percentageScore - recent[0].percentageScore)
        : 0

    return {
      id: skill.id,
      name: skill.name,
      score,
      weeklyChange,
      sparkline: sparkline.length > 0 ? sparkline : [score],
    }
  })
}

function computeInsights(
  attempts: AttemptSummary[],
  metrics: ReturnType<typeof computeProgressMetrics>
): DashboardInsights {
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekStartMs = weekStart.getTime()
  const nextWeekMs = weekStartMs + 7 * 86_400_000
  const prevWeekMs = weekStartMs - 7 * 86_400_000

  const interviewsThisWeek = countAttemptsInRange(attempts, weekStartMs, nextWeekMs)
  const interviewsLastWeek = countAttemptsInRange(attempts, prevWeekMs, weekStartMs)

  const weekChange =
    interviewsLastWeek > 0
      ? Math.round(((interviewsThisWeek - interviewsLastWeek) / interviewsLastWeek) * 100)
      : interviewsThisWeek > 0
        ? 100
        : 0

  const completedScores = attempts
    .filter((a) => a.status === 'COMPLETE' && a.evaluation)
    .map((a) => a.evaluation!.percentageScore)

  const midpoint = Math.floor(completedScores.length / 2)
  const recentAvg =
    completedScores.length > 0
      ? Math.round(
          completedScores.slice(midpoint).reduce((sum, score) => sum + score, 0) /
            Math.max(1, completedScores.slice(midpoint).length)
        )
      : 0
  const priorAvg =
    completedScores.length > 1
      ? Math.round(
          completedScores.slice(0, midpoint).reduce((sum, score) => sum + score, 0) /
            Math.max(1, completedScores.slice(0, midpoint).length)
        )
      : recentAvg

  const avgScoreChange = recentAvg - priorAvg
  const scoreTrendLabel =
    metrics.scoreTrend.length >= 2 &&
    metrics.scoreTrend[metrics.scoreTrend.length - 1].score >= metrics.scoreTrend[0].score
      ? 'Upward'
      : metrics.scoreTrend.length > 0
        ? 'Steady'
        : 'Building'

  const evaluations = attempts
    .filter((a) => a.evaluation)
    .map((a) => a.evaluation!) as EvaluationResult[]

  const skills = computeSkillMetrics(evaluations, metrics.avgScore)
  const focusSkill =
    skills.length > 0
      ? skills.reduce((lowest, skill) => (skill.score < lowest.score ? skill : lowest)).name
      : metrics.weakestSkill

  const nextSuggestedPractice =
    metrics.weakestSkill ?? focusSkill ?? 'System Design'

  return {
    interviewsThisWeek,
    interviewsLastWeek,
    avgScoreChange,
    scoreTrendLabel,
    nextSuggestedPractice,
    focusSkill,
    weeklyActivity: computeWeeklyActivity(attempts),
    skills,
  }
}

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const [interviewsSnap, attemptsSnap] = await Promise.all([
    adminDb.collection('interviews').where('userId', '==', userId).limit(50).get(),
    adminDb.collection('attempts').where('userId', '==', userId).limit(100).get(),
  ])

  const interviews = interviewsSnap.docs.map((doc) => doc.data())
  const attempts = attemptsSnap.docs.map((doc) => doc.data())

  const attemptsByInterview = new Map<string, typeof attempts>()
  for (const attempt of attempts) {
    const list = attemptsByInterview.get(attempt.interviewId) ?? []
    list.push(attempt)
    attemptsByInterview.set(attempt.interviewId, list)
  }

  const interviewCards: DashboardInterview[] = interviews.map((interview) => {
    const related = attemptsByInterview.get(interview.id) ?? []
    const completed = related.filter((a) => a.status === 'COMPLETE')
    const inProgress = related.find((a) =>
      ['IN_PROGRESS', 'READY', 'PLANNING', 'EVALUATING', 'COACHING'].includes(a.status)
    )
    const latestComplete = completed
      .filter((a) => a.evaluation)
      .sort((a, b) => toMillis(b.completedAt) - toMillis(a.completedAt))[0]

    let progressPercent = 0
    if (latestComplete?.evaluation) progressPercent = 100
    else if (inProgress) {
      const total = inProgress.questions?.length ?? 0
      const idx = inProgress.currentQuestionIndex ?? 0
      progressPercent = total > 0 ? Math.round(((idx + 1) / total) * 100) : 10
    }

    return {
      id: interview.id,
      role: interview.role,
      difficulty: interview.difficulty,
      status: interview.status ?? 'ACTIVE',
      techStack: interview.techStack ?? [],
      progressPercent,
      lastAttemptScore: latestComplete?.evaluation?.percentageScore,
      completedAt: latestComplete?.completedAt
        ? formatStartedLabel(latestComplete.completedAt)
        : undefined,
      interviewType: interview.interviewType ?? 'Technical',
    }
  })

  interviewCards.sort((a, b) => {
    const aComplete = a.lastAttemptScore !== undefined ? 1 : 0
    const bComplete = b.lastAttemptScore !== undefined ? 1 : 0
    return bComplete - aComplete
  })

  const attemptSummaries: AttemptSummary[] = attempts.map((a) => ({
    id: a.id,
    interviewId: a.interviewId,
    status: a.status,
    evaluation: (a.evaluation as EvaluationResult | null) ?? null,
    startedAt: a.startedAt ?? null,
    completedAt: a.completedAt ?? null,
    createdAt: a.createdAt ?? null,
  }))

  const inProgressRaw = attempts.find((a) => a.status === 'IN_PROGRESS')
  let inProgressAttempt: InProgressAttempt | null = null
  if (inProgressRaw) {
    const interview = interviews.find((i) => i.id === inProgressRaw.interviewId)
    const totalQuestions = inProgressRaw.questions?.length ?? 0
    const questionIndex = (inProgressRaw.currentQuestionIndex ?? 0) + 1
    const startedMs = toMillis(inProgressRaw.startedAt ?? inProgressRaw.createdAt)
    const elapsedMinutes = startedMs > 0 ? Math.max(1, Math.round((Date.now() - startedMs) / 60_000)) : 0

    inProgressAttempt = {
      id: inProgressRaw.id,
      interviewId: inProgressRaw.interviewId,
      role: interview?.role ?? 'Interview',
      progressPercent:
        totalQuestions > 0 ? Math.round((questionIndex / totalQuestions) * 100) : 10,
      questionIndex,
      totalQuestions: totalQuestions || 10,
      elapsedMinutes,
      startedLabel: formatStartedLabel(inProgressRaw.startedAt ?? inProgressRaw.createdAt),
    }
  }

  const metrics = computeProgressMetrics(attemptSummaries, interviews.length)

  return {
    interviews: interviewCards,
    metrics,
    inProgressAttempt,
    insights: computeInsights(attemptSummaries, metrics),
  }
}
