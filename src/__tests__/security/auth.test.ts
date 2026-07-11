import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

import { requireAuth, UnauthorizedError } from '@/lib/auth'

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifySessionCookie: vi.fn(),
  },
  adminDb: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(async () => ({
          exists: true,
          data: () => ({ userId: 'owner-uid' }),
        })),
      })),
    })),
  },
}))

vi.mock('@/lib/audit', () => ({
  getClientInfo: () => ({ ip: '127.0.0.1', userAgent: 'vitest' }),
  writeAuditLog: vi.fn(),
}))

import { adminAuth } from '@/lib/firebase-admin'
import { GET as getAttempt } from '@/app/api/attempts/[id]/route'

function makeRequest(cookie?: string): NextRequest {
  const headers = new Headers()
  if (cookie) headers.set('cookie', `session=${cookie}`)
  return new NextRequest('http://localhost/api/interviews', { headers })
}

function authedGetAttempt(attemptId: string): NextRequest {
  return new NextRequest(`http://localhost/api/attempts/${attemptId}`, {
    headers: { cookie: 'session=valid' },
  })
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
  beforeEach(() => {
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({ uid: 'other-uid' } as never)
  })

  it('returns 404 when requesting another user attempt (not 403)', async () => {
    const res = await getAttempt(authedGetAttempt('attempt-1'), {
      params: Promise.resolve({ id: 'attempt-1' }),
    })
    expect(res.status).toBe(404)
    const body = (await res.json()) as { error: string }
    expect(body.error).toBe('Not found')
  })
})
