import { test, expect } from '@playwright/test'

test('user can sign in with email', async ({ page }) => {
  await page.goto('/auth/signin')
  await expect(page.locator('text=Welcome back')).toBeVisible()
  await expect(page.locator('[data-slot="card-title"]:has-text("Sign in with email")')).toBeVisible()
  
  await page.fill('input[type="email"]', 'testuser@example.com')
  await page.click('button[type="submit"]')
  
  // Check for the email sent confirmation
  await expect(page.locator('text=Check your email')).toBeVisible()
  await expect(page.locator('text=We sent a magic link')).toBeVisible()
})
