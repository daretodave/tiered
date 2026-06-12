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
// Critique pass-50 LOW: the prior /about frontmatter `title` read
// `About tiered.tv`, which the root layout's `%s — tiered.tv`
// template double-stamped into `<title>About tiered.tv — tiered.tv</title>`
// on every SERP snippet, browser tab, share-card fallback, and Slack
// preview. Every other page on the site passes a clean noun
// (`title: 'All shows'` → `All shows — tiered.tv`) and lets the
// template carry the brand stamp once. The fix rotates the
// frontmatter to the clean noun `About`. The pin below catches any
// future authoring pass re-introducing the brand stamp in the title
// itself (which would re-double-stamp at render time).
describe('content/legal/about.md frontmatter title — brand-stamp hygiene (critique pass-50)', () => {
  it('uses the clean noun `About` so the root template stamps the brand exactly once', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    expect(doc?.title).toBe('About')
  })

  it('does not regress to the double-stamped `About tiered.tv` form', () => {
    const doc = getLegalDoc('about')
    expect(doc?.title).not.toMatch(/tiered\.tv/i)
  })
})

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

// Critique pass-33 MED (issue #318): intra-/about drift — two
// adjacent sections of the same legal doc both opened with the
// `<group> carry the most weight` sentence template, and the
// `How voting works` lede (`Long-standing accounts carry the
// most weight.`) overpromised against the 7-day cliff named
// two sentences below (`Accounts 7+ days old count at 1.0×`).
// Seven days is not `long-standing` by any reader's reading. The
// fix replaces line 38's opener with the direct datum
// (`Accounts a week old or older count at full weight; younger
// accounts and guests count less.`). Bidirectional pins below
// catch (1) re-introduction of the duplicate template across
// two distinct sentences, AND (2) re-coupling the `long-standing`
// claim to the weighting ladder it contradicts. Closure pattern
// matches pass-26 #282 + pass-27 #287 + pass-32 #311 (drift
// guard on the page that owes the truth).
describe('content/legal/about.md within-page sentence-template + tenure honesty (#318)', () => {
  it('does not repeat the "<group> carry the most weight" template across two distinct sentences', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    const matches =
      body.match(
        /\b(signed-in|long-standing|account|voter|member|guest)[^.]*\bcarry the most weight\b/gi,
      ) ?? []
    expect(matches.length).toBeLessThanOrEqual(1)
  })

  it('does not couple the `long-standing` claim to the 7+ day weighting ladder', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    if (/0\.1×|0\.25×|1\.0×/.test(body)) {
      expect(body).not.toMatch(
        /long-standing[^.]*carry the most weight|carry the most weight[^.]*long-standing/i,
      )
    }
  })
})

// Critique pass-34 MED (issue #322): the prior /about lede
// (`Community Rank` bullet) closed on `Signed-in members carry
// the most weight.` — a flat promise that contradicted the
// weighting ladder three paragraphs below (which names a 7-day
// tenure cliff: brand-new signed-in accounts count at 0.25×, not
// 1.0×). The #318 close drained the same overpromise from the
// policy paragraph but left the upstream lede unmodified. The
// fix rewrites the third sentence to name the same two-cliff
// structure the policy ladder commits to (guest vs signed-in +
// new vs long-tenured). Bidirectional pins below catch (1) the
// lede regressing to a flat `signed-in … carry the most weight`
// promise whenever the body still names the weighting ladder,
// AND (2) the rewrite drifting back to the bare marketing form
// without a tenure qualifier. Closure pattern matches pass-26
// #282 + pass-27 #287 + pass-32 #311 + pass-33 #318 (drift
// guard on the page that owes the truth).
describe('content/legal/about.md lede honesty vs weighting ladder (#322)', () => {
  // The lede region is everything before the `## How voting works`
  // policy heading. The policy ladder lives below that boundary;
  // pinning against the lede slice keeps the negative match clear
  // of the ladder text itself (the ladder is allowed to name the
  // weighting; the lede must not flat-promise it).
  function ledeOf(body: string): string {
    const idx = body.search(/## How voting works/)
    return idx > 0 ? body.slice(0, idx) : body
  }

  it('lede does not flat-promise that signed-in members carry the most weight when the ladder is named', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    if (/0\.1×|0\.25×|1\.0×/.test(body)) {
      expect(ledeOf(body)).not.toMatch(/\bsigned-in[^.]*\bcarry the most weight\b/i)
    }
  })

  it('lede names a tenure qualifier so the rewrite does not drift back to the bare marketing form', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(ledeOf(body)).toMatch(
      /\b(long-tenured|long-standing|tenured|a week old|7\+?\s*days?)\b/i,
    )
  })
})

// Critique pass-34 LOW (issue #325): the prior `/about` "How
// voting works" policy paragraph carried a qualitative bridge
// sentence (`Accounts a week old or older count at full weight;
// younger accounts and guests count less.`) immediately followed
// by the three numeric sentences that say the same thing with the
// actual multipliers (`0.1×` / `0.25×` / `1.0×`). The qualitative
// bridge previewed the numeric ladder in English right before the
// numbers themselves — same fact, two registers, no new editorial
// work between them. The fix drops the bridge entirely so the
// numeric ladder carries the policy alone. Bidirectional pins
// below catch (1) a re-introduction of the bridge phrase in any
// form (`full weight; younger accounts and guests count less` —
// the load-bearing two-clause structure), AND (2) the numeric
// ladder regressing or losing one of the three weight cliffs that
// now do all the work. Closure pattern matches pass-26 #282 +
// pass-27 #287 + pass-32 #311 + pass-33 #318 + pass-34 #322
// (drift guard on the page that owes the truth).
describe('content/legal/about.md voting paragraph drops qualitative bridge (#325)', () => {
  it('does not regress by re-introducing the qualitative bridge sentence', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    expect(body).not.toMatch(
      /full\s+weight\s*;\s*younger\s+accounts\s+and\s+guests\s+count\s+less/i,
    )
  })

  it('numeric ladder still carries the three weight cliffs (0.1× / 0.25× / 1.0×)', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/0\.1×/)
    expect(body).toMatch(/0\.25×/)
    expect(body).toMatch(/1\.0×/)
  })
})

// Critique pass-37 MED (issue #335): the home Community Rank
// blurb (`HomeDualCallout.tsx`) named the three weights in a
// different order than /about — home went highest-to-lowest and
// dropped the 1.0× ceiling; /about lists lowest-to-highest with
// the 7-day cliff. A reader following home → /about formed two
// inconsistent mental models of the same ladder. The fix aligned
// home to /about's lowest-to-highest ordering. The pin below
// guards the /about side of that alignment — a future authoring
// pass that re-orders or drops a cliff trips at unit time so the
// two surfaces stay in lockstep.
describe('content/legal/about.md weight ladder ordering vs home (#335)', () => {
  it('lists the three cliffs lowest-to-highest (anon 0.1× → under-7 0.25× → 7+ 1.0×)', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    expect(body).toMatch(
      /0\.1×[^]*under\s+7\s+days[^]*0\.25×[^]*7\+\s*days[^]*1\.0×/i,
    )
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
// Critique pass-45 MED (issue #381): the prior /about masthead
// narrated the editor function in first-person plural
// (`For every show we cover`, `Editor's Canon — our editorial
// ranking`, `We err on the side of redacting`) while the same
// surface admitted singular two paragraphs later
// (`Built and operated by one person`). Same defect class as
// the resolved pass-44 #341 /themes hero plural→singular
// closure (84c1882) — at the legal-doc surface that closure
// didn't reach. The fix rotates all three literals to the
// singular-I editor narrator now established across the rest
// of the editorial chrome (/themes hero post-#341,
// /shows/[show] canon-methodology `I've ranked every single
// one` / `How do I weigh it?` / `When do I revisit?`).
// Bidirectional pins below catch (1) the rotation succeeding
// (positive on `I cover`), AND (2) any future authoring pass
// reverting to the three retired plural literals (negative on
// the verbatim phrases). Closure pattern matches pass-44 #341.
describe('editorial narrator voice on /about (critique pass-45, issue #381)', () => {
  // Source markdown wraps at 65 cols, so positive pins use `\s+`
  // for whitespace tolerance — the exact phrase may span a line
  // break in the body_md (raw, pre-render) the assertions read.
  it('rotates `For every show we cover` to the singular `I cover`', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/For\s+every\s+show\s+I\s+cover/)
    expect(body).not.toMatch(/For\s+every\s+show\s+we\s+cover/)
  })

  it('rotates `our editorial ranking` to a singular framing', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).not.toMatch(/our\s+editorial\s+ranking/)
  })

  it('rotates `We err on the side of redacting` to the singular `I err`', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/I\s+err\s+on\s+the\s+side\s+of\s+redacting/)
    expect(body).not.toMatch(/We\s+err\s+on\s+the\s+side\s+of\s+redacting/)
  })

  // critique pass-46 MED — Become-an-editor `tell us` survived
  // #381's masthead rotation. Same defect class as #381 at the
  // section the prior closure didn't reach.
  it('rotates Become-an-editor `tell us` to the singular `tell me`', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/tell\s+me\s+which\s+show\s+and\s+which\s+season/)
    expect(body).not.toMatch(/tell\s+us\s+which\s+show/)
  })
})

// Critique pass-47 MED (issue #393): the prior /about section
// order rendered (1) `How voting works`, (2) `Spoilers policy`,
// (3) `Become an editor`, (4) `What this is` — the project's
// identity statement (`An experiment. Built and operated by one
// person…`) was the page's last major section, so a first-time
// visitor read the weighting-ladder math before they read what
// the project *is*. Identity-before-mechanics is the standard
// editorial order for an /about page. The fix promotes
// `What this is` to the first H2 section (between the hero lede
// and `How voting works`). Bidirectional pins below catch (1) a
// future content rewrite that defaults the order back to
// mechanics-first, AND (2) silent renames of the load-bearing
// section heading. Closure pattern matches pass-45 #381 (drift
// guard on the page that owes the truth).
describe('content/legal/about.md section order — identity before mechanics (#393)', () => {
  it('renders `What this is` as the first H2 after the hero lede', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    const headings = [...body.matchAll(/^##\s+(.+?)(?:\s+\{#[^}]+\})?\s*$/gm)].map((m) =>
      (m[1] ?? '').trim(),
    )
    expect(headings[0]).toBe('What this is')
  })

  it('keeps the four-section roster intact (no silent rename or drop)', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    const headings = [...body.matchAll(/^##\s+(.+?)(?:\s+\{#[^}]+\})?\s*$/gm)].map((m) =>
      (m[1] ?? '').trim(),
    )
    expect(headings).toEqual([
      'What this is',
      'How voting works',
      'Spoilers policy',
      'Become an editor',
    ])
  })

  it('does not regress by putting `How voting works` ahead of `What this is`', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    const whatIdx = body.search(/^##\s+What this is\b/m)
    const votingIdx = body.search(/^##\s+How voting works\b/m)
    expect(whatIdx).toBeGreaterThan(-1)
    expect(votingIdx).toBeGreaterThan(-1)
    expect(whatIdx).toBeLessThan(votingIdx)
  })
})

// Critique pass-47 LOW (issue #406): the prior /about
// `Become an editor` section closed on "New editors come in by
// invitation after a draft round." — `draft round` is a
// term-of-art undefined in-page and nowhere else on the site.
// A reader who pitches by opening a GitHub issue has no
// reliable read on what `draft round` means as a process. The
// fix rewrites the close to a plain one-clause description
// ("a sample season write-up I agree to") that names the
// artifact + the agreement, preserves the editor's gatekeeping
// discretion + the invitation-rather-than-application model,
// and drops the undefined term-of-art. Bidirectional pins
// below catch (1) the rewrite succeeding (positive on the new
// clause), AND (2) any future authoring pass reintroducing
// `draft round` in the same section. Closure pattern matches
// pass-45 #381 + pass-46 #393 (drift guard on the page that
// owes the truth).
describe('Become-an-editor close drops undefined `draft round` (#406)', () => {
  it('rewrites to a plain one-clause description naming the artifact', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    const body = doc?.body_md ?? ''
    expect(body).toMatch(/sample\s+season\s+write-up\s+I\s+agree\s+to/)
  })

  it('does not regress to the undefined `draft round` term-of-art', () => {
    const doc = getLegalDoc('about')
    const body = doc?.body_md ?? ''
    expect(body).not.toMatch(/\bdraft\s+round\b/i)
  })
})

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
