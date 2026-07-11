import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const logEntries: Record<string, unknown>[] = []

vi.mock('pino', () => {
  const makeLogger = () => ({
    info: (entry: Record<string, unknown>) => logEntries.push(entry),
    error: (entry: Record<string, unknown>) => logEntries.push(entry),
    warn: (entry: Record<string, unknown>) => logEntries.push(entry),
    child: () => makeLogger(),
  })

  return { default: vi.fn(() => makeLogger()) }
})

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifySessionCookie: vi.fn().mockResolvedValue({ uid: 'firebase-user-99' }),
  },
}))

import { requireAuth } from '@/lib/auth'
import { withLoggedRoute } from '@/lib/route-handler'

describe('requireAuth route logging', () => {
  beforeEach(() => {
    logEntries.length = 0
  })

  it('sets userId on active route log after successful auth', async () => {
    const handler = withLoggedRoute('test_action', async (request) => {
      await requireAuth(request)
      return NextResponse.json({ ok: true })
    })

    const request = new NextRequest('http://localhost/api/test', {
      headers: { cookie: 'session=valid-token' },
    })

    const response = await handler(request, { params: Promise.resolve({}) })
    expect(response.status).toBe(200)

    const completeEntry = logEntries.find((e) => e.msg === 'request_complete')
    expect(completeEntry?.userId).toBe('firebase-user-99')
  })
})
