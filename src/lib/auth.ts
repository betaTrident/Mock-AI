import { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

export async function requireAuth(request: NextRequest): Promise<DecodedIdToken> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) throw new UnauthorizedError()
  try {
    return await adminAuth.verifyIdToken(token)
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
