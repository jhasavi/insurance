import { test, expect } from '@playwright/test'

test('strategy guide flow produces recommendation with export actions', async ({ page }) => {
  await page.goto('/life-insurance')

  await page.getByPlaceholder('John Doe').fill('Strategy Client')
  await page.getByRole('spinbutton', { name: /Age/i }).fill('45')
  await page.getByRole('spinbutton', { name: /Annual Income/i }).fill('180000')
  await page.click('text=Next')

  await page.getByRole('spinbutton', { name: /Total Debt/i }).fill('10000')
  await page.getByRole('spinbutton', { name: /Mortgage Balance/i }).fill('300000')
  await page.click('text=Next')

  await page.getByRole('spinbutton', { name: /Number of Children/i }).fill('2')
  await page.getByLabel(/Primary Goal/i).selectOption({ label: 'Retirement Income' })
  await page.click('text=Next')

  await page.getByLabel(/Living Benefits/i).check()
  await page.click('text=Get Recommendation')

  await expect(page.getByRole('heading', { name: 'Your Life Insurance Plan' })).toBeVisible()
  await expect(page.getByText('Suggested Strategy')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Download Strategy Guide (PDF)' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Application' })).toBeVisible()
})
