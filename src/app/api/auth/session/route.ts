import { NextRequest, NextResponse } from 'next/server'

import { getClientInfo, writeAuditLog } from '@/lib/audit'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  sessionCookieOptions,
} from '@/lib/auth'
import { adminAuth } from '@/lib/firebase-admin'
import { withLoggedRoute } from '@/lib/route-handler'
import { sessionTokenSchema } from '@/lib/validations/auth'

function isSameOriginRequest(request: NextRequest): boolean {
  const expectedOrigin = request.nextUrl.origin
  const origin = request.headers.get('origin')
  if (origin) return origin === expectedOrigin

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin
    } catch {
      return false
    }
  }
  return false
}

export const POST = withLoggedRoute('auth_session', async (request) => {
  const { ip, userAgent } = getClientInfo(request)

  if (request.headers.get('x-session-request') !== '1' || !isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = sessionTokenSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const decoded = await adminAuth.verifyIdToken(parsed.data.idToken)
    const sessionCookie = await adminAuth.createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    })

    const response = NextResponse.json({ status: 'authenticated', uid: decoded.uid })
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, sessionCookieOptions())

    await writeAuditLog({
      userId: decoded.uid,
      action: 'auth_session',
      resourceId: decoded.uid,
      ip,
      userAgent,
      success: true,
    })

    return response
  } catch {
    await writeAuditLog({
      userId: 'anonymous',
      action: 'auth_session',
      resourceId: 'session',
      ip,
      userAgent,
      success: false,
      errorCode: 'INVALID_TOKEN',
    })
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
})

export const DELETE = withLoggedRoute('auth_sign_out', async (request) => {
  const { ip, userAgent } = getClientInfo(request)
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  let userId = 'anonymous'

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie)
      userId = decoded.uid
      await adminAuth.revokeRefreshTokens(decoded.uid)
    } catch {
      // Cookie may already be invalid — still clear it
    }
  }

  const response = NextResponse.json({ status: 'signed_out' })
  response.cookies.set(SESSION_COOKIE_NAME, '', { ...sessionCookieOptions(), maxAge: 0 })

  await writeAuditLog({
    userId,
    action: 'auth_sign_out',
    resourceId: userId,
    ip,
    userAgent,
    success: true,
  })

  return response
})
