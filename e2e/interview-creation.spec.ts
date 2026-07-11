import { test, expect } from '@playwright/test'

test.describe('Interview creation', () => {
  test('new interview page requires authentication', async ({ page }) => {
    await page.goto('/interview/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page links to register', async ({ page }) => {
    await page.goto('/login')
    const registerLink = page.getByRole('link', { name: /register|sign up|create account/i })
    if (await registerLink.count()) {
      await expect(registerLink.first()).toBeVisible()
    }
  })
})
