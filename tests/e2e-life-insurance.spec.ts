import { test, expect } from '@playwright/test'

async function fillLifeInsuranceBasics(page: import('@playwright/test').Page) {
  await page.getByPlaceholder('John Doe').fill('Test Client')
  await page.getByRole('spinbutton', { name: /Age/i }).fill('35')
  await page.getByRole('spinbutton', { name: /Annual Income/i }).fill('80000')
  await page.click('text=Next')

  await page.getByRole('spinbutton', { name: /Total Debt/i }).fill('5000')
  await page.getByRole('spinbutton', { name: /Mortgage Balance/i }).fill('200000')
  await page.click('text=Next')

  await page.getByRole('spinbutton', { name: /Number of Children/i }).fill('2')
  await page.getByLabel(/Primary Goal/i).selectOption('Income Replacement')
  await page.click('text=Next')

  await page.click('text=Get Recommendation')
}

test('life insurance tool provides recommendation', async ({ page }) => {
  await page.goto('/life-insurance')
  await expect(page.locator('text=Life Insurance Recommendation Tool')).toBeVisible()
  await fillLifeInsuranceBasics(page)

  await expect(page.getByRole('heading', { name: 'Your Life Insurance Plan' })).toBeVisible()
  await expect(page.getByText('Suggested Coverage').first()).toBeVisible()
  await expect(page.getByText('Recommended Type').first()).toBeVisible()
})
