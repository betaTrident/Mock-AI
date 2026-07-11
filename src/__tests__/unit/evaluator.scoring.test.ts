import { describe, expect, it } from 'vitest'

import {
  computeOverallFromQuestions,
  computePercentageScore,
  normalizeEvaluationScores,
} from '@/lib/evaluator-scoring'

describe('computePercentageScore', () => {
  it('returns rounded percentage for valid scores', () => {
    expect(computePercentageScore(34, 50)).toBe(68)
    expect(computePercentageScore(40, 50)).toBe(80)
  })

  it('returns 0 when maxScore is zero or negative', () => {
    expect(computePercentageScore(10, 0)).toBe(0)
    expect(computePercentageScore(10, -5)).toBe(0)
  })

  it('clamps percentage to 0–100', () => {
    expect(computePercentageScore(60, 50)).toBe(100)
    expect(computePercentageScore(-5, 50)).toBe(0)
  })
})

describe('computeOverallFromQuestions', () => {
  it('sums per-question scores with mock rubric', () => {
    const result = computeOverallFromQuestions([
      { score: 8, maxScore: 10 },
      { score: 6, maxScore: 10 },
      { score: 7, maxScore: 10 },
    ])
    expect(result).toEqual({ overallScore: 21, maxScore: 30 })
  })

  it('returns zeros for empty question list', () => {
    expect(computeOverallFromQuestions([])).toEqual({ overallScore: 0, maxScore: 0 })
  })
})

describe('normalizeEvaluationScores', () => {
  it('fills percentageScore when missing but overall/max are present', () => {
    const result = normalizeEvaluationScores({
      overallScore: 34,
      maxScore: 50,
      percentageScore: 0,
      perQuestionScores: [],
    })
    expect(result.percentageScore).toBe(68)
  })

  it('recomputes overall from per-question scores when provided', () => {
    const result = normalizeEvaluationScores({
      overallScore: 0,
      maxScore: 0,
      percentageScore: 0,
      perQuestionScores: [
        { questionIndex: 0, score: 8, maxScore: 10, feedback: '', evidenceQuotes: [] },
        { questionIndex: 1, score: 7, maxScore: 10, feedback: '', evidenceQuotes: [] },
      ],
    })
    expect(result.overallScore).toBe(15)
    expect(result.maxScore).toBe(20)
    expect(result.percentageScore).toBe(75)
  })
})
