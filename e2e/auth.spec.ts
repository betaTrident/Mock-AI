import { test, expect } from '@playwright/test'

test.describe('Auth pages', () => {
  test('login page renders sign-in form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible()
  })

  test('register page renders sign-up form', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
  })

  test('unauthenticated user is redirected from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page links to register', async ({ page }) => {
    await page.goto('/login')
    const registerLink = page.getByRole('link', { name: /sign up/i })
    await expect(registerLink).toBeVisible()
  })
})
