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
// `category` tone / craft / era must carry entries from >= 3
// distinct shows — the /themes hero copy and every CROSS-CANON
// tag promise cross-show coverage, so the data has to back the
// claim. `category: single` is the legal carve-out for a
// deliberately mono-show tier. Lax (warns) during the phase-41
// drain; `CROSS_SHOW_STRICT` in main() flips on the final drain
// tick, the same lax->strict pattern as the canon (STRICT) and
// era-band invariants. Exported so the vitest suite can exercise
// it directly.
const CROSS_SHOW_CATEGORIES = new Set(['tone', 'craft', 'era'])

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
