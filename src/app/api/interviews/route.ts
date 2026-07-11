import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import { createInterviewSchema } from '@/lib/validations/interview'

export const GET = withLoggedRoute('list_interviews', async (request) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const snapshot = await adminDb
      .collection('interviews')
      .where('userId', '==', user.uid)
      .limit(50)
      .get()

    const interviews = snapshot.docs.map((doc) => doc.data())

    await writeAuditLog({
      userId: user.uid,
      action: 'list_interviews',
      resourceId: 'list',
      ip,
      userAgent,
      success: true,
    })
    return NextResponse.json({ interviews })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'list_interviews',
      resourceId: 'list',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})

export const POST = withLoggedRoute('create_interview', async (request) => {
  const { ip, userAgent } = getClientInfo(request)

  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const parsed = createInterviewSchema.safeParse(body)
    if (!parsed.success) {
      await writeAuditLog({
        userId: user.uid,
        action: 'create_interview',
        resourceId: 'new',
        ip,
        userAgent,
        success: false,
        errorCode: 'VALIDATION_ERROR',
      })
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const ref = adminDb.collection('interviews').doc()
    await ref.set({
      id: ref.id,
      userId: user.uid,
      role: parsed.data.role,
      description: parsed.data.description,
      experience: parsed.data.experience,
      difficulty: parsed.data.difficulty,
      techStack: parsed.data.techStack,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    await writeAuditLog({
      userId: user.uid,
      action: 'create_interview',
      resourceId: ref.id,
      ip,
      userAgent,
      success: true,
    })

    return NextResponse.json({ id: ref.id }, { status: 201 })
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'create_interview',
      resourceId: 'new',
      ip,
      userAgent,
      success: false,
      errorCode: 'UNAUTHORIZED',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
})
