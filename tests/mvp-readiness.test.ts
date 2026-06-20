/**
 * Site readiness tests — classes-first financial planning platform
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage & primary goals', () => {
  test('Homepage highlights classes and planning tools', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: /Learn, Plan, and Build Financial Confidence/i })).toBeVisible()
    await expect(page.locator('a:has-text("Sign Up for Classes")').first()).toBeVisible()
    await expect(page.locator('a:has-text("Portfolio Balance Tool")').first()).toBeVisible()
  })

  test('Compliance banner is visible on homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Educational content only')).toBeVisible()
    await expect(page.locator('a[href="/licenses"]').first()).toBeVisible()
  })

  test('Classes page loads with registration CTA', async ({ page }) => {
    await page.goto('/classes')
    await expect(page.getByRole('heading', { level: 1, name: /Upcoming Classes/i })).toBeVisible()
    await expect(page.locator('text=View full calendar')).toBeVisible()
  })

  test('Portfolio balance tool page loads', async ({ page }) => {
    await page.goto('/tools/balance')
    await expect(page.getByRole('heading', { level: 1, name: /Portfolio Balance Planner/i })).toBeVisible()
    await expect(page.locator('text=Educational use only')).toBeVisible()
    await expect(page.locator('button:has-text("Analyze my balance")')).toBeVisible()
  })

  test('Balance tool produces recommendations', async ({ page }) => {
    await page.goto('/tools/balance')
    await page.fill('#age', '35')
    await page.fill('#income', '100000')
    await page.fill('#expenses', '5000')
    await page.click('button:has-text("Analyze my balance")')
    await expect(page.locator('text=Portfolio overview')).toBeVisible()
    await expect(page.locator('text=Where to focus next')).toBeVisible()
  })
})

test.describe('Compliance & Legal', () => {
  test('Licenses page has regulatory disclosures', async ({ page }) => {
    await page.goto('/licenses')
    await expect(page.locator('text=Educational Purpose Only')).toBeVisible()
    await expect(page.locator('text=Financial Advisory Disclosure')).toBeVisible()
    await expect(page.locator('text=Insurance Licensing')).toBeVisible()
  })

  test('Footer has privacy and terms links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByRole('link', { name: 'Privacy Policy' }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Terms of Service' }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Licenses & Disclaimers' }).first()).toBeVisible()
  })

  test('Footer includes investment and insurance disclosures', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=not a registered investment adviser')).toBeVisible()
    await expect(page.locator('text=not an insurance company')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('Header links to classes and tools', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header nav a[href="/classes"]').first()).toBeVisible()
    await page.locator('header details summary').click()
    await expect(page.locator('header a[href="/tools/balance"]')).toBeVisible()
  })

  test('Internal pages load', async ({ page }) => {
    const pages = [
      { path: '/learn', text: 'Insurance Education' },
      { path: '/faq', text: 'Frequently Asked Questions' },
      { path: '/about', text: 'About' },
      { path: '/contact', text: 'Contact' },
    ]
    for (const { path, text } of pages) {
      await page.goto(path)
      await expect(page.locator(`text=${text}`).first()).toBeVisible()
    }
  })
})

test.describe('SEO & accessibility basics', () => {
  test('Page titles are descriptive', async ({ page }) => {
    await page.goto('/')
    const homeTitle = await page.title()
    expect(homeTitle).toContain('Safora')

    await page.goto('/classes')
    const classesTitle = await page.title()
    expect(classesTitle).not.toBe(homeTitle)
  })

  test('Meta description present', async ({ page }) => {
    await page.goto('/')
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription!.length).toBeGreaterThan(50)
  })

  test('404 page works', async ({ page }) => {
    await page.goto('/thispagedoesnotexist')
    await expect(page.locator('text=404')).toBeVisible()
  })
})
