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
  if (cookie) {
    headers.set('cookie', `session=${cookie}`)
  }
  return new NextRequest('http://localhost/api/test', { headers })
}

describe('requireAuth', () => {
  beforeEach(() => {
    vi.mocked(adminAuth.verifySessionCookie).mockReset()
  })

  it('throws UnauthorizedError when session cookie is missing', async () => {
    await expect(requireAuth(makeRequest())).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('throws UnauthorizedError when session cookie is invalid', async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockRejectedValue(new Error('invalid'))
    await expect(requireAuth(makeRequest('bad-token'))).rejects.toBeInstanceOf(
      UnauthorizedError
    )
  })

  it('returns decoded token for valid session cookie', async () => {
    const decoded = { uid: 'user-123', email: 'test@example.com' }
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue(decoded as never)
    const result = await requireAuth(makeRequest('valid-token'))
    expect(result.uid).toBe('user-123')
    expect(adminAuth.verifySessionCookie).toHaveBeenCalledWith('valid-token', true)
  })
})
