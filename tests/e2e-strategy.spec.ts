import { test, expect } from '@playwright/test'

test('strategy guide and start application flow', async ({ page }) => {
  await page.goto('/life-insurance')

  // Fill step 1
  await expect(page.getByLabel('Age')).toBeVisible()
  await page.getByLabel('Age').fill('45')
  await page.getByLabel('Annual Income (USD)').fill('180000')
  // Enable comparison mode and set priority
  await page.getByTestId('comparison-mode').check()
  await page.getByLabel('Priority').selectOption({ label: 'Comprehensive Living Benefits' })
  // Add windfall
  await page.getByLabel('Cash Windfall (one-time, USD)').fill('150000')
  await page.click('text=Next')

  // Step 2: debt/mortgage
  await page.getByLabel('Total Debt (USD)').fill('10000')
  await page.getByLabel('Mortgage Balance (USD)').fill('300000')
  await page.click('text=Next')

  // Step 3: children & goal
  await page.getByLabel('Number of Children').fill('2')
  await page.getByLabel('Primary Goal').selectOption({ label: 'Retirement' })
  // select riders
  await page.getByLabel(/Would you like to access your death benefit while alive/i).check()
  await page.getByLabel(/If you become disabled, keep coverage active/i).check()

  await page.click('text=Get Recommendation')

  // Expect recommendation visible
  await expect(page.getByRole('heading', { name: 'Recommendation', exact: true })).toBeVisible()
  await expect(page.getByText('Suggested Coverage')).toBeVisible()

  // Start Application -> should open saved recommendation view
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=Start Application')
  ])
  await popup.waitForLoadState('domcontentloaded')
  await expect(popup.getByText('Saved Recommendation')).toBeVisible()

  // Strategy Guide prints in a popup — capture popup
  const [guide] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=Download Strategy Guide (PDF)')
  ])
  await guide.waitForLoadState('domcontentloaded')
  await expect(guide.getByText('Comprehensive Financial Strategy Guide')).toBeVisible()
})
