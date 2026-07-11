import { test, expect } from '@playwright/test'

test.describe('Auth pages', () => {
  test('login page renders sign-in form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('register page renders sign-up form', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /create.*account|sign up|register/i })).toBeVisible()
  })

  test('unauthenticated user is redirected from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
