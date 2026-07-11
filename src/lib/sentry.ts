import * as Sentry from '@sentry/nextjs'

export type AgentFailureContext = {
  agentName: string
  attemptId: string
  input?: Record<string, unknown>
}

export function captureAgentFailure(error: unknown, context: AgentFailureContext): void {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return

  Sentry.withScope((scope) => {
    scope.setTag('agentName', context.agentName)
    scope.setTag('attemptId', context.attemptId)
    if (context.input) {
      scope.setContext('agentInput', context.input)
    }
    Sentry.captureException(error)
  })
}

export function captureClientError(error: unknown, context?: Record<string, unknown>): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  Sentry.withScope((scope) => {
    if (context) scope.setContext('client', context)
    Sentry.captureException(error)
  })
}
