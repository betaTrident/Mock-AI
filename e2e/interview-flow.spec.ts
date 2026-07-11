import { test, expect } from '@playwright/test'

import { bypassMiddlewareAuth } from './helpers/auth'

test.describe('Interview flow', () => {
  test('protected interview route redirects without valid session', async ({ page }) => {
    await page.goto('/interview/test-id')
    await expect(page).toHaveURL(/\/login/)
  })

  test('middleware cookie alone does not load interview workspace', async ({ page, context }) => {
    await bypassMiddlewareAuth(context)
    await page.goto('/interview/e2e-attempt-1')
    await expect(page).toHaveURL(/\/login/)
  })

  test('agent-step API returns 401 without session', async ({ request }) => {
    const res = await request.post('/api/attempts/test-attempt/agent-step', {
      data: { candidateMessage: 'My answer' },
    })
    expect(res.status()).toBe(401)
  })

  test('complete API returns 401 without session', async ({ request }) => {
    const res = await request.post('/api/attempts/test-attempt/complete')
    expect(res.status()).toBe(401)
  })
})
