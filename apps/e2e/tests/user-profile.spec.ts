import { expect, test } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// Phase 38 — the public profile page (`/u/[handle]`).
//
// The webServer chain runs `supabase db reset --no-seed`, so the
// users/votes/comments tables start empty. This spec drives the
// fixtures through the real POST paths (the same approach as
// comment-read.spec) instead of relying on seeded rows:
//
//  - authed pass: cast a vote (→ users row upserted, session
//    claimed to the sub, votes row attributed) AND post a comment
//    (held=pending on a fresh DB by the phase-12 new-account
//    hold). Then visit the profile LOGGED OUT.
//  - the profile must resolve for the anon visitor (not "not me →
//    404"), surface the vote participation count, and must NOT
//    leak the pending comment (spoiler/mod P0): a pending row is
//    never a published comment, so the recent-comments block
//    stays empty and the unique phrase never appears.
//  - unknown handle → 404.
//  - mobile reflow at 375px.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

const SEASON_URL = '/shows/survivor/season/heroes-vs-villains'
const VOTE_TARGET = 'survivor:20'
const PENDING_PHRASE =
  'profile-spec pending sentinel — this must never surface publicly'

async function castVote(
  page: import('@playwright/test').Page,
  value: -1 | 0 | 1,
): Promise<number> {
  return await page.evaluate(
    async ({ targetId, v }) => {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetType: 'season', targetId, value: v }),
        credentials: 'include',
      })
      return res.status
    },
    { targetId: VOTE_TARGET, v: value },
  )
}

async function postComment(
  page: import('@playwright/test').Page,
  body: string,
): Promise<number> {
  return await page.evaluate(
    async ({ targetId, b }) => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetType: 'season', targetId, body: b }),
        credentials: 'include',
      })
      return res.status
    },
    { targetId: VOTE_TARGET, b: body },
  )
}

test.describe('public profile — populated, spoiler-safe, indexable', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  test('known handle renders activity to a logged-out visitor; pending never leaks', async ({
    page,
    context,
  }) => {
    // 1. Authed: produce activity + discover this user's handle.
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    const userLink = page.getByTestId('site-header-user-link')
    await expect(userLink).toBeVisible()
    const href = await userLink.getAttribute('href')
    expect(href, 'header must expose /u/<handle>').toMatch(/^\/u\/.+/)
    const profilePath = href as string

    expect(await castVote(page, 1)).toBe(200)
    expect(await postComment(page, PENDING_PHRASE)).toBe(200)

    // 2. Logged out — any visitor must see the profile (not 404).
    await context.clearCookies()
    const resp = await page.goto(profilePath, {
      waitUntil: 'domcontentloaded',
    })
    expect(resp?.status(), 'real handle must not 404 for a stranger').toBe(200)

    const profile = page.getByTestId('user-profile')
    await expect(profile).toBeVisible()
    await expect(page.getByTestId('profile-handle')).toContainText('@')
    await expect(page.getByTestId('profile-stats')).toBeVisible()

    // The vote makes the profile populated → indexable.
    await expect(profile).toHaveAttribute('data-populated', 'true')
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
    await expect(page.getByTestId('profile-stat-seasons')).toContainText('1')

    // Editorial-voice meta description (CRITIQUE pass 9 LOW): the
    // populated branch reads as a "knowledgeable peer", not a CMS
    // placeholder. Pins the public-record framing so a regression
    // back to "${handle} on tiered.tv." trips the gate.
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description, 'populated profile must carry the editorial description').toMatch(
      /public record on tiered\.tv — votes, comments, the seasons they've weighed in on\./,
    )

    // Spoiler/mod P0: the pending comment is NOT a published
    // comment — the recent block stays empty and the phrase is
    // nowhere on the page (nor in the JSON-LD).
    await expect(page.getByTestId('profile-no-comments')).toBeVisible()
    expect(await page.content()).not.toContain(PENDING_PHRASE)
  })

  test('unknown handle 404s', async ({ page, context }) => {
    await context.clearCookies()
    const resp = await page.goto('/u/__no-such-member-xyz__', {
      waitUntil: 'domcontentloaded',
    })
    expect(resp?.status()).toBe(404)
  })

  test('profile reflows at 375px with no horizontal scroll', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    const href = await page
      .getByTestId('site-header-user-link')
      .getAttribute('href')
    expect(href).toMatch(/^\/u\/.+/)

    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(href as string, { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('user-profile')).toBeVisible()
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
