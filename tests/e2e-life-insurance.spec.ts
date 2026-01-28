import { test, expect } from '@playwright/test'

test('life insurance tool provides recommendation', async ({ page }) => {
  await page.goto('/life-insurance')

  // Step 1: Age and Income
  await expect(page.locator('text=Life Insurance Recommendation Tool')).toBeVisible()
  await page.fill('input[type="number"]:nth-of-type(1)', '35')
  await page.fill('input[type="number"]:nth-of-type(2)', '80000')
  await page.click('text=Next')

  // Step 2: Debt and Mortgage
  await page.fill('input[type="number"]:nth-of-type(3)', '5000')
  await page.fill('input[type="number"]:nth-of-type(4)', '200000')
  await page.click('text=Next')

  // Step 3: Children and Goal
  await page.fill('input[type="number"]:nth-of-type(5)', '2')
  await page.selectOption('select', 'Income Replacement')
  await page.click('text=Get Recommendation')

  // Expect recommendation card
  await expect(page.locator('text=Recommendation')).toBeVisible()
  await expect(page.locator('text=Suggested Coverage')).toBeVisible()
  await expect(page.locator('text=Recommended Type')).toBeVisible()
})
