import { test, expect } from '@playwright/test'

test.describe('Feedback', () => {
  test('public feedback API handles unknown slug', async ({ request }) => {
    const res = await request.get('/api/feedback/nonexistent-slug-12345')
    expect([404, 500]).toContain(res.status())
  })

  test('feedback page for unknown slug does not crash', async ({ page }) => {
    const response = await page.goto('/feedback/nonexistent-slug-12345')
    expect(response?.status()).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('authenticated feedback API returns 401 without session', async ({ request }) => {
    const res = await request.get('/api/attempts/test-attempt/feedback')
    expect(res.status()).toBe(401)
  })

  test('PDF export API returns 401 without session', async ({ request }) => {
    const res = await request.get('/api/attempts/test-attempt/feedback/pdf')
    expect(res.status()).toBe(401)
  })
})
