import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-45 LOW closure (issue #383): /shows/survivor/season/
// heroes-vs-villains section 04 (`What to watch for`) previously had
// three of four moment bodies opening on the same `The [opening|first]
// [unit-of-time]` noun-phrase frame:
//
//   OPENER · COLD OPEN — `The opening shot — boat, water, twenty
//                         people who already know the camera is
//                         watching…`
//   MID · MERGE        — `The first ten minutes after the merge are
//                         the cleanest piece of reality-TV staging…`
//   LATE · THIRD ACT   — `The first minute of the late-game stretch
//                         is doing real work — staging, blocking,
//                         who's eating where. Don't blink.`
//
// EARLY · LONG TAKE broke the pattern (`An unbroken three-minute
// confessional…`). Three of four sibling beats on one stacked list
// shared the same opening grammatical shape — the kind of echo a
// reader picks up scanning the four bullet bodies in sequence.
//
// Pass-45's closure rotated LATE off the `The first [unit]` frame to
// `Late-game scenes do real work — staging, blocking, who's eating
// where. Don't blink.` — drops the leading `The first minute of the
// late-game stretch is`, preserves the staging-beat noun list and the
// `Don't blink.` close, brings the section's opener-frame echo from
// three-of-four to two-of-four (OPENER + MID still earn the `The
// [opening|first] [unit]` frame — OPENER because the section name IS
// `OPENER · COLD OPEN`; MID because the post-merge minute count is a
// structural fact the body anchors to).
//
// Pin shape mirrors the sibling `hvv-take-shape-opener-echo.test.ts`
// (pass-41 #358) bidirectional discipline: positive case asserts LATE
// body opens on the non-`The [first|opening] [unit]` rotation; negative
// case pins that the rejected shape does not return. A future authoring
// pass that drifts the LATE body back into the frame trips at unit
// time, not the next reader pass.

const FILE = path.resolve(
  process.cwd(),
  'content/shows/survivor/seasons/20-heroes-vs-villains.md',
)

function readWatchListBodies(): Record<string, string> {
  const raw = readFileSync(FILE, 'utf-8')
  const out: Record<string, string> = {}
  const labelRe = /-\s+episode_label:\s*"([^"]+)"\s*\n\s+body:\s*"([^"]+)"/g
  let m: RegExpExecArray | null = labelRe.exec(raw)
  while (m !== null) {
    const label = m[1]
    const body = m[2]
    if (label !== undefined && body !== undefined) out[label] = body
    m = labelRe.exec(raw)
  }
  return out
}

describe('content/shows/survivor/seasons/20-heroes-vs-villains — watch_list opener echo (pass-45 #383)', () => {
  const bodies = readWatchListBodies()

  it('extracts all four watch_list bodies from the live content file', () => {
    expect(Object.keys(bodies).sort()).toEqual(
      ['Early · long take', 'Late · third act', 'Mid · merge', 'Opener · cold open'].sort(),
    )
  })

  it('LATE body opens on the non-`The [opening|first] [unit]` rotation', () => {
    const late = bodies['Late · third act'] ?? ''
    expect(late).toMatch(/^Late-game scenes do real work/)
  })

  it('LATE body does NOT open with the rejected `The [opening|first] [unit]` frame', () => {
    const late = bodies['Late · third act'] ?? ''
    expect(late).not.toMatch(/^The (first|opening)\b/i)
  })

  it('at most two of the four watch_list bodies share the `The [opening|first] [unit]` opener frame', () => {
    // Pass-45 closure brought the echo from three-of-four to
    // two-of-four (OPENER + MID still earn the frame — OPENER because
    // the section name IS `OPENER · COLD OPEN`; MID because the
    // post-merge minute count is a structural fact). A future drift
    // that re-introduces a third `The [opening|first] [unit]` opener
    // trips this assertion.
    const echoes = Object.values(bodies).filter((b) =>
      /^The (first|opening)\b/i.test(b),
    )
    expect(echoes.length).toBeLessThanOrEqual(2)
  })
})
