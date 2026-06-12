import { expect, test } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// #160 (critique pass-6) — the YOUR VOTE block must disambiguate
// "you voted higher/lower" from the no-vote state for the
// signed-in viewer. Before the fix the block read
// "YOUR VOTE / 1 NET VOTE" with no signal that the 1 came from
// someone else.
//
// #189 (critique pass-12) — the no-vote pill was dropped on the
// theory that <VoteRowHead>'s head meta ("cast vote") owned the
// channel. The pill was scoped to signed-in-with-vote only.
//
// Critique pass-27 — pass-12's narrower scope reopened: a signed-
// in non-voter on the season page reading "YOUR VOTE / CAST VOTE
// / Does this belong in the community top 10? / +1 / COMMUNITY ·
// NET VOTE" still could not tell whether the +1 was the community
// net or their own already-cast vote. The pill now ships in
// three shapes — "you haven't voted yet" (state='none') / "you
// voted higher" (state='up') / "you voted lower" (state='down')
// — for every signed-in viewer. The "cast vote" meta is the
// action nudge; the cap declares state. Anon viewers still see
// no pill (the affordance is viewer-identity bearing).
//
// #207 (critique pass-15) — the no-vote head meta dropped its
// "this week" qualifier: the vote is a one-time per-reader act;
// only the recompute is weekly. The bare imperative is honest.
// Critique pass-22 swapped the literal from "cast yours"
// (possessive-elision fragment, only clever-fragment CTA on
// the authed walk) to the plain "cast vote".
//
// #190 (critique pass-13) + #199 (critique pass-14) — when the
// head reads "Your vote / cast vote" the count's label must
// qualify the number's source: a plain "1 NET VOTE" reads
// ambiguously (community total vs. personal). Pass-13/14 added
// a conditional "community · " prefix in the unacted state.
// Pass-34 (#361) folded the prefix into the base label so the
// rendered text was "community vote(s)" on every state.
// Pass-49 (#410) re-words again: the bare-integer + singular-
// noun pair "1 / COMMUNITY VOTE" still read ambiguously
// between the tally read and a counter widget value. The
// label is now "vote(s) so far" — the "so far" suffix names
// the count as a tally with implicit time-context, dropping
// the redundant `community` prefix (the voteHelp + voteQuestion
// already carry the community framing). The integer is still
// the distinct voter count (matches the ShiftCard's `vote_count`
// framing across surfaces). The pill above the buttons keeps
// owning the *viewer-identity* disambiguation channel for
// authed-and-voted viewers (the "you voted higher/lower"
// declaration).
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

  test('signed-in viewer sees disambiguated VotePair state (three-state cap triad)', async ({
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

    // The pill declares one of three states for every signed-in
    // viewer. Test runs share a hermetic DB across specs so the
    // viewer's value is variable — assert all three shapes against
    // the same source of truth.
    const cap = page.getByTestId('vote-state-cap')
    if (api.value === 1) {
      await expect(cap).toHaveText('you voted higher')
      await expect(cap).toHaveAttribute('data-vote-state', 'up')
    } else if (api.value === -1) {
      await expect(cap).toHaveText('you voted lower')
      await expect(cap).toHaveAttribute('data-vote-state', 'down')
    } else {
      await expect(cap).toHaveText("you haven't voted yet")
      await expect(cap).toHaveAttribute('data-vote-state', 'none')
    }

    // Pass-49 #410: the count's label is "vote(s) so far" on
    // every state — the prior pass-34 "community vote(s)"
    // framing surfaced as a staccato "1 / COMMUNITY VOTE" on
    // the bare-integer + singular-noun pair (the staccato
    // pass-49 closed). The "so far" suffix names the count as
    // a tally with implicit time-context; the displayed integer
    // is still the distinct voter count so the vote-pair cites
    // the same canonical fact as the ShiftCard's `vote_count`.
    // Tridirectional drift guard: the label must end with
    // /votes? so far$/, must NEVER carry the pre-pass-34
    // "net vote(s)" framing, AND must NEVER regress to the
    // bare pass-34 "community vote(s)" framing.
    const label = page.getByTestId('vote-pair').locator('.vote-label')
    await expect(label).toHaveText(/votes? so far$/)
    const labelText = (await label.textContent()) ?? ''
    expect(labelText).not.toMatch(/net votes?/)
    expect(labelText).not.toMatch(/^community votes?$/)

    if (api.value === 0) {
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
    }
  })

  test('clicking up flips the pill across the three-state triad', async ({
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
    // the no-vote state and the pill flips to "you haven't voted
    // yet". Either transition is a valid assertion as long as
    // the pill stays in sync with the data-voted attr.
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
      // Retract → the cap flips back to the no-vote declaration.
      await expect(cap).toHaveText("you haven't voted yet")
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
    // who have voted. Spoiler/account-confusion P0: an anon
    // viewer reading a pill copy would imply a viewer-identity
    // surface they don't have.
    await expect(page.getByTestId('vote-state-cap')).toHaveCount(0)

    // Pass-49 #410: the label reads "vote(s) so far" on every
    // state — the pass-34 "community vote(s)" form surfaced as
    // an ambiguous "1 / COMMUNITY VOTE" staccato; the "so far"
    // suffix names the count as a tally, and the integer is
    // still the distinct voter count (matches the ShiftCard's
    // `vote_count` framing). Tridirectional drift guard.
    const label = page.getByTestId('vote-pair').locator('.vote-label')
    await expect(label).toHaveText(/votes? so far$/)
    const labelText = (await label.textContent()) ?? ''
    expect(labelText).not.toMatch(/net votes?/)
    expect(labelText).not.toMatch(/^community votes?$/)
  })
})
