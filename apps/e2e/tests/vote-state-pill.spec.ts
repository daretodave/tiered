import { type BrowserContext, expect, type Page, test } from '@playwright/test'
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
// members only. The component is global, so the same shape
// applies to every season route.
//
// Test isolation (#785 / #787): this file owns its vote target.
// It used to share `survivor:20` with user-profile.spec.ts (same
// authed e2e user), so cross-file execution order decided whether
// the authed viewer was already "up" and whether the anon count
// read 0 or 1. Now:
//  - SEASON_TARGET is a season no other spec votes on as the authed
//    user, and season-page.spec's sampled anon vote-up walk retracts
//    its own votes, so nothing else leaves state on it.
//  - beforeAll seeds exactly one anon "community" voter from a fresh
//    context, so the count is >= 1 no matter what ran before;
//    afterAll retracts it.
//  - every authed test starts from a known no-vote state (beforeEach)
//    and leaves none behind (afterEach), so user-profile's
//    "1 season voted" count never sees this file's vote.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

const SEASON_URL = '/shows/survivor/season/millennials-vs-gen-x'
const SEASON_TARGET = 'survivor:33'

type VoteValue = -1 | 0 | 1

async function setVote(page: Page, value: VoteValue): Promise<void> {
  const res = await page.evaluate(
    async ({ targetId, v }) => {
      const r = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetType: 'season', targetId, value: v }),
        credentials: 'include',
      })
      return { status: r.status, body: await r.json() }
    },
    { targetId: SEASON_TARGET, v: value },
  )
  expect(res.status, `set vote ${value}: ${JSON.stringify(res.body)}`).toBe(200)
  expect(res.body.value).toBe(value)
}

// The seeded community voter's cookie jar, so afterAll can retract
// the very vote beforeAll cast.
let communityVoter: Awaited<ReturnType<BrowserContext['storageState']>> | null =
  null

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext()
  try {
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await setVote(page, 1)
    communityVoter = await ctx.storageState()
  } finally {
    await ctx.close()
  }
})

test.afterAll(async ({ browser }) => {
  if (!communityVoter) return
  const ctx = await browser.newContext({ storageState: communityVoter })
  try {
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await setVote(page, 0)
  } finally {
    await ctx.close()
    communityVoter = null
  }
})

test.describe('vote state pill — authed viewer sees disambiguation', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  // Known starting state: the authed viewer has not voted on this
  // file's target. Load the page first so the fetch runs same-origin
  // with the authed cookie jar.
  test.beforeEach(async ({ page }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    await setVote(page, 0)
  })

  // Leave no authed vote behind for any later spec.
  test.afterEach(async ({ page }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    await setVote(page, 0)
  })

  const triad: Array<{ value: VoteValue; text: string; attr: string }> = [
    { value: 1, text: 'you voted higher', attr: 'up' },
    { value: -1, text: 'you voted lower', attr: 'down' },
    { value: 0, text: "you haven't voted yet", attr: 'none' },
  ]

  for (const shape of triad) {
    test(`signed-in viewer sees disambiguated VotePair state (three-state cap triad: ${shape.attr})`, async ({
      page,
    }) => {
      await setVote(page, shape.value)
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
      expect(api.value).toBe(shape.value)
      // The seeded community voter is always counted.
      expect(Number(api.count)).toBeGreaterThanOrEqual(1)

      const stack = page.getByTestId('vote-pair-stack')
      await expect(stack).toBeVisible()
      await expect(stack).toHaveAttribute('data-signed-in', 'true')

      // The pill declares one of three states for every signed-in
      // viewer; each shape is driven explicitly above.
      const cap = page.getByTestId('vote-state-cap')
      await expect(cap).toHaveText(shape.text)
      await expect(cap).toHaveAttribute('data-vote-state', shape.attr)

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

      if (shape.value === 0) {
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
  }

  test('raw SSR HTML already reflects signed-in state — no anon-shell flash for an authed viewer (critique pass-84 HIGH)', async ({
    context,
  }) => {
    // `getByTestId(...)` assertions elsewhere in this spec auto-wait
    // and so only ever observe the post-hydration DOM — they would
    // never catch the bug critique pass-84 found: the server-
    // rendered HTML resolving the header's signed-in state
    // correctly while VoteRowHead/VotePair rendered the anon shell
    // in the very same response, repaired only after client JS
    // mounted. `context.request` shares this context's authed
    // cookie jar, so this reads the raw response body with no
    // browser JS involved.
    const res = await context.request.get(SEASON_URL)
    expect(res.ok()).toBe(true)
    const html = await res.text()

    expect(html).toContain('data-testid="site-header"')
    expect(html).toMatch(/data-signed-in="true"/)

    // The page can't know the viewer's vote value without a DB read,
    // but it does know signedIn — so the SSR payload always seeds
    // "signed-in-no-vote", never "anon", for an authed viewer. The
    // /api/vote client read-back may still upgrade it to
    // "signed-in-with-vote" post-hydration if they'd already voted.
    expect(html).not.toContain('data-vote-head-state="anon"')
    expect(html).toContain('data-vote-head-state="signed-in-no-vote"')
    expect(html).toContain('data-testid="vote-pair-stack" data-signed-in="true"')
  })

  test('clicking up flips the pill across the three-state triad', async ({
    page,
  }) => {
    await page.goto(SEASON_URL, { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('vote-pair-stack')).toHaveAttribute(
      'data-signed-in',
      'true',
    )

    const pair = page.getByTestId('vote-pair')
    const cap = page.getByTestId('vote-state-cap')
    const up = page.getByTestId('vote-up')

    // beforeEach cleared the viewer's vote; wait for the mount
    // read-back to land so the click is not racing hydration.
    await expect(cap).toHaveText("you haven't voted yet")
    await expect(cap).toHaveAttribute('data-vote-state', 'none')
    await expect(pair).toHaveAttribute('data-voted', 'none')

    const posted = () =>
      page.waitForResponse(
        (r) => r.url().includes('/api/vote') && r.request().method() === 'POST',
      )

    // Drive the pair through up-vote. The pill is owned by the
    // same component so the optimistic state must show in the
    // pill text immediately — no network round-trip required.
    await Promise.all([posted(), up.click()])
    await expect(pair).toHaveAttribute('data-voted', 'up')
    await expect(cap).toHaveText('you voted higher')
    await expect(cap).toHaveAttribute('data-vote-state', 'up')

    // A second click (after the lock lifts) retracts to the
    // no-vote state and the pill flips back.
    await expect(up).toBeEnabled()
    await Promise.all([posted(), up.click()])
    await expect(pair).toHaveAttribute('data-voted', 'none')
    await expect(cap).toHaveText("you haven't voted yet")
    await expect(cap).toHaveAttribute('data-vote-state', 'none')
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
    // beforeAll's seeded community voter.
    expect(Number(api.count)).toBeGreaterThanOrEqual(1)

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
    // `vote_count` framing). Tridirectional drift guard. The
    // count is >= 1 by construction (beforeAll), so the zero-state
    // "be the first to vote" copy must not appear here.
    const label = page.getByTestId('vote-pair').locator('.vote-label')
    await expect(label).toHaveText(/votes? so far$/)
    const labelText = (await label.textContent()) ?? ''
    expect(labelText).not.toMatch(/net votes?/)
    expect(labelText).not.toMatch(/^community votes?$/)
  })
})

test.describe('vote-pair SSR count seeding (critique pass-106)', () => {
  test('raw SSR HTML seeds the vote count from the true aggregate, never a hardcoded 0', async ({
    context,
  }) => {
    await context.clearCookies()

    // read_vote's aggregate is session-independent (its own RPC
    // contract comment: "an anon visitor with no cookie still sees
    // the true net"), so an unauthenticated GET reports the same
    // voter_count the page's server component now seeds VotePair
    // with. Before the pass-106 fix, `initialCount` was hardcoded
    // to 0 regardless of this value, so a season with existing
    // votes flashed "0 votes so far" until the client mount fetch
    // resolved a few hundred ms later.
    const api = await context.request.get(
      `/api/vote?targetType=season&targetId=${encodeURIComponent(SEASON_TARGET)}`,
    )
    expect(api.ok()).toBe(true)
    const apiJson = await api.json()
    expect(apiJson.ok).toBe(true)
    const trueCount = Number(apiJson.count)

    const res = await context.request.get(SEASON_URL)
    expect(res.ok()).toBe(true)
    const html = await res.text()

    const match = html.match(/data-testid="vote-count"[^>]*>([\d,]+)</)
    expect(match).not.toBeNull()
    const ssrCount = Number((match?.[1] ?? '').replace(/,/g, ''))
    expect(ssrCount).toBe(trueCount)
  })
})
