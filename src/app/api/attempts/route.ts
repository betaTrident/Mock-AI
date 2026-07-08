import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { createAttemptSchema } from '@/lib/validations/attempt'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const parsed = createAttemptSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const interview = await adminDb
      .collection('interviews')
      .doc(parsed.data.interviewId)
      .get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
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

    return NextResponse.json({ id: ref.id, status: 'PENDING' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
