import { describe, expect, it, vi, beforeEach } from 'vitest'

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

describe('startRouteLog', () => {
  beforeEach(() => {
    logEntries.length = 0
  })

  it('includes userId in request_complete when setUserId is called', async () => {
    const { startRouteLog } = await import('@/lib/logger')
    const routeLog = startRouteLog('agent_step')
    routeLog.setUserId('user-abc')
    routeLog.complete({ success: true })

    const completeEntry = logEntries.find((e) => e.msg === 'request_complete')
    expect(completeEntry).toBeDefined()
    expect(completeEntry?.userId).toBe('user-abc')
    expect(completeEntry?.action).toBeUndefined()
    expect(completeEntry?.durationMs).toEqual(expect.any(Number))
  })

  it('includes userId in request_failed when setUserId is called', async () => {
    const { startRouteLog } = await import('@/lib/logger')
    const routeLog = startRouteLog('create_interview')
    routeLog.setUserId('user-xyz')
    routeLog.fail(new Error('boom'))

    const failEntry = logEntries.find((e) => e.msg === 'request_failed')
    expect(failEntry?.userId).toBe('user-xyz')
  })
})
