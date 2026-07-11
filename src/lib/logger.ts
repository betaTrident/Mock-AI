import pino from 'pino'

export type LogContext = {
  requestId?: string
  userId?: string
  action?: string
}

const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, singleLine: true },
        },
      }
    : {}),
})

export function createLogger(context: LogContext = {}) {
  return baseLogger.child({
    requestId: context.requestId,
    userId: context.userId,
    action: context.action,
  })
}

export type RouteLogHandle = {
  requestId: string
  complete: (extra?: { success?: boolean; error?: string }) => void
  fail: (error: unknown) => void
}

export function startRouteLog(action: string, userId?: string): RouteLogHandle {
  const requestId = crypto.randomUUID().slice(0, 12)
  const log = createLogger({ requestId, userId, action })
  const started = performance.now()

  log.info({ msg: 'request_start' })

  const durationMs = () => Math.round(performance.now() - started)

  return {
    requestId,
    complete: (extra) => {
      log.info({ durationMs: durationMs(), msg: 'request_complete', ...extra })
    },
    fail: (error) => {
      log.error({
        durationMs: durationMs(),
        msg: 'request_failed',
        error: error instanceof Error ? error.message : String(error),
      })
    },
  }
}
