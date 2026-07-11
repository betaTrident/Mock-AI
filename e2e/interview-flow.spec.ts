import { test, expect } from '@playwright/test'

test.describe('Interview flow', () => {
  test('home or login is accessible', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response?.status()).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('protected interview route redirects unauthenticated users', async ({ page }) => {
    await page.goto('/interview/test-id')
    await expect(page).toHaveURL(/\/login/)
  })
})
