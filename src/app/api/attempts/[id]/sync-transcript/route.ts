import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import { syncTranscriptSchema } from '@/lib/validations/attempt'

export const POST = withLoggedRoute<{ id: string }>('sync_transcript', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const attempt = attemptSnap.data()!
    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Attempt not in progress' }, { status: 409 })
    }

    const body = await request.json()
    const parsed = syncTranscriptSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const existingIds = new Set(
      (attempt.transcriptEvents ?? []).map((e: { id: string }) => e.id)
    )
    const newEvents = parsed.data.events
      .filter((e) => !existingIds.has(e.id))
      .map((e) => ({
        id: e.id,
        attemptId: id,
        role: e.role,
        content: e.content,
        questionIndex: e.questionIndex,
        agentName: e.agentName,
        timestamp: FieldValue.serverTimestamp(),
      }))

    if (newEvents.length > 0) {
      await adminDb
        .collection('attempts')
        .doc(id)
        .update({
          transcriptEvents: FieldValue.arrayUnion(...newEvents),
        })
    }

    await writeAuditLog({
      userId: user.uid,
      action: 'sync_transcript',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json({ synced: newEvents.length })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'sync_transcript',
      resourceId: 'unknown',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
