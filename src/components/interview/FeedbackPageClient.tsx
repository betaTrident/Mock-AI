"use client"

import { useCallback, useEffect, useState } from "react"
import { FileDownIcon, LinkIcon } from "lucide-react"
import { toast } from "sonner"

import { FeedbackReport, type FeedbackReportData } from "@/components/interview/FeedbackReport"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { PLACEHOLDER_FEEDBACK } from "@/lib/placeholder-data"
import type { EvaluationResult, PracticePlan } from "@/types/interview"

type FeedbackPageClientProps = {
  attemptId: string
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

export function FeedbackPageClient({ attemptId }: FeedbackPageClientProps) {
  const [report, setReport] = useState<FeedbackReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/attempts/${attemptId}/feedback`, {
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to load feedback")
        const data = (await response.json()) as {
          evaluation: EvaluationResult | null
          practicePlan: PracticePlan | null
        }
        if (!cancelled && data.evaluation && data.practicePlan) {
          setReport(toReportData(data.evaluation, data.practicePlan))
        }
      } catch {
        if (!cancelled) toast.error("Could not load feedback — showing demo data")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [attemptId])

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/attempts/${attemptId}/feedback/pdf`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Export failed")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `mockai-feedback-${attemptId}.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success("PDF downloaded")
    } catch {
      toast.error("Could not export PDF")
    } finally {
      setIsExporting(false)
    }
  }, [attemptId])

  const handleShare = useCallback(async () => {
    setIsSharing(true)
    try {
      const response = await fetch(`/api/attempts/${attemptId}/feedback/share`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Share failed")
      const data = (await response.json()) as { url: string }
      const fullUrl = `${window.location.origin}${data.url}`
      await navigator.clipboard.writeText(fullUrl)
      toast.success("Share link copied to clipboard")
    } catch {
      toast.error("Could not create share link")
    } finally {
      setIsSharing(false)
    }
  }, [attemptId])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <PageHeader
          title="Interview Feedback"
          description="Structured evaluation and practice plan from your coaching session."
          badge="Complete"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Interview", href: `/interview/${attemptId}` },
            { label: "Feedback" },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={isSharing || isLoading}
                aria-label="Copy share link"
              >
                <LinkIcon data-icon="inline-start" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPdf}
                disabled={isExporting || isLoading}
                aria-label="Export feedback as PDF"
              >
                <FileDownIcon data-icon="inline-start" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          }
        />

        {isLoading ? (
          <LoadingSkeleton variant="page" count={4} />
        ) : (
          <FeedbackReport report={report ?? PLACEHOLDER_FEEDBACK} />
        )}
      </div>
  )
}
