import { expect, test } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// #160 (critique pass-6) — the YOUR VOTE block must disambiguate
// "you voted higher/lower" from the no-vote state for the
// signed-in viewer. Before the fix the block read
// "YOUR VOTE / 1 NET VOTE" with no signal that the 1 came from
// someone else.
//
// #189 (critique pass-12) — the no-vote channel is owned by
// <VoteRowHead>'s head meta (the plain imperative). VotePair no
// longer renders "you haven't voted" in that state to avoid
// double-nudging the same action against the same count. The
// pill survives as a pure post-action confirmation
// (signed-in-with-vote → "you voted higher"/"you voted lower").
//
// #207 (critique pass-15) — the no-vote head meta dropped its
// "this week" qualifier: the vote is a one-time per-reader act;
// only the recompute is weekly. The bare imperative is honest.
// Critique pass-22 swapped the literal from "cast yours"
// (possessive-elision fragment, only clever-fragment CTA on
// the authed walk) to the plain "cast vote".
//
// #190 (critique pass-13) + #199 (critique pass-14) — when the
// head reads "Your vote / cast vote" the count's
// label must qualify the number's source: a plain "1 NET VOTE"
// reads ambiguously (community total vs. personal). The label
// gains a "community · " prefix in the unacted state for BOTH
// anon and authed viewers (pass-14 widened the prefix to anon
// after observing the first-paint reader meets "1 NET VOTE"
// next to "EDITOR'S CANON #02" with no syntactic cue
// distinguishing the two ranking frames). The qualifier stays
// silent only for authed-and-voted, where the cap pill below
// the buttons owns the disambiguation channel.
//
// The pill ships from VotePair itself (driven by /api/vote
// returning `signedIn` alongside the read-back value). Anon
// viewers must never see the pill — the affordance is for
// members only. Survivor S20 is the gold-standard reference
// page the critique walks; same shape applies to every season
// route since the component is global.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

const SEASON_URL = '/shows/survivor/season/heroes-vs-villains'
const SEASON_TARGET = 'survivor:20'

test.describe('vote state pill — authed viewer sees disambiguation', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  test('signed-in viewer sees disambiguated VotePair state (with-vote → pill, no-vote → silent)', async ({
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

    // The pill is silent when the viewer has not voted (the head
    // owns the imperative). When the viewer HAS voted the pill
    // confirms which side. Test runs share a hermetic DB across
    // specs so the viewer's value is variable — assert both
    // shapes against the same source of truth.
    const cap = page.getByTestId('vote-state-cap')
    if (api.value === 1) {
      await expect(cap).toHaveText('you voted higher')
      await expect(cap).toHaveAttribute('data-vote-state', 'up')
    } else if (api.value === -1) {
      await expect(cap).toHaveText('you voted lower')
      await expect(cap).toHaveAttribute('data-vote-state', 'down')
    } else {
      await expect(cap).toHaveCount(0)
    }
    // Whatever the value, the redundant "haven't voted" copy
    // must never surface on the stack (#189).
    await expect(stack).not.toContainText("haven't voted")

    // #190: the count's label disambiguates the number's source.
    // Authed-not-yet-voted gets "community · net vote(s)";
    // authed-and-voted reverts to the plain label (the pill
    // above the buttons owns the disambiguation in that state).
    const label = page.getByTestId('vote-pair').locator('.vote-label')
    if (api.value === 0) {
      await expect(label).toHaveText(/^community · /)
      // #207 (pass-15): the signed-in-no-vote head meta carries the
      // bare imperative with no "this week" qualifier — the vote is
      // a one-time per-reader act; only the recompute is weekly.
      // Pass-22 swapped the literal from "cast yours" (clever-
      // fragment elision) to the plain "cast vote".
      const head = page.getByTestId('vote-row-head')
      await expect(head).toHaveAttribute(
        'data-vote-head-state',
        'signed-in-no-vote',
      )
      await expect(head.locator('.meta')).toHaveText('cast vote')
    } else {
      await expect(label).not.toHaveText(/^community · /)
    }
  })

  test('clicking up flips the pill (silent → "you voted higher", or retracts to silent)', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('vote-pair-stack')).toHaveAttribute(
      'data-signed-in',
      'true',
    )

    // Drive the pair through up-vote. The pill is owned by the
    // same component so the optimistic state must show in the
    // pill text immediately — no network round-trip required.
    const up = page.getByTestId('vote-up')
    // If the viewer is already "up", a second click retracts to
    // the no-vote state and the pill must disappear. Either
    // transition is a valid assertion as long as the pill stays
    // in sync with the data-voted attr.
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
      // Retract → no pill; the head's imperative carries again.
      await expect(cap).toHaveCount(0)
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
    // who have voted. Spoiler/account-confusion P0: an anon
    // viewer reading a pill copy would imply a viewer-identity
    // surface they don't have.
    await expect(page.getByTestId('vote-state-cap')).toHaveCount(0)

    // #199 (pass-14): the "community · " qualifier renders for
    // anon-no-vote too — the first-paint reader meets the big
    // "N NET VOTE" element next to "EDITOR'S CANON #02" with no
    // syntactic cue distinguishing the canon vs. community
    // frames. The qualifier carries the disambiguation; the
    // anon's lack of a personal vote is irrelevant here because
    // the imperative head ("SIGN IN TO WEIGH IN" for anon)
    // already telegraphs the viewer-identity boundary.
    const label = page.getByTestId('vote-pair').locator('.vote-label')
    await expect(label).toHaveText(/^community · /)
  })
})
