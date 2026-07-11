import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const POST = withLoggedRoute<{ id: string }>('share_feedback', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const { id } = await context.params
    const attemptSnap = await adminDb.collection('attempts').doc(id).get()
    if (!attemptSnap.exists || attemptSnap.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const data = attemptSnap.data()!
    if (data.status !== 'COMPLETE' || !data.feedbackReport) {
      return NextResponse.json({ error: 'Feedback not ready' }, { status: 409 })
    }

    const slug = data.feedbackReport.publicSlug ?? nanoid(12)
    await adminDb.collection('attempts').doc(id).update({
      'feedbackReport.isPublic': true,
      'feedbackReport.publicSlug': slug,
    })

    await writeAuditLog({
      userId: user.uid,
      action: 'share_feedback',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json({ slug, url: `/feedback/${slug}` })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
