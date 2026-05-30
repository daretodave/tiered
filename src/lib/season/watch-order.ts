// Watch-order shield line — derives the SeasonInfoCard shield-row
// chip ("Watch order — …") from a season's frontmatter format
// fields. Replaces the prior hardcoded `start here, no
// prerequisites` default that surfaced on every season page,
// including all-returnees / all-stars seasons where prior-season
// recognition is the actual entry contract.
//
// Three branches:
//   1. Returnee-flavored season (any all-stars / returnees /
//      veterans signal in format_changes / format_summary /
//      format_caption) → "relies on prior-season recognition".
//   2. Premiere season (number === 1) → "start here, no
//      prerequisites". The only legitimately standalone entry.
//   3. Otherwise (mid-run original cast) → "no prerequisites".
//      Honest about not requiring prior context without
//      mislabelling itself as the entry point.
//
// Spoiler P0 is unchanged: the chip frames *watch order*, not the
// outcome.

// Returnee-signal vocabulary, drawn from the live corpus:
//   - `returnee` / `returnees` — covers explicit format_changes tokens
//     (all-returnee-cast, returnee-injection, returnee-loved-one,
//     first-crossover-returnees) and editorial copy ("a returnee
//     pulled from the deep archive").
//   - `all-stars` / `all-star` — survivor S08 All-Stars,
//     PR S20, BB S07 + S22, AR S11 + S24.
//   - `veteran` / `veterans` — BB S13 Veterans vs. Newbies,
//     PR S20 "Returning-veterans edition", The Challenge S12
//     "Challenge veteran drafted a fresh athletic stranger".
//   - `vets?[- ]` — covers the hyphenated abbreviation in
//     "Vet-rookie pairs" (The Challenge S12) and "vets-and-newbies"
//     (BB S18).
//   - `all-winners` — Survivor S40 Winners at War format_changes.
const RETURNEE_SIGNAL =
  /(returnee|returnees|all-?stars?|veteran|veterans|vets?[- ]|all-winners)/i

export type WatchOrderInput = {
  number: number
  format_changes: readonly string[]
  format_summary?: string | null
  format_caption?: string | null
  // Editorial fields — eyebrow and lede catch the rare case where the
  // returnee signal lives only in prose (e.g., The Challenge S29
  // "Staged returnee arrival" / "staged returnees-arrival
  // storytelling"). Scanning these alongside the format fields keeps
  // the classification honest when an editor doesn't restate the
  // structural fact in the structural fields.
  eyebrow?: string | null
  lede?: string | null
}

export function isReturneeFlavored(season: WatchOrderInput): boolean {
  const haystack = [
    season.format_changes.join(' '),
    season.format_summary ?? '',
    season.format_caption ?? '',
    season.eyebrow ?? '',
    season.lede ?? '',
  ].join(' ')
  return RETURNEE_SIGNAL.test(haystack)
}

export const WATCH_ORDER_RETURNEE =
  'Watch order — relies on prior-season recognition'
export const WATCH_ORDER_PREMIERE =
  'Watch order — start here, no prerequisites'
export const WATCH_ORDER_MID_RUN = 'Watch order — no prerequisites'

export function seasonWatchOrderLine(season: WatchOrderInput): string {
  if (isReturneeFlavored(season)) return WATCH_ORDER_RETURNEE
  if (season.number === 1) return WATCH_ORDER_PREMIERE
  return WATCH_ORDER_MID_RUN
}
