// Phase 43 tick 4 — derived read time for the season-page byline.
//
// Before this module, the byline chip computed `Math.round((lede +
// body) / 220)` minutes and floored to 1. For multi-section canon
// entries (a pull quote, a watch list, an "Also appears in" rail)
// the count silently rounded to "1 min read" even when the
// reader's actual scroll was three or four times that. The chip
// stayed honest only for the leanest stub seasons.
//
// This helper walks every editorial surface that renders on the
// season page — lede, body paragraphs, pull blockquote, watch-list
// items (label + body), the derived "Where it sits" copy — and
// returns a minute count rounded to the nearest integer with a
// minimum of one. The render component reads from one source so
// the chip never drifts from what the reader sees.
//
// 220 wpm matches the prior calculation, which lands between the
// general-purpose 200 wpm (serif editorial) and 250 wpm (news);
// not changing it here keeps lean stub pages reading the same
// "1 min" they did before — the change is upward, not across.

export type WatchListLike = {
  episode_label?: string | null
  body: string
}

export type ReadMinutesInput = {
  lede?: string | null
  body?: string | null
  pull?: string | null
  whereItSits?: string | null
  watchList?: ReadonlyArray<WatchListLike> | null
}

const WORDS_PER_MINUTE = 220

function countWords(text: string | null | undefined): number {
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

export function totalReadWords(input: ReadMinutesInput): number {
  let total = 0
  total += countWords(input.lede)
  total += countWords(input.body)
  total += countWords(input.pull)
  total += countWords(input.whereItSits)
  if (input.watchList) {
    for (const item of input.watchList) {
      total += countWords(item.episode_label ?? null)
      total += countWords(item.body)
    }
  }
  return total
}

export function computeReadMinutes(input: ReadMinutesInput): number {
  const words = totalReadWords(input)
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
