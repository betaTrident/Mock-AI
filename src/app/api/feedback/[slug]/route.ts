import { NextRequest, NextResponse } from 'next/server'

import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const GET = withLoggedRoute<{ slug: string }>('public_feedback', async (_request, context) => {
  const { slug } = await context.params

  const snapshot = await adminDb
    .collection('attempts')
    .where('feedbackReport.publicSlug', '==', slug)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = snapshot.docs[0].data()
  if (!data.feedbackReport?.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    feedback: data.feedbackReport,
    evaluation: data.evaluation ?? null,
    practicePlan: data.practicePlan ?? null,
  })
})
