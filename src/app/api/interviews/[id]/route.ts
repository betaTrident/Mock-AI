import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const GET = withLoggedRoute<{ id: string }>('get_interview', async (request, context) => {
  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const interview = await adminDb.collection('interviews').doc(id).get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ interview: interview.data() })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})

export const DELETE = withLoggedRoute<{ id: string }>('delete_interview', async (request, context) => {
  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const interview = await adminDb.collection('interviews').doc(id).get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ deleted: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
