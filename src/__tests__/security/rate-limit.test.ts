import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockLimit } = vi.hoisted(() => ({
  mockLimit: vi.fn(),
}))

vi.mock('@upstash/ratelimit', () => {
  class MockRatelimit {
    limit = mockLimit
    static slidingWindow = vi.fn().mockReturnValue('sliding-window')
    constructor(_opts: unknown) {}
  }
  return { Ratelimit: MockRatelimit }
})

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: vi.fn() },
}))

describe('rate limiting security', () => {
  beforeEach(() => {
    mockLimit.mockReset()
    vi.resetModules()
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
  })

  it('returns 429 when rate limit exceeded on 21st request', async () => {
    for (let i = 0; i < 20; i++) {
      mockLimit.mockResolvedValueOnce({ success: true, limit: 20, remaining: 19 - i })
    }
    mockLimit.mockResolvedValue({ success: false, limit: 20, remaining: 0 })

    const { middleware } = await import('@/middleware')

    for (let i = 0; i < 20; i++) {
      const req = new NextRequest('http://localhost/api/interviews', {
        headers: { 'x-forwarded-for': '203.0.113.1' },
      })
      const res = await middleware(req)
      expect(res.status).not.toBe(429)
    }

    const blocked = await middleware(
      new NextRequest('http://localhost/api/interviews', {
        headers: { 'x-forwarded-for': '203.0.113.1' },
      })
    )
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('X-RateLimit-Limit')).toBe('20')
  })
})
