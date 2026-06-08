#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import {
  getAllShows,
  getAllSeasons,
  getCanon,
  getAllThemes,
  getLegalDoc,
  loadAllContent,
} from '../src/content/loaders'
import { getCalendar } from '../src/content/calendar'
import { ContentValidationError } from '../src/content/errors'
import { legalFile, showFile } from '../src/content/paths'
import {
  validateEraBandCoverage,
  yearOfSeason,
} from '../src/lib/canon/era-bands'
import { extractPlacementOrdinal } from '../src/lib/canon/placement-ordinal'
import {
  SHOW_ANNIVERSARIES,
  numberToWords,
  yearsSinceEst,
} from '../src/lib/show-tenure'
import {
  WATCH_ORDER_RETURNEE,
  seasonWatchOrderLine,
} from '../src/lib/season/watch-order'

export type Failure = { file: string; message: string }

function fmtFailure(f: Failure): string {
  return `  ${f.file}\n    ${f.message.replace(/\n/g, '\n    ')}`
}

// Exported so the vitest suite can exercise the assertion set
// directly against a temp content tree without spawning a child
// process. The flag mirrors the script-level `STRICT` constant —
// 31b's final tick changes the default to `true`.
export function collectFailures(strict = false): Failure[] {
  const failures: Failure[] = []

  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    const seasons = getAllSeasons(show.slug)
    const seasonNumbers = new Set(seasons.map((s) => s.number))
    const seasonTitleByNumber = new Map(seasons.map((s) => [s.number, s.title]))
    const seasonBySlug = new Map<string, string>()

    for (const season of seasons) {
      const prior = seasonBySlug.get(season.slug)
      if (prior) {
        failures.push({
          file: `content/shows/${show.slug}/seasons/`,
          message: `duplicate season slug "${season.slug}" — appears on seasons ${prior} and ${season.number}`,
        })
      } else {
        seasonBySlug.set(season.slug, String(season.number))
      }
    }

    if (canon) {
      const canonRankBySeason = new Map<number, number>()
      for (const entry of canon.entries) {
        if (!seasonNumbers.has(entry.season)) {
          failures.push({
            file: `content/shows/${show.slug}/canon.md`,
            message: `canon entry rank ${entry.rank} references season ${entry.season} but no matching season file exists`,
          })
        }
        canonRankBySeason.set(entry.season, entry.rank)

        // The rationale's spoken placement ("the canon places it
        // twelfth", "earns the third slot") must equal the slot.
        // Drift here is a reader-visible correctness bug on the
        // flagship page (#63). Absence of a placement sentence is
        // tolerated — only a stated-but-wrong ordinal fails.
        const spoken = extractPlacementOrdinal(entry.rationale)
        if (spoken != null && spoken !== entry.rank) {
          failures.push({
            file: `content/shows/${show.slug}/canon.md`,
            message: `canon entry #${entry.rank} ("${entry.title}") prose states placement ${spoken}, not ${entry.rank} — rebase the placement ordinal to the slot`,
          })
        }

        // The canon heading is the season's display name on the
        // canon pane; the community pane renders the season
        // frontmatter title. When the heading is a clean prefix of
        // the season title that drops a separator-led subtitle
        // (e.g. "Micronesia" vs "Micronesia: Fans vs. Favorites"),
        // a reader sees the same season under two names on one page
        // (critique 2026-05-16). Editorial headings that *rename*
        // or *add* a disambiguating suffix (e.g. "Brad Womack
        // (first run)") are not prefixes-with-dropped-subtitle and
        // stay legal.
        const seasonTitle = seasonTitleByNumber.get(entry.season)
        if (
          seasonTitle != null &&
          seasonTitle !== entry.title &&
          seasonTitle.startsWith(entry.title) &&
          /^\s*[:—–-]\s/.test(seasonTitle.slice(entry.title.length))
        ) {
          failures.push({
            file: `content/shows/${show.slug}/canon.md`,
            message: `canon entry #${entry.rank} heading "${entry.title}" drops the subtitle of season ${entry.season} ("${seasonTitle}") — use the full season title so the canon and community panes name it identically`,
          })
        }
      }
      for (const season of seasons) {
        if (season.canonical_position == null) continue
        const expected = canonRankBySeason.get(season.number)
        if (expected != null && expected !== season.canonical_position) {
          failures.push({
            file: `content/shows/${show.slug}/seasons/`,
            message: `season ${season.number} declares canonical_position ${season.canonical_position} but canon ranks it #${expected}`,
          })
        }
      }
    }

    // Phase 34: era-band coverage. A present `canon.era_bands[]`
    // must always be structurally sound (gap-free, overlap-free,
    // covering the aired span) — that fails in lax mode too, the
    // same way a mismatched canon rank does. Absence is only a
    // failure under strict, and only for a canon'd show with a
    // substantial aired span (>= 8 seeded seasons) — newly-seeded
    // shows get bands when their canon is first authored.
    if (canon) {
      const eraBands = canon.era_bands ?? []
      const airedYears = seasons
        .map((s) => yearOfSeason(s))
        .filter((y): y is number => y != null)
      if (eraBands.length > 0) {
        for (const problem of validateEraBandCoverage(eraBands, airedYears)) {
          failures.push({
            file: `content/shows/${show.slug}/canon.md`,
            message: problem,
          })
        }
      } else if (strict && seasons.length >= 8) {
        failures.push({
          file: `content/shows/${show.slug}/canon.md`,
          message: `era_bands required (strict mode) — canon'd show has ${seasons.length} seeded seasons`,
        })
      }
    }

    if (strict && seasons.length > 0) {
      if (!canon) {
        failures.push({
          file: `content/shows/${show.slug}/canon.md`,
          message: 'canon.md required (strict mode) — show has seeded seasons',
        })
      } else {
        const canonSeasons = new Set(canon.entries.map((e) => e.season))
        for (const season of seasons) {
          if (!canonSeasons.has(season.number)) {
            failures.push({
              file: `content/shows/${show.slug}/canon.md`,
              message: `season ${season.number} ("${season.title}") is missing from canon (strict mode)`,
            })
          }
          if (season.canonical_position == null) {
            failures.push({
              file: `content/shows/${show.slug}/seasons/`,
              message: `season ${season.number} ("${season.title}") missing canonical_position (strict mode)`,
            })
          }
        }
      }
    }
  }
  return failures
}

// Themed-list invariants. Two referential checks (unknown show,
// missing season file) plus #101's `season_label`-vs-canonical
// title check: when `season_label` carries a ` · `-delimited name
// suffix, the suffix must equal the season's frontmatter `title`
// so themed-list rows and canon/season-page rows name the same
// season identically (S41 "Reboot" vs "New Era I"; S45 "Survivor
// 45" vs "Mom I Won"). Labels with no separator (e.g. a bare
// "S41") stay legal — only a stated-but-divergent name fails.
// Exported so the vitest suite can exercise it directly.
export function collectThemeFailures(): Failure[] {
  const failures: Failure[] = []
  const showSlugs = new Set(getAllShows().map((s) => s.slug))
  for (const theme of getAllThemes()) {
    for (const entry of theme.entries) {
      if (!showSlugs.has(entry.show)) {
        failures.push({
          file: `content/themes/${theme.slug}.md`,
          message: `theme entry rank ${entry.rank} references unknown show "${entry.show}"`,
        })
        continue
      }
      const seasons = getAllSeasons(entry.show)
      const matchingSeason = seasons.find((s) => s.number === entry.season)
      if (!matchingSeason) {
        failures.push({
          file: `content/themes/${theme.slug}.md`,
          message: `theme entry rank ${entry.rank} references show "${entry.show}" season ${entry.season} but that season file is missing`,
        })
        continue
      }
      if (entry.season_label != null) {
        const sep = ' · '
        const sepIdx = entry.season_label.indexOf(sep)
        if (sepIdx !== -1) {
          const namePart = entry.season_label.slice(sepIdx + sep.length).trim()
          if (namePart !== matchingSeason.title) {
            failures.push({
              file: `content/themes/${theme.slug}.md`,
              message: `theme entry rank ${entry.rank} season_label "${entry.season_label}" names season ${entry.season} as "${namePart}" but the canonical season title is "${matchingSeason.title}" — align the label so themed-list and season-page rows name the same season identically`,
            })
          }
          // Critique pass-8 #161: the `S<NN>` prefix already names
          // the season number, so a `· Season N` (or `· Series N`)
          // suffix is redundant — render reads "S07 · SEASON 7" on
          // the list page and a scanning reader registers the
          // duplication before they reach the entry blurb. A
          // parenthetical year tagged onto the bare numeric subtitle
          // (e.g. "S02 · Season 2 (2024)") is the same class plus
          // an extra ornament no other entry asks for. Rule: when
          // the subtitle is just the season number restated (with
          // or without a year suffix), the label MUST be the bare
          // `S<NN>`. Editorialized names ("Heroes vs. Villains",
          // "Las Vegas", "Renegades Era") stay legal.
          if (/^(Season|Series)\s+\d+(\s+\(\d{4}\))?$/i.test(namePart)) {
            failures.push({
              file: `content/themes/${theme.slug}.md`,
              message: `theme entry rank ${entry.rank} season_label "${entry.season_label}" repeats the season number in its subtitle ("${namePart}") — the "S${String(entry.season).padStart(2, '0')}" prefix already names the season, so drop the " · ${namePart}" suffix and use the bare "S${String(entry.season).padStart(2, '0')}" label`,
            })
          }
        }
      }
    }
  }
  return failures
}

// Phase 41: cross-canon coverage. Every themed list tagged
// `category` tone / structure / craft / era must carry entries
// from >= 3 distinct shows — the /themes hero copy and every
// CROSS-CANON tag promise cross-show coverage, so the data has to
// back the claim. `category: single` is the legal carve-out for a
// deliberately mono-show tier. (`structure` was added at critique
// pass-31 when the `tone` group head was split — structural cuts
// like reunion specials / post-merge / returnees inherently cross
// shows.) Lax (warns) during the phase-41 drain; `CROSS_SHOW_STRICT`
// in main() flips on the final drain tick, the same lax->strict
// pattern as the canon (STRICT) and era-band invariants. Exported
// so the vitest suite can exercise it directly.
const CROSS_SHOW_CATEGORIES = new Set(['tone', 'structure', 'craft', 'era'])

export function collectCrossShowIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (!CROSS_SHOW_CATEGORIES.has(theme.category)) continue
    const distinctShows = new Set(theme.entries.map((e) => e.show)).size
    if (distinctShows < 3) {
      issues.push({
        file: `content/themes/${theme.slug}.md`,
        message: `themed list "${theme.slug}" (category: ${theme.category}) covers ${distinctShows} distinct show${distinctShows === 1 ? '' : 's'} — cross-canon lists require entries from >= 3 shows (re-tag to category: single if it is deliberately one-show)`,
      })
    }
  }
  return issues
}

// Phase 39: the finale calendar. The Zod schema (getCalendar)
// owns structural validation — a malformed row throws
// ContentValidationError, surfaced here as a failure. This
// function additionally owns the referential checks the schema
// deliberately cannot express: every calendared show slug must
// resolve to a real show (a typo would silently disable the gate
// for that show), and no duplicate (show, season) pair. The
// referenced season file is intentionally NOT required — a
// calendared future finale legitimately precedes its seeded
// season file; surfacing that gap is the gate's whole purpose.
// Exported so the vitest suite can exercise it against a temp
// content tree without spawning a child process.
export function collectCalendarFailures(): Failure[] {
  const failures: Failure[] = []
  const showSlugs = new Set(getAllShows().map((s) => s.slug))
  try {
    const calendar = getCalendar()
    const seenFinale = new Set<string>()
    for (const entry of calendar.finales) {
      if (!showSlugs.has(entry.show)) {
        failures.push({
          file: 'content/calendar.yml',
          message: `finale references unknown show "${entry.show}" (season ${entry.season})`,
        })
      }
      const key = `${entry.show}:${entry.season}`
      if (seenFinale.has(key)) {
        failures.push({
          file: 'content/calendar.yml',
          message: `duplicate finale entry for "${entry.show}" season ${entry.season}`,
        })
      } else {
        seenFinale.add(key)
      }
    }
  } catch (err) {
    if (err instanceof ContentValidationError) {
      failures.push({ file: err.file, message: err.message })
    } else {
      failures.push({
        file: 'content/calendar.yml',
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }
  return failures
}

// Phase 43: editorial-tenure honesty. Editorial copy that spells
// out a show's tenure ("twenty-five years of casting work") rots
// silently as the show ages. Tick 1 introduced the
// `{yearsWord}` token + loader substitution; this invariant pins
// every remaining spelled-out year phrase in catalog markdown to
// the value `numberToWords(yearsSinceEst(estYear))` reads today.
// A mismatch surfaces as a warning (lax) during the phase-43
// drain, then as a verify-gate failure when the final tick flips
// strict — same lax->strict pattern as the canon STRICT and
// CROSS_SHOW_STRICT toggles above. Exported so the vitest suite
// can exercise it directly against a temp content tree and a
// stable `asOfDate`.
//
// Tick 6 (catalog sweep): the regex was tightened from "compound
// only" (twenty-five years) to "compound or bare" (twenty years
// also counts). Bare forms like "lasting twenty years" only stay
// editorially honest at multiple-of-ten anniversaries — Survivor
// S40 (2020) was the 20-year milestone, so the canon's Winners-at-
// War entry can cite "twenty years" historically. To allow that
// without re-licensing the rotting blurbs, callers can anchor a
// specific phrase to a specific (show, canon-entry-title) pair via
// `TENURE_ANCHOR_ALLOWLIST`. The anchor is intentionally narrow —
// each entry names the show, the canon entry's title, and the
// exact phrase it permits — so a future copy that just happens to
// say "twenty years" outside that entry still fails.
// Case-insensitive: editorial copy capitalizes the lede word
// ("Twenty-five years in, ...") and the lowercase-only form let
// the rotting H&V pull slip past the invariant. Comparison
// against `expectedPhrase` and the anchor allowlist is also
// case-insensitive below.
const YEAR_TENURE_RE =
  /\b(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-\w+)? years\b/gi

type TenureAnchor = {
  show: string
  /** Matched against the canon entry's `title` (case-insensitive). */
  entryTitle: RegExp
  /** Exact phrase (full match against the year-tenure regex) to allow. */
  phrase: string
}

export const TENURE_ANCHOR_ALLOWLIST: readonly TenureAnchor[] = [
  // Survivor S40 (Winners at War, aired 2020) is the franchise's
  // 20-year milestone. The slot_argument and rationale anchor on
  // that exact fact ("twenty winners back on the same beach with
  // twenty years of franchise history sitting behind them"). The
  // literal stays historically accurate forever because it is
  // pinned to the milestone season's airing, not to today's count.
  { show: 'survivor', entryTitle: /winners at war/i, phrase: 'twenty years' },
]

function isAnchorAllowed(
  show: string,
  entryTitle: string | undefined,
  phrase: string,
): boolean {
  if (!entryTitle) return false
  const phraseLower = phrase.toLowerCase()
  for (const anchor of TENURE_ANCHOR_ALLOWLIST) {
    if (anchor.show !== show) continue
    if (anchor.phrase.toLowerCase() !== phraseLower) continue
    if (anchor.entryTitle.test(entryTitle)) return true
  }
  return false
}

// Critique pass-12 HIGH finding: ten of thirteen show taglines once
// closed on the identical "Ranked without <verb> a single <noun>."
// construction. The site-wide no-spoilers promise is already carried
// structurally by the chrome (header + footer ShieldBadge + the home
// brand promise), so per-show repetition is editorial dead weight —
// and the parallel template across ten siblings read as fill-in-the-
// blank generation on the /shows tier list. The fix dropped the tail
// from every offender; this invariant pins the absence going forward
// so a future authoring pass cannot regress the catalog into the
// same template. Strict floor 0 — the construction is forbidden,
// not capped. Mirrors the lax->strict pattern of STRICT,
// CROSS_SHOW_STRICT, and YEAR_TENURE_STRICT above; ships strict
// because the rewrite drained every offender in one tick. Exported
// so the vitest suite can exercise it directly against a temp
// content tree.
const TAGLINE_TEMPLATED_TAIL_RE =
  /\bRanked without \w+(?:\s+\w+)? a single [\w'-]+(?:\s+[\w'-]+){0,3}\./

export function collectTaglineTemplatedTailIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    if (TAGLINE_TEMPLATED_TAIL_RE.test(show.tagline)) {
      issues.push({
        file: `content/shows/${show.slug}.md (tagline)`,
        message: `templated trailing clause — tagline closes on the "Ranked without <verb> a single <noun>." construction; drop the tail and let the show's own editorial observation close the line (the site-wide no-spoilers promise is already carried by chrome)`,
      })
    }
  }
  return issues
}

// Critique pass-12 MED finding (issue #191): eight of ten themed-list
// `description` fields closed on the same count-of-shows tail —
// "across <N> different franchises." or "<N> shows, <M> [thing-noun]."
// The construction duplicates the structural "N SHOWS COVERED" /
// "N ENTRIES" stat strip every `/themes` card and every
// `/themes/<theme>` hero already renders, so the blurb pays twice for
// the same fact; the parallel template across eight of ten siblings
// scanned as one writer using one mold. Same class as the show-tagline
// tail above. The fix dropped the tail from every offender; this
// invariant pins the absence so a future authoring pass cannot
// regress the catalog into the same template. Strict floor 0 —
// mirrors the lax->strict pattern of STRICT, CROSS_SHOW_STRICT,
// YEAR_TENURE_STRICT, and TAGLINE_TAIL_STRICT; ships strict because
// the rewrite drained every offender in one tick. Exported so the
// vitest suite can exercise it directly against a temp content tree.
//
// Critique pass-13 follow-up: the same scan now also covers the
// `tagline` field — the body-hero copy on `/themes/<theme>` carries
// the identical AI-counting tic and is reader-visible on the same
// page surface. The function emits one issue per offending field so
// a future drain can resolve both in a single pass.
const SPELLED_NUMBER =
  '(?:two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen)'

const THEME_DESCRIPTION_COUNT_TAIL_RE = new RegExp(
  // (A) "across <N> [different] (franchises|shows)" — both end-of-clause
  // and mid-sentence. Catches "across six different franchises.",
  // "Across five franchises,", "Seasons across six franchises".
  String.raw`\bacross\s+(?:` +
    SPELLED_NUMBER +
    String.raw`|\d+)\s+(?:different\s+)?(?:franchises?|shows?)\b` +
    // (B) "<N> shows, ..." or "<N> shows' worth ..." — the punch-list
    // construction. Catches "six shows, seven landings.", "five shows,
    // one premise landed.", "six shows' worth of rookie rosters".
    String.raw`|\b(?:` +
    SPELLED_NUMBER +
    String.raw`|\d+)\s+shows[,’']`,
  'i',
)

const THEME_COUNT_TAIL_MESSAGE = `templated count-of-shows tail — field carries the "across <N> [different] (franchises|shows)" or "<N> shows[,'] <X>" construction that the chrome's "N SHOWS COVERED" stat strip already renders structurally; drop the count and close on the editorial observation already in the prior sentences`

export function collectThemeDescriptionCountTailIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (THEME_DESCRIPTION_COUNT_TAIL_RE.test(theme.description)) {
      issues.push({
        file: `content/themes/${theme.slug}.md (description)`,
        message: THEME_COUNT_TAIL_MESSAGE,
      })
    }
    if (THEME_DESCRIPTION_COUNT_TAIL_RE.test(theme.tagline)) {
      issues.push({
        file: `content/themes/${theme.slug}.md (tagline)`,
        message: THEME_COUNT_TAIL_MESSAGE,
      })
    }
  }
  return issues
}

// Critique pass-13 MED finding: themed-list entry blurbs are public
// list surfaces (`/themes/<theme>`), not detail pages — they must
// land without naming season-specific twist mechanics a viewer who
// hasn't watched is meant to discover. Spoiler discipline is P0 per
// CLAUDE.md "the seasons, ranked. no spoilers." brand promise. The
// pass-13 row caught Survivor S40 (Winners at War) naming both
// "Edge of Extinction" and "fire-token economy" in its blurb on
// `/themes/best-finales`. The rewrite drained the offender; this
// invariant pins the absence so a future authoring pass cannot
// regress a themed-list entry blurb back into naming a canonical
// season-specific twist mechanic. Strict floor 0 — the names are
// forbidden, not capped. Mirrors the lax->strict pattern of STRICT,
// CROSS_SHOW_STRICT, YEAR_TENURE_STRICT, TAGLINE_TAIL_STRICT, and
// THEME_COUNT_TAIL_STRICT; ships strict immediately. Exported so
// the vitest suite can exercise it directly against a temp content
// tree.
//
// Conservative scope: the blocklist names only Survivor mid-season
// reveal mechanics the pass-13 finding flagged, plus the two
// closely-paired returnee mechanics (Redemption Island is the
// premise EoE iterates on). Future additions belong in a paired
// /iterate tick — adding a name here without a content rewrite
// would break verify.
const THEMED_ENTRY_SPOILER_NAMES: ReadonlyArray<{ name: string; re: RegExp }> = [
  { name: 'Edge of Extinction', re: /\bEdge of Extinction\b/i },
  { name: 'Redemption Island', re: /\bRedemption Island\b/i },
  { name: 'fire token', re: /\bfire[- ]tokens?\b/i },
]

export function collectThemedEntrySpoilerIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    for (const entry of theme.entries) {
      if (!entry.blurb) continue
      for (const { name, re } of THEMED_ENTRY_SPOILER_NAMES) {
        if (re.test(entry.blurb)) {
          issues.push({
            file: `content/themes/${theme.slug}.md (entry #${entry.rank} blurb)`,
            message: `spoiler-name in themed-list entry blurb — names "${name}", a season-specific twist mechanic a first-time viewer is meant to discover; rewrite the blurb to describe the closing-run quality without naming the twist set (brand promise "no spoilers")`,
          })
        }
      }
    }
  }
  return issues
}

// Critique pass-19 HIGH (issue #241): the season-page watch-order
// chip used to default to "start here, no prerequisites" on every
// season, including returnees seasons where prior-season recognition
// is the actual entry contract. The fix gates the chip via
// `seasonWatchOrderLine()`, which scans `format_changes` +
// `format_summary` + `format_caption` for returnee/all-stars/veterans
// signals. This invariant catches the case where a future editor
// stuffs the returnees signal into a different field — `title` or
// `eyebrow` or `lede` — and the helper would silently miss it,
// re-introducing the standalone chip on a returnee season.
//
// Rule: if any of `title`/`eyebrow`/`lede` carries an explicit
// all-stars / returnees / veterans signal AND the helper resolves
// to the non-returnee chip, that's a content-check failure — either
// the signal belongs in `format_summary`/`format_caption`, or the
// editorial copy is misleading.
const WATCH_ORDER_RETURNEE_SIGNAL =
  /(returnee|returnees|all-?stars?|veteran|veterans)/i

export function collectWatchOrderClassificationIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      const editorialHaystack = [
        season.title ?? '',
        season.eyebrow ?? '',
        season.lede ?? '',
      ].join(' ')
      const editorialSignalsReturnees =
        WATCH_ORDER_RETURNEE_SIGNAL.test(editorialHaystack)
      if (!editorialSignalsReturnees) continue
      const computed = seasonWatchOrderLine(season)
      if (computed !== WATCH_ORDER_RETURNEE) {
        const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
        issues.push({
          file: seasonFile,
          message: `watch-order chip drift — title/eyebrow/lede names returnees/all-stars/veterans but the helper resolves to "${computed}" (standalone copy). Move the signal into format_changes (e.g. add "all-returnee-cast" / "returnee-injection") or restate it in format_summary/format_caption so seasonWatchOrderLine() classifies it as returnee-flavored; a first-time viewer landing on this page would otherwise be told "start here, no prerequisites" on a returnees season.`,
        })
      }
    }
  }
  return issues
}

// Critique pass-25 MED (issue #280): the editorial phrase
// `measures? itself against` / `measured against` / `measure
// against` had drifted to 32 occurrences across 22 content files
// — a clever closer the first time, the editor's tic by the
// third. The content rewrite drained every offender except the
// single highest-leverage surface (the HvV pull-quote). This
// invariant pins phrase-reuse below a small threshold so a
// future authoring pass cannot regress the catalog back into the
// refrain. The pattern mirrors `collectYearTenureIssues`'s
// cross-surface scan (every editorial text field on every show,
// season, canon entry, and theme entry) but counts cross-file
// reuse of a closed list of high-leverage clichés rather than
// asserting a numeric truth.
//
// Threshold is per-pattern. The "measures/measured against"
// pattern uses 3: one kept high-leverage surface plus a small
// margin. A future drain that wants to add another pattern
// (e.g. "set the bar", "the reference point") appends here once
// the corpus has been cleaned to fit under its threshold —
// adding a pattern without a paired rewrite would break verify.

type ClichePattern = {
  /** Human label for the failure message. */
  label: string
  /** Regex — must carry the global flag so matchAll iterates. */
  re: RegExp
  /** Max acceptable cross-surface occurrence count. Strictly greater fails. */
  threshold: number
}

const CLICHE_PATTERNS: ReadonlyArray<ClichePattern> = [
  {
    label: '"measures/measured against"',
    re: /\bmeasure[sd]?\s+(?:itself\s+)?against\b/gi,
    threshold: 3,
  },
  // Critique pass-29 MED (issue #301): the editorial phrase
  // `at full volume` had drifted to 14 occurrences across 8 content
  // files — themed-list description + entry blurbs + Big Brother
  // canon entries + Big Brother season files. /themes →
  // /themes/best-finales repeats the phrase 4+ times in three clicks.
  // The content rewrite drained every walked offender; the
  // remaining off-corpus instances (the load-bearing themed-list
  // `title` field at content/themes/best-post-merge.md, and the
  // /about page quote of that same title required by
  // collectAboutListTitleQuoteIssues) sit outside this scanner's
  // source set. Threshold 2 leaves a small margin for a single
  // walked re-use without re-opening the drift class.
  {
    label: '"at full volume"',
    re: /\bat full volume\b/gi,
    threshold: 2,
  },
  // Critique pass-30 LOW (issue #302): the participial intensifier
  // `freighted` appeared in two adjacent entries on the same
  // /themes/best-finales scroll — entry #02 (Survivor S20 HvV) body
  // opener and entry #05 (The Traitors S02) body, both in the
  // `every <noun> freighted` shape. The content rewrite dropped the
  // Traitors S2 occurrence; the S20 HvV instance is kept as the
  // highest-leverage surface (the first all-returnee final tribal,
  // the editorial point the word was reaching for). Threshold 2
  // matches the `at full volume` margin — one walked re-use is
  // permissible, a second simultaneous occurrence re-opens the
  // class.
  {
    label: '"freighted"',
    re: /\bfreighted\b/gi,
    threshold: 2,
  },
]

export function collectClicheRepetitionIssues(): Failure[] {
  type Source = { where: string; text: string | null | undefined }
  const sources: Source[] = []

  for (const show of getAllShows()) {
    sources.push(
      { where: `content/shows/${show.slug}.md (tagline)`, text: show.tagline },
      { where: `content/shows/${show.slug}.md (body)`, text: show.body_md },
    )
    for (const season of getAllSeasons(show.slug)) {
      const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
      sources.push(
        { where: `${seasonFile} (eyebrow)`, text: season.eyebrow },
        { where: `${seasonFile} (lede)`, text: season.lede },
        { where: `${seasonFile} (body)`, text: season.body },
        { where: `${seasonFile} (pull)`, text: season.pull },
        { where: `${seasonFile} (blurb_md)`, text: season.blurb_md },
      )
    }
    const canon = getCanon(show.slug)
    if (canon) {
      const canonFile = `content/shows/${show.slug}/canon.md`
      sources.push(
        { where: `${canonFile} (tier_s_blurb)`, text: canon.tier_s_blurb },
        { where: `${canonFile} (tier_a_blurb)`, text: canon.tier_a_blurb },
        { where: `${canonFile} (tier_b_blurb)`, text: canon.tier_b_blurb },
        { where: `${canonFile} (tier_c_blurb)`, text: canon.tier_c_blurb },
        { where: `${canonFile} (weekly_question)`, text: canon.weekly_question },
        { where: `${canonFile} (meth_who_p)`, text: canon.meth_who_p },
        { where: `${canonFile} (meth_how_p)`, text: canon.meth_how_p },
        { where: `${canonFile} (meth_when_p)`, text: canon.meth_when_p },
      )
      for (const entry of canon.entries) {
        sources.push(
          { where: `${canonFile} (#${entry.rank} rationale)`, text: entry.rationale },
          { where: `${canonFile} (#${entry.rank} slot_argument)`, text: entry.slot_argument },
          { where: `${canonFile} (#${entry.rank} tag)`, text: entry.tag },
        )
      }
    }
  }

  for (const theme of getAllThemes()) {
    const themeFile = `content/themes/${theme.slug}.md`
    sources.push(
      { where: `${themeFile} (description)`, text: theme.description },
      { where: `${themeFile} (tagline)`, text: theme.tagline },
      { where: `${themeFile} (body_md)`, text: theme.body_md },
    )
    for (const entry of theme.entries) {
      sources.push(
        { where: `${themeFile} (entry #${entry.rank} title)`, text: entry.title },
        { where: `${themeFile} (entry #${entry.rank} blurb)`, text: entry.blurb },
      )
    }
  }

  const issues: Failure[] = []
  for (const pattern of CLICHE_PATTERNS) {
    type Hit = { where: string; phrase: string }
    const hits: Hit[] = []
    for (const { where, text } of sources) {
      if (!text) continue
      for (const match of text.matchAll(pattern.re)) {
        hits.push({ where, phrase: match[0] })
      }
    }
    if (hits.length > pattern.threshold) {
      for (const hit of hits) {
        issues.push({
          file: hit.where,
          message: `cliche-repetition drift — phrase ${pattern.label} ("${hit.phrase}") appears ${hits.length} times across content; threshold is ${pattern.threshold}. Pick the highest-leverage surface to keep and rewrite the rest with material specific to each entry (see plan/CRITIQUE.md pass-25 / issue #280 for the original rewrite).`,
        })
      }
    }
  }
  return issues
}

// Critique pass-28 LOW finding (issue #297): /themes/best-finales
// body copy leaned on `closing run`/`closing stretch`/`closing
// hour` across the tagline plus 4 of 7 entry bodies. The structural
// class — one noun phrase load-bearing in the majority of a themed
// list's entries — is what a reader pattern-matches as templated /
// SEO copy. Catch-class invariant: for every themed list with >= 5
// cross-canon entries, scan all entry titles + blurbs for the most-
// repeated 2-word phrase (alphabetic bigrams, both words content-
// bearing — stopwords excluded). If any phrase appears in more than
// 50% of entries (entry counts as containing it iff its title or
// blurb contains it), warn naming the phrase + entry count. Tagline
// occurrences fold into the reported total but the 50% floor is
// measured strictly against entries. `category: single`
// (intra-canon, single-show) lists are exempt — natural show-name
// references repeat by design.
const PHRASE_REPETITION_STOPWORDS = new Set([
  'a','about','above','after','against','all','almost','along','also','am','an',
  'and','another','any','are','around','as','at','away','back','be','because',
  'been','before','being','below','between','both','but','by','can','could',
  'did','do','does','doing','don','done','down','during','each','either','else',
  'enough','even','ever','every','few','for','from','further','get','gets',
  'getting','give','given','gives','go','goes','going','gone','got','had','has',
  'have','having','he','her','here','hers','herself','him','himself','his','how',
  'i','if','in','into','is','it','its','itself','just','least','less','let',
  'like','many','may','me','might','more','most','much','must','my','myself',
  'never','no','nor','not','now','of','off','on','once','one','only','onto',
  'or','other','others','our','ours','ourselves','out','over','own','past','per',
  'rather','same','say','says','said','she','should','since','so','some','still',
  'such','take','takes','taken','taking','than','that','the','their','theirs',
  'them','themselves','then','there','these','they','this','those','though',
  'three','through','throughout','to','too','two','under','until','up','upon',
  'us','use','used','using','very','was','we','well','were','what','when',
  'where','whereas','whether','which','while','who','whom','whose','why','will',
  'with','within','without','would','yet','you','your','yours','yourself',
  'across',
])

function extractContentBigrams(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ''))
    .filter((t) => /^[a-z][a-z'-]*$/.test(t))
  const bigrams = new Set<string>()
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i]!
    const b = tokens[i + 1]!
    if (PHRASE_REPETITION_STOPWORDS.has(a)) continue
    if (PHRASE_REPETITION_STOPWORDS.has(b)) continue
    bigrams.add(`${a} ${b}`)
  }
  return bigrams
}

export function collectThemeBodyPhraseRepetitionIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (theme.category === 'single') continue
    const entryCount = theme.entries.length
    if (entryCount < 5) continue

    const phraseToEntries = new Map<string, Set<number>>()
    const phraseTotal = new Map<string, number>()
    const recordOccurrences = (text: string, entryRank: number | null) => {
      const bigrams = extractContentBigrams(text)
      for (const phrase of bigrams) {
        phraseTotal.set(phrase, (phraseTotal.get(phrase) ?? 0) + 1)
        if (entryRank != null) {
          if (!phraseToEntries.has(phrase)) {
            phraseToEntries.set(phrase, new Set())
          }
          phraseToEntries.get(phrase)!.add(entryRank)
        }
      }
    }
    for (const entry of theme.entries) {
      recordOccurrences(`${entry.title ?? ''} ${entry.blurb ?? ''}`, entry.rank)
    }
    if (theme.tagline) recordOccurrences(theme.tagline, null)

    const floor = Math.floor(entryCount / 2)
    let topPhrase: string | null = null
    let topEntries = 0
    for (const [phrase, entries] of phraseToEntries) {
      if (entries.size > floor && entries.size > topEntries) {
        topPhrase = phrase
        topEntries = entries.size
      }
    }
    if (topPhrase) {
      const total = phraseTotal.get(topPhrase) ?? 0
      const ranks = Array.from(phraseToEntries.get(topPhrase)!).sort(
        (a, b) => a - b,
      )
      const totalNote =
        total > topEntries
          ? `, ${total} occurrences total across entry titles + blurbs + tagline`
          : ''
      issues.push({
        file: `content/themes/${theme.slug}.md`,
        message: `themed-list body copy templating — phrase "${topPhrase}" appears in ${topEntries} of ${entryCount} entries (#${ranks.join(', #')})${totalNote}. A single noun phrase load-bearing in more than half of a list's entries reads as templated rather than written. Rotate the metaphor in all but one entry (or keep the phrase only in the tagline) using surface-native vocabulary already in the surrounding editorial body.`,
      })
    }
  }
  return issues
}

// Critique pass-36 MED (issue #337): /themes/best-finales body
// openers reached for `endgame` (3 of 7 entries) and `closing run`
// (2 of 7) as the templated rewrite for `finale` — on a list whose
// subject IS finales. Five of seven entries rotating between two
// synonyms for the title noun reads as the writer dodging the
// title noun rather than reaching for a fresh angle per entry.
// Sibling defect to `collectThemeBodyPhraseRepetitionIssues` above
// (which catches a single load-bearing bigram); this helper catches
// the broader pattern where multiple synonyms in the same semantic
// cluster carry the editorial load across a list. Per cluster
// (the dictionary below; extensible), count entries whose
// title-or-blurb contains any cluster phrase; flag when the count
// meets the strict floor (≥ 3 entries hit). `category: single`
// (intra-canon, single-show) lists are exempt — natural repetition
// of show-specific surface vocabulary is part of the form.
const THEME_SYNONYM_CLUSTERS: Record<string, readonly string[]> = {
  finale: ['endgame', 'closing run', 'last act', 'final stretch'],
}
const THEME_SYNONYM_CLUSTER_STRICT_FLOOR = 3

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function textContainsClusterPhrase(text: string, phrase: string): boolean {
  return new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i').test(text)
}

export function collectThemeSynonymClusterIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (theme.category === 'single') continue
    const entryCount = theme.entries.length
    if (entryCount < 5) continue
    for (const [clusterName, phrases] of Object.entries(
      THEME_SYNONYM_CLUSTERS,
    )) {
      const hitRanks: number[] = []
      for (const entry of theme.entries) {
        const text = `${entry.title ?? ''} ${entry.blurb ?? ''}`.replace(
          /<[^>]+>/g,
          ' ',
        )
        for (const phrase of phrases) {
          if (textContainsClusterPhrase(text, phrase)) {
            hitRanks.push(entry.rank)
            break
          }
        }
      }
      if (hitRanks.length >= THEME_SYNONYM_CLUSTER_STRICT_FLOOR) {
        const ranks = hitRanks.sort((a, b) => a - b).map((r) => `#${r}`).join(', ')
        const phraseList = phrases.map((p) => `"${p}"`).join(' / ')
        issues.push({
          file: `content/themes/${theme.slug}.md`,
          message: `themed-list synonym-cluster — the "${clusterName}" cluster (${phraseList}) appears across ${hitRanks.length} of ${entryCount} entries (${ranks}). When a list rotates between synonyms for its own subject noun, the rotation reads as templated rather than authored. Rotate at the sentence level — anchor each entry's body opener to a different structural fact (cast, premise, episode rhythm, staging) instead of swapping noun phrases.`,
        })
      }
    }
  }
  return issues
}

// Critique pass-37 MED (issue #333): /shows/survivor hero subtitle
// (`blurb`) and body opener (`tagline`) both opened on `50 seasons of
// <X>` — the count was restated on adjacent lines of the most-visited
// show page. Lexical pin for the class: per show, flag when BOTH
// `blurb` AND `tagline` open with a `\d+ seasons?` clause (an opener
// that asserts the season count). Hero+body are rendered back-to-back
// on the show page; one count-bearing opener is load-bearing copy,
// two is a templated tell. Allowed: blurb-only or tagline-only count
// openers (the count needs to live somewhere). Disallowed: both at
// once.
const COUNT_OPENER_RE = /^\s*\d+\s+seasons?\b/i
export function collectShowBlurbTaglineCountRepetitionIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const blurb = show.blurb ?? ''
    const tagline = show.tagline ?? ''
    if (COUNT_OPENER_RE.test(blurb) && COUNT_OPENER_RE.test(tagline)) {
      issues.push({
        file: `content/shows/${show.slug}.md`,
        message: `hero/body count-restate — both \`blurb\` ("${blurb.trim().slice(0, 60)}…") and \`tagline\` ("${tagline.trim().slice(0, 60)}…") open on a \`<N> seasons\` clause. The hero subtitle and the editorial body opener render on adjacent lines of /shows/${show.slug}; the count belongs in one of them, not both. Recut one opener — keep the count on the hero \`blurb\` (the load-bearing count-bearing line) and rewrite the \`tagline\` to add editorial colour rather than restate the count.`,
      })
    }
  }
  return issues
}

// Critique pass-41 MED (issue #359): /shows A-tier band rendered every
// blurb through the same `{N} seasons of {plural-noun} {-ing verb}`
// opener — a fill-in-the-blank echo across 10+ adjacent tiles. The
// /shows tile renders `card_tagline ?? tagline` (see ShowsTile.tsx:63),
// so the lemma is computed on the rendered field, not the underlying
// tagline. The leading digit is normalized to `<N>` so "11 seasons"
// and "40 seasons" collapse to the same lemma. Strict floor 7 — up to
// 6 carriers per tier band are tolerated; a 7th tile sharing the
// opener trips the gate. Ships strict at this commit because the
// pass-41 drain adds `card_tagline` overrides to 5 A-tier carriers
// (bachelor, bake-off, top-chef, bachelorette, love-island-uk),
// taking the `<N> seasons` carrier count to 6 of 11 — below floor.
// S-tier has only 2 shows (both opening "the format that …", lemma
// "the format"), well below floor regardless. The invariant is the
// bidirectional drift guard: future authoring that re-templates the
// band trips at content-check time.
function showTileLemma(text: string): string {
  const cleaned = text
    .replace(/<[^>]+>/g, ' ')
    .toLowerCase()
    .replace(/[—–]/g, ' ')
    .trim()
  const tokens = cleaned
    .split(/\s+/)
    .map((t) => t.replace(/^['"`(\[]+|['"`,.;:!?)\]]+$/g, ''))
    .filter((t) => /[a-z0-9]/.test(t))
  if (tokens.length < 2) return tokens.join(' ')
  const norm = (t: string): string => (/^\d+$/.test(t) ? '<N>' : t)
  return `${norm(tokens[0]!)} ${norm(tokens[1]!)}`
}

const SHOW_TAGLINE_BAND_TEMPLATE_FLOOR = 7

export function collectShowTaglineBandTemplateEchoIssues(): Failure[] {
  const issues: Failure[] = []
  const showsByTier = new Map<string, Array<{ slug: string; tile: string }>>()
  for (const show of getAllShows()) {
    if (show.tier !== 'S' && show.tier !== 'A' && show.tier !== 'B') continue
    const tile = show.card_tagline ?? show.tagline ?? ''
    if (!tile) continue
    const bucket = showsByTier.get(show.tier) ?? []
    bucket.push({ slug: show.slug, tile })
    showsByTier.set(show.tier, bucket)
  }
  for (const [tier, shows] of showsByTier) {
    const lemmaToCarriers = new Map<string, string[]>()
    for (const { slug, tile } of shows) {
      const lemma = showTileLemma(tile)
      if (!lemma) continue
      const carriers = lemmaToCarriers.get(lemma) ?? []
      carriers.push(slug)
      lemmaToCarriers.set(lemma, carriers)
    }
    for (const [lemma, carriers] of lemmaToCarriers) {
      if (carriers.length >= SHOW_TAGLINE_BAND_TEMPLATE_FLOOR) {
        const sorted = [...carriers].sort()
        issues.push({
          file: `content/shows/ (tier ${tier})`,
          message: `tier-${tier} band tagline template echo — ${carriers.length} of ${shows.length} shows render their /shows tile copy (\`card_tagline ?? tagline\`) opening on the same first-two-word lemma "${lemma}" (carriers: ${sorted.join(', ')}). The catalog band scans as a fill-in-the-blank template rather than ${shows.length} different doors. Rotate ${carriers.length - SHOW_TAGLINE_BAND_TEMPLATE_FLOOR + 1} tile openers off the shared lemma — add a \`card_tagline\` override (the tile-only field, so the show-page \`tagline\` stays intact) on the carriers you rewrite. Floor: at most ${SHOW_TAGLINE_BAND_TEMPLATE_FLOOR - 1} carriers per band may share a first-two-word lemma.`,
        })
      }
    }
  }
  return issues
}

// Critique pass-33 MED (issue #319): /themes/best-finales entry #03
// (Top Chef S06 Las Vegas) opened with `Las Vegas runs the most
// technically loaded roster the show ever fielded` against the deck
// `The deepest knife-skill cast carries the kitchen all the way home`
// — body restates the deck rather than advancing the editorial point.
// Lexical pin for the class: per themed-list entry, the first sentence
// of the blurb (the body opener) must not share a 3-token content
// sequence with the entry title (the deck), AND must not exceed a 50%
// content-token overlap (with at least 2 shared tokens). Stopwords are
// filtered so the overlap counts only content-bearing tokens. This
// catches the lexical / near-literal restatement class; the semantic
// restatement class (synonymy pairs like "deepest knife-skill cast" ↔
// "most technically loaded roster") would need a WordNet-style lookup
// and sits outside this scanner's scope. `category: single`
// (intra-canon, single-show) lists are exempt — natural deck-body
// resonance is part of the form.
function firstSentenceOfBlurb(text: string): string {
  // Strip HTML tags first, then take everything up to the first
  // sentence terminator followed by whitespace or end-of-string.
  // Em-dash clauses and commas stay inside the first sentence — the
  // critique class is about the deck/body relationship at the
  // sentence boundary, not the clause boundary.
  const stripped = text.replace(/<[^>]+>/g, ' ')
  const match = stripped.match(/^[\s\S]*?[.!?](?=\s|$)/)
  return (match?.[0] ?? stripped).trim()
}

function deckBodyContentTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ''))
    .filter((t) => /^[a-z][a-z'-]*$/.test(t))
    .filter((t) => !PHRASE_REPETITION_STOPWORDS.has(t))
}

function sharedContentTrigram(
  titleTokens: string[],
  openerTokens: string[],
): string | null {
  if (titleTokens.length < 3 || openerTokens.length < 3) return null
  const titleTrigrams = new Set<string>()
  for (let i = 0; i <= titleTokens.length - 3; i++) {
    titleTrigrams.add(
      `${titleTokens[i]} ${titleTokens[i + 1]} ${titleTokens[i + 2]}`,
    )
  }
  for (let i = 0; i <= openerTokens.length - 3; i++) {
    const trigram = `${openerTokens[i]} ${openerTokens[i + 1]} ${openerTokens[i + 2]}`
    if (titleTrigrams.has(trigram)) return trigram
  }
  return null
}

export function collectThemeDeckBodyOpenerDivergenceIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (theme.category === 'single') continue
    for (const entry of theme.entries) {
      const title = entry.title?.trim()
      const blurb = entry.blurb?.trim()
      if (!title || !blurb) continue

      const opener = firstSentenceOfBlurb(blurb)
      const titleTokens = deckBodyContentTokens(title)
      const openerTokens = deckBodyContentTokens(opener)
      if (titleTokens.length === 0 || openerTokens.length === 0) continue

      const trigram = sharedContentTrigram(titleTokens, openerTokens)
      if (trigram) {
        issues.push({
          file: `content/themes/${theme.slug}.md (entry #${entry.rank} blurb)`,
          message: `themed-list deck-vs-body restatement — entry #${entry.rank} title and the blurb's first sentence share the 3-token content sequence "${trigram}". The body opener should advance to a season-specific observation the deck does not already make (see plan/CRITIQUE.md pass-33 / issue #319).`,
        })
        continue
      }

      const titleSet = new Set(titleTokens)
      const openerSet = new Set(openerTokens)
      let shared = 0
      for (const t of titleSet) if (openerSet.has(t)) shared++
      const ratio = shared / titleSet.size
      if (ratio > 0.5 && shared >= 2) {
        issues.push({
          file: `content/themes/${theme.slug}.md (entry #${entry.rank} blurb)`,
          message: `themed-list deck-vs-body restatement — entry #${entry.rank} blurb's first sentence shares ${shared} of ${titleSet.size} content tokens with the title (${Math.round(ratio * 100)}%). The body opener should advance to a season-specific observation the deck does not already make (see plan/CRITIQUE.md pass-33 / issue #319).`,
        })
      }
    }
  }
  return issues
}

// Critique pass-38 MED (issue #341): /themes/best-finales entries
// #05 (Traitors S02) + #06 (Drag Race S6) carried within-entry
// verbatim echoes of the headline's load-bearing noun-phrase inside
// the body — #05 "Round Table tighten*" appeared in title + blurb
// opener; #06 "crown coronation" appeared in title + blurb closer.
// Distinct defect class from `collectThemeBodyPhraseRepetitionIssues`
// (cross-entry within-list repetition) and from
// `collectThemeDeckBodyOpenerDivergenceIssues` (deck↔body-OPENER
// 3-token sequence OR >50% content-token-set overlap). This invariant
// is narrower: per-entry, any content bigram that appears verbatim in
// BOTH `title` AND `blurb` (anywhere in the blurb, not just the
// opener). A 50–70-word blurb has room to extend the headline's
// argument; reusing the headline's load-bearing noun-phrase verbatim
// turns the headline into a label the body restates. `category:
// single` (intra-canon, single-show) lists are exempt — natural
// repetition of show-specific surface vocabulary is part of the form.
export function collectThemeEntryHeadlineBodyEchoIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    if (theme.category === 'single') continue
    for (const entry of theme.entries) {
      const title = entry.title?.trim()
      const blurb = entry.blurb?.trim()
      if (!title || !blurb) continue
      const titleBigrams = extractContentBigrams(title)
      if (titleBigrams.size === 0) continue
      const blurbBigrams = extractContentBigrams(blurb)
      const shared: string[] = []
      for (const bigram of titleBigrams) {
        if (blurbBigrams.has(bigram)) shared.push(bigram)
      }
      if (shared.length > 0) {
        const phraseList = shared.map((p) => `"${p}"`).join(', ')
        issues.push({
          file: `content/themes/${theme.slug}.md (entry #${entry.rank} blurb)`,
          message: `themed-list within-entry headline-to-body echo — entry #${entry.rank} title and blurb share the noun-phrase${shared.length > 1 ? 's' : ''} ${phraseList}. A 50–70-word blurb should extend the headline's argument, not restate its load-bearing noun-phrase verbatim. Rotate the blurb's phrasing so the headline pays off in a fresh structural beat (see plan/CRITIQUE.md pass-38).`,
        })
      }
    }
  }
  return issues
}

export function collectYearTenureIssues(asOfDate?: Date): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const anniversary =
      SHOW_ANNIVERSARIES[show.slug] ?? { month: 1, day: 1 }
    const years = yearsSinceEst(show.est_year, asOfDate, anniversary)
    let expectedWord: string
    try {
      expectedWord = numberToWords(years)
    } catch {
      continue
    }

    type Source = {
      where: string
      text: string | null | undefined
      /** Canon entry title for sources scoped to one entry; undefined otherwise. */
      entryTitle?: string
    }
    const sources: Source[] = [
      { where: `content/shows/${show.slug}.md (tagline)`, text: show.tagline },
      { where: `content/shows/${show.slug}.md (body)`, text: show.body_md },
    ]
    for (const season of getAllSeasons(show.slug)) {
      const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
      sources.push(
        { where: `${seasonFile} (eyebrow)`, text: season.eyebrow },
        { where: `${seasonFile} (lede)`, text: season.lede },
        { where: `${seasonFile} (body)`, text: season.body },
        { where: `${seasonFile} (pull)`, text: season.pull },
        { where: `${seasonFile} (blurb_md)`, text: season.blurb_md },
      )
    }
    const canon = getCanon(show.slug)
    if (canon) {
      const canonFile = `content/shows/${show.slug}/canon.md`
      sources.push(
        { where: `${canonFile} (tier_s_blurb)`, text: canon.tier_s_blurb },
        { where: `${canonFile} (tier_a_blurb)`, text: canon.tier_a_blurb },
        { where: `${canonFile} (tier_b_blurb)`, text: canon.tier_b_blurb },
        { where: `${canonFile} (tier_c_blurb)`, text: canon.tier_c_blurb },
        { where: `${canonFile} (weekly_question)`, text: canon.weekly_question },
        { where: `${canonFile} (meth_who_p)`, text: canon.meth_who_p },
        { where: `${canonFile} (meth_how_p)`, text: canon.meth_how_p },
        { where: `${canonFile} (meth_when_p)`, text: canon.meth_when_p },
      )
      for (const entry of canon.entries) {
        sources.push(
          {
            where: `${canonFile} (#${entry.rank} rationale)`,
            text: entry.rationale,
            entryTitle: entry.title,
          },
          {
            where: `${canonFile} (#${entry.rank} slot_argument)`,
            text: entry.slot_argument,
            entryTitle: entry.title,
          },
          {
            where: `${canonFile} (#${entry.rank} tag)`,
            text: entry.tag,
            entryTitle: entry.title,
          },
        )
      }
    }

    const expectedPhrase = `${expectedWord} years`
    const expectedPhraseLower = expectedPhrase.toLowerCase()
    for (const { where, text, entryTitle } of sources) {
      if (!text) continue
      for (const match of text.matchAll(YEAR_TENURE_RE)) {
        const phrase = match[0]
        if (phrase.toLowerCase() === expectedPhraseLower) continue
        if (isAnchorAllowed(show.slug, entryTitle, phrase)) continue
        issues.push({
          file: where,
          message: `editorial-tenure drift — phrase "${phrase}" but show "${show.slug}" reads "${expectedPhrase}" today (est_year ${show.est_year}); derive via the show-tenure helper, anchor to a milestone canon entry (TENURE_ANCHOR_ALLOWLIST), or rephrase to drop the literal ("a quarter-century", "the franchise's first decade")`,
        })
      }
    }
  }
  return issues
}

// Critique pass-28 HIGH (issue #N): the `{yearsWord}` token
// substitutes the spelled-out number ONLY — it does not inject the
// word `years` after itself (see `renderShowTaglineTokens` in
// `src/lib/show-tenure.ts`). An author must supply the surrounding
// noun explicitly: the canonical pairing is `{yearsWord} years`,
// rendering as e.g. "twenty-five years of casting work". The
// Amazing Race tagline shipped without the noun
// (`across {yearsWord} of starting lines`) and rendered as the
// ungrammatical "twenty-five of starting lines" on every visit to
// `/shows`. This invariant pins the pairing in raw frontmatter:
// any show whose `tagline` or `card_tagline` carries `{yearsWord}`
// must also carry the literal substring `{yearsWord} years`. The
// check operates on raw frontmatter (not the loader-materialized
// `Show.tagline`) because token substitution erases the literal
// before runtime — only the source-of-truth markdown still sees
// the bare token. Strict floor 0 — mirrors STRICT,
// CROSS_SHOW_STRICT, YEAR_TENURE_STRICT, TAGLINE_TAIL_STRICT,
// THEME_COUNT_TAIL_STRICT, THEMED_ENTRY_SPOILER_STRICT,
// WATCH_ORDER_CLASSIFICATION_STRICT, CLICHE_REPETITION_STRICT.
// If a future tagline ever needs a different construction (the
// row notes `{yearsWord}-year run` as a hypothetical), extend
// this helper with a per-show allowlist alongside the rewrite.
const YEAR_TOKEN_LITERAL = '{yearsWord}'
const YEAR_TOKEN_PAIRED = '{yearsWord} years'

type RawShowFrontmatter = {
  tagline?: unknown
  card_tagline?: unknown
}

export function collectYearTokenPairingIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const raw = readFileSync(showFile(show.slug), 'utf8')
    const parsed = matter(raw)
    const data = parsed.data as RawShowFrontmatter
    const fields: ReadonlyArray<[string, unknown]> = [
      ['tagline', data.tagline],
      ['card_tagline', data.card_tagline],
    ]
    for (const [field, value] of fields) {
      if (typeof value !== 'string') continue
      if (!value.includes(YEAR_TOKEN_LITERAL)) continue
      if (value.includes(YEAR_TOKEN_PAIRED)) continue
      issues.push({
        file: `content/shows/${show.slug}.md (${field})`,
        message: `\`${YEAR_TOKEN_LITERAL}\` token pairing — the token substitutes the spelled-out number only, so an unpaired use renders ungrammatical copy (e.g. "twenty-five of starting lines"). Author the literal as "\`${YEAR_TOKEN_PAIRED}\` <noun>" so the rendered string reads "twenty-five years of …". If a future tagline genuinely needs a different construction (e.g. "\`${YEAR_TOKEN_LITERAL}\`-year run"), extend \`collectYearTokenPairingIssues\` with a per-show allowlist in the same pass.`,
      })
    }
  }
  return issues
}

// Critique pass-27 LOW (issue #N): the /about page's example
// parenthetical names two illustrative themed-list titles
// (originally `"best premieres"` and `"best post-merge runs"`) —
// neither matched a real `content/themes/<slug>.md` `title`, so a
// reader following the example over to /themes found nothing by
// the quoted names. The /about page is the editorial trust-frame
// document; example fidelity matters here more than anywhere.
// This invariant is scoped to the paragraph(s) referencing
// `(/themes)`: any double-quoted phrase inside such a paragraph
// must match a real theme `title` exactly. Other quoted strings
// in about.md (e.g. the "filmed in Fiji" / "darker than usual"
// example reasons in the voting-rationale list, which live in a
// different paragraph block that does NOT reference /themes) pass
// through unaffected. Strict floor 0 — mirrors STRICT,
// CROSS_SHOW_STRICT, YEAR_TENURE_STRICT, TAGLINE_TAIL_STRICT,
// THEME_COUNT_TAIL_STRICT, THEMED_ENTRY_SPOILER_STRICT,
// WATCH_ORDER_CLASSIFICATION_STRICT, CLICHE_REPETITION_STRICT,
// YEAR_TOKEN_PAIRING_STRICT. The check operates on the raw
// markdown body (frontmatter stripped) because it scans editorial
// prose, not loader-materialized fields.
const ABOUT_THEMES_LINK_NEEDLE = '(/themes)'
const QUOTED_PHRASE_RE = /"([^"]+)"/g

export function collectAboutListTitleQuoteIssues(): Failure[] {
  const issues: Failure[] = []
  const file = legalFile('about')
  if (!existsSync(file)) return issues
  const raw = readFileSync(file, 'utf8')
  const parsed = matter(raw)
  const body = typeof parsed.content === 'string' ? parsed.content : ''
  if (!body.includes(ABOUT_THEMES_LINK_NEEDLE)) return issues
  const themeTitles = new Set(getAllThemes().map((t) => t.title))
  const paragraphs = body.split(/\n\s*\n/)
  for (const para of paragraphs) {
    if (!para.includes(ABOUT_THEMES_LINK_NEEDLE)) continue
    // Collapse interior whitespace so an authored line wrap mid-quote
    // (e.g. `"The back-half\nat full volume"`) matches the theme title
    // the reader actually sees once markdown joins the lines.
    const flat = para.replace(/\s+/g, ' ')
    for (const match of flat.matchAll(QUOTED_PHRASE_RE)) {
      const quoted = match[1]
      if (quoted == null || themeTitles.has(quoted)) continue
      issues.push({
        file: 'content/legal/about.md',
        message: `quoted example list title "${quoted}" does not match any real themed-list \`title\` in \`content/themes/\`. The paragraph linking to \`/themes\` names list titles a reader can skim — a hand-waved label reads as generic SEO copy rather than the curator's actual editorial title. Quote a real theme \`title\` verbatim (one of: ${Array.from(themeTitles).sort().map((t) => `"${t}"`).join(', ')}), or move the illustrative quote into a different paragraph that doesn't reference \`/themes\`.`,
      })
    }
  }
  return issues
}

// Critique pass-31 HIGH (issue #306): cross-surface editorial-byline
// parity. `/about` admits the operator is one person ("Built and
// operated by one person.") — but the rendered chrome bylines and
// the catalog-level `curator` / `editor` frontmatter previously
// pluralized to "tiered.tv Editors" / "tiered.tv editors", a
// contradiction a reader hits in one click from any season or
// themed-list page. The invariant: while `/about` carries either
// of the two singular-admission anchors, every theme `curator` and
// every canon `editor` field must NOT match the plural
// `tiered.tv (E|e)ditors` form. Bidirectional — catches plural
// drift while /about still admits solo operation, and goes silent
// (no false positives) if a future /about edit removes both
// anchors. The two source-file bylines (the season page hero, the
// FeaturedThemes strip, the ShowRanking canon lede) are pinned by
// their colocated component tests; this invariant covers the
// catalog frontmatter the chrome surfaces consume.
const ABOUT_SINGULAR_ANCHORS = [
  'Built and operated by one person',
  "the editor's call — one person",
] as const
const PLURAL_BYLINE_RE = /\btiered\.tv\s+(?:E|e)ditors\b/

export function collectEditorialBylineSingularIssues(): Failure[] {
  const issues: Failure[] = []
  const aboutFile = legalFile('about')
  if (!existsSync(aboutFile)) return issues
  const aboutRaw = readFileSync(aboutFile, 'utf8')
  const aboutBody = matter(aboutRaw).content
  const hasSingularAnchor = ABOUT_SINGULAR_ANCHORS.some((anchor) =>
    aboutBody.includes(anchor),
  )
  if (!hasSingularAnchor) return issues
  for (const theme of getAllThemes()) {
    if (PLURAL_BYLINE_RE.test(theme.curator)) {
      issues.push({
        file: `content/themes/${theme.slug}.md`,
        message: `editorial-byline drift — \`curator: "${theme.curator}"\` reads plural while /about admits solo operation ("${ABOUT_SINGULAR_ANCHORS[0]}"). Rewrite to singular ("tiered.tv editor") so the themed-list hero byline matches the page that owes the truth. See plan/CRITIQUE.md pass-31 / issue #306.`,
      })
    }
  }
  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    if (!canon) continue
    const editor = canon.editor
    if (typeof editor === 'string' && PLURAL_BYLINE_RE.test(editor)) {
      issues.push({
        file: `content/shows/${show.slug}/canon.md`,
        message: `editorial-byline drift — \`editor: ${editor}\` reads plural while /about admits solo operation ("${ABOUT_SINGULAR_ANCHORS[0]}"). Rewrite to singular ("tiered.tv editor") so the canon attribution matches the page that owes the truth. See plan/CRITIQUE.md pass-31 / issue #306.`,
      })
    }
  }
  return issues
}

// Critique pass-30 LOW (issue #305): the noun phrase `back half`
// vs `back-half` drifted across adjacent themed-list surfaces — the
// load-bearing `content/themes/best-post-merge.md` title is
// hyphenated (`The back-half at full volume`, also rendered into
// the /themes featured strip, /themes BY TONE band, HvV `Also
// appears in` row), but neighbouring entry titles/blurbs and the
// HvV season's `episode_heat_caption` rendered the same phrase
// unhyphenated — a reader sees both forms within four lines of
// editorial copy on /themes/best-finales + /themes/best-post-merge.
// Pin: every occurrence of the literal `back half` in a themed-list
// entry title / blurb / tagline / description / body_md, or in a
// season's `episode_heat_caption`, must render as `back-half`. The
// scoping matches the cross-reference surfaces the row spotted —
// canon prose and season ledes/bodies sit outside this scanner's
// source set, where the form drift is not visible on a single
// reader scroll. A future critique that flags a wider drift can
// extend the source set.
const BACK_HALF_HYPHEN_RE = /\bback half\b/gi

export function collectBackHalfHyphenIssues(): Failure[] {
  const issues: Failure[] = []
  const flag = (where: string, text: string | null | undefined) => {
    if (!text) return
    const matches = text.match(BACK_HALF_HYPHEN_RE)
    if (!matches) return
    issues.push({
      file: where,
      message: `back-half hyphenation drift — found "${matches[0]}". The themed-list title \`The back-half at full volume\` is the canonical site reference; the noun-phrase use across adjacent themed-list surfaces and the HvV \`episode_heat_caption\` favors the hyphenated form. Rewrite \`back half\` → \`back-half\` so cross-references render the same noun phrase on a single reader scroll. See plan/CRITIQUE.md pass-30 / issue #305.`,
    })
  }
  for (const theme of getAllThemes()) {
    const themeFile = `content/themes/${theme.slug}.md`
    flag(`${themeFile} (description)`, theme.description)
    flag(`${themeFile} (tagline)`, theme.tagline)
    flag(`${themeFile} (body_md)`, theme.body_md)
    for (const entry of theme.entries) {
      flag(`${themeFile} (entry #${entry.rank} title)`, entry.title)
      flag(`${themeFile} (entry #${entry.rank} blurb)`, entry.blurb)
    }
  }
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
      flag(
        `${seasonFile} (episode_heat_caption)`,
        season.episode_heat_caption,
      )
    }
  }
  return issues
}

// Critique pass-32 MED (issue #312): the self-naming brand-stamp
// closing-sentence frame `tiered.tv's canon places it [ordinal]
// because no other [noun]...` appeared at two adjacent canonical
// positions on the most-visited canon (Survivor #01 Cagayan + #02
// Heroes vs. Villains). Two adjacent rationales running the same
// closing formula reads as a CMS template tell rather than the
// knowledgeable-peer voice. Pin: for every canon, scan entries in
// rank order; if two adjacent entries both close with the literal
// frame, fail with both positions and titles. The non-self-naming
// `The canon places it...` form is fine — only the brand-stamp
// version is flagged. Single-occurrence is fine; only adjacency
// trips the gate.
const CANON_CLOSING_FORMULA_RE =
  /tiered\.tv's canon places it (?:[a-z-]+) because no other/i

// Critique pass-33 MED (issue #317): a season's `eyebrow` that names
// a single calendar-season label (spring/summer/fall/autumn/winter)
// AND has a `premiere_date` set MUST have the date fall inside that
// calendar season under the Northern Hemisphere meteorological
// convention (spring=Mar–May, summer=Jun–Aug, fall=Sep–Nov,
// winter=Dec–Feb). A span eyebrow like `winter–spring 2010` carries
// two season labels so the check is a no-op (multi-label eyebrows
// are presumed deliberate). Triggered by /shows/survivor/season/
// heroes-vs-villains: the eyebrow read "Aired spring 2010" while the
// PREMIERED meta cell named Feb 11, 2010 — winter, not spring. The
// HvV literal is fixed in this commit (eyebrow → "Aired winter–
// spring 2010 · Filmed in Samoa"); the invariant is the
// corpus-wide floor that catches the class on every show.
const SEASON_LABEL_RE = /\b(spring|summer|fall|autumn|winter)\b/gi

function calendarSeasonForMonth(month: number): 'spring' | 'summer' | 'fall' | 'winter' {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

export function collectSeasonEyebrowCalendarIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      const eyebrow = season.eyebrow
      const premiere = season.premiere_date
      if (!eyebrow || !premiere) continue
      const labels = [...eyebrow.matchAll(SEASON_LABEL_RE)].map((m) =>
        m[1]!.toLowerCase(),
      )
      // Multi-label eyebrows (e.g., `winter–spring 2010`) opt out —
      // the editor has already disclosed the span.
      if (labels.length !== 1) continue
      const label = labels[0] === 'autumn' ? 'fall' : labels[0]
      const month = Number.parseInt(String(premiere).slice(5, 7), 10)
      if (!Number.isFinite(month) || month < 1 || month > 12) continue
      const calendar = calendarSeasonForMonth(month)
      if (calendar === label) continue
      const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
      // Order the span calendar-forward: the earlier-in-the-year
      // season comes first (winter–spring, spring–summer, etc.).
      // For winter ↔ summer (180° off), there's no clean adjacent
      // span — leave the span suggestion empty and lean on the
      // calendar-fact alternative.
      const order = ['winter', 'spring', 'summer', 'fall'] as const
      const a = order.indexOf(calendar as typeof order[number])
      const b = order.indexOf(label as typeof order[number])
      const adjacent = a >= 0 && b >= 0 && Math.abs(a - b) === 1
      const year = String(premiere).slice(0, 4)
      const spanSuggestion = adjacent
        ? `Rewrite the eyebrow as a span (e.g., "${order[Math.min(a, b)]}–${order[Math.max(a, b)]} ${year}") to disclose both halves of the run, or `
        : 'Rewrite the eyebrow as a span across the run, or '
      issues.push({
        file: `${seasonFile} (eyebrow)`,
        message: `season-eyebrow calendar drift — eyebrow names "${label}" but premiere_date ${premiere} falls in ${calendar} (Northern Hemisphere convention: spring=Mar–May, summer=Jun–Aug, fall=Sep–Nov, winter=Dec–Feb). ${spanSuggestion}restate the eyebrow with a calendar fact (e.g., "Aired Feb–May ${year}"). See plan/CRITIQUE.md pass-33 / issue #317.`,
      })
    }
  }
  return issues
}

export function collectCanonRationaleClosingFormulaIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    if (!canon) continue
    const entries = [...canon.entries].sort((a, b) => a.rank - b.rank)
    const carries = entries.map((e) =>
      CANON_CLOSING_FORMULA_RE.test(e.rationale.replace(/\s+/g, ' ')),
    )
    for (let i = 0; i < entries.length - 1; i++) {
      if (carries[i] && carries[i + 1]) {
        const a = entries[i]
        const b = entries[i + 1]
        if (!a || !b) continue
        issues.push({
          file: `content/shows/${show.slug}/canon.md`,
          message: `canon-rationale closing-formula adjacency drift — entries at canonical_position ${a.rank} (${a.title}) and ${b.rank} (${b.title}) both close with the self-naming brand-stamp frame \`tiered.tv's canon places it [ordinal] because no other [noun]...\`. Two adjacent rationales running the same closing formula reads as a CMS template tell rather than the knowledgeable-peer voice. Rotate one of the two closers off the frame — drop the self-naming brand-stamp and let the rationale's own editorial verdict close the entry. See plan/CRITIQUE.md pass-32 / issue #312.`,
        })
      }
    }
  }
  return issues
}

// Critique pass-35 MED (issue #329): the `CanonMethodology` component's
// own DEFAULT body for the `01 · WHO` cell reads "One editor, named.
// ... we will tell you who, and we will not hide behind plural
// pronouns." (`src/components/canon/CanonMethodology.tsx:13-20`). Per-
// show `meth_who_p` overrides on 9 of 13 shows ship plural-collective
// voice — `tiered.tv's editors` (plural possessive) + `we've watched`
// / `we are trying` first-person-plural pronouns — that directly
// contradict the default's singular-voice promise. /about formally
// admits the singular form at two surfaces (`content/legal/about.md:29`
// — "The Editor's Canon is the editor's call — one person, one position
// per season" — and `:78` — "Built and operated by one person.").
// Multi-tick drain (one show per tick, phase-26 / 31b / 34 / 41 / 43
// mechanic): each tick rewrites one show's override into singular
// voice that mirrors the default + /about; this invariant catches the
// class at author-time and (at strict floor) catches any future
// authoring pass slipping back to plural-collective voice on any
// show's `meth_who_p`. The two patterns flagged are independent
// signals — either one trips the gate.
const PLURAL_EDITOR_PRONOUN_RE =
  /\bwe(?:'ve|'re|'d|'ll| have| are| aren't| would)\b/i
const PLURAL_EDITOR_POSSESSIVE_RE = /tiered\.tv's editors\b/i

export function collectCanonMethWhoPluralEditorIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    if (!canon) continue
    const body = canon.meth_who_p
    if (!body) continue
    const flat = body.replace(/\s+/g, ' ')
    const hits: string[] = []
    if (PLURAL_EDITOR_POSSESSIVE_RE.test(flat)) {
      hits.push('plural possessive `tiered.tv\'s editors`')
    }
    if (PLURAL_EDITOR_PRONOUN_RE.test(flat)) {
      hits.push('first-person-plural pronouns (`we\'ve` / `we are` / `we aren\'t` / etc.)')
    }
    if (hits.length === 0) continue
    issues.push({
      file: `content/shows/${show.slug}/canon.md (meth_who_p)`,
      message: `canon meth_who_p plural-collective editor voice — carries ${hits.join(' AND ')}. The CanonMethodology default body (src/components/canon/CanonMethodology.tsx:13-20) reads "One editor, named. ... we will not hide behind plural pronouns."; /about (content/legal/about.md:29, :78) formally admits the singular form. Recast \`tiered.tv's editors\` → \`tiered.tv's editor\` and the plural pronouns into singular voice (first-person \`I've watched\` / \`I'm trying\`, or third-person \`the editor has watched\`). Preserve per-show editorial detail. See plan/CRITIQUE.md pass-35 / issue #329.`,
    })
  }
  return issues
}

// Critique pass-41 MED (issue #357): sibling drain to #329 at the
// methodology layer. The pass-35 #329 closure flipped `meth_who_p`
// across all 13 canon files to first-person-singular voice; the
// sibling fields `meth_how_h` / `meth_how_p` / `meth_when_h` /
// `meth_when_p` were not in scope and still carried plural-collective
// voice across every show. A reader scrolling the three methodology
// cells in order read `I` (cell 01) → `we` (cell 02) → `we`
// (cell 03) — the editorial voice swapped narrators inside one
// module. This invariant scans the four sibling fields for the same
// plural-we / plural-our literals the #329 invariant catches at the
// `meth_who_p` layer; strict-at-floor-0 since all 13 canons drain in
// the same tick that lands this invariant.
const PLURAL_EDITOR_OUR_RE = /\bour\b/i
const CANON_METH_SIBLING_FIELDS = [
  'meth_how_h',
  'meth_how_p',
  'meth_when_h',
  'meth_when_p',
] as const

export function collectCanonMethSiblingsPluralEditorIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    if (!canon) continue
    for (const field of CANON_METH_SIBLING_FIELDS) {
      const body = canon[field]
      if (!body) continue
      const flat = body.replace(/\s+/g, ' ')
      const hits: string[] = []
      if (PLURAL_EDITOR_PRONOUN_RE.test(flat) || /\bwe\b/i.test(flat)) {
        hits.push('first-person-plural pronoun (`we` / `we\'ve` / `we are` / etc.)')
      }
      if (PLURAL_EDITOR_OUR_RE.test(flat)) {
        hits.push('plural possessive `our`')
      }
      if (hits.length === 0) continue
      issues.push({
        file: `content/shows/${show.slug}/canon.md (${field})`,
        message: `canon ${field} plural-collective editor voice — carries ${hits.join(' AND ')}. The pass-35 #329 closure committed the canon methodology block to first-person-singular voice at the meth_who_p layer; cells 02 / 03 must match. Recast \`How do we weigh it?\` → \`How do I weigh it?\` (or \`How we weigh it\` → \`How I weigh it\`), \`we revisit\` → \`I revisit\`, \`our read\` → \`my read\`, etc. Preserve per-show editorial detail. See plan/CRITIQUE.md pass-41 / issue #357.`,
      })
    }
  }
  return issues
}

// Critique pass-41 MED (issue #356): show `tagline` field plural-collective
// editor voice — the same defect class as pass-35 #329 at the per-show
// tagline layer the #329 closure did not sweep. Survivor + Amazing Race
// hero taglines closed on `We've ranked every single one.` /
// `We've ranked every leg of every one.` while the same-page canon
// methodology cell 01 reads first-person-singular `I've watched ... I'm
// trying to be honest.` Same-page voice contradiction on the same
// activity (ranking the canon). The remaining 11 show taglines do not
// carry the plural closer — narrow 2-show drain, not whole catalog.
// Strict at floor 0 since both carriers drain in this tick; any future
// authoring pass that re-introduces a plural closer at the tagline
// field layer trips at content-check time.
export function collectShowTaglinePluralEditorIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    const tagline = show.tagline
    if (!tagline) continue
    const flat = tagline.replace(/\s+/g, ' ')
    const hits: string[] = []
    if (PLURAL_EDITOR_POSSESSIVE_RE.test(flat)) {
      hits.push('plural possessive `tiered.tv\'s editors`')
    }
    if (PLURAL_EDITOR_PRONOUN_RE.test(flat)) {
      hits.push('first-person-plural pronouns (`we\'ve` / `we are` / `we aren\'t` / etc.)')
    }
    if (hits.length === 0) continue
    issues.push({
      file: `content/shows/${show.slug}.md (tagline)`,
      message: `show tagline plural-collective editor voice — carries ${hits.join(' AND ')}. The same-page canon methodology cell 01 reads first-person-singular per the pass-35 #329 closure ("I've watched ... I'm trying to be honest."); a hero tagline closing on plural-collective \`We've ranked\` contradicts that voice on the same page. Recast \`We've\` → \`I've\` (or third-person \`The editor has\`) and \`tiered.tv's editors\` → \`tiered.tv's editor\`. See plan/CRITIQUE.md pass-41 / issue #356.`,
    })
  }
  return issues
}

// Critique pass-32 LOW (issue #325): `/shows/survivor/season/heroes-vs-villains`
// "What to watch for" callouts re-used `cold-open` across moment 1's label and
// moment 4's body — two of four small callouts sharing the same content-bearing
// vocabulary. The four-card surface is supposed to read as four distinct beats;
// shared 2-word phrases across items blur that contract.
//
// Tokenizer note: this invariant splits hyphens, so `cold-open` (the body's
// single hyphenated token) bigrams with adjacent words and ALSO matches the
// label's two-token `cold open` form. The standard `extractContentBigrams`
// helper above keeps hyphenated tokens whole, which would not have caught
// the original finding. Stopwords are dropped via the same set used by
// the themed-list invariant.
function extractWatchListContentBigrams(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z\s'-]/g, ' ')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ''))
    .filter((t) => /^[a-z][a-z']*$/.test(t))
  const bigrams = new Set<string>()
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i]!
    const b = tokens[i + 1]!
    if (PHRASE_REPETITION_STOPWORDS.has(a)) continue
    if (PHRASE_REPETITION_STOPWORDS.has(b)) continue
    bigrams.add(`${a} ${b}`)
  }
  return bigrams
}

export function collectWatchListPhraseRepetitionIssues(): Failure[] {
  const issues: Failure[] = []
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      const items = season.watch_list
      if (!items || items.length < 2) continue
      // Body-vs-body and body-vs-label cross-callout phrase repetition.
      // Label-vs-label collisions are excluded — the structural label
      // tokens (e.g., `OPENER · COLD OPEN`, `LATE · THIRD ACT`) are
      // supposed to carry recurring scaffolding vocabulary.
      const bodyBigrams = items.map((it) =>
        extractWatchListContentBigrams(it.body),
      )
      const labelBigrams = items.map((it) =>
        extractWatchListContentBigrams(it.episode_label),
      )
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const shared = new Set<string>()
          // body[i] ∩ body[j]
          for (const phrase of bodyBigrams[i]!) {
            if (bodyBigrams[j]!.has(phrase)) shared.add(phrase)
          }
          // body[i] ∩ label[j], body[j] ∩ label[i]
          for (const phrase of bodyBigrams[i]!) {
            if (labelBigrams[j]!.has(phrase)) shared.add(phrase)
          }
          for (const phrase of bodyBigrams[j]!) {
            if (labelBigrams[i]!.has(phrase)) shared.add(phrase)
          }
          if (shared.size === 0) continue
          const seasonFile = `content/shows/${show.slug}/seasons/${String(season.number).padStart(2, '0')}-${season.slug}.md`
          const phrases = Array.from(shared)
            .map((p) => `"${p}"`)
            .join(', ')
          issues.push({
            file: `${seasonFile} (watch_list)`,
            message: `watch_list cross-callout phrase repetition — items #${i + 1} (${items[i]!.episode_label}) and #${j + 1} (${items[j]!.episode_label}) share content-bearing 2-word phrase(s) ${phrases}. The four-card surface is supposed to read as distinct beats; rotate one of the two uses to surface-native vocabulary the other items do not already carry. See plan/CRITIQUE.md pass-32 / issue #325.`,
          })
        }
      }
    }
  }
  return issues
}

// Critique pass-35 HIGH (issue #328): a themed-list entry whose
// `title` or `blurb` claims the named show+season is the **first**
// all-returnee / all-star / returnee outing must agree with the
// site's known first-of-class allowlist. /themes/best-finales #02
// (Survivor S20 Heroes vs. Villains) shipped the title `The first
// all-returnee season closing on a final tribal that reads like a
// verdict.` — HvV is the SECOND all-returnee Survivor season;
// Survivor S8 All-Stars (2004) was the first, and the show's own
// canon names that on the adjacent /shows/survivor surface (entry
// `## 8. All-Stars` tag: "The first returnee season — historic,
// uneven, foundational..."). One hop deep, the themed-list claim
// contradicted the canon. The HvV literal is rewritten in this
// commit (drops the factual error, preserves the `final tribal
// that reads like a verdict` simile); this invariant is the floor
// that catches a future authoring pass making the same class of
// `first <returnee>` claim against a show/season that isn't the
// allowlisted first-of-class.
const FIRST_RETURNEE_CLAIM_RE =
  /\bfirst\b[^.]{0,40}?(all-returnee|all[ -]star|returnee)\b/i
// Allowlist of (show, season) entries whose "first <returnee|all-star|
// all-returnee>" claim is editorially truthful — either a genuine
// first-of-class for that show, or a qualified/scoped first (e.g.,
// "first all-star house in fourteen years"). A new entry that makes
// this class of claim must either match an allowlist row or rewrite
// the claim off the "first" frame; expanding this allowlist requires
// the entry's editorial justification to be checked against the
// show's own canon on the adjacent /shows/<show> surface.
const FIRST_ALL_RETURNEE_ALLOWLIST: Record<string, number[]> = {
  // Survivor S8 All-Stars (2004) — the franchise's first all-returnee
  // season; canon entry `## 8. All-Stars` tag names it explicitly.
  survivor: [8],
  // Big Brother S7 All-Stars (2006) — the franchise's first all-star
  // season (BB22 was the second). Big Brother S22 (2020) carries the
  // qualified-first claim "first all-star house in fourteen years",
  // editorially truthful as a windowed first.
  'big-brother': [7, 22],
  // Amazing Race S11 All-Stars (2007) — the franchise's first
  // all-returnee race.
  'amazing-race': [11],
}

export function collectThemeFactualFirstClaimIssues(): Failure[] {
  const issues: Failure[] = []
  for (const theme of getAllThemes()) {
    const themeFile = `content/themes/${theme.slug}.md`
    for (const entry of theme.entries) {
      const flagged =
        FIRST_RETURNEE_CLAIM_RE.test(entry.title) ||
        FIRST_RETURNEE_CLAIM_RE.test(entry.blurb)
      if (!flagged) continue
      const allowedSeasons = FIRST_ALL_RETURNEE_ALLOWLIST[entry.show]
      if (allowedSeasons && allowedSeasons.includes(entry.season)) continue
      const claimSurface = FIRST_RETURNEE_CLAIM_RE.test(entry.title)
        ? 'title'
        : 'blurb'
      const allowText =
        allowedSeasons
          ? `show "${entry.show}" is allowlisted as first-of-class at season(s) ${allowedSeasons.join(', ')}, but this entry names season ${entry.season}`
          : `show "${entry.show}" is not allowlisted as first-of-class for the returnee/all-star class`
      issues.push({
        file: `${themeFile} (entry #${entry.rank} ${claimSurface})`,
        message: `themed-list entry makes a "first <returnee|all-star|all-returnee>" claim but ${allowText}. /themes/best-finales #02 (Survivor S20 HvV) shipped this defect class — HvV is the SECOND all-returnee Survivor season; All-Stars (S8) was the first, and the show's own canon names it on the adjacent /shows/survivor surface. A factual claim one hop from the source canon that names the truth is the failure class brand promise commits the product against. Rewrite the claim off the "first" frame (preserve any load-bearing simile), or — if the show genuinely was first-of-class for the returnee/all-star format — extend FIRST_ALL_RETURNEE_ALLOWLIST in scripts/content-check.ts with the new show+season. See plan/CRITIQUE.md pass-35 / issue #328.`,
      })
    }
  }
  return issues
}

function main(): number {
  const failures: Failure[] = []

  let summary: ReturnType<typeof loadAllContent>
  try {
    summary = loadAllContent()
  } catch (err) {
    if (err instanceof ContentValidationError) {
      failures.push({ file: err.file, message: err.message })
    } else {
      failures.push({
        file: '(load)',
        message: err instanceof Error ? err.message : String(err),
      })
    }
    console.error('content-check: load failed')
    for (const f of failures) console.error(fmtFailure(f))
    return 1
  }

  // 31a: lax-mode canon invariants. The script fails on conflict
  // (mismatched canon ranks vs season frontmatter; dangling canon
  // refs; duplicate slugs within a show), but still passes when a
  // show simply has no canon yet — that's the "always-working"
  // rule's tolerance window for newly-seeded shows. 31b's final
  // tick flips STRICT to true, at which point every show with
  // seasons must carry a canon and every season must have
  // canonical_position set.
  //
  // Toggling STRICT is intentionally a one-line change so the
  // 31b drain ticks can flip it without re-arguing the contract.
  const STRICT = true
  failures.push(...collectFailures(STRICT))

  failures.push(...collectThemeFailures())

  // Phase 41: cross-canon coverage. Lax during the drain — a list
  // below the >= 3-distinct-shows floor is printed as a warning,
  // not pushed into `failures`. The final drain tick flips
  // CROSS_SHOW_STRICT to true (one-line change, like STRICT
  // above), at which point every tone/craft/era list must clear
  // the floor or be re-tagged `category: single`.
  const CROSS_SHOW_STRICT = true
  const crossShowIssues = collectCrossShowIssues()
  if (CROSS_SHOW_STRICT) {
    failures.push(...crossShowIssues)
  } else {
    for (const issue of crossShowIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  for (const slug of ['about', 'terms', 'privacy'] as const) {
    if (!getLegalDoc(slug)) {
      failures.push({
        file: `content/legal/${slug}.md`,
        message: 'required legal doc missing',
      })
    }
  }

  // Phase 43: year-tenure invariant. Strict since the final tick
  // (this commit) — every spelled-out tenure phrase in editorial
  // copy must either match today's
  // `numberToWords(yearsSinceEst(estYear))`, be allowlisted via
  // `TENURE_ANCHOR_ALLOWLIST` (milestone-anchored canon entries),
  // or be rephrased to drop the literal ("a quarter-century",
  // "the franchise's first decade"). Mirrors the STRICT and
  // CROSS_SHOW_STRICT toggles above.
  const YEAR_TENURE_STRICT = true
  const yearTenureIssues = collectYearTenureIssues()
  if (YEAR_TENURE_STRICT) {
    failures.push(...yearTenureIssues)
  } else {
    for (const issue of yearTenureIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-12 HIGH: ships strict at floor 0 because the
  // content rewrite drained every offender in one tick (issue
  // #187). Same one-line strict toggle as STRICT,
  // CROSS_SHOW_STRICT, and YEAR_TENURE_STRICT above.
  const TAGLINE_TAIL_STRICT = true
  const taglineTailIssues = collectTaglineTemplatedTailIssues()
  if (TAGLINE_TAIL_STRICT) {
    failures.push(...taglineTailIssues)
  } else {
    for (const issue of taglineTailIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-12 MED (issue #191): same lax->strict precedent —
  // ships strict at floor 0 because the rewrite drained every
  // offender in one tick. One-line toggle mirroring the four above.
  const THEME_COUNT_TAIL_STRICT = true
  const themeCountTailIssues = collectThemeDescriptionCountTailIssues()
  if (THEME_COUNT_TAIL_STRICT) {
    failures.push(...themeCountTailIssues)
  } else {
    for (const issue of themeCountTailIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-13 MED (Survivor S40 Winners at War twist-name
  // spoiler): ships strict at floor 0 — the WaW blurb rewrite
  // drained the only offender in one tick. Spoiler discipline is
  // P0, so the invariant is the mechanical floor that keeps a
  // future authoring pass from naming twist mechanics on a public
  // list surface. One-line toggle mirroring the five above.
  const THEMED_ENTRY_SPOILER_STRICT = true
  const themedEntrySpoilerIssues = collectThemedEntrySpoilerIssues()
  if (THEMED_ENTRY_SPOILER_STRICT) {
    failures.push(...themedEntrySpoilerIssues)
  } else {
    for (const issue of themedEntrySpoilerIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-19 HIGH (issue #241): ships strict at floor 0 —
  // the season-page watch-order chip rewrite resolves every existing
  // season correctly via the helper's format-field scan. The
  // invariant is the regression guard that catches a future editor
  // stashing the returnees signal in title/eyebrow/lede only,
  // re-surfacing "start here, no prerequisites" on a returnees
  // season. One-line toggle mirroring the six above.
  const WATCH_ORDER_CLASSIFICATION_STRICT = true
  const watchOrderClassificationIssues =
    collectWatchOrderClassificationIssues()
  if (WATCH_ORDER_CLASSIFICATION_STRICT) {
    failures.push(...watchOrderClassificationIssues)
  } else {
    for (const issue of watchOrderClassificationIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-25 MED (issue #280): ships strict at threshold 3
  // — the content rewrite drained the "measures/measured against"
  // refrain from 32 occurrences across 22 files down to the single
  // kept HvV pull-quote. One-line toggle mirroring the seven above.
  const CLICHE_REPETITION_STRICT = true
  const clicheRepetitionIssues = collectClicheRepetitionIssues()
  if (CLICHE_REPETITION_STRICT) {
    failures.push(...clicheRepetitionIssues)
  } else {
    for (const issue of clicheRepetitionIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-28 HIGH: ships strict at floor 0 — the Amazing
  // Race tagline rewrite drained the only offender in one tick
  // (this commit), and the only other corpus use of `{yearsWord}`
  // (Survivor) was already paired with ` years` from the phase-43
  // tick-1 introduction of the token. One-line toggle mirroring
  // the eight above.
  const YEAR_TOKEN_PAIRING_STRICT = true
  const yearTokenPairingIssues = collectYearTokenPairingIssues()
  if (YEAR_TOKEN_PAIRING_STRICT) {
    failures.push(...yearTokenPairingIssues)
  } else {
    for (const issue of yearTokenPairingIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-27 LOW: ships strict at floor 0 — the /about
  // edit drains the two existing offenders in one tick, so the
  // invariant is the floor that catches a future authoring pass
  // quoting non-existent list titles in the example parenthetical.
  // One-line toggle mirroring the nine above.
  const ABOUT_LIST_TITLE_STRICT = true
  const aboutListTitleIssues = collectAboutListTitleQuoteIssues()
  if (ABOUT_LIST_TITLE_STRICT) {
    failures.push(...aboutListTitleIssues)
  } else {
    for (const issue of aboutListTitleIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-28 LOW (issue #297): ships strict at floor 0 —
  // the best-finales rewrite drains `closing run` to 2 of 7 entries
  // (28.6%, below the 50% threshold). The invariant is the floor
  // that catches a future themed list whose entry bodies converge
  // on a single noun phrase. One-line toggle mirroring the ten
  // above.
  const THEME_BODY_PHRASE_STRICT = true
  const themeBodyPhraseIssues = collectThemeBodyPhraseRepetitionIssues()
  if (THEME_BODY_PHRASE_STRICT) {
    failures.push(...themeBodyPhraseIssues)
  } else {
    for (const issue of themeBodyPhraseIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-36 MED (issue #337): ships strict at floor 3 — the
  // best-finales body-opener rewrite drains the `finale` synonym
  // cluster (`endgame` / `closing run` / `last act` / `final stretch`)
  // to 2 of 7 entries (entry #03 deliberate "Restaurant Wars takes the
  // season into its endgame" callback + entry #07 deliberate "closing
  // run rewards the alliance play" rhythm; under the strict floor of
  // 3). The invariant is the floor that catches a future themed list
  // whose entries rotate between synonyms for its own subject noun.
  // One-line toggle mirroring the twelve above.
  const THEME_SYNONYM_CLUSTER_STRICT = true
  const themeSynonymClusterIssues = collectThemeSynonymClusterIssues()
  if (THEME_SYNONYM_CLUSTER_STRICT) {
    failures.push(...themeSynonymClusterIssues)
  } else {
    for (const issue of themeSynonymClusterIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-38 MED (issue #341): ships LAX this commit — the
  // best-finales rewrite drains the two named entries (#05 Traitors
  // S02 + #06 Drag Race S6), but a corpus sweep of the other 11
  // themed lists may surface unrelated entries with shared title↔blurb
  // bigrams that need a follow-up content tick. Lax floor → warn only
  // until the corpus drains; the next ship-content pass flips
  // THEME_HEADLINE_BODY_ECHO_STRICT to true (same lax→strict pattern
  // as SHOW_COUNT_RESTATE_STRICT directly below). One-line toggle.
  const THEME_HEADLINE_BODY_ECHO_STRICT = false
  const themeHeadlineBodyEchoIssues = collectThemeEntryHeadlineBodyEchoIssues()
  if (THEME_HEADLINE_BODY_ECHO_STRICT) {
    failures.push(...themeHeadlineBodyEchoIssues)
  } else {
    for (const issue of themeHeadlineBodyEchoIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-37 MED (issue #333): ships LAX during the corpus
  // drain — this commit's Survivor tagline rewrite drops the
  // critique-named offender, but a sweep of the catalog finds 12
  // other shows whose `blurb` and `tagline` both open on a `<N>
  // seasons` clause (amazing-race, bachelor, bachelorette, bake-off,
  // big-brother, dragrace, love-island-uk, love-island-us,
  // project-runway, the-challenge, top-chef, traitors). The wider
  // drain is per-tick `/iterate` work; this commit ships the
  // invariant warn-only, so the next drain ticks each rotate one
  // show's tagline and the final drain tick flips
  // SHOW_COUNT_RESTATE_STRICT to true. One-line toggle mirroring
  // SEASON_EYEBROW_CALENDAR_STRICT / WATCHLIST_PHRASE_REPETITION_STRICT
  // above (the lax→strict pattern).
  const SHOW_COUNT_RESTATE_STRICT = false
  const showCountRestateIssues = collectShowBlurbTaglineCountRepetitionIssues()
  if (SHOW_COUNT_RESTATE_STRICT) {
    failures.push(...showCountRestateIssues)
  } else {
    for (const issue of showCountRestateIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-41 MED (issue #359): ships strict at floor 7 — the
  // /shows A-tier card_tagline drain (this commit) takes the `<N>
  // seasons` carrier count from 11 of 11 to 6 of 11, one below the
  // floor; S-tier has only 2 shows total, well below floor regardless.
  // The invariant is the bidirectional floor that catches a future
  // authoring pass re-templating an entire band's rendered tile copy
  // onto a shared first-two-word lemma. One-line toggle mirroring the
  // fifteen above.
  const SHOW_TAGLINE_BAND_TEMPLATE_ECHO_STRICT = true
  const showTaglineBandTemplateEchoIssues =
    collectShowTaglineBandTemplateEchoIssues()
  if (SHOW_TAGLINE_BAND_TEMPLATE_ECHO_STRICT) {
    failures.push(...showTaglineBandTemplateEchoIssues)
  } else {
    for (const issue of showTaglineBandTemplateEchoIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-33 MED (issue #319): ships strict at floor 0 —
  // the best-finales #03 (Top Chef S06 Las Vegas) body-opener
  // rewrite drops the lone deck-vs-body restatement in the corpus
  // (the synonymy "deepest knife-skill cast" ↔ "most technically
  // loaded roster" sat outside the lexical heuristic; the candidate
  // "Restaurant Wars takes the season into its endgame on a kitchen
  // split" shares only "kitchen" across the title/opener pair).
  // The invariant is the floor that catches a future authoring pass
  // opening a themed-list entry's blurb by lexically restating the
  // deck (shared 3-token content sequence OR >50% content-token
  // overlap with at least 2 shared tokens). One-line toggle
  // mirroring the eleven above.
  const THEME_DECK_BODY_DIVERGENCE_STRICT = true
  const themeDeckBodyDivergenceIssues =
    collectThemeDeckBodyOpenerDivergenceIssues()
  if (THEME_DECK_BODY_DIVERGENCE_STRICT) {
    failures.push(...themeDeckBodyDivergenceIssues)
  } else {
    for (const issue of themeDeckBodyDivergenceIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-30 LOW (issue #305): ships strict at floor 0 —
  // the content rewrite (this commit) drains the 3 themed-list
  // blurb offenders + the HvV `episode_heat_caption` in one tick.
  // The invariant is the floor that catches a future authoring pass
  // re-introducing the unhyphenated form on the in-scope surfaces.
  // One-line toggle mirroring the eleven above.
  const BACK_HALF_HYPHEN_STRICT = true
  const backHalfHyphenIssues = collectBackHalfHyphenIssues()
  if (BACK_HALF_HYPHEN_STRICT) {
    failures.push(...backHalfHyphenIssues)
  } else {
    for (const issue of backHalfHyphenIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-31 HIGH (issue #306): ships strict at floor 0 —
  // the byline drain (this commit) swaps every theme `curator` and
  // every canon `editor` field from the plural "tiered.tv Editors"
  // form to the singular "tiered.tv editor" form, matching /about's
  // long-standing "Built and operated by one person" admission.
  // The invariant is the bidirectional floor: while /about carries
  // the singular anchor, no curator/editor field may regress to
  // plural; if /about later moves to a plural editorship, the
  // invariant goes silent (no false positives). One-line toggle
  // mirroring the twelve above.
  const EDITORIAL_BYLINE_SINGULAR_STRICT = true
  const editorialBylineIssues = collectEditorialBylineSingularIssues()
  if (EDITORIAL_BYLINE_SINGULAR_STRICT) {
    failures.push(...editorialBylineIssues)
  } else {
    for (const issue of editorialBylineIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-32 MED (issue #312): ships strict at floor 0 —
  // the Survivor canon entry #02 rotation (this commit) drops the
  // only adjacency pair in the corpus. The invariant is the floor
  // that catches a future canon authoring pass re-running the
  // self-naming brand-stamp closer at adjacent ranks on any show.
  // One-line toggle mirroring the thirteen above.
  const CANON_CLOSING_FORMULA_STRICT = true
  const canonClosingFormulaIssues = collectCanonRationaleClosingFormulaIssues()
  if (CANON_CLOSING_FORMULA_STRICT) {
    failures.push(...canonClosingFormulaIssues)
  } else {
    for (const issue of canonClosingFormulaIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-33 MED (issue #317): ships LAX during the corpus
  // drain — the live catalog carries ~38 Feb-premiere "spring 20XX"
  // and ~10 May/Aug-premiere "summer/fall" eyebrows that the
  // invariant flags but do not warrant the per-tick scope of an
  // /iterate fix. Subsequent /ship-content drain ticks rewrite each
  // offender's eyebrow (span form like "winter–spring 2010" or
  // calendar form like "Feb–May 2024"); the final drain tick flips
  // SEASON_EYEBROW_CALENDAR_STRICT to true. One-line toggle
  // mirroring CROSS_SHOW_STRICT and the other lax→strict invariants
  // above. The HvV literal that triggered this finding is fixed in
  // this commit.
  const SEASON_EYEBROW_CALENDAR_STRICT = false
  const seasonEyebrowCalendarIssues = collectSeasonEyebrowCalendarIssues()
  if (SEASON_EYEBROW_CALENDAR_STRICT) {
    failures.push(...seasonEyebrowCalendarIssues)
  } else {
    for (const issue of seasonEyebrowCalendarIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-35 HIGH (issue #328): ships strict at floor 0 —
  // the /themes/best-finales #02 title rewrite (this commit) drains
  // the only offender in the corpus. The invariant is the floor that
  // catches a future authoring pass making a "first <returnee|
  // all-star|all-returnee>" claim against a show+season that isn't
  // the allowlisted first-of-class. One-line toggle mirroring the
  // strict invariants above.
  const THEME_FIRST_CLAIM_STRICT = true
  const themeFirstClaimIssues = collectThemeFactualFirstClaimIssues()
  if (THEME_FIRST_CLAIM_STRICT) {
    failures.push(...themeFirstClaimIssues)
  } else {
    for (const issue of themeFirstClaimIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-32 LOW (issue #325): ships LAX during the corpus
  // drain — the live catalog carries ~161 seasons with `watch_list`
  // and a strict floor would surface incidental cross-callout
  // bigrams that don't all warrant per-tick rotation. The HvV
  // literal that triggered this finding is fixed in this commit;
  // subsequent /ship-content drain ticks rotate each remaining
  // offender, and the final drain tick flips
  // WATCHLIST_PHRASE_REPETITION_STRICT to true. One-line toggle
  // mirroring SEASON_EYEBROW_CALENDAR_STRICT above.
  const WATCHLIST_PHRASE_REPETITION_STRICT = false
  const watchListPhraseIssues = collectWatchListPhraseRepetitionIssues()
  if (WATCHLIST_PHRASE_REPETITION_STRICT) {
    failures.push(...watchListPhraseIssues)
  } else {
    for (const issue of watchListPhraseIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-35 MED (issue #329): the 9-tick drain is complete
  // — every carrier show's `meth_who_p` override now reads singular
  // voice mirroring the CanonMethodology default + /about's promise.
  // STRICT is on so any future authoring pass slipping back to
  // plural-collective voice fails at the verify gate (same shape as
  // STRICT / CROSS_SHOW_STRICT / YEAR_TENURE_STRICT above).
  const PLURAL_EDITOR_STRICT = true
  const pluralEditorIssues = collectCanonMethWhoPluralEditorIssues()
  if (PLURAL_EDITOR_STRICT) {
    failures.push(...pluralEditorIssues)
  } else {
    for (const issue of pluralEditorIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-41 MED (issue #356): both carriers (Survivor +
  // Amazing Race) drain in the same tick that lands this invariant,
  // so STRICT ships on day one — any future authoring pass slipping a
  // plural closer back into a show tagline trips at the verify gate.
  const SHOW_TAGLINE_PLURAL_STRICT = true
  const showTaglinePluralIssues = collectShowTaglinePluralEditorIssues()
  if (SHOW_TAGLINE_PLURAL_STRICT) {
    failures.push(...showTaglinePluralIssues)
  } else {
    for (const issue of showTaglinePluralIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  // Critique pass-41 MED (issue #357): all 13 canons drain in the same
  // tick that lands this invariant — every `meth_how_h` / `meth_how_p`
  // / `meth_when_h` / `meth_when_p` field now reads first-person-
  // singular voice mirroring the pass-35 #329 closure at the
  // `meth_who_p` layer. STRICT ships on day one — any future authoring
  // pass slipping plural-collective voice back into the methodology
  // siblings trips at the verify gate.
  const METH_SIBLINGS_PLURAL_STRICT = true
  const methSiblingsPluralIssues =
    collectCanonMethSiblingsPluralEditorIssues()
  if (METH_SIBLINGS_PLURAL_STRICT) {
    failures.push(...methSiblingsPluralIssues)
  } else {
    for (const issue of methSiblingsPluralIssues) {
      console.warn(`content-check: warning —\n${fmtFailure(issue)}`)
    }
  }

  failures.push(...collectCalendarFailures())

  if (!existsSync('content')) {
    failures.push({
      file: 'content',
      message: 'content directory missing',
    })
  }

  if (failures.length > 0) {
    console.error('content-check: validation failed')
    for (const f of failures) console.error(fmtFailure(f))
    return 1
  }

  console.log(
    `content-check: ok — ${summary.shows} show${summary.shows === 1 ? '' : 's'}, ${summary.seasons} season${summary.seasons === 1 ? '' : 's'}, ${summary.canons} canon${summary.canons === 1 ? '' : 's'}, ${summary.themes} theme${summary.themes === 1 ? '' : 's'}, ${summary.legal} legal docs`,
  )
  return 0
}

// Only execute when invoked as a script — keeps the module
// safely importable from vitest suites.
const isDirect =
  typeof process.argv[1] === 'string' &&
  process.argv[1] === fileURLToPath(import.meta.url)
if (isDirect) {
  process.exit(main())
}

export { main }
