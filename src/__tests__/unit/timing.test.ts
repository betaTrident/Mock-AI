import { describe, expect, it } from 'vitest'

import { AGENT_SLOW_THRESHOLD_MS, isSlowAgent, measureAsync } from '@/lib/timing'

describe('timing utilities', () => {
  it('detects slow agents above threshold', () => {
    expect(isSlowAgent(AGENT_SLOW_THRESHOLD_MS + 1)).toBe(true)
    expect(isSlowAgent(AGENT_SLOW_THRESHOLD_MS)).toBe(false)
    expect(isSlowAgent(100)).toBe(false)
  })

  it('measures async operation duration', async () => {
    const { result, durationMs } = await measureAsync(async () => {
      await new Promise((r) => setTimeout(r, 10))
      return 'done'
    })
    expect(result).toBe('done')
    expect(durationMs).toBeGreaterThanOrEqual(5)
  })
})
