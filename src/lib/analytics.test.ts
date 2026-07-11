import { describe, expect, it } from 'vitest'

import { computeProgressMetrics, computeStreak } from '@/lib/analytics'

describe('computeStreak', () => {
  it('returns 0 when no dates', () => {
    expect(computeStreak([])).toBe(0)
  })

  it('counts consecutive days ending today or yesterday', () => {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
    expect(computeStreak([today, yesterday])).toBe(2)
  })
})

describe('computeProgressMetrics', () => {
  it('computes averages from completed attempts', () => {
    const metrics = computeProgressMetrics(
      [
        {
          id: 'a1',
          interviewId: 'i1',
          status: 'COMPLETE',
          evaluation: {
            attemptId: 'a1',
            overallScore: 34,
            maxScore: 50,
            percentageScore: 68,
            perQuestionScores: [],
            strengths: ['Communication'],
            areasForImprovement: ['System design'],
            rubricVersion: '1',
            evaluatedAt: {} as never,
          },
          startedAt: null,
          completedAt: null,
          createdAt: null,
        },
        {
          id: 'a2',
          interviewId: 'i1',
          status: 'COMPLETE',
          evaluation: {
            attemptId: 'a2',
            overallScore: 40,
            maxScore: 50,
            percentageScore: 80,
            perQuestionScores: [],
            strengths: ['Communication'],
            areasForImprovement: ['Algorithms'],
            rubricVersion: '1',
            evaluatedAt: {} as never,
          },
          startedAt: null,
          completedAt: null,
          createdAt: null,
        },
      ],
      2
    )

    expect(metrics.avgScore).toBe(74)
    expect(metrics.completedAttempts).toBe(2)
    expect(metrics.strongestSkill).toBe('Communication')
  })
})
