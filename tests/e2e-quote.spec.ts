import { test, expect } from '@playwright/test'

test('user can submit quote intake', async ({ page }) => {
  await page.goto('/compare/new')
  // Step 1: Coverage Type
  await page.click('text=Auto Insurance Only')
  await page.click('button:has-text("Continue")')
  // Step 2: Personal Info
  await page.fill('input#firstName', 'John')
  await page.fill('input#lastName', 'Doe')
  await page.fill('input#dateOfBirth', '1990-01-01')
  await page.click('button:has-text("Continue")')
  // Step 3: Vehicle Details
  await page.selectOption('select#vehicleYear', '2020')
  await page.fill('input#vehicleMake', 'Toyota')
  await page.fill('input#vehicleModel', 'Camry')
  await page.selectOption('select#vehicleMileage', '0-5000')
  await page.selectOption('select#parkingLocation', 'GARAGE')
  await page.click('button:has-text("Continue")')
  // Step 5: Coverage Preferences
  await page.click('label:has-text("Recommended")')
  await page.click('button:has-text("Continue")')
  // Step 6: Consent
  await page.click('input#consentDataProcessing')
  await page.click('input#consentReferral')
  await page.click('button:has-text("Get My Quotes")')
  await expect(page.locator('text=Your Quotes Are Ready!')).toBeVisible()
})
