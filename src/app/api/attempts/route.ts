import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import { createAttemptSchema } from '@/lib/validations/attempt'

export const GET = withLoggedRoute('list_attempts', async (request) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const snapshot = await adminDb
      .collection('attempts')
      .where('userId', '==', user.uid)
      .limit(100)
      .get()

    const attempts = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: data.id,
        interviewId: data.interviewId,
        status: data.status,
        evaluation: data.evaluation ?? null,
        startedAt: data.startedAt ?? null,
        completedAt: data.completedAt ?? null,
        createdAt: data.createdAt ?? null,
      }
    })

    await writeAuditLog({
      userId: user.uid,
      action: 'list_attempts',
      resourceId: 'list',
      ip,
      userAgent,
      success: true,
    })
    return NextResponse.json({ attempts })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'list_attempts',
      resourceId: 'list',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})

export const POST = withLoggedRoute('start_attempt', async (request) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const parsed = createAttemptSchema.safeParse(body)
    if (!parsed.success) {
      await writeAuditLog({
        userId: user.uid,
        action: 'start_attempt',
        resourceId: 'new',
        ip,
        userAgent,
        success: false,
        errorCode: 'VALIDATION_ERROR',
      })
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const interview = await adminDb
      .collection('interviews')
      .doc(parsed.data.interviewId)
      .get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'start_attempt',
        resourceId: parsed.data.interviewId,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const ref = adminDb.collection('attempts').doc()
    await ref.set({
      id: ref.id,
      interviewId: parsed.data.interviewId,
      userId: user.uid,
      status: 'PENDING',
      currentQuestionIndex: 0,
      questions: [],
      transcriptEvents: [],
      plannerOutput: null,
      evaluation: null,
      feedbackReport: null,
      practicePlan: null,
      startedAt: null,
      completedAt: null,
      metadata: {},
      createdAt: FieldValue.serverTimestamp(),
    })

    await writeAuditLog({
      userId: user.uid,
      action: 'start_attempt',
      resourceId: ref.id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json({ id: ref.id, status: 'PENDING' }, { status: 201 })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'start_attempt',
      resourceId: 'new',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
