"use client"

import { useEffect, useState } from "react"

import { FeedbackReport, type FeedbackReportData } from "@/components/interview/FeedbackReport"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { PageHeader } from "@/components/shared/PageHeader"
import type { EvaluationResult, PracticePlan } from "@/types/interview"

type PublicFeedbackPageProps = {
  slug: string
}

function toReportData(
  evaluation: EvaluationResult,
  practicePlan: PracticePlan
): FeedbackReportData {
  return {
    overallScore: evaluation.overallScore,
    maxScore: evaluation.maxScore,
    percentageScore: evaluation.percentageScore,
    perQuestionScores: evaluation.perQuestionScores.map((q) => ({
      questionIndex: q.questionIndex,
      questionText: `Question ${q.questionIndex + 1}`,
      score: q.score,
      maxScore: q.maxScore,
      feedback: q.feedback,
    })),
    strengths: evaluation.strengths,
    areasForImprovement: evaluation.areasForImprovement,
    practicePlan: {
      summary: practicePlan.summary,
      weeklyGoals: practicePlan.weeklyGoals,
      resources: practicePlan.resources,
      focusAreas: practicePlan.focusAreas,
      estimatedImprovementWeeks: practicePlan.estimatedImprovementWeeks,
    },
  }
}

export function PublicFeedbackPageClient({ slug }: PublicFeedbackPageProps) {
  const [report, setReport] = useState<FeedbackReportData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/feedback/${slug}`)
        if (!response.ok) throw new Error("Not found")
        const data = (await response.json()) as {
          evaluation: EvaluationResult | null
          practicePlan: PracticePlan | null
        }
        if (!cancelled && data.evaluation && data.practicePlan) {
          setReport(toReportData(data.evaluation, data.practicePlan))
        }
      } catch {
        if (!cancelled) setError("This feedback link is invalid or has expired.")
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Shared Interview Feedback"
        description="Read-only feedback report shared by a MockAI user."
      />
      {error ? (
        <p className="text-center text-muted-foreground">{error}</p>
      ) : report ? (
        <FeedbackReport report={report} />
      ) : (
        <LoadingSkeleton variant="page" count={4} />
      )}
    </main>
  )
}
