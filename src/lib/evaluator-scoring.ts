export type PerQuestionScore = {
  questionIndex: number
  score: number
  maxScore: number
  feedback: string
  evidenceQuotes: string[]
}

export type EvaluationScores = {
  overallScore: number
  maxScore: number
  percentageScore: number
  perQuestionScores: PerQuestionScore[]
}

export function computePercentageScore(overallScore: number, maxScore: number): number {
  if (maxScore <= 0) return 0
  const raw = Math.round((overallScore / maxScore) * 100)
  return Math.min(100, Math.max(0, raw))
}

export function computeOverallFromQuestions(
  perQuestionScores: Pick<PerQuestionScore, 'score' | 'maxScore'>[]
): { overallScore: number; maxScore: number } {
  if (perQuestionScores.length === 0) {
    return { overallScore: 0, maxScore: 0 }
  }
  const overallScore = perQuestionScores.reduce((sum, q) => sum + q.score, 0)
  const maxScore = perQuestionScores.reduce((sum, q) => sum + q.maxScore, 0)
  return { overallScore, maxScore }
}

export function normalizeEvaluationScores(
  evaluation: EvaluationScores
): EvaluationScores {
  let { overallScore, maxScore, percentageScore } = evaluation
  const { perQuestionScores } = evaluation

  if (perQuestionScores.length > 0 && (overallScore === 0 || maxScore === 0)) {
    const totals = computeOverallFromQuestions(perQuestionScores)
    overallScore = totals.overallScore
    maxScore = totals.maxScore
  }

  if (!percentageScore && maxScore > 0) {
    percentageScore = computePercentageScore(overallScore, maxScore)
  }

  return { overallScore, maxScore, percentageScore, perQuestionScores }
}
