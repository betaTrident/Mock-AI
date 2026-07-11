import type { BrowserContext } from '@playwright/test'

const SESSION_COOKIE = 'session'

export async function bypassMiddlewareAuth(context: BrowserContext) {
  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value: 'e2e-middleware-bypass',
      domain: 'localhost',
      path: '/',
    },
  ])
}
