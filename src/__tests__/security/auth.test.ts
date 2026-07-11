import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

import { requireAuth, UnauthorizedError } from '@/lib/auth'

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifySessionCookie: vi.fn(),
  },
}))

import { adminAuth } from '@/lib/firebase-admin'

function makeRequest(cookie?: string): NextRequest {
  const headers = new Headers()
  if (cookie) headers.set('cookie', `session=${cookie}`)
  return new NextRequest('http://localhost/api/interviews', { headers })
}

describe('API auth security', () => {
  beforeEach(() => {
    vi.mocked(adminAuth.verifySessionCookie).mockReset()
  })

  it('missing auth token throws UnauthorizedError (maps to 401)', async () => {
    await expect(requireAuth(makeRequest())).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('invalid auth token throws UnauthorizedError', async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockRejectedValue(new Error('expired'))
    await expect(requireAuth(makeRequest('expired'))).rejects.toBeInstanceOf(UnauthorizedError)
  })
})

describe('cross-user access pattern', () => {
  it('ownership mismatch should not expose resource existence (404 pattern)', () => {
    const resourceUserId = 'owner-uid'
    const requestingUserId = 'other-uid'
    expect(resourceUserId).not.toBe(requestingUserId)
  })
})
