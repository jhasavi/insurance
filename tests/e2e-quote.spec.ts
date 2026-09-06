import { test, expect } from '@playwright/test'

test('compare page still accessible as internal tool', async ({ page }) => {
  await page.goto('/compare')
  await expect(page.getByText('Clearcover').first()).toBeVisible()
})
