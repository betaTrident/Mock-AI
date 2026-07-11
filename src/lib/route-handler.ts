import { AsyncLocalStorage } from 'async_hooks'

import { NextRequest, NextResponse } from 'next/server'

import { type RouteLogHandle, startRouteLog } from '@/lib/logger'

const routeLogStorage = new AsyncLocalStorage<RouteLogHandle>()

export function getActiveRouteLog(): RouteLogHandle | undefined {
  return routeLogStorage.getStore()
}

type AppRouteHandler<TParams extends Record<string, string> = Record<string, never>> = (
  request: NextRequest,
  context: { params: Promise<TParams> }
) => Promise<NextResponse> | NextResponse

export function withLoggedRoute<TParams extends Record<string, string> = Record<string, never>>(
  action: string,
  handler: AppRouteHandler<TParams>
): AppRouteHandler<TParams> {
  return async (request, context) => {
    const routeLog = startRouteLog(action)

    return routeLogStorage.run(routeLog, async () => {
      try {
        const response = await handler(request, context)
        routeLog.complete({ success: response.status < 400 })
        return response
      } catch (error) {
        routeLog.fail(error)
        throw error
      }
    })
  }
}
