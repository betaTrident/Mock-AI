import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const GET = withLoggedRoute<{ id: string }>('get_attempt', async (request, context) => {
  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attempt = await adminDb.collection('attempts').doc(id).get()
    if (!attempt.exists || attempt.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ attempt: attempt.data() })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
