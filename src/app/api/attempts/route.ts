import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const interviewId = body?.interviewId as string | undefined
    if (!interviewId) {
      return NextResponse.json({ error: 'interviewId required' }, { status: 400 })
    }
    const interview = await adminDb.collection('interviews').doc(interviewId).get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ id: 'stub' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
