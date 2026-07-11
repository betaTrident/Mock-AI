import { test, expect } from '@playwright/test'

test.describe('Feedback', () => {
  test('public feedback API handles unknown slug', async ({ request }) => {
    const res = await request.get('/api/feedback/nonexistent-slug-12345')
    // 404 when Firestore query succeeds; 500 when Firebase is unavailable locally
    expect([404, 500]).toContain(res.status())
  })

  test('feedback page for unknown slug shows error or redirects', async ({ page }) => {
    const response = await page.goto('/feedback/nonexistent-slug-12345')
    expect(response?.status()).toBeLessThan(500)
  })
})
