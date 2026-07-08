export class AgentError extends Error {
  readonly meta: { attempt: number }

  constructor(message: string, meta: { attempt: number }) {
    super(message)
    this.name = 'AgentError'
    this.meta = meta
  }
}

export async function runAgentWithRetry<T>(
  fn: () => Promise<T>,
  options = { maxAttempts: 3, backoffMs: 1000 }
): Promise<T> {
  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === options.maxAttempts - 1) {
        throw new AgentError(String(error), { attempt })
      }
      await new Promise((resolve) =>
        setTimeout(resolve, options.backoffMs * Math.pow(2, attempt))
      )
    }
  }
  throw new AgentError('Max attempts reached', { attempt: options.maxAttempts })
}
