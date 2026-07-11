import { describe, expect, it, vi, beforeEach } from 'vitest'

const captureException = vi.fn()
const setTag = vi.fn()
const setContext = vi.fn()
const withScope = vi.fn((fn: (scope: { setTag: typeof setTag; setContext: typeof setContext }) => void) => {
  fn({ setTag, setContext })
})

vi.mock('@sentry/nextjs', () => ({
  withScope,
  captureException,
}))

describe('captureAgentFailure', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('no-ops when SENTRY_DSN is unset', async () => {
    const { captureAgentFailure } = await import('@/lib/sentry')
    captureAgentFailure(new Error('agent failed'), {
      agentName: 'planner',
      attemptId: 'attempt-1',
    })
    expect(captureException).not.toHaveBeenCalled()
  })

  it('captures exception with agent context when DSN is set', async () => {
    vi.stubEnv('SENTRY_DSN', 'https://example@sentry.io/1')
    vi.resetModules()

    const { captureAgentFailure } = await import('@/lib/sentry')
    const error = new Error('agent failed')
    captureAgentFailure(error, {
      agentName: 'evaluator',
      attemptId: 'attempt-42',
      input: { role: 'Backend Engineer' },
    })

    expect(withScope).toHaveBeenCalled()
    expect(setTag).toHaveBeenCalledWith('agentName', 'evaluator')
    expect(setTag).toHaveBeenCalledWith('attemptId', 'attempt-42')
    expect(setContext).toHaveBeenCalledWith('agentInput', { role: 'Backend Engineer' })
    expect(captureException).toHaveBeenCalledWith(error)
  })
})

describe('captureClientError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('no-ops when NEXT_PUBLIC_SENTRY_DSN is unset', async () => {
    const { captureClientError } = await import('@/lib/sentry')
    captureClientError(new Error('client crash'))
    expect(captureException).not.toHaveBeenCalled()
  })

  it('captures client exception when public DSN is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')
    vi.resetModules()

    const { captureClientError } = await import('@/lib/sentry')
    const error = new Error('render failed')
    captureClientError(error, { page: '/dashboard' })

    expect(setContext).toHaveBeenCalledWith('client', { page: '/dashboard' })
    expect(captureException).toHaveBeenCalledWith(error)
  })
})
