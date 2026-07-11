import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'

export const GET = withLoggedRoute<{ id: string }>('get_interview', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)
  const { id } = await context.params

  try {
    const user = await requireAuth(request)
    const interview = await adminDb.collection('interviews').doc(id).get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'get_interview',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await writeAuditLog({
      userId: user.uid,
      action: 'get_interview',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })
    return NextResponse.json({ interview: interview.data() })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'get_interview',
      resourceId: id,
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})

export const DELETE = withLoggedRoute<{ id: string }>('delete_interview', async (request, context) => {
  const { ip, userAgent } = getClientInfo(request)
  const { id } = await context.params

  try {
    const user = await requireAuth(request)
    const interview = await adminDb.collection('interviews').doc(id).get()
    if (!interview.exists || interview.data()!.userId !== user.uid) {
      await writeAuditLog({
        userId: user.uid,
        action: 'delete_interview',
        resourceId: id,
        ip,
        userAgent,
        success: false,
        errorCode: 'NOT_FOUND',
      })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await adminDb.collection('interviews').doc(id).delete()

    await writeAuditLog({
      userId: user.uid,
      action: 'delete_interview',
      resourceId: id,
      ip,
      userAgent,
      success: true,
    })
    return NextResponse.json({ deleted: true })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'delete_interview',
      resourceId: id,
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
