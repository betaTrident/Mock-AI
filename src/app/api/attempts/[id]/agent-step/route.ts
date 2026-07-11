import { NextRequest, NextResponse } from 'next/server'

import { advanceAttempt, type AttemptDocument } from '@/agents/orchestrator'
import { guardInput } from '@/agents/safety.guard'
import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import { agentStepSchema } from '@/lib/validations/attempt'
import type { Interview } from '@/types/interview'

export const POST = withLoggedRoute<{ id: string }>('agent_step', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'agent_step',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const parsed = agentStepSchema.safeParse(body)
    if (!parsed.success) {
      await writeAuditLog({
        userId: user.uid,
        action: 'agent_step',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'VALIDATION_ERROR',
      })
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    if (parsed.data.candidateMessage) {
      const guard = await guardInput(parsed.data.candidateMessage)
      if (!guard.safe) {
        await writeAuditLog({
          userId: user.uid,
          action: 'agent_step',
          resourceId: id,
          ip,
          userAgent,
          success: false,
          errorCode: guard.reason,
        })
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
      }
    }

    const attempt = attemptSnap.data() as AttemptDocument
    const interviewSnap = await adminDb
      .collection('interviews')
      .doc(attempt.interviewId)
      .get()
    if (!interviewSnap.exists) {
      await writeAuditLog({
        userId: user.uid,
        action: 'agent_step',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'INTERVIEW_NOT_FOUND',
      })
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const result = await advanceAttempt(
      attempt,
      interviewSnap.data() as Interview,
      { candidateMessage: parsed.data.candidateMessage }
    )

    await writeAuditLog({
      userId: user.uid,
      action: 'agent_step',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }
    await writeAuditLog({
      userId: 'anonymous',
      action: 'agent_step',
      resourceId: 'unknown',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
