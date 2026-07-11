import { NextRequest, NextResponse } from 'next/server'

import { startRouteLog } from '@/lib/logger'

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
    try {
      const response = await handler(request, context)
      routeLog.complete({ success: response.status < 400 })
      return response
    } catch (error) {
      routeLog.fail(error)
      throw error
    }
  }
}
