export const AGENT_SLOW_THRESHOLD_MS = 8_000

export type TimingResult<T> = {
  result: T
  durationMs: number
}

export function measureSync<T>(fn: () => T): TimingResult<T> {
  const start = performance.now()
  const result = fn()
  return { result, durationMs: Math.round(performance.now() - start) }
}

export async function measureAsync<T>(fn: () => Promise<T>): Promise<TimingResult<T>> {
  const start = performance.now()
  const result = await fn()
  return { result, durationMs: Math.round(performance.now() - start) }
}

export function isSlowAgent(durationMs: number): boolean {
  return durationMs > AGENT_SLOW_THRESHOLD_MS
}
