import { NextRequest, NextResponse } from 'next/server'

import { completeAttempt, type AttemptDocument } from '@/agents/orchestrator'
import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import type { Interview } from '@/types/interview'

export const POST = withLoggedRoute<{ id: string }>('complete_attempt', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'complete_attempt',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const attempt = attemptSnap.data() as AttemptDocument
    const interviewSnap = await adminDb
      .collection('interviews')
      .doc(attempt.interviewId)
      .get()
    if (!interviewSnap.exists) {
      await writeAuditLog({
        userId: user.uid,
        action: 'complete_attempt',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'INTERVIEW_NOT_FOUND',
      })
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const result = await completeAttempt(
      attempt,
      interviewSnap.data() as Interview
    )

    await writeAuditLog({
      userId: user.uid,
      action: 'complete_attempt',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json(result)
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'complete_attempt',
      resourceId: 'unknown',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
