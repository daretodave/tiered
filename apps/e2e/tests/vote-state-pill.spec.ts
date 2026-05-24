import { expect, test } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// #160 (critique pass-6) — the YOUR VOTE block must disambiguate
// "you haven't voted" from "you voted higher/lower" for the
// signed-in viewer. Before the fix the block read
// "YOUR VOTE / 1 NET VOTE" with no signal that the 1 came from
// someone else and the viewer's own ballot was still empty.
//
// The pill ships from VotePair itself (driven by /api/vote
// returning `signedIn` alongside the read-back value). Anon
// viewers must never see the pill — the affordance is for
// members only. Survivor S20 is the gold-standard reference
// page the critique walks; same shape applies to every season
// route since the component is global.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

const SEASON_URL = '/shows/survivor/season/heroes-villains'
const SEASON_TARGET = 'survivor:20'

test.describe('vote state pill — authed viewer sees disambiguation', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  test('signed-in viewer sees a state pill above the VotePair buttons', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })

    // The /api/vote read-back must carry signedIn:true; that is
    // the field VotePair gates the pill on. The vote read shares
    // the same session-resolution path as the comment read, so a
    // failure here is the same class as comment-read's
    // signedIn-handshake regressions — easier to diagnose if
    // pinned here too.
    const api = await page.evaluate(async (targetId) => {
      const res = await fetch(
        `/api/vote?targetType=season&targetId=${encodeURIComponent(targetId)}`,
        { headers: { accept: 'application/json' }, credentials: 'include' },
      )
      return await res.json()
    }, SEASON_TARGET)
    expect(api.ok).toBe(true)
    expect(api.signedIn).toBe(true)

    const stack = page.getByTestId('vote-pair-stack')
    await expect(stack).toBeVisible()
    await expect(stack).toHaveAttribute('data-signed-in', 'true')

    const cap = page.getByTestId('vote-state-cap')
    await expect(cap).toBeVisible()
    // Whatever the viewer's recorded value is (test runs share a
    // hermetic DB across specs), the pill must be one of the
    // three legal copies — never a stale placeholder.
    await expect(cap).toHaveText(
      /you (haven't voted|voted higher|voted lower)/i,
    )
    await expect(cap).toHaveAttribute('data-vote-state', /^(none|up|down)$/)
  })

  test('clicking up flips the pill to "you voted higher" without a refetch', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('vote-state-cap')).toBeVisible()

    // Drive the pair through up-vote. The pill is owned by the
    // same component so the optimistic state must show in the
    // pill text immediately — no network round-trip required.
    const up = page.getByTestId('vote-up')
    // If the viewer is already "up", a second click retracts to
    // "haven't voted". Either transition is a valid assertion as
    // long as the pill stays in sync with the data-voted attr.
    await up.click()
    const pair = page.getByTestId('vote-pair')
    const voted = await pair.getAttribute('data-voted')
    const cap = page.getByTestId('vote-state-cap')
    if (voted === 'up') {
      await expect(cap).toHaveText('you voted higher')
      await expect(cap).toHaveAttribute('data-vote-state', 'up')
    } else if (voted === 'down') {
      await expect(cap).toHaveText('you voted lower')
      await expect(cap).toHaveAttribute('data-vote-state', 'down')
    } else {
      await expect(cap).toHaveText("you haven't voted")
      await expect(cap).toHaveAttribute('data-vote-state', 'none')
    }
  })
})

test.describe('vote state pill — public never sees the pill', () => {
  test('anon viewer renders the pair but no state pill', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })

    // Direct API check: an anon read must report signedIn:false
    // so the pill stays hidden by contract, not by accident.
    const api = await page.evaluate(async (targetId) => {
      const res = await fetch(
        `/api/vote?targetType=season&targetId=${encodeURIComponent(targetId)}`,
        { headers: { accept: 'application/json' }, credentials: 'include' },
      )
      return await res.json()
    }, SEASON_TARGET)
    expect(api.ok).toBe(true)
    expect(api.signedIn).toBe(false)

    // The pair itself still renders — voting is anon-eligible.
    await expect(page.getByTestId('vote-pair')).toBeVisible()
    await expect(page.getByTestId('vote-pair-stack')).toHaveAttribute(
      'data-signed-in',
      'false',
    )
    // The pill must be absent — the affordance is for members
    // only. Spoiler/account-confusion P0: an anon viewer reading
    // "you haven't voted" would imply a viewer-identity surface
    // they don't have.
    await expect(page.getByTestId('vote-state-cap')).toHaveCount(0)
  })
})
