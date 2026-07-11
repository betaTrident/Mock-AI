import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const GET = withLoggedRoute<{ id: string }>('get_feedback', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attempt = await adminDb.collection('attempts').doc(id).get()
    if (!attempt.exists || attempt.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'get_feedback',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const data = attempt.data()!

    await writeAuditLog({
      userId: user.uid,
      action: 'get_feedback',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json({
      feedback: data.feedbackReport ?? null,
      evaluation: data.evaluation ?? null,
      practicePlan: data.practicePlan ?? null,
      status: data.status,
    })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'get_feedback',
      resourceId: 'unknown',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
