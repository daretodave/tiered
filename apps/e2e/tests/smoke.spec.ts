import { test, expect, type Page } from '@playwright/test'
import { urlsForRun } from '../src/fixtures/sample-urls'
import { pageReads, type PageReadAssertion } from '../src/fixtures/page-reads'

// Some console errors are unavoidable in dev / preview (font 404s in
// hermetic mode, hot-reload chatter, etc.). Filter narrowly to keep
// the gate signal high. Adjust only with a Decision recorded in the
// next phase commit.
const NOISE_PATTERNS: RegExp[] = [
  /favicon\.ico/i,
  /Failed to load resource: net::ERR_FAILED.*sourcemap/i,
]

async function readJsonLdTypes(page: Page): Promise<string[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types: string[] = []
  for (const raw of blocks) {
    try {
      const parsed: unknown = JSON.parse(raw)
      const collect = (v: unknown): void => {
        if (v && typeof v === 'object') {
          const t = (v as Record<string, unknown>)['@type']
          if (typeof t === 'string') types.push(t)
          else if (Array.isArray(t)) for (const x of t) if (typeof x === 'string') types.push(x)
        }
      }
      collect(parsed)
      if (Array.isArray(parsed)) for (const item of parsed) collect(item)
    } catch {
      /* ignore unparseable */
    }
  }
  return types
}

async function runAssertion(
  page: Page,
  url: { pattern: string; path: string },
  reads: PageReadAssertion,
  errors: string[],
  failedResponses: string[],
): Promise<void> {
  if (reads.expectH1Pattern) {
    await expect(page.locator('h1').first()).toContainText(reads.expectH1Pattern)
  }
  for (const sel of reads.expectVisible ?? []) {
    await expect(page.locator(sel).first()).toBeVisible()
  }
  for (const sel of reads.expectNotVisible ?? []) {
    await expect(page.locator(sel)).toHaveCount(0)
  }
  if (reads.expectJsonLdType) {
    const types = await readJsonLdTypes(page)
    expect(
      types,
      `expected JSON-LD @type "${reads.expectJsonLdType}" on ${url.path}; saw ${types.join(', ') || '(none)'}`,
    ).toContain(reads.expectJsonLdType)
  }
  if (reads.expectMetaDescription) {
    const desc = await page.locator('meta[name="description"]').first().getAttribute('content')
    expect(desc ?? '').toMatch(reads.expectMetaDescription)
  }
  if (reads.expectNoConsoleErrors !== false) {
    const meaningful = errors.filter((e) => !NOISE_PATTERNS.some((p) => p.test(e)))
    expect(meaningful, `console errors on ${url.path}: ${meaningful.join('\n')}`).toEqual([])
  }
  const meaningfulFailures = failedResponses.filter((e) => !NOISE_PATTERNS.some((p) => p.test(e)))
  expect(meaningfulFailures, `failed responses on ${url.path}: ${meaningfulFailures.join('\n')}`).toEqual([])
}

for (const url of urlsForRun()) {
  test(`smoke: ${url.path}`, async ({ page }) => {
    const errors: string[] = []
    const failedResponses: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('response', (res) => {
      if (res.status() >= 400) failedResponses.push(`${res.status()} ${res.url()}`)
    })

    const reads = pageReads[url.pattern] ?? {}
    const expectedStatus = reads.expectStatus ?? 200
    const response = await page.goto(url.path, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), `status on ${url.path}`).toBe(expectedStatus)

    await runAssertion(page, url, reads, errors, failedResponses)
  })
}
