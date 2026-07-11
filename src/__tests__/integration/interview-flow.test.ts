import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/firebase-admin', () => {
  const interviews = new Map<string, Record<string, unknown>>()
  const attempts = new Map<string, Record<string, unknown>>()

  return {
    adminAuth: {
      verifySessionCookie: vi.fn().mockResolvedValue({ uid: 'user-1' }),
    },
    adminDb: {
      collection: vi.fn((name: string) => ({
        doc: vi.fn((id?: string) => {
          const docId = id ?? `gen-${name}-${Date.now()}`
          return {
            id: docId,
            get: vi.fn(async () => {
              const store = name === 'interviews' ? interviews : attempts
              const data = store.get(docId)
              return { exists: Boolean(data), data: () => data }
            }),
            set: vi.fn(async (data: Record<string, unknown>) => {
              const store = name === 'interviews' ? interviews : attempts
              store.set(docId, data)
            }),
          }
        }),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn(async () => ({ docs: [] })),
      })),
    },
    __stores: { interviews, attempts },
  }
})

import { POST as createInterview } from '@/app/api/interviews/route'
import { POST as createAttempt } from '@/app/api/attempts/route'

const emptyContext = { params: Promise.resolve({}) }

function authedRequest(url: string, body?: unknown): NextRequest {
  return new NextRequest(
    new Request(url, {
      method: 'POST',
      headers: {
        cookie: 'session=valid',
        'content-type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  )
}

describe('interview creation flow', () => {
  beforeEach(async () => {
    const { adminAuth } = await import('@/lib/firebase-admin')
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({ uid: 'user-1' } as never)
  })

  it('returns 401 for unauthenticated interview creation', async () => {
    const res = await createInterview(
      new NextRequest('http://localhost/api/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          role: 'Backend Engineer',
          description: 'Building scalable APIs with Node.js and PostgreSQL.',
          experience: 3,
          difficulty: 'mid',
          techStack: ['Node.js'],
        }),
      })
    , emptyContext)
    expect(res.status).toBe(401)
  })

  it('returns 400 for malformed interview input', async () => {
    const res = await createInterview(
      authedRequest('http://localhost/api/interviews', { role: 'X' }),
      emptyContext
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('creates interview then attempt for authenticated user', async () => {
    const interviewRes = await createInterview(
      authedRequest('http://localhost/api/interviews', {
        role: 'Backend Engineer',
        description: 'Building scalable APIs with Node.js and PostgreSQL.',
        experience: 3,
        difficulty: 'mid',
        techStack: ['Node.js'],
      })
    , emptyContext)
    expect(interviewRes.status).toBe(201)
    const { id: interviewId } = await interviewRes.json()

    const { __stores } = (await import('@/lib/firebase-admin')) as unknown as {
      __stores: { interviews: Map<string, Record<string, unknown>> }
    }
    __stores.interviews.set(interviewId, {
      id: interviewId,
      userId: 'user-1',
      role: 'Backend Engineer',
    })

    const attemptRes = await createAttempt(
      authedRequest('http://localhost/api/attempts', { interviewId }),
      emptyContext
    )
    expect(attemptRes.status).toBe(201)
    const attempt = await attemptRes.json()
    expect(attempt.status).toBe('PENDING')
  })

  it('returns 404 for cross-user interview access', async () => {
    const { __stores } = (await import('@/lib/firebase-admin')) as unknown as {
      __stores: { interviews: Map<string, Record<string, unknown>> }
    }
    __stores.interviews.set('other-interview', {
      id: 'other-interview',
      userId: 'other-user',
    })

    const res = await createAttempt(
      authedRequest('http://localhost/api/attempts', { interviewId: 'other-interview' }),
      emptyContext
    )
    expect(res.status).toBe(404)
  })
})
