import { NextRequest, NextResponse } from 'next/server'

import { completeAttempt, type AttemptDocument } from '@/agents/orchestrator'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import type { Interview } from '@/types/interview'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const attempt = attemptSnap.data() as AttemptDocument
    const interviewSnap = await adminDb
      .collection('interviews')
      .doc(attempt.interviewId)
      .get()
    if (!interviewSnap.exists) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const result = await completeAttempt(
      attempt,
      interviewSnap.data() as Interview
    )

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
