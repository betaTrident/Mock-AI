import { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from '@/lib/auth-constants'
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from '@/lib/auth-constants'
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

export async function requireAuth(request: NextRequest): Promise<DecodedIdToken> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!sessionCookie) throw new UnauthorizedError()
  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch {
    throw new UnauthorizedError()
  }
}

export function assertOwnership(
  resourceUserId: string,
  requestingUserId: string
): void {
  if (resourceUserId !== requestingUserId) {
    throw new UnauthorizedError()
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE_MS / 1000,
  }
}
