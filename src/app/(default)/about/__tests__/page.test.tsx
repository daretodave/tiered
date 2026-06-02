import { describe, expect, it } from 'vitest'
import { getLegalDoc } from '@/content'

// The FAQs array is private to the page module. We re-export
// behavior assertions via the JSON-LD that the e2e walks, but
// this unit-level test smoke-checks that the page module
// imports without crashing — primarily a guard against a stale
// content/legal/about.md filename or schema change breaking
// build.

describe('/about page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })
})

// Iterate finding #258 (issue #258): the prior `/about` "How voting
// works" section described a per-session, unlimited-flip mechanic
// with no mention of the post-#240 single-binary "belongs in the
// community top 10?" framing the home + season pages now lead with.
// New copy leads with the question (matching HomeDualCallout) and
// pins per-reader scope + 72-hour change window + weekly recompute
// (matching SeasonInfoCard). The weighting math stays — it is
// accurate to the DB and /about is the granular surface where it
// belongs. The earlier #257 closure ([+]/[−] regression guard)
// folds into the bidirectional pins here so the prior contract
// holds while the new one lands.
describe('content/legal/about.md voting copy (#258, supersedes #257)', () => {
  // Source markdown wraps at 65 cols, so positive pins use `\s+` for
  // whitespace tolerance — the exact phrase may span a line break in
  // the body_md (raw, pre-render) the assertions read.
  it('leads with the single-binary "belongs in the community top 10" question (matches HomeDualCallout)', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    expect(doc?.body_md).toMatch(/belong\s+in\s+the\s+community\s+top\s+10/)
  })

  it('describes the live VotePair as upvote / downvote (the question\'s answer)', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).toMatch(/upvote\s+or\s+downvote/)
  })

  it('pins per-reader scope (matches SeasonInfoCard voteHelp)', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).toMatch(/per\s+reader/)
  })

  it('pins the 72-hour change window (matches the season info-row "change within 72h")', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).toMatch(/72\s+hours/)
  })

  it('pins the weekly recompute cadence (matches SeasonInfoCard voteHelp)', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).toMatch(/updates\s+weekly/)
  })

  it('does not regress to the bracketed [+] / [−] glyphs that drifted from the live UI (#257)', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).not.toMatch(/\[\+\]/)
    expect(doc?.body_md).not.toMatch(/\[−\]/)
  })

  it('does not regress to the per-session scope claim that contradicts the live UI', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).not.toMatch(/per session/i)
  })

  it('does not regress to the unlimited-flip claim that contradicts the 72-hour window', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).not.toMatch(/flip it whenever/i)
  })
})

// Iterate finding #276 (issue #276, critique pass 25 MED): the prior
// /about frontmatter description ("A spoiler-free home for ranked TV
// seasons. How it works.") was the home tagline with three terse words
// tacked on — flat across search snippets, OG cards, JSON-LD. The page
// body delivers the canon spec + weight ladder + spoilers policy, so
// the new description leads with that substance. Bidirectional pins:
// positive that the description names at least one of {canon, vote,
// spoilers}; negative that it does not regress to the prior
// "How it works." closer drift.
describe('content/legal/about.md frontmatter description (#276)', () => {
  it('names a substantive editorial keyword the body owns (canon / vote / spoilers)', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    expect(doc?.description).toMatch(/canon|vote|spoilers/i)
  })

  it('does not regress to the prior "How it works." flat-fallback closer', () => {
    const doc = getLegalDoc('about')
    expect(doc?.description).not.toMatch(/How it works\.\s*$/)
  })

  it('does not regress to the home-tagline duplicate "A spoiler-free home for ranked TV seasons" opener', () => {
    const doc = getLegalDoc('about')
    expect(doc?.description).not.toMatch(/A spoiler-free home for ranked TV seasons/)
  })
})
