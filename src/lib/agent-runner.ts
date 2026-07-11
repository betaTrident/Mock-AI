import { createLogger } from '@/lib/logger'
import { captureAgentFailure } from '@/lib/sentry'
import { AGENT_SLOW_THRESHOLD_MS, measureAsync } from '@/lib/timing'

export class AgentError extends Error {
  readonly meta: { attempt: number; durationMs?: number }

  constructor(message: string, meta: { attempt: number; durationMs?: number }) {
    super(message)
    this.name = 'AgentError'
    this.meta = meta
  }
}

export type AgentRunOptions = {
  maxAttempts?: number
  backoffMs?: number
  agentName?: string
  attemptId?: string
  input?: Record<string, unknown>
  onComplete?: (durationMs: number) => void
}

const agentLog = createLogger({ action: 'agent_runner' })

export async function runAgentWithRetry<T>(
  fn: () => Promise<T>,
  options: AgentRunOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3
  const backoffMs = options.backoffMs ?? 1000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { result, durationMs } = await measureAsync(fn)

      if (durationMs > AGENT_SLOW_THRESHOLD_MS) {
        agentLog.warn({
          msg: 'slow_agent',
          agentName: options.agentName,
          attemptId: options.attemptId,
          durationMs,
          thresholdMs: AGENT_SLOW_THRESHOLD_MS,
        })
      }

      options.onComplete?.(durationMs)
      return result
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        if (options.agentName && options.attemptId) {
          captureAgentFailure(error, {
            agentName: options.agentName,
            attemptId: options.attemptId,
            input: options.input,
          })
        }
        throw new AgentError(String(error), { attempt, durationMs: undefined })
      }
      await new Promise((resolve) =>
        setTimeout(resolve, backoffMs * Math.pow(2, attempt))
      )
    }
  }
  throw new AgentError('Max attempts reached', { attempt: maxAttempts })
}
