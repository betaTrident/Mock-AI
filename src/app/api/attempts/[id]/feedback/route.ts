import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attempt = await adminDb.collection('attempts').doc(id).get()
    if (!attempt.exists || attempt.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const data = attempt.data()!
    return NextResponse.json({
      feedback: data.feedbackReport ?? null,
      evaluation: data.evaluation ?? null,
      practicePlan: data.practicePlan ?? null,
      status: data.status,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
