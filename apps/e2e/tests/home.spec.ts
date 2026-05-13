import { test, expect } from '@playwright/test'

test('home renders the promise', async ({ page }) => {
  const errors: string[] = []
  const failedResponses: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('response', (res) => {
    if (res.status() >= 400) failedResponses.push(`${res.status()} ${res.url()}`)
  })

  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  const main = page.getByRole('main')
  await expect(main.locator('h1')).toContainText('Pantheon')
  await expect(main.getByText(/the seasons, ranked\. no spoilers\./i)).toBeVisible()

  // The chrome.
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('link', { name: /pantheon home/i }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeVisible()

  expect(failedResponses, `failed responses: ${failedResponses.join(', ')}`).toEqual([])
  expect(errors).toEqual([])
})

test('theme toggle flips data-theme without flash', async ({ page }) => {
  await page.goto('/')
  // Default: dark (no data-theme set, tokens default at :root).
  const initialTheme = await page.evaluate(() => document.documentElement.dataset['theme'])
  expect(initialTheme === undefined || initialTheme === 'dark').toBe(true)

  await page.getByRole('button', { name: /switch to light mode/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: /switch to dark mode/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
