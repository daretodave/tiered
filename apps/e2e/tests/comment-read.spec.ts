import { expect, test } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// Phase 36 — the comment READ path + author-sees-own-held.
//
// The webServer chain runs `supabase db reset --no-seed`, so the
// comments table starts empty (seed.sql is inert in hermetic e2e —
// it exists for local/manual parity). This spec therefore drives
// the fixtures through the real POST path instead of relying on
// seeded rows:
//
//  - authed pass: post a benign comment. The phase-12 new-account
//    hold forces status=pending on a fresh DB, so this is exactly
//    the "posted but held" bug. Reload the season page; the
//    client thread must show the author's own row as
//    "held for review" (bug C) and survive a refresh (bug B).
//  - anon pass: the same season's thread must show the empty
//    state — a pending comment is invisible to the public AND it
//    is not the anon viewer's own row. Spoiler/mod P0.
//
// Survivor S20 = `survivor:20`, /shows/survivor/season/heroes-vs-villains.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

const SEASON_URL = '/shows/survivor/season/heroes-vs-villains'
const SEASON_TARGET = 'survivor:20'

async function postComment(
  page: import('@playwright/test').Page,
  body: string,
): Promise<{ status: number; body: unknown }> {
  return await page.evaluate(
    async ({ targetId, b }) => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetType: 'season', targetId, body: b }),
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
    },
    { targetId: SEASON_TARGET, b: body },
  )
}

test.describe('comment read — authed author sees own held comment', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  test('posted comment appears as held-for-review and survives reload', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    const r = await postComment(
      page,
      'The location work this season is a quiet argument for the format.',
    )
    expect(r.status, `post: ${JSON.stringify(r.body)}`).toBe(200)
    const posted = r.body as { ok: boolean; status: string }
    expect(posted.ok).toBe(true)
    // Fresh DB → new-account hold → pending. This is the bug shape.
    expect(posted.status).toBe('pending')

    // The island only auto-refetches when its own input posts; we
    // posted via raw fetch, so reload to exercise the read path.
    await page.reload({ waitUntil: 'domcontentloaded' })
    const held = page.getByTestId('comment-held-badge')
    await expect(held).toBeVisible()
    await expect(page.getByTestId('comment-body').first()).toContainText(
      'quiet argument for the format',
    )

    // Refresh again — truth persists.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('comment-held-badge')).toBeVisible()
  })

  test('signed-in header chrome resolves on the static season page', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    const header = page.getByTestId('site-header')
    await expect(header).toHaveAttribute('data-signed-in', 'true')
    await expect(page.getByTestId('site-header-user-link')).toBeVisible()
    await expect(page.getByTestId('site-header-signin-link')).toHaveCount(0)
  })
})

test.describe('comment read — public never sees pending', () => {
  test('anon viewer sees the empty thread, not the held/pending row', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })

    // Direct API check: the pending row (posted by the authed pass)
    // must not surface to an anon caller.
    const api = await page.evaluate(async (targetId) => {
      const res = await fetch(
        `/api/comments?targetType=season&targetId=${encodeURIComponent(targetId)}`,
        { headers: { accept: 'application/json' }, credentials: 'include' },
      )
      return await res.json()
    }, SEASON_TARGET)
    expect(api.ok).toBe(true)
    expect(api.signedIn).toBe(false)
    expect(api.count).toBe(0)
    expect(Array.isArray(api.comments) ? api.comments.length : -1).toBe(0)

    // DOM: empty-state copy, no held badge, no comment body.
    await expect(page.getByTestId('comment-thread')).toBeVisible()
    await expect(page.getByTestId('comment-thread-empty')).toBeVisible()
    await expect(page.getByTestId('comment-held-badge')).toHaveCount(0)
    await expect(page.getByTestId('comment-body')).toHaveCount(0)
    await expect(page.getByTestId('site-header')).toHaveAttribute(
      'data-signed-in',
      'false',
    )
  })
})
