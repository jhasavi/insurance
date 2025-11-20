import { test, expect } from '@playwright/test'

test('user can sign in with email', async ({ page }) => {
  await page.goto('/auth/signin')
  await page.fill('input[type="email"]', 'testuser@example.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Check your email')).toBeVisible()
})
