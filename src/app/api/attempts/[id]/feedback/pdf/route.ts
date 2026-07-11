import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { renderFeedbackPdf } from '@/lib/feedback-pdf'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import type { FeedbackReportData } from '@/components/interview/FeedbackReport'
import type { EvaluationResult, PracticePlan } from '@/types/interview'

function toReportData(
  evaluation: EvaluationResult,
  practicePlan: PracticePlan
): FeedbackReportData {
  return {
    overallScore: evaluation.overallScore,
    maxScore: evaluation.maxScore,
    percentageScore: evaluation.percentageScore,
    perQuestionScores: evaluation.perQuestionScores.map((q, index) => ({
      questionIndex: q.questionIndex,
      questionText: `Question ${index + 1}`,
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

export const GET = withLoggedRoute<{ id: string }>('export_feedback_pdf', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const data = attemptSnap.data()!
    if (!data.evaluation || !data.practicePlan) {
      return NextResponse.json({ error: 'Feedback not ready' }, { status: 409 })
    }

    const interviewSnap = await adminDb.collection('interviews').doc(data.interviewId).get()
    const role = interviewSnap.data()?.role as string | undefined

    const report = toReportData(data.evaluation, data.practicePlan)
    const buffer = await renderFeedbackPdf(report, role)

    await writeAuditLog({
      userId: user.uid,
      action: 'export_feedback_pdf',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mockai-feedback-${id}.pdf"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
