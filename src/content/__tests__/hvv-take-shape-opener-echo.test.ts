import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-41 MED closure (issue #358) — opener-echo half: /shows/
// survivor/season/heroes-vs-villains TAKE (frontmatter `pull` field) and
// SHAPE (markdown body) previously opened with verbatim-near-identical
// structural sentences within ~80 words of each other. Both restated
// cast size + Samoa + first-decade framing before they diverged — a
// reader scrolling past 01 into 02 read the same setup twice without
// progress.
//
// The pass-41 fix rewrote SHAPE's opening to lead with the pacing/
// rhythm read SHAPE actually owns (the structural beat TAKE doesn't
// reach).
//
// Critique pass-42 LOW + pass-43 LOW closure (issue #372) — close-echo
// half: both TAKE close + SHAPE close subsequently echoed the canon #02
// rationale close (`measured against this stretch of TV.`) one-and-two
// clicks away on the same legacy-stinger frame. Pass-43 LOW explicitly
// noted the within-page sibling echo (TAKE close + SHAPE close both
// terminating on the `every all-returnee X since` clause). The closure
// rotated BOTH closes off the legacy stinger to concrete structural
// beats: TAKE now closes on the heroes-versus-villains premise holding
// clean through pre-merge (no tribe swap, no twist reshuffle); SHAPE
// now closes on tribal-council floors reading as open negotiation
// tables with players doing the math in front of each other. The canon
// #02 rationale close at `content/shows/survivor/canon.md:67-68`
// remains the legacy-anchored read of record.
//
// Pin shape mirrors the #325 closure pattern (bidirectional drift guard
// at sibling `best-finales-card-hero-noun-share.test.ts`): the positive
// case asserts SHAPE's new opener carries the rhythm/pacing lead; the
// negative cases pin that the rejected duplicative shape — `Twenty
// returnees split` + the verbatim 7-word "back half rarely lets the
// editor breathe" echo that an earlier rewrite draft introduced — does
// not return to the body; the second positive case pins the casting-
// as-format observation that survives BOTH closures plus the new
// SHAPE-close anchors (tribal-council floors + math-in-the-open).
// Together they trip at unit time on a future authoring drift, not the
// next reader pass.

const FILE = path.resolve(
  process.cwd(),
  'content/shows/survivor/seasons/20-heroes-vs-villains.md',
)

function readBody(): string {
  const raw = readFileSync(FILE, 'utf-8')
  const m = raw.match(/^---\n[\s\S]+?\n---\n([\s\S]*)$/)
  return (m?.[1] ?? '').trim()
}

function readPull(): string {
  const raw = readFileSync(FILE, 'utf-8')
  const m = raw.match(/^pull:\s*"([\s\S]+?)"\s*$/m)
  return m?.[1] ?? ''
}

describe('content/shows/survivor/seasons/20-heroes-vs-villains — TAKE/SHAPE opener echo (pass-41 #358)', () => {
  const body = readBody()
  const pull = readPull()

  it('extracts both editorial fields from the live content file', () => {
    expect(body.length).toBeGreaterThan(0)
    expect(pull.length).toBeGreaterThan(0)
  })

  it('SHAPE body opens on the rhythm/pacing read SHAPE actually owns', () => {
    expect(body).toMatch(/^The episodes land in a different rhythm/)
  })

  it('SHAPE body does not regress to the duplicative cast-size + Samoa + decade opener', () => {
    const firstSentence = body.split(/\.\s/)[0] ?? ''
    expect(firstSentence).not.toMatch(/^Twenty returnees split/i)
    expect(firstSentence).not.toMatch(/two tribes by reputation/i)
    expect(firstSentence).not.toMatch(/shot in\s+Samoa/i)
    expect(firstSentence).not.toMatch(/celebration of its first decade/i)
  })

  it('no 5-gram from TAKE appears verbatim anywhere in SHAPE', () => {
    const tokenize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[—–\-]/g, ' ')
        .replace(/[^a-z0-9'\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
    const ngrams = (tokens: string[], n: number) =>
      tokens.slice(0, Math.max(0, tokens.length - n + 1)).map((_, i) => tokens.slice(i, i + n).join(' '))
    const pullTokens = tokenize(pull)
    const bodyTokens = tokenize(body)
    const pullFiveGrams = new Set(ngrams(pullTokens, 5))
    const overlaps = ngrams(bodyTokens, 5).filter((g) => pullFiveGrams.has(g))
    expect(overlaps).toEqual([])
  })

  it('SHAPE preserves the casting-as-format observation and the new tribal-council-floor / math-in-the-open close', () => {
    // Survives pass-41 #358 + pass-42/43 #372: the casting-as-format
    // observation ("recognizable players placed") is the structural
    // beat both closures kept in the body. The other two pre-pass-42
    // anchors ("all-returnee run since" + "decade-memory hour") were
    // intentionally rotated off the body by the #372 closure — they
    // formed the cross-surface + within-page legacy-stinger echo with
    // the canon #02 rationale close. Negative pins below guard against
    // either phrase returning to the body.
    expect(body).toMatch(/recognizable players placed/i)
    expect(body).toMatch(/tribal-council floors/i)
    expect(body).toMatch(/doing the math/i)
  })

  it('SHAPE close does not regress to the pre-#372 legacy-stinger framing', () => {
    // Pass-42/43 #372 closure: the previous SHAPE close terminated on
    // `…decade-memory hour that every all-returnee run since has lived
    // in the shadow of.` — verbatim cross-surface echo with the canon
    // #02 close (`content/shows/survivor/canon.md:67-68`). Both phrases
    // pinned negative so a future authoring pass that re-introduces
    // either trips at unit time, not the next reader pass.
    expect(body).not.toMatch(/all-returnee run since/i)
    expect(body).not.toMatch(/decade-memory hour/i)
    expect(body).not.toMatch(/lived in the shadow of/i)
  })

  it('TAKE close does not regress to the pre-#372 legacy-stinger framing', () => {
    // Pass-42/43 #372 closure: the previous TAKE close terminated on
    // `Years on, every all-returnee experiment the genre attempts is
    // still measured against this stretch of television.` — the
    // cross-surface anchor with canon #02. Negative pin so a future
    // authoring drift back into the legacy-stinger frame trips at
    // unit time.
    expect(pull).not.toMatch(/every all-returnee experiment/i)
    expect(pull).not.toMatch(/measured against this stretch/i)
  })
})
