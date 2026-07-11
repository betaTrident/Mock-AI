import { test, expect } from '@playwright/test'

import { bypassMiddlewareAuth } from './helpers/auth'

test.describe('Interview creation', () => {
  test('new interview page requires server authentication', async ({ page }) => {
    await page.goto('/interview/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('middleware cookie alone does not bypass server auth on app routes', async ({ page, context }) => {
    await bypassMiddlewareAuth(context)
    await page.goto('/interview/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('interview creation API returns 401 without session', async ({ request }) => {
    const res = await request.post('/api/interviews', {
      data: {
        role: 'Backend Engineer',
        description: 'Building scalable APIs with Node.js and PostgreSQL.',
        experience: 3,
        difficulty: 'mid',
        techStack: ['Node.js'],
      },
    })
    expect(res.status()).toBe(401)
  })
})
