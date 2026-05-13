import { expect, test } from '@playwright/test'

// Phase 11 — votes are durable in Supabase. The webServer chain
// runs `supabase db reset --no-seed` before this spec runs, so
// all four phase-11 migrations apply and the votes table starts
// empty.
//
// We exercise the API via page.evaluate(fetch) so the cookies
// follow the browser context's cookie jar naturally.

const SEASON_TARGET = 'survivor:1'

async function castVote(
  page: import('@playwright/test').Page,
  args: { targetType: 'season' | 'comment'; targetId: string; value: -1 | 0 | 1 },
): Promise<{ status: number; body: unknown }> {
  return await page.evaluate(async (a) => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(a),
      credentials: 'include',
    })
    const text = await res.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = text
    }
    return { status: res.status, body: parsed }
  }, args)
}

test('anon vote round-trip persists in Supabase', async ({ page, context }) => {
  await context.clearCookies()

  // First page load — middleware mints the anon cookie.
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const cookies = await context.cookies()
  expect(cookies.find((c) => c.name === 'pantheon_anon_id')?.value).toBeDefined()

  // Cast +1.
  const cast = await castVote(page, {
    targetType: 'season',
    targetId: SEASON_TARGET,
    value: 1,
  })
  expect(cast.status, `cast: ${JSON.stringify(cast.body)}`).toBe(200)
  const body = cast.body as {
    ok: boolean
    value: number
    weight: number
    count: number
    persisted: boolean
  }
  expect(body.ok).toBe(true)
  expect(body.value).toBe(1)
  expect(body.weight).toBe(0.1)
  expect(body.persisted).toBe(true)
  expect(body.count).toBeGreaterThan(0)

  // Retract — value 0.
  const retract = await castVote(page, {
    targetType: 'season',
    targetId: SEASON_TARGET,
    value: 0,
  })
  expect(retract.status).toBe(200)
  expect((retract.body as { value: number }).value).toBe(0)
})

test('vote in opposite direction swaps the stored value', async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  let r = await castVote(page, {
    targetType: 'season',
    targetId: `${SEASON_TARGET}:swap`,
    value: 1,
  })
  expect(r.status).toBe(200)

  r = await castVote(page, {
    targetType: 'season',
    targetId: `${SEASON_TARGET}:swap`,
    value: -1,
  })
  expect(r.status).toBe(200)
  expect((r.body as { value: number }).value).toBe(-1)
})

test('/api/vote rejects malformed bodies with 400', async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const result = await page.evaluate(async () => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 1 }),
      credentials: 'include',
    })
    return { status: res.status }
  })
  expect(result.status).toBe(400)
})
