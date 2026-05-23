// Phase 43 — derived tenure for show editorial copy.
//
// The show schema is locked at twelve fields (CLAUDE.md "Show
// identity, formalized"), so a per-show premiere date is not
// available. `est_year` is an int. To bridge that gap, this
// module exposes a small `SHOW_ANNIVERSARIES` override map for
// the handful of shows whose tagline copy cites their tenure;
// every other show falls back to a January 1 anchor, which is
// the conservative default for year-only frontmatter.
//
// The intent: tagline copy uses `{yearsWord}` / `{years}` tokens
// instead of literal counts like "twenty-five years". The loader
// substitutes the tokens on every read, so the rendered string
// stays honest across the show's anniversary without an editor
// touching the file. The same helper backs the `content-check`
// invariant that pins literal-count rephrasings to the derived
// value (lax during the Phase 43 drain; final tick flips strict).

export type ShowAnniversary = {
  /** 1-12 */ month: number
  /** 1-31 */ day: number
}

const DEFAULT_ANNIVERSARY: ShowAnniversary = { month: 1, day: 1 }

// Premiere anchors for shows whose tagline (or pinned body copy)
// cites their tenure. Add an entry the first time a show's copy
// needs a token; until then the Jan 1 default is fine.
export const SHOW_ANNIVERSARIES: Readonly<Record<string, ShowAnniversary>> = {
  // Survivor S1 premiered 2000-05-31. The tagline reads "spent
  // {yearsWord} years rediscovering what it is" — through May 30
  // 2026 the show is in its 25th year; from May 31 forward, the
  // 26th. Without this anchor the helper would read 26 from Jan 1
  // 2026 onward, overshooting the editor's voice by five months.
  survivor: { month: 5, day: 31 },
}

// Returns the number of full years between the show's `est_year`
// anniversary and the reference date. The reference defaults to
// "now" so callers don't have to thread the date through. The
// anniversary defaults to Jan 1 — pass the show-specific anchor
// from `SHOW_ANNIVERSARIES` when one exists.
export function yearsSinceEst(
  estYear: number,
  asOfDate: Date = new Date(),
  anniversary: ShowAnniversary = DEFAULT_ANNIVERSARY,
): number {
  const refYear = asOfDate.getUTCFullYear()
  const refMonth = asOfDate.getUTCMonth() + 1
  const refDay = asOfDate.getUTCDate()
  const beforeAnniversary =
    refMonth < anniversary.month ||
    (refMonth === anniversary.month && refDay < anniversary.day)
  const elapsed = refYear - estYear - (beforeAnniversary ? 1 : 0)
  return elapsed < 0 ? 0 : elapsed
}

const UNITS: readonly string[] = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]

const TENS: Readonly<Record<number, string>> = {
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety',
}

// Converts a non-negative integer (0-99) to its spelled-out
// form. Covers the realistic tenure range for any reality show
// (no show is older than 99 years). Throws on negatives or
// >= 100 so a typo at the call site surfaces during verify
// rather than rendering "undefined years".
export function numberToWords(n: number): string {
  if (!Number.isInteger(n)) {
    throw new RangeError(`numberToWords expects an integer, got ${n}`)
  }
  if (n < 0 || n >= 100) {
    throw new RangeError(`numberToWords supports 0-99, got ${n}`)
  }
  if (n < 20) return UNITS[n] as string
  const tens = Math.floor(n / 10) * 10
  const unit = n % 10
  if (unit === 0) return TENS[tens] as string
  return `${TENS[tens]}-${UNITS[unit]}`
}

export type ShowTaglineContext = {
  estYear: number
  slug: string
  asOfDate?: Date
}

// Substitutes `{years}` (decimal) and `{yearsWord}` (spelled-out)
// in a tagline template. Token-free templates pass through
// unchanged, so calling this on every read is safe for shows
// whose tagline is a literal string.
export function renderShowTaglineTokens(
  template: string,
  ctx: ShowTaglineContext,
): string {
  if (!template.includes('{years')) return template
  const anniversary = SHOW_ANNIVERSARIES[ctx.slug] ?? DEFAULT_ANNIVERSARY
  const years = yearsSinceEst(ctx.estYear, ctx.asOfDate, anniversary)
  return template
    .replaceAll('{yearsWord}', numberToWords(years))
    .replaceAll('{years}', String(years))
}

// Spelled-out ordinals 1-19 (irregular forms).
const ORDINAL_UNITS: readonly string[] = [
  'zeroth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
]

// Spelled-out tens, ordinal form (used when the units digit is 0).
const ORDINAL_TENS: Readonly<Record<number, string>> = {
  20: 'twentieth',
  30: 'thirtieth',
  40: 'fortieth',
  50: 'fiftieth',
  60: 'sixtieth',
  70: 'seventieth',
  80: 'eightieth',
  90: 'ninetieth',
}

// Converts a non-negative integer (1-99) to its spelled-out
// ordinal form. Same range as `numberToWords`. Throws on values
// outside 1-99 so a typo at the call site surfaces during verify
// rather than rendering "undefined".
export function ordinalWord(n: number): string {
  if (!Number.isInteger(n)) {
    throw new RangeError(`ordinalWord expects an integer, got ${n}`)
  }
  if (n < 1 || n >= 100) {
    throw new RangeError(`ordinalWord supports 1-99, got ${n}`)
  }
  if (n < 20) return ORDINAL_UNITS[n] as string
  const tens = Math.floor(n / 10) * 10
  const unit = n % 10
  if (unit === 0) return ORDINAL_TENS[tens] as string
  // Compound — tens stay in cardinal form, units switch to ordinal.
  return `${TENS[tens]}-${ORDINAL_UNITS[unit]}`
}

// Numeric ordinal suffix: 1 -> "1st", 22 -> "22nd", 113 -> "113th".
// Handles the 11/12/13 irregularity. Range is 0-999 to give the
// renderer headroom; ordinals beyond a show's season count never
// surface in real copy.
export function ordinalSuffix(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`ordinalSuffix expects a non-negative integer, got ${n}`)
  }
  const lastTwo = n % 100
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`
  const last = n % 10
  if (last === 1) return `${n}st`
  if (last === 2) return `${n}nd`
  if (last === 3) return `${n}rd`
  return `${n}th`
}

export type SeasonCaptionContext = {
  /** The season's `number` field — 1, 2, …, N. */
  seasonNumber: number
}

// Substitutes `{seasonOrdinalWord}` (spelled-out — "twentieth")
// and `{seasonOrdinal}` (numeric — "20th") in a season-scoped
// caption template. Token-free templates pass through unchanged,
// so calling this on every season read is safe for the 200+
// existing literal captions.
//
// Phase 43 tick 5 introduced this for the `host_caption` field on
// shows where the host has been at the helm since season 1 (Probst
// on Survivor, Heidi Klum on Project Runway's classic era, Phil
// Keoghan on Amazing Race, Alan Cumming on The Traitors). The
// token form makes the caption mechanically correct without
// requiring the editor to count seasons on every author pass.
export function renderSeasonCaptionTokens(
  template: string,
  ctx: SeasonCaptionContext,
): string {
  if (!template.includes('{seasonOrdinal')) return template
  return template
    .replaceAll('{seasonOrdinalWord}', ordinalWord(ctx.seasonNumber))
    .replaceAll('{seasonOrdinal}', ordinalSuffix(ctx.seasonNumber))
}
