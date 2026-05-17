import { type Browser, expect, test } from '@playwright/test'

// Phase 35 — the read half of the vote system. The webServer
// chain runs `supabase db reset --no-seed`, so migration
// 20260513000015 (rank_snapshots + compute_weighted_rank +
// recompute_rankings) is applied and the votes table starts
// empty. We drive votes through /api/vote (cookies follow the
// browser context's jar) and read the contracted aggregate at
// GET /api/ranking/[show].
//
// Scoped to `the-challenge` (40 seasons in content) so this spec
// never collides with vote-backend.spec.ts, which votes on
// `survivor:1` and asserts a positive aggregate. Cross-spec DB
// state is shared (one db reset for the whole run).

const SHOW = 'the-challenge'

type RankingBody = {
  ok: boolean
  show: string
  source: 'votes' | 'canon' | 'seasons'
  votersThisWeek: number
  entries: Array<{
    rank: number
    seasonNumber: number
    score: number
    approval: number | null
    voteCount: number
    trend: number | null
  }>
}

async function castFrom(
  browser: Browser,
  votes: Array<{ targetId: string; value: -1 | 0 | 1 }>,
): Promise<void> {
  const ctx = await browser.newContext()
  try {
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    for (const v of votes) {
      const res = await page.evaluate(async (a) => {
        const r = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            targetType: 'season',
            targetId: a.targetId,
            value: a.value,
          }),
          credentials: 'include',
        })
        return r.status
      }, v)
      expect(res).toBe(200)
    }
  } finally {
    await ctx.close()
  }
}

async function getRanking(
  browser: Browser,
  show: string,
): Promise<{ status: number; body: RankingBody }> {
  const ctx = await browser.newContext()
  try {
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    return await page.evaluate(async (s) => {
      const r = await fetch(`/api/ranking/${s}`, { credentials: 'include' })
      return { status: r.status, body: (await r.json()) as RankingBody }
    }, show)
  } finally {
    await ctx.close()
  }
}

test('unknown show is a 404', async ({ browser }) => {
  const r = await getRanking(browser, 'not-a-real-show')
  expect(r.status).toBe(404)
})

test('a single voter stays below threshold but counters are real', async ({
  browser,
}) => {
  await castFrom(browser, [{ targetId: `${SHOW}:3`, value: 1 }])

  const { status, body } = await getRanking(browser, SHOW)
  expect(status).toBe(200)
  expect(body.ok).toBe(true)
  expect(body.show).toBe(SHOW)
  // one voter < VOTE_THRESHOLD (5): canon-mirror still authoritative
  expect(body.source).not.toBe('votes')
  // ...but the counter for the voted season is Supabase-derived
  const s3 = body.entries.find((e) => e.seasonNumber === 3)
  expect(s3, 'season 3 present in mirror').toBeTruthy()
  expect(s3?.score).toBeGreaterThan(0)
  expect(s3?.voteCount).toBe(1)
})

test('crossing the voter threshold flips to live vote order', async ({
  browser,
}) => {
  // 6 distinct sessions (> VOTE_THRESHOLD) push season 2 up and
  // season 1 down so the live order is deterministic.
  for (let i = 0; i < 6; i++) {
    await castFrom(browser, [
      { targetId: `${SHOW}:2`, value: 1 },
      { targetId: `${SHOW}:1`, value: -1 },
    ])
  }

  const { body } = await getRanking(browser, SHOW)
  expect(body.source).toBe('votes')
  expect(body.votersThisWeek).toBeGreaterThanOrEqual(5)

  const idx2 = body.entries.findIndex((e) => e.seasonNumber === 2)
  const idx1 = body.entries.findIndex((e) => e.seasonNumber === 1)
  expect(idx2).toBeGreaterThanOrEqual(0)
  expect(idx1).toBeGreaterThan(idx2) // season 2 ranks above season 1
  expect(body.entries.find((e) => e.seasonNumber === 2)?.score).toBeGreaterThan(
    0,
  )
  expect(body.entries.find((e) => e.seasonNumber === 1)?.score).toBeLessThan(0)
  // ranks are dense 1..N
  expect(body.entries.map((e) => e.rank)).toEqual(
    body.entries.map((_, i) => i + 1),
  )
})

test('recompute writes a snapshot batch', async ({ browser }) => {
  await castFrom(browser, [{ targetId: `${SHOW}:5`, value: 1 }])

  const ctx = await browser.newContext()
  try {
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const result = await page.evaluate(async () => {
      const r = await fetch(`/api/internal/recompute?show=the-challenge`, {
        method: 'POST',
        credentials: 'include',
      })
      return { status: r.status, body: await r.json() }
    })
    expect(result.status).toBe(200)
    expect(result.body.ok).toBe(true)
    expect(result.body.rowsWritten).toBeGreaterThan(0)
  } finally {
    await ctx.close()
  }
})
