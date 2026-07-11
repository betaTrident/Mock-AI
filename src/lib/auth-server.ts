import { cookies } from 'next/headers'
import type { DecodedIdToken } from 'firebase-admin/auth'

import { SESSION_COOKIE_NAME } from '@/lib/auth-constants'
import { adminAuth } from '@/lib/firebase-admin'

export class ServerUnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

export async function requireServerAuth(): Promise<DecodedIdToken> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!sessionCookie) throw new ServerUnauthorizedError()
  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch {
    throw new ServerUnauthorizedError()
  }
}
