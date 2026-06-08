import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-41 MED closure (issue #358): /shows/survivor/season/
// heroes-vs-villains TAKE (frontmatter `pull` field) and SHAPE (markdown
// body) previously opened with verbatim-near-identical structural
// sentences within ~80 words of each other. Both restated cast size +
// Samoa + first-decade framing before they diverged — a reader scrolling
// past 01 into 02 read the same setup twice without progress.
//
// The fix rewrote SHAPE's opening to lead with the pacing/rhythm read
// SHAPE actually owns (the structural beat TAKE doesn't reach), keeping
// the casting-as-format observation, the long-shadow framing, and the
// decade-memory hour closer.
//
// Pin shape mirrors the #325 closure pattern (bidirectional drift guard
// at sibling `best-finales-card-hero-noun-share.test.ts`): the positive
// case asserts SHAPE's new opener carries the rhythm/pacing lead; the
// negative cases pin that the rejected duplicative shape — `Twenty
// returnees split` + the verbatim 7-word "back half rarely lets the
// editor breathe" echo that an earlier rewrite draft introduced — does
// not return to the body. Together they trip at unit time on a future
// authoring drift, not the next reader pass.

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

  it('SHAPE preserves the casting-as-format observation, long-shadow framing, and decade-memory hour', () => {
    expect(body).toMatch(/recognizable players placed/i)
    expect(body).toMatch(/all-returnee run since/i)
    expect(body).toMatch(/decade-memory hour/i)
  })
})
