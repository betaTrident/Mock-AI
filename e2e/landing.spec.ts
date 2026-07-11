import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('home page renders hero and primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /get started|start practicing|sign up/i }).first()).toBeVisible()
  })

  test('navigation links to login', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.getByRole('link', { name: /log in|sign in/i }).first()
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/)
  })
})
