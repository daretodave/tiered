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

// Critique pass-31 HIGH (issue #306): cross-surface editorial-
// byline parity. Every rendered chrome byline and every catalog-
// level `curator` / `editor` frontmatter must agree with /about
// about the editorship's size. When /about admits "Built and
// operated by one person", the chrome bylines must read singular
// (`tiered.tv editor`). The bidirectional check below trips at
// unit time if either surface drifts in isolation — if /about
// is rewritten to a plural editorship without also re-pluralising
// the curator/editor fields (or vice versa), the gate fails and
// forces an editor to align both surfaces in lockstep. The
// content-check.ts companion invariant covers the catalog
// frontmatter; this test covers the /about prose anchor + the
// two source-file literal bylines.
describe('cross-surface byline parity vs /about (critique pass-31, issue #306)', () => {
  it('when /about admits "Built and operated by one person", source bylines stay singular', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    const singularAdmission =
      body.includes('Built and operated by one person') ||
      body.includes("the editor's call — one person")
    if (!singularAdmission) return
    // Two source-file literal bylines (the season page hero "Canon
    // entry by …" + the FeaturedThemes "curated by …" strip + the
    // ShowRanking canon lede). Each lives in its own colocated unit
    // test; the cross-surface guard here re-asserts the contract at
    // the /about boundary so a divergence between the two surfaces
    // (e.g. /about goes plural but the chrome stays singular) trips
    // here AND in the colocated tests, not silently in only one.
    expect(body).not.toMatch(/tiered\.tv\s+Editors\b/)
    expect(body).not.toMatch(/by\s+editors\b/i)
  })

  it('the singular admission still names exactly one operator (no silent rewrite to a collective)', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/Built and operated by one person/)
    expect(body).toMatch(/one person, one position per season/)
  })
})

// Critique pass-32 MED (issue #311): cross-surface drift — the
// home Community Rank card (`HomeDualCallout.tsx`) commits the
// product to a self-attestation rule (`Signed-in voters self-
// attest they watched the season end to end`) the formal /about
// voting policy never substantiated. /about details the
// 0.1× / 0.25× / 1.0× weighting ladder + the 72-hour window +
// weekly recompute, but the attestation prerequisite was missing.
// The fix lands the attestation sentence on /about as the lead
// sentence of the trust-mechanic paragraph (substantiates the
// home claim from the policy side). Bidirectional pin: whenever
// /about names the weighting ladder, the page MUST also name the
// self-attestation. A future authoring pass that drops one but
// keeps the other trips at unit time. Closure pattern matches
// pass-26 #282 + pass-27 #287 (name the mechanic on the page
// that owes the truth).
describe('cross-surface attestation parity vs home Community Rank (#311)', () => {
  it('names the self-attestation prerequisite the home card promises', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    expect(doc?.body_md).toMatch(/self-attest|watched the season end/i)
  })

  it('parity guard: if the weighting ladder is named, the self-attestation must be too', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    if (/0\.1×|0\.25×|1\.0×/.test(body)) {
      expect(body).toMatch(/self-attest|watched the season end/i)
    }
  })
})

// Critique pass-31 LOW (issue #310): the rate-limit trust line on
// /about previously read `Brigade rate-limits run behind the
// scenes…` — `Brigade` is verb-as-noun community-moderation
// jargon and the rest of the page reads in plain language. The
// load-bearing trust promise needs to land in plain language so
// a first-time visitor absorbs it. The bidirectional pin below
// trips if a future edit reintroduces the bare standalone token
// without a `coordinated|campaign|brigading` bridge in the same
// sentence — drift guard against regression back to the cold
// jargon form, AND against the same jargon migrating elsewhere
// in /about prose.
describe('content/legal/about.md rate-limit trust line voice (#310)', () => {
  it('does not use the bare standalone `Brigade` token without an inline plain-language bridge', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    // Walk every line that contains `Brigade` (word-boundary,
    // case-sensitive — the prior drift was title-case). Each
    // such line must also name `coordinated`, `campaign`, or
    // `brigading` so the term lands unpacked.
    const offending = body
      .split('\n')
      .filter((line) => /\bBrigade\b/.test(line))
      .filter((line) => !/coordinated|campaign|brigading/i.test(line))
    expect(offending).toEqual([])
  })

  it('names the rate-limit function in plain language (coordinated campaigns)', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/coordinated\s+voting\s+campaigns/)
  })
})
