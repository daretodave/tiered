import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { __resetContentCache } from '../loaders'
import { setContentRoot } from '../paths'
// scripts/content-check.ts exports its assertion logic so the same
// rules can be exercised in vitest without spawning a child process.
import {
  collectAboutListTitleQuoteIssues,
  collectBackHalfHyphenIssues,
  collectCanonMethSiblingsPluralEditorIssues,
  collectCanonMethWhoClosingPairEchoIssues,
  collectCanonMethWhoPluralEditorIssues,
  collectCanonRationaleClosingFormulaIssues,
  collectCalendarFailures,
  collectClicheRepetitionIssues,
  collectCrossShowIssues,
  collectEditorialBylineSingularIssues,
  collectFailures,
  collectSeasonEyebrowCalendarIssues,
  collectShowBlurbTaglineCountRepetitionIssues,
  collectShowCardTaglineVoiceConsistencyIssues,
  collectShowTaglineBandTemplateEchoIssues,
  collectShowTaglinePluralEditorIssues,
  collectTaglineTemplatedTailIssues,
  collectThemeBodyPhraseRepetitionIssues,
  collectThemeSynonymClusterIssues,
  collectThemeDeckBodyOpenerDivergenceIssues,
  collectThemeEntryHeadlineBodyEchoIssues,
  collectThemedEntryVerbatimPhraseEchoIssues,
  collectThemeDescriptionCountTailIssues,
  collectThemedEntrySpoilerIssues,
  collectThemeFactualFirstClaimIssues,
  collectThemeFailures,
  collectWatchListPhraseRepetitionIssues,
  collectYearTenureIssues,
  collectYearTokenPairingIssues,
} from '../../../scripts/content-check'

const sixtyWords = Array.from({ length: 60 }, (_, i) => `w${i}`).join(' ')
const ninetyWords = Array.from({ length: 90 }, (_, i) => `w${i}`).join(' ')
const fortyWords = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ')

function makeShow(root: string, slug: string): void {
  const file = path.join(root, 'shows', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 2
status: airing
blurb: A blurb.
tagline: A tagline.
tier: B
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
  )
}

function makeSeason(
  root: string,
  show: string,
  n: number,
  slug: string,
  opts: { canonical_position?: number; premiere_date?: string } = {},
): void {
  const file = path.join(
    root,
    'shows',
    show,
    'seasons',
    `${String(n).padStart(2, '0')}-${slug}.md`,
  )
  mkdirSync(path.dirname(file), { recursive: true })
  const cp =
    opts.canonical_position != null
      ? `\ncanonical_position: ${opts.canonical_position}`
      : ''
  const pd =
    opts.premiere_date != null ? `\npremiere_date: ${opts.premiere_date}` : ''
  writeFileSync(
    file,
    `---
show: ${show}
number: ${n}
title: ${slug}${cp}${pd}
---

${sixtyWords}
`,
  )
}

// Canon with an explicit era_bands block — used to exercise the
// phase-34 coverage invariant. `ranks` are auto-numbered 1..N over
// seasons 1..N so the canon validates without per-season tuning.
function makeEraCanon(
  root: string,
  show: string,
  seasonCount: number,
  bands: Array<{ key: string; label: string; range: [number, number] }>,
): void {
  const file = path.join(root, 'shows', show, 'canon.md')
  mkdirSync(path.dirname(file), { recursive: true })
  const bandsYaml = bands
    .map(
      (b) =>
        `  - key: ${b.key}\n    label: ${b.label}\n    range: [${b.range[0]}, ${b.range[1]}]`,
    )
    .join('\n')
  const headings = Array.from(
    { length: seasonCount },
    (_, i) => `## ${i + 1}. Title ${i + 1}\n\n${ninetyWords}\n`,
  ).join('\n')
  writeFileSync(
    file,
    `---
show: ${show}
era_bands:
${bandsYaml}
---

${headings}
`,
  )
}

function makeCanon(
  root: string,
  show: string,
  ranks: Array<{ rank: number; season: number; title: string }>,
): void {
  const file = path.join(root, 'shows', show, 'canon.md')
  mkdirSync(path.dirname(file), { recursive: true })
  const ordered = ranks.slice().sort((a, b) => a.rank - b.rank)
  const headings = ordered
    .map((r) => `## ${r.season}. ${r.title}\n\n${ninetyWords}\n`)
    .join('\n')
  writeFileSync(
    file,
    `---
show: ${show}
---

${headings}
`,
  )
}

function makeMethodologyCanon(root: string, show: string, season: number): void {
  const file = path.join(root, 'shows', show, 'canon.md')
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
show: ${show}
editor: Test Editor
last_revised: 2026-05-14
meth_who_h: Who ranks
meth_who_p: ${fortyWords}
weekly_question: Question of the week?
era_bands:
  - key: era-one
    label: Era One
    range:
      - 2000
      - 2010
---

## ${season}. Title

${ninetyWords}
`,
  )
}

describe('content-check (lax mode)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes when a show has seasons but no canon (lax tolerance)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one')
    makeSeason(tmp, 'alpha', 2, 'two')
    expect(collectFailures(false)).toEqual([])
  })

  it('passes when canon and seasons agree on ranks', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 2 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 1 })
    makeCanon(tmp, 'alpha', [
      { rank: 1, season: 2, title: 'Two' },
      { rank: 2, season: 1, title: 'One' },
    ])
    expect(collectFailures(false)).toEqual([])
  })

  it('fails when canonical_position disagrees with canon rank', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 5 })
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'One' }])
    const failures = collectFailures(false)
    expect(failures.length).toBeGreaterThan(0)
    expect(failures[0]?.message).toMatch(/canonical_position 5/)
    expect(failures[0]?.message).toMatch(/#1/)
  })

  it('fails when canon entry references a missing season', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one')
    makeCanon(tmp, 'alpha', [
      { rank: 1, season: 1, title: 'One' },
      { rank: 2, season: 99, title: 'Ghost' },
    ])
    const failures = collectFailures(false)
    expect(failures.some((f) => f.message.includes('season 99'))).toBe(true)
  })

  it('passes when a season has canonical_position but the show has no canon', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    expect(collectFailures(false)).toEqual([])
  })

  it('accepts the new optional canon frontmatter (editor / methodology / era_bands)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 5, 'five')
    makeMethodologyCanon(tmp, 'alpha', 5)
    expect(collectFailures(false)).toEqual([])
  })
})

describe('content-check (strict mode preview)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-strict-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('fails strict when a show with seasons has no canon', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one')
    const failures = collectFailures(true)
    expect(failures.some((f) => f.message.includes('canon.md required'))).toBe(true)
  })

  it('fails strict when a season has no canonical_position', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one')
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'One' }])
    const failures = collectFailures(true)
    expect(failures.some((f) => f.message.includes('missing canonical_position'))).toBe(true)
  })

  it('passes strict when every season has canon + canonical_position', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 2 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 1 })
    makeCanon(tmp, 'alpha', [
      { rank: 1, season: 2, title: 'Two' },
      { rank: 2, season: 1, title: 'One' },
    ])
    expect(collectFailures(true)).toEqual([])
  })
})

// Canon whose rationales carry a spoken placement sentence — used
// to exercise the prose-ordinal-vs-slot invariant (#63).
function makeCanonWithProse(
  root: string,
  show: string,
  entries: Array<{ season: number; title: string; spoken: string }>,
): void {
  const file = path.join(root, 'shows', show, 'canon.md')
  mkdirSync(path.dirname(file), { recursive: true })
  const headings = entries
    .map(
      (e) =>
        `## ${e.season}. ${e.title}\n\nThe canon places it ${e.spoken} because ${ninetyWords}\n`,
    )
    .join('\n')
  writeFileSync(file, `---\nshow: ${show}\n---\n\n${headings}\n`)
}

describe('content-check — canon placement ordinal (#63)', () => {
  let tmp: string
  const ordMsg = (fs: ReturnType<typeof collectFailures>) =>
    fs.filter((f) => /placement ordinal|states placement/i.test(f.message))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-ord-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes when every spoken ordinal matches its slot', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithProse(tmp, 'alpha', [
      { season: 1, title: 'One', spoken: 'first' },
      { season: 2, title: 'Two', spoken: 'second' },
    ])
    expect(ordMsg(collectFailures(false))).toEqual([])
  })

  it('fails (even in lax) when a spoken ordinal drifts from the slot', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithProse(tmp, 'alpha', [
      { season: 1, title: 'One', spoken: 'first' },
      { season: 2, title: 'Two', spoken: 'first' },
    ])
    const problems = ordMsg(collectFailures(false))
    expect(problems.some((f) => /states placement 1, not 2/.test(f.message))).toBe(
      true,
    )
  })

  it('tolerates a rationale with no placement sentence', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'One' }])
    expect(ordMsg(collectFailures(false))).toEqual([])
  })
})

// A season whose frontmatter `title` carries a separator-led
// subtitle, paired with a canon heading the test controls — used
// to exercise the canon-heading-vs-season-title invariant
// (critique 2026-05-16: "Micronesia" vs "Micronesia: Fans vs.
// Favorites" naming the same season twice on one page).
function makeSeasonWithTitle(
  root: string,
  show: string,
  n: number,
  slug: string,
  title: string,
): void {
  const file = path.join(
    root,
    'shows',
    show,
    'seasons',
    `${String(n).padStart(2, '0')}-${slug}.md`,
  )
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---\nshow: ${show}\nnumber: ${n}\ntitle: "${title}"\n---\n\n${sixtyWords}\n`,
  )
}

describe('content-check — canon heading vs season title (critique 2026-05-16)', () => {
  let tmp: string
  const nameMsg = (fs: ReturnType<typeof collectFailures>) =>
    fs.filter((f) => /drops the subtitle/.test(f.message))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-name-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('fails (even in lax) when the canon heading drops a separator-led subtitle', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 16, 'micronesia', 'Micronesia: Fans vs. Favorites')
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 16, title: 'Micronesia' }])
    const problems = nameMsg(collectFailures(false))
    expect(problems.some((f) => /season 16/.test(f.message))).toBe(true)
  })

  it('passes when the canon heading is the full season title', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 16, 'micronesia', 'Micronesia: Fans vs. Favorites')
    makeCanon(tmp, 'alpha', [
      { rank: 1, season: 16, title: 'Micronesia: Fans vs. Favorites' },
    ])
    expect(nameMsg(collectFailures(false))).toEqual([])
  })

  it('allows an editorial heading that adds a disambiguating suffix', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 11, 'brad-womack-1', 'Brad Womack')
    makeSeasonWithTitle(tmp, 'alpha', 15, 'brad-womack-2', 'Brad Womack')
    makeCanon(tmp, 'alpha', [
      { rank: 1, season: 11, title: 'Brad Womack (first run)' },
      { rank: 2, season: 15, title: 'Brad Womack (return run)' },
    ])
    expect(nameMsg(collectFailures(false))).toEqual([])
  })
})

// A theme file with a single entry — used to exercise the
// themed-list `season_label` vs canonical-title invariant
// (critique 2026-05-19, #101: S41 "Reboot" / S45 "Survivor 45"
// list labels diverging from the season frontmatter title).
function makeTheme(
  root: string,
  slug: string,
  entry: {
    show: string
    season: number
    season_label?: string
    rank?: number
  },
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  const labelLine =
    entry.season_label != null
      ? `\n    season_label: "${entry.season_label}"`
      : ''
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: "${slug}"
entries:
  - show: ${entry.show}
    season: ${entry.season}
    rank: ${entry.rank ?? 1}${labelLine}
    title: "t"
    blurb: "b"
---
`,
  )
}

describe('content-check — themed-list season_label vs canonical title (#101)', () => {
  let tmp: string
  const labelMsg = (fs: ReturnType<typeof collectThemeFailures>) =>
    fs.filter((f) => /season_label/.test(f.message))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-label-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('fails when the suffix after " · " diverges from the season title', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 41, 's41', 'New Era I')
    makeTheme(tmp, 'best-premieres', {
      show: 'alpha',
      season: 41,
      season_label: 'S41 · Reboot',
    })
    const problems = labelMsg(collectThemeFailures())
    expect(problems.length).toBe(1)
    expect(problems[0]?.file).toBe('content/themes/best-premieres.md')
    expect(problems[0]?.message).toMatch(/"Reboot"/)
    expect(problems[0]?.message).toMatch(/"New Era I"/)
    expect(problems[0]?.message).toMatch(/rank 1/)
  })

  it('passes when the suffix after " · " equals the season title', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 41, 's41', 'New Era I')
    makeTheme(tmp, 'best-premieres', {
      show: 'alpha',
      season: 41,
      season_label: 'S41 · New Era I',
    })
    expect(labelMsg(collectThemeFailures())).toEqual([])
  })

  it('tolerates a label with no " · " separator (bare "S41")', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 41, 's41', 'New Era I')
    makeTheme(tmp, 'best-premieres', {
      show: 'alpha',
      season: 41,
      season_label: 'S41',
    })
    expect(labelMsg(collectThemeFailures())).toEqual([])
  })

  it('tolerates an entry with no season_label at all', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 41, 's41', 'New Era I')
    makeTheme(tmp, 'best-premieres', { show: 'alpha', season: 41 })
    expect(labelMsg(collectThemeFailures())).toEqual([])
  })

  it('still flags unknown show / missing season referential errors', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 41, 's41', 'New Era I')
    makeTheme(tmp, 'best-premieres', {
      show: 'ghost',
      season: 41,
      season_label: 'S41 · New Era I',
    })
    const all = collectThemeFailures()
    expect(all.some((f) => /unknown show "ghost"/.test(f.message))).toBe(true)
  })

  it('handles a multi-word season title with embedded spaces', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 20, 's20', 'Heroes vs. Villains')
    makeTheme(tmp, 'best-finales', {
      show: 'alpha',
      season: 20,
      season_label: 'S20 · Heroes vs. Villains',
    })
    expect(labelMsg(collectThemeFailures())).toEqual([])
  })
})

describe('content-check — themed-list season_label redundant "Season N" subtitle (#161)', () => {
  let tmp: string
  const redundantMsg = (fs: ReturnType<typeof collectThemeFailures>) =>
    fs.filter((f) => /repeats the season number/.test(f.message))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-redundant-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('fails when the subtitle restates "Season N" (matching the source title)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 7, 's7', 'Season 7')
    makeTheme(tmp, 'best-finales', {
      show: 'alpha',
      season: 7,
      season_label: 'S07 · Season 7',
    })
    const problems = redundantMsg(collectThemeFailures())
    expect(problems.length).toBe(1)
    expect(problems[0]?.message).toMatch(/"Season 7"/)
    expect(problems[0]?.message).toMatch(/use the bare "S07"/)
  })

  it('fails when the subtitle restates "Season N (YYYY)" with a parenthetical year', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 2, 's2', 'Season 2 (2024)')
    makeTheme(tmp, 'best-villain-editing', {
      show: 'alpha',
      season: 2,
      season_label: 'S02 · Season 2 (2024)',
    })
    const problems = redundantMsg(collectThemeFailures())
    expect(problems.length).toBe(1)
    expect(problems[0]?.message).toMatch(/"Season 2 \(2024\)"/)
    expect(problems[0]?.message).toMatch(/use the bare "S02"/)
  })

  it('fails when the subtitle restates "Series N (YYYY)" (Love Island UK shape)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 1, 's1', 'Series 1 (2015)')
    makeTheme(tmp, 'best-premieres', {
      show: 'alpha',
      season: 1,
      season_label: 'S01 · Series 1 (2015)',
    })
    expect(redundantMsg(collectThemeFailures()).length).toBe(1)
  })

  it('passes the bare-numeric form "S07" (no subtitle, the canonical post-#161 shape)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 7, 's7', 'Season 7')
    makeTheme(tmp, 'best-finales', {
      show: 'alpha',
      season: 7,
      season_label: 'S07',
    })
    expect(redundantMsg(collectThemeFailures())).toEqual([])
  })

  it('passes when the subtitle is a real proper name', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 20, 's20', 'Heroes vs. Villains')
    makeTheme(tmp, 'best-finales', {
      show: 'alpha',
      season: 20,
      season_label: 'S20 · Heroes vs. Villains',
    })
    expect(redundantMsg(collectThemeFailures())).toEqual([])
  })

  it('passes a subtitle that starts with "Season" but reads as a real name (e.g. "Seasonal Cup")', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 9, 's9', 'Seasonal Cup')
    makeTheme(tmp, 'best-finales', {
      show: 'alpha',
      season: 9,
      season_label: 'S09 · Seasonal Cup',
    })
    expect(redundantMsg(collectThemeFailures())).toEqual([])
  })

  it('tolerates an entry with no season_label at all', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithTitle(tmp, 'alpha', 7, 's7', 'Season 7')
    makeTheme(tmp, 'best-finales', { show: 'alpha', season: 7 })
    expect(redundantMsg(collectThemeFailures())).toEqual([])
  })
})

describe('content-check — era-band coverage (phase 34)', () => {
  let tmp: string
  const eraMsg = (fs: ReturnType<typeof collectFailures>) =>
    fs.filter((f) => /era[ _]band/i.test(f.message))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-era-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function eightSeasons(show: string): void {
    for (let i = 1; i <= 8; i++) {
      makeSeason(tmp, show, i, `s${i}`, {
        premiere_date: `${2000 + i}-01-01`,
      })
    }
  }

  it('lax tolerates a canon with no era_bands on a large show', () => {
    makeShow(tmp, 'alpha')
    eightSeasons('alpha')
    makeCanon(
      tmp,
      'alpha',
      Array.from({ length: 8 }, (_, i) => ({
        rank: i + 1,
        season: i + 1,
        title: `S${i + 1}`,
      })),
    )
    expect(eraMsg(collectFailures(false))).toEqual([])
  })

  it('strict requires era_bands on a canon’d show with >= 8 seasons', () => {
    makeShow(tmp, 'alpha')
    eightSeasons('alpha')
    makeCanon(
      tmp,
      'alpha',
      Array.from({ length: 8 }, (_, i) => ({
        rank: i + 1,
        season: i + 1,
        title: `S${i + 1}`,
      })),
    )
    const problems = eraMsg(collectFailures(true))
    expect(problems.some((f) => /era_bands required/.test(f.message))).toBe(true)
  })

  it('strict does not require era_bands on a small canon’d show', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 's1', {
      canonical_position: 1,
      premiere_date: '2020-01-01',
    })
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'S1' }])
    expect(eraMsg(collectFailures(true))).toEqual([])
  })

  it('fails (even in lax) when present era_bands leave a gap', () => {
    makeShow(tmp, 'alpha')
    eightSeasons('alpha')
    makeEraCanon(tmp, 'alpha', 8, [
      { key: 'early', label: 'Early', range: [2001, 2003] },
      { key: 'late', label: 'Late', range: [2006, 2010] },
    ])
    const problems = eraMsg(collectFailures(false))
    expect(problems.some((f) => /gap between/.test(f.message))).toBe(true)
  })

  it('fails when present era_bands stop before the latest aired season', () => {
    makeShow(tmp, 'alpha')
    eightSeasons('alpha') // years 2001..2008
    makeEraCanon(tmp, 'alpha', 8, [
      { key: 'all', label: 'All', range: [2001, 2007] },
    ])
    const problems = eraMsg(collectFailures(false))
    expect(problems.some((f) => /latest aired season is 2008/.test(f.message))).toBe(
      true,
    )
  })

  it('passes when present era_bands are contiguous and cover the span', () => {
    makeShow(tmp, 'alpha')
    eightSeasons('alpha') // years 2001..2008
    makeEraCanon(tmp, 'alpha', 8, [
      { key: 'early', label: 'Early', range: [2001, 2004] },
      { key: 'late', label: 'Late', range: [2005, 2008] },
    ])
    expect(eraMsg(collectFailures(false))).toEqual([])
    expect(eraMsg(collectFailures(true))).toEqual([])
  })
})

describe('content-check — finale calendar (phase 39)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-cal-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function writeCalendar(body: string): void {
    writeFileSync(path.join(tmp, 'calendar.yml'), body)
  }

  it('passes when calendar.yml is absent (optional infrastructure)', () => {
    makeShow(tmp, 'alpha')
    expect(collectCalendarFailures()).toEqual([])
  })

  it('passes a well-formed calendar referencing a known show', () => {
    makeShow(tmp, 'alpha')
    writeCalendar(
      `finales:
  - show: alpha
    season: 3
    finale_date: 2025-05-21
    status: aired`,
    )
    expect(collectCalendarFailures()).toEqual([])
  })

  it('does NOT require the referenced season file to exist', () => {
    makeShow(tmp, 'alpha')
    // No season files for alpha at all — a future finale precedes
    // its seeded season; that gap is exactly what the gate exists
    // to surface, so content-check must not fail it.
    writeCalendar(
      `finales:
  - show: alpha
    season: 99
    finale_date: 2030-05-21
    status: scheduled`,
    )
    expect(collectCalendarFailures()).toEqual([])
  })

  it('fails on an unknown show slug', () => {
    makeShow(tmp, 'alpha')
    writeCalendar(
      `finales:
  - show: ghost-show
    season: 1
    finale_date: 2025-05-21
    status: aired`,
    )
    const failures = collectCalendarFailures()
    expect(
      failures.some((f) => /unknown show "ghost-show"/.test(f.message)),
    ).toBe(true)
  })

  it('fails on a duplicate (show, season) pair', () => {
    makeShow(tmp, 'alpha')
    writeCalendar(
      `finales:
  - show: alpha
    season: 2
    finale_date: 2024-05-21
    status: aired
  - show: alpha
    season: 2
    finale_date: 2025-05-21
    status: aired`,
    )
    const failures = collectCalendarFailures()
    expect(
      failures.some((f) => /duplicate finale entry for "alpha" season 2/.test(f.message)),
    ).toBe(true)
  })

  it('fails (surfacing the Zod error) on a malformed row', () => {
    makeShow(tmp, 'alpha')
    writeCalendar(
      `finales:
  - show: alpha
    season: not-a-number
    finale_date: 2025-05-21
    status: aired`,
    )
    const failures = collectCalendarFailures()
    expect(failures.length).toBeGreaterThan(0)
    expect(failures[0]?.file).toMatch(/calendar\.yml$/)
    expect(failures[0]?.message).toMatch(/calendar validation failed/)
  })
})

// A themed list with one entry per supplied show slug and a chosen
// category — used to exercise the phase-41 cross-canon coverage
// invariant (every tone/craft/era list must span >= 3 distinct
// shows). The referenced shows/seasons need not exist:
// collectCrossShowIssues only counts distinct entry.show values.
function makeCategoryTheme(
  root: string,
  slug: string,
  category: string,
  showSlugs: string[],
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  const entries = showSlugs
    .map(
      (show, i) =>
        `  - show: ${show}\n    season: ${i + 1}\n    rank: ${i + 1}\n    title: "t${i}"\n    blurb: "b${i}"`,
    )
    .join('\n')
  const eraRange = category === 'era' ? '\nera_range: [2000, 2020]' : ''
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: ${category}${eraRange}
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-21
featured: false
description: "${slug}"
entries:
${entries}
---
`,
  )
}

describe('content-check — cross-canon coverage (phase 41)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-xshow-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags a craft list that covers only one show', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'best-premieres', 'craft', ['alpha'])
    const issues = collectCrossShowIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/themes/best-premieres.md')
    expect(issues[0]?.message).toMatch(/1 distinct show\b/)
    expect(issues[0]?.message).toMatch(/category: single/)
  })

  it('flags a tone list that covers only two shows', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'best-villain-editing', 'tone', ['alpha', 'beta'])
    const issues = collectCrossShowIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.message).toMatch(/2 distinct shows/)
  })

  it('passes a craft list that covers three distinct shows', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'best-finales', 'craft', ['alpha', 'beta', 'gamma'])
    expect(collectCrossShowIssues()).toEqual([])
  })

  it('passes an era list once it clears the >= 3-show floor', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'best-of-the-2010s', 'era', [
      'alpha',
      'beta',
      'gamma',
      'delta',
    ])
    expect(collectCrossShowIssues()).toEqual([])
  })

  it('exempts category: single — a deliberately one-show tier never fails', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'survivor-pillars', 'single', ['alpha'])
    expect(collectCrossShowIssues()).toEqual([])
  })

  it('flags a structure list that covers only two shows (critique pass-31 split)', () => {
    // `structure` was split out of `tone` at critique pass-31 — see
    // src/content/schemas.ts `themeCategorySchema` rationale. The
    // cross-show floor applies symmetrically because structural cuts
    // (reunion specials, post-merge, returnees, firsts) inherently
    // cross shows; if they don't, the index lies the same way the
    // `By tone` head did before the split.
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'best-reunion-specials', 'structure', [
      'alpha',
      'beta',
    ])
    const issues = collectCrossShowIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.message).toMatch(/category: structure/)
    expect(issues[0]?.message).toMatch(/2 distinct shows/)
  })

  it('passes a structure list once it clears the >= 3-show floor', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'firsts', 'structure', [
      'alpha',
      'beta',
      'gamma',
      'delta',
    ])
    expect(collectCrossShowIssues()).toEqual([])
  })

  it('reports one issue per under-covered list across the catalogue', () => {
    makeShow(tmp, 'alpha')
    makeCategoryTheme(tmp, 'list-a', 'craft', ['alpha'])
    makeCategoryTheme(tmp, 'list-b', 'tone', ['alpha', 'beta'])
    makeCategoryTheme(tmp, 'list-c', 'craft', ['alpha', 'beta', 'gamma'])
    const issues = collectCrossShowIssues()
    expect(issues.length).toBe(2)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/list-a.md',
      'content/themes/list-b.md',
    ])
  })
})

// Phase 43: spelled-out year drift in editorial copy. Each test
// pins `asOfDate` so the helper's wall-clock reading is
// deterministic regardless of when the suite runs.
function makeShowWithTagline(root: string, slug: string, opts: {
  estYear: number
  tagline: string
}): void {
  const file = path.join(root, 'shows', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: A blurb.
tagline: ${JSON.stringify(opts.tagline)}
tier: B
network: "Test"
est_year: ${opts.estYear}
genre_tag: "Reality"
featured: false
---
`,
  )
}

describe('content-check — year-tenure drift (phase 43)', () => {
  let tmp: string
  // 2026-05-23: Survivor's 25th year (est_year 2000, anchor May 31).
  // Any est_year=2000 show with this asOfDate reads "twenty-five
  // years" today; any est_year=2001 show reads "twenty-five years"
  // (year math + Jan 1 anchor) — that is fine, the only thing the
  // helper cares about is the rendered word matching the phrase.
  const asOf = new Date(Date.UTC(2026, 4, 23))

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-tenure-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes when no editorial surface carries a spelled-out year phrase', () => {
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A franchise that has spent a quarter-century inventing itself.',
    })
    expect(collectYearTenureIssues(asOf)).toEqual([])
  })

  it('passes when the spelled-out year in the tagline matches the helper-derived value today', () => {
    // est_year=2002, asOf=2026-05-23 (after Jan 1 anchor) → 24
    // years today; "twenty-four" matches the helper exactly.
    makeShowWithTagline(tmp, 'bachelor', {
      estYear: 2002,
      tagline: 'twenty-four years of one franchise reinventing the format.',
    })
    expect(collectYearTenureIssues(asOf)).toEqual([])
  })

  it('reports drift when a season pull cites a year count that is no longer accurate', () => {
    // est_year=2002, asOf=2026-05-23 (after Jan 1 anchor) → 24
    // years today (numberToWords(24) = "twenty-four"). "twenty-five
    // years" rots vs the helper.
    makeShowWithTagline(tmp, 'bachelor', {
      estYear: 2002,
      tagline: 'A clean tagline.',
    })
    const seasonFile = path.join(
      tmp,
      'shows',
      'bachelor',
      'seasons',
      '26-clayton.md',
    )
    mkdirSync(path.dirname(seasonFile), { recursive: true })
    writeFileSync(
      seasonFile,
      `---
show: bachelor
number: 26
title: Clayton
pull: "After twenty-five years, the franchise changes the voice in the room."
---

${Array.from({ length: 60 }, (_, i) => `w${i}`).join(' ')}
`,
    )
    const issues = collectYearTenureIssues(asOf)
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toMatch(/26-clayton\.md \(pull\)/)
    expect(issues[0]?.message).toMatch(/twenty-five years/)
    expect(issues[0]?.message).toMatch(/twenty-four years/)
  })

  it('reports drift inside a canon entry rationale', () => {
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A clean tagline.',
    })
    makeSeason(tmp, 'survivor', 50, 'survivor-50', { canonical_position: 50 })
    const canonFile = path.join(tmp, 'shows', 'survivor', 'canon.md')
    mkdirSync(path.dirname(canonFile), { recursive: true })
    // Rationale must be 80-120 words; embed the rotting phrase in a
    // 90-word body where the helper would expect "twenty-five years"
    // (Survivor anchor) but the prose says "twenty-six years".
    const padding = Array.from({ length: 87 }, (_, i) => `w${i}`).join(' ')
    writeFileSync(
      canonFile,
      `---
show: survivor
---

## 50. Survivor 50

hung on twenty-six years of casting work ${padding}
`,
    )
    const issues = collectYearTenureIssues(asOf)
    expect(issues.some((i) => /\(#1 rationale\)/.test(i.file))).toBe(true)
    expect(issues[0]?.message).toMatch(/twenty-six years/)
  })

  it('ignores milestone-anchored phrases that do not match the regex', () => {
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline:
        'a first quarter-century closer — the twenty-fifth anniversary season',
    })
    // "quarter-century" and "twenty-fifth anniversary" never match
    // the year-tenure regex, so they pass silently.
    expect(collectYearTenureIssues(asOf)).toEqual([])
  })

  // Tick 6: the regex was tightened from "compound only" (twenty-five
  // years) to "compound or bare" (twenty years). The bare form is
  // legal only when (a) it matches today's helper-derived value or
  // (b) the source is in a canon entry whose title matches a
  // TENURE_ANCHOR_ALLOWLIST row.

  it('catches a bare spelled-out year phrase that does not match today', () => {
    // est_year=2000, asOf=2026-05-23 (before Survivor's May 31
    // anniversary) → 25 years today; "twenty years" rots vs the
    // helper. The pre-tick-6 regex (compound only) missed this.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline:
        'a quiet sixty seconds and twenty years of casting work in the can.',
    })
    const issues = collectYearTenureIssues(asOf)
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toMatch(/survivor\.md \(tagline\)/)
    expect(issues[0]?.message).toMatch(/twenty years/)
    expect(issues[0]?.message).toMatch(/twenty-five years/)
  })

  it('catches a rotting bare phrase in a tier blurb', () => {
    // The tier_b_blurb sits on the canon frontmatter, scanned by
    // tick 6's source set. A literal that drifts here would reach
    // the /shows/<slug> tier-blurb surface in production.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A clean tagline.',
    })
    makeSeason(tmp, 'survivor', 50, 'survivor-50', { canonical_position: 50 })
    const canonFile = path.join(tmp, 'shows', 'survivor', 'canon.md')
    mkdirSync(path.dirname(canonFile), { recursive: true })
    writeFileSync(
      canonFile,
      `---
show: survivor
tier_b_blurb: Classic-era stalwarts — shapes the next twenty years lean on.
---

## 50. Survivor 50

${Array.from({ length: 90 }, (_, i) => `w${i}`).join(' ')}
`,
    )
    const issues = collectYearTenureIssues(asOf)
    expect(issues.some((i) => /tier_b_blurb/.test(i.file))).toBe(true)
  })

  it('allowlists Winners at War — the S40 milestone canon entry can cite "twenty years"', () => {
    // Survivor S40 (Winners at War, 2020) is the 20-year milestone.
    // The slot_argument and rationale anchor on that exact fact and
    // stay historically accurate forever — the literal is pinned to
    // the season's airing, not to today's count.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A clean tagline.',
    })
    makeSeason(tmp, 'survivor', 40, 'winners-at-war', {
      canonical_position: 1,
    })
    const canonFile = path.join(tmp, 'shows', 'survivor', 'canon.md')
    mkdirSync(path.dirname(canonFile), { recursive: true })
    const padding = Array.from({ length: 85 }, (_, i) => `w${i}`).join(' ')
    writeFileSync(
      canonFile,
      `---
show: survivor
---

## 40. Winners at War

slot_argument: Twenty winners with twenty years of franchise history sitting behind them.

The franchise milestone the format earns by lasting twenty years. ${padding}
`,
    )
    expect(collectYearTenureIssues(asOf)).toEqual([])
  })

  it('allowlist is scoped to the specific canon entry — the same phrase elsewhere still fails', () => {
    // The allowlist row names a (show, entryTitle, phrase) triple.
    // "twenty years" inside the WaW entry passes; the same phrase
    // inside the Heroes vs. Villains entry fails. This keeps a
    // future editor from accidentally re-licensing the literal
    // across the canon by typing "Winners at War" once.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A clean tagline.',
    })
    makeSeason(tmp, 'survivor', 20, 'heroes-vs-villains', {
      canonical_position: 1,
    })
    const canonFile = path.join(tmp, 'shows', 'survivor', 'canon.md')
    mkdirSync(path.dirname(canonFile), { recursive: true })
    writeFileSync(
      canonFile,
      `---
show: survivor
---

## 20. Heroes vs. Villains

slot_argument: spanning twenty years of franchise history collapsing on one beach.

${Array.from({ length: 90 }, (_, i) => `w${i}`).join(' ')}
`,
    )
    const issues = collectYearTenureIssues(asOf)
    expect(
      issues.some((i) => /slot_argument/.test(i.file) && /twenty years/.test(i.message)),
    ).toBe(true)
  })

  it('allowlist is scoped to the specific show — "Winners at War" in a non-Survivor canon still fails', () => {
    // The triple is (show, entryTitle, phrase). A different show
    // that happens to title an entry "Winners at War" does not
    // inherit the allowance. Keeps the anchor literal to its
    // intended franchise.
    makeShowWithTagline(tmp, 'bachelor', {
      estYear: 2002,
      tagline: 'A clean tagline.',
    })
    makeSeason(tmp, 'bachelor', 30, 'winners-at-war', {
      canonical_position: 1,
    })
    const canonFile = path.join(tmp, 'shows', 'bachelor', 'canon.md')
    mkdirSync(path.dirname(canonFile), { recursive: true })
    writeFileSync(
      canonFile,
      `---
show: bachelor
---

## 30. Winners at War

slot_argument: spanning twenty years of franchise history at the rose ceremony.

${Array.from({ length: 90 }, (_, i) => `w${i}`).join(' ')}
`,
    )
    const issues = collectYearTenureIssues(asOf)
    expect(
      issues.some((i) => /bachelor/.test(i.file) && /twenty years/.test(i.message)),
    ).toBe(true)
  })

  it('catches a capitalized spelled-out year phrase ("Twenty-five years")', () => {
    // Phase 43 tick 7 originally landed the regex case-sensitive
    // (lowercase only); editorial copy that starts a sentence with
    // the literal ("Twenty-five years in, ...") slipped past until
    // critique pass 6 (#163) flagged the H&V pull rotting on
    // 2026-05-31. The `gi` flag + case-insensitive comparison
    // closes the hole.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 1999,
      tagline: 'A clean tagline.',
    })
    const seasonFile = path.join(
      tmp,
      'shows',
      'survivor',
      'seasons',
      '20-heroes-vs-villains.md',
    )
    mkdirSync(path.dirname(seasonFile), { recursive: true })
    writeFileSync(
      seasonFile,
      `---
show: survivor
number: 20
title: Heroes vs. Villains
pull: "Twenty-five years in, this is the season Survivor will still be measured against."
---

${Array.from({ length: 60 }, (_, i) => `w${i}`).join(' ')}
`,
    )
    // est_year=1999, asOf=2026-05-23 → 27 years today (Jan 1 anchor
    // since this fixture has no SHOW_ANNIVERSARIES entry). Capital-T
    // "Twenty-five years" rots vs the helper-derived "twenty-seven".
    const issues = collectYearTenureIssues(asOf)
    expect(issues.some((i) => /20-heroes-vs-villains\.md \(pull\)/.test(i.file))).toBe(true)
    expect(issues[0]?.message).toMatch(/Twenty-five years/)
  })
})

// Critique pass-28 HIGH (issue #292): the Amazing Race tagline
// shipped as `across {yearsWord} of starting lines` and rendered
// ungrammatical "twenty-five of starting lines" on /shows because
// the token substitutes the number ONLY (see
// `src/lib/__tests__/show-tenure.test.ts` for the runtime
// counterpart). This invariant pins the raw frontmatter contract:
// any show whose `tagline` or `card_tagline` carries `{yearsWord}`
// must also carry the literal substring `{yearsWord} years` so the
// rendered string reads naturally.
describe('content-check — {yearsWord} token pairing (critique pass-28, issue #292)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-yearsword-pairing-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes when no tagline carries the token', () => {
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline: 'A franchise that has spent a quarter-century inventing itself.',
    })
    expect(collectYearTokenPairingIssues()).toEqual([])
  })

  it('passes when the token is paired with ` years`', () => {
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline:
        'spent {yearsWord} years rediscovering what it is. The mother format.',
    })
    expect(collectYearTokenPairingIssues()).toEqual([])
  })

  it('reports the Amazing Race regression shape — token without ` years`', () => {
    makeShowWithTagline(tmp, 'amazing-race', {
      estYear: 2001,
      tagline:
        'a cross-continent route mechanic that has held its shape across {yearsWord} of starting lines.',
    })
    const issues = collectYearTokenPairingIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toMatch(/amazing-race\.md \(tagline\)/)
    expect(issues[0]?.message).toMatch(/\{yearsWord\} years/)
  })

  it('passes when {yearsWord} appears once unpaired but the same field also carries the paired form', () => {
    // Substring check — as long as the paired form occurs anywhere
    // in the field, the field is honored. A future authoring pass
    // that wants two clauses can keep the paired one elsewhere.
    makeShowWithTagline(tmp, 'survivor', {
      estYear: 2000,
      tagline:
        'spent {yearsWord} years rediscovering what it is — and {yearsWord} more ahead.',
    })
    expect(collectYearTokenPairingIssues()).toEqual([])
  })

  it('reports a card_tagline regression independently from tagline', () => {
    const file = path.join(tmp, 'shows', 'amazing-race.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: amazing-race
name: The Amazing Race
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: A blurb.
tagline: "Clean — no token here."
card_tagline: "across {yearsWord} of starting lines"
tier: A
network: "CBS"
est_year: 2001
genre_tag: "Travel competition"
featured: false
---
`,
    )
    const issues = collectYearTokenPairingIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toMatch(/amazing-race\.md \(card_tagline\)/)
  })
})

// Critique pass-27 LOW (issue #N): the /about page's example
// parenthetical quoted two illustrative themed-list titles
// (originally `"best premieres"` and `"best post-merge runs"`) —
// neither matched a real `content/themes/<slug>.md` `title`, so a
// reader following the example over to /themes found nothing by
// the quoted names. This invariant scopes to the paragraph(s)
// referencing `(/themes)`: any double-quoted phrase inside such
// a paragraph must match a real theme `title` exactly. The
// remaining quoted strings elsewhere in about.md (the voting-
// rationale example list: "filmed in Fiji" / "darker than usual"
// etc.) live in a different paragraph block that does NOT
// reference /themes, so they pass through unaffected.
function makeAboutWithBody(root: string, body: string): void {
  const file = path.join(root, 'legal', 'about.md')
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: about
title: About
description: About tiered.tv.
---

${body}
`,
  )
}

function makeThemeWithTitle(root: string, slug: string, title: string): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${title}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: "${slug}"
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: "b"
---
`,
  )
}

describe('content-check — /about example list-title fidelity (critique pass-27)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-about-titles-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes when the /themes paragraph quotes real theme titles verbatim', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeThemeWithTitle(tmp, 'back-half', 'The back-half at full volume')
    makeAboutWithBody(
      tmp,
      `Or skim the [themed lists](/themes) for cross-show patterns ("Premieres that earned it", "The back-half at full volume", etc.).`,
    )
    expect(collectAboutListTitleQuoteIssues()).toEqual([])
  })

  it('reports the pass-27 regression shape — quoted titles that match no real theme', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeAboutWithBody(
      tmp,
      `Or skim the [themed lists](/themes) for cross-show patterns ("best premieres", "best post-merge runs", etc.).`,
    )
    const issues = collectAboutListTitleQuoteIssues()
    expect(issues.length).toBe(2)
    expect(issues.every((i) => i.file === 'content/legal/about.md')).toBe(true)
    expect(issues[0]?.message).toMatch(/"best premieres"/)
    expect(issues[1]?.message).toMatch(/"best post-merge runs"/)
    expect(issues[0]?.message).toMatch(/Premieres that earned it/)
  })

  it('ignores quoted strings in paragraphs that do not reference /themes (voting-rationale examples)', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeAboutWithBody(
      tmp,
      `Or skim the [themed lists](/themes) for cross-show patterns ("Premieres that earned it", etc.).

A different paragraph entirely. Reasons people cite when voting:

- Format changes ("the season was shortened")
- Casting energy ("the cast had great chemistry")
- Location ("filmed in Fiji")`,
    )
    expect(collectAboutListTitleQuoteIssues()).toEqual([])
  })

  it('passes when about.md never references /themes (the link was removed entirely)', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeAboutWithBody(
      tmp,
      `A page with no /themes link at all. Quoted phrases here like "anything goes" should pass through because the scoping needle is absent.`,
    )
    expect(collectAboutListTitleQuoteIssues()).toEqual([])
  })

  it('passes when about.md is missing (no-op rather than crash)', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    // Deliberately do NOT create about.md — the helper must
    // tolerate absence rather than throw.
    expect(collectAboutListTitleQuoteIssues()).toEqual([])
  })

  it('tolerates a quoted title wrapped across a markdown line break (whitespace collapse)', () => {
    // The authored markdown wraps mid-quote — what the reader sees
    // once markdown joins the lines is the single-spaced title.
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeThemeWithTitle(tmp, 'back-half', 'The back-half at full volume')
    makeAboutWithBody(
      tmp,
      `Or skim the [themed lists](/themes) for cross-show patterns ("Premieres that earned it", "The back-half
at full volume", etc.).`,
    )
    expect(collectAboutListTitleQuoteIssues()).toEqual([])
  })

  it('reports a drift even when one of several quotes is real (bidirectional partial-match guard)', () => {
    makeThemeWithTitle(tmp, 'best-premieres', 'Premieres that earned it')
    makeAboutWithBody(
      tmp,
      `Or skim the [themed lists](/themes) for cross-show patterns ("Premieres that earned it", "ghost-title that no theme carries", etc.).`,
    )
    const issues = collectAboutListTitleQuoteIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.message).toMatch(/"ghost-title that no theme carries"/)
  })
})

// Critique pass-12 HIGH: the templated trailing clause invariant
// (issue #187). After the rewrite drained every offender, the
// invariant ships strict at floor 0 — any show whose tagline closes
// on "Ranked without <verb> a single <noun>." regresses the catalog
// back to the fill-in-the-blank shape pass-12 caught.
function makeShowWithRawTagline(root: string, slug: string, tagline: string): void {
  const file = path.join(root, 'shows', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: A blurb.
tagline: ${JSON.stringify(tagline)}
tier: B
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
  )
}

describe('content-check — templated tagline tail (critique pass-12)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-tagline-tail-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags a tagline that closes on the templated "Ranked without spoiling a single X." clause', () => {
    makeShowWithRawTagline(
      tmp,
      'alpha',
      'Two sentences of editorial setup. Ranked without spoiling a single crowning.',
    )
    const issues = collectTaglineTemplatedTailIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/shows/alpha.md (tagline)')
    expect(issues[0]?.message).toMatch(/templated trailing clause/i)
  })

  it('flags every offender shape pass-12 named — spoiling / ruining / naming / giving away', () => {
    makeShowWithRawTagline(
      tmp,
      'spoiling',
      'Editorial setup. Ranked without spoiling a single hometown.',
    )
    makeShowWithRawTagline(
      tmp,
      'ruining',
      'Editorial setup. Ranked without ruining a single eviction.',
    )
    makeShowWithRawTagline(
      tmp,
      'naming',
      'Editorial setup. Ranked without naming a single traitor.',
    )
    makeShowWithRawTagline(
      tmp,
      'givingaway',
      'Editorial setup. Ranked without giving away a single final rose.',
    )
    const issues = collectTaglineTemplatedTailIssues()
    expect(issues.length).toBe(4)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/shows/givingaway.md (tagline)',
      'content/shows/naming.md (tagline)',
      'content/shows/ruining.md (tagline)',
      'content/shows/spoiling.md (tagline)',
    ])
  })

  it('flags multi-word noun phrases ("a single final couple", "a single Star Baker", "a single finale collection")', () => {
    makeShowWithRawTagline(
      tmp,
      'two-noun',
      'Editorial setup. Ranked without spoiling a single final couple.',
    )
    makeShowWithRawTagline(
      tmp,
      'proper-noun',
      'Editorial setup. Ranked without spoiling a single Star Baker.',
    )
    makeShowWithRawTagline(
      tmp,
      'compound-noun',
      'Editorial setup. Ranked without spoiling a single finale collection.',
    )
    const issues = collectTaglineTemplatedTailIssues()
    expect(issues.length).toBe(3)
  })

  it('passes a tagline that closes on its own editorial observation (no templated tail)', () => {
    makeShowWithRawTagline(
      tmp,
      'clean',
      "21 seasons. The flip-the-script sibling that turned out to be its own show — warmer, sharper, and more willing to let the lead drive.",
    )
    expect(collectTaglineTemplatedTailIssues()).toEqual([])
  })

  it('passes a tagline that uses a different "ranked" construction', () => {
    // A "Ranked by …" construction uses "ranked" but not the
    // templated "Ranked without <verb> a single <noun>." shape.
    // Must not be flagged. (Historical fixture — Top Chef's tagline
    // was rewritten in pass-21 to match A-tier sibling density and no
    // longer carries this exact closer; the synthetic fixture stays
    // here to pin the regex's behavior on non-templated "Ranked by"
    // constructions in case a future tagline reaches for the shape.)
    makeShowWithRawTagline(
      tmp,
      'top-chef-shape',
      '22 seasons of professional cooks in unfamiliar kitchens. Ranked by people who actually liked the food.',
    )
    expect(collectTaglineTemplatedTailIssues()).toEqual([])
  })

  it('passes a tagline that says "We have ranked every single one" (Survivor / Amazing Race shape)', () => {
    // Survivor closes on "We've ranked every single one." which
    // shares the word "single" with the offenders but is not the
    // template — must not be flagged.
    makeShowWithRawTagline(
      tmp,
      'survivor-shape',
      'Editorial setup. The genre that invented itself in episode one. We have ranked every single one.',
    )
    expect(collectTaglineTemplatedTailIssues()).toEqual([])
  })

  it('reports the live catalog at zero offenders (rewrite drained every show in this tick)', () => {
    // The production content tree is the source of truth — when this
    // test runs with the default content root (no setContentRoot
    // override), the live catalog must read zero. Pins the
    // post-rewrite state so a future authoring pass cannot regress
    // any of the ten rewritten shows back into the template.
    setContentRoot(null)
    __resetContentCache()
    expect(collectTaglineTemplatedTailIssues()).toEqual([])
  })

  it('handles taglines with multiple sentences before the tail', () => {
    makeShowWithRawTagline(
      tmp,
      'three-sentences',
      'First sentence here. Second editorial observation lands. Ranked without spoiling a single elimination.',
    )
    const issues = collectTaglineTemplatedTailIssues()
    expect(issues.length).toBe(1)
  })
})

// Critique pass-12 MED finding (issue #191). Pins the
// `collectThemeDescriptionCountTailIssues` invariant so a future
// authoring pass cannot regress the catalog into the count-of-shows
// template the rewrite just drained.
function makeThemeWithRawDescription(
  root: string,
  slug: string,
  description: string,
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: ${JSON.stringify(description)}
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: "b"
---
`,
  )
}

describe('content-check — themed-list description count-of-shows tail (critique pass-12, issue #191)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-theme-count-tail-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags a description that closes on "across <N> different franchises."', () => {
    makeThemeWithRawDescription(
      tmp,
      'best-premieres',
      'First episodes that told you what the show was. The format statement, the cast read — all in one hour, across six different franchises.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/themes/best-premieres.md (description)')
    expect(issues[0]?.message).toMatch(/count-of-shows tail/i)
  })

  it('flags the variant without "different" — "across <N> franchises"', () => {
    makeThemeWithRawDescription(
      tmp,
      'best-post-merge',
      'The late-game stretch where pressure spikes. Across five franchises, these are the back-half runs that play at full volume.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
  })

  it('flags "across <N> shows" as well as "across <N> franchises"', () => {
    makeThemeWithRawDescription(
      tmp,
      'best-finales',
      'Closing runs that pay off the season they spent a dozen episodes building, across six shows.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
  })

  it('flags the punch-list construction — "<N> shows, <M> [thing-noun]"', () => {
    makeThemeWithRawDescription(
      tmp,
      'best-finales',
      'Closing runs that pay off the season they spent a dozen episodes building — six shows, seven landings.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
  })

  it('flags the possessive variant — "<N> shows\' worth"', () => {
    makeThemeWithRawDescription(
      tmp,
      'best-newbie-casts',
      "Confident, prepared, fully formed on arrival — six shows' worth of rookie rosters.",
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
  })

  it('flags every offender shape pass-12 named in one pass', () => {
    makeThemeWithRawDescription(
      tmp,
      'a-shape',
      'Editorial setup. The story across six different franchises.',
    )
    makeThemeWithRawDescription(
      tmp,
      'b-shape',
      'Editorial setup. Five shows, one premise landed.',
    )
    makeThemeWithRawDescription(
      tmp,
      'c-shape',
      "Editorial setup. Five shows' worth of rookies.",
    )
    makeThemeWithRawDescription(
      tmp,
      'd-shape',
      'Editorial setup. Across six franchises, the texture lands.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(4)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/a-shape.md (description)',
      'content/themes/b-shape.md (description)',
      'content/themes/c-shape.md (description)',
      'content/themes/d-shape.md (description)',
    ])
  })

  it('passes a description that closes on its own editorial observation (no count tail)', () => {
    makeThemeWithRawDescription(
      tmp,
      'clean',
      'First episodes that told you exactly what the show was. The format statement, the cast read, the structural swing — all in one hour, all on purpose.',
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('passes the named-shows construction (best-reunion-specials shape)', () => {
    // The reunion-specials description names the participating
    // shows explicitly ("done well across Survivor, Drag Race, The
    // Challenge, Top Chef, and The Traitors") — that's editorial
    // texture, not the count-of-shows tail. Must not be flagged.
    makeThemeWithRawDescription(
      tmp,
      'best-reunion-specials',
      'The reunion hour as a craft job — done well across Survivor, Drag Race, The Challenge, Top Chef, and The Traitors.',
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('passes the "<N> seasons" construction (survivor-pillars shape)', () => {
    // survivor-pillars closes on "Four seasons that define the
    // show's eras" — counts seasons, not shows/franchises; that's
    // a legitimate construction the invariant must not catch.
    makeThemeWithRawDescription(
      tmp,
      'survivor-pillars',
      "Four seasons that define the show's eras — the original experiment, the tactical era's apex, the post-pandemic reset, and the steady-state new normal.",
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('reports the live catalog at zero offenders (rewrite drained every theme in this tick)', () => {
    // The production content tree is the source of truth — when
    // this test runs with the default content root (no
    // setContentRoot override), the live catalog must read zero.
    // Pins the post-rewrite state so a future authoring pass
    // cannot regress any of the rewritten themes back into the
    // template.
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })
})

// Critique pass-13 MED follow-up to issue #191: the same count-of-
// shows tail surfaced on the `tagline` field (the body-hero copy on
// `/themes/<theme>`) across six themed-list files the pass-12
// description-drain didn't cover. The scan now checks both fields;
// the helper emits one issue per offending field. These tests pin
// the tagline branch of the scan so a future authoring pass cannot
// regress the catalog into the count template via the second field.
function makeThemeWithRawTagline(
  root: string,
  slug: string,
  tagline: string,
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: ${JSON.stringify(tagline)}
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-27
featured: false
description: "Editorial setup that closes on its own observation."
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: "b"
---
`,
  )
}

describe('content-check — themed-list tagline count-of-shows tail (critique pass-13 follow-up to issue #191)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-theme-tagline-tail-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags a tagline that closes on "across <N> different franchises."', () => {
    makeThemeWithRawTagline(
      tmp,
      'best-finales',
      'The closing run is where a season pays off its promise. These finales <b>land the season they were always making</b> — texture intact, stakes earned, across six different franchises.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/themes/best-finales.md (tagline)')
    expect(issues[0]?.message).toMatch(/count-of-shows tail/i)
  })

  it('flags the opener-position variant — "Across <N> franchises, ..."', () => {
    makeThemeWithRawTagline(
      tmp,
      'best-newbie-casts',
      "Some first-time casts step off the boat playing like they've already done this. Across six franchises, these are the rookie rosters that <b>walked in fluent</b>.",
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/themes/best-newbie-casts.md (tagline)')
  })

  it('flags "across <N> shows" as well as "across <N> franchises"', () => {
    makeThemeWithRawTagline(
      tmp,
      'best-premieres',
      'Premieres get cited the wrong way. These are the first episodes that <b>told you what the show was actually doing</b>, across six shows.',
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe('content/themes/best-premieres.md (tagline)')
  })

  it('emits two issues when both fields carry the count tail', () => {
    // Single theme with the count construction in both the
    // tagline and the description. The scan emits one issue per
    // offending field so a future drain catches both in a single
    // pass.
    const file = path.join(tmp, 'themes', 'two-fielder.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: two-fielder
title: "Two-fielder"
tagline: "Editorial setup. These are the seasons where the <b>shape held</b>, across six different franchises."
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-27
featured: false
description: "Editorial setup, across five different franchises."
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: "b"
---
`,
    )
    const issues = collectThemeDescriptionCountTailIssues()
    expect(issues.length).toBe(2)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/two-fielder.md (description)',
      'content/themes/two-fielder.md (tagline)',
    ])
  })

  it('passes a tagline that closes on its own editorial observation (no count tail)', () => {
    makeThemeWithRawTagline(
      tmp,
      'clean',
      "All-returnee casts are easy to pitch and hard to land. These are the ones where the roster, the framing, and the format <b>added up to something the show couldn't have made with newbies</b>.",
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('passes the named-shows construction in a tagline (best-reunion-specials shape)', () => {
    // The reunion-specials tagline names the participating
    // franchises explicitly. Editorial texture, not the
    // count-of-shows tail.
    makeThemeWithRawTagline(
      tmp,
      'best-reunion-specials',
      "Every competition franchise has a closing hour to land — Survivor's reunion, Drag Race's Reunited, The Challenge's reunion special, Top Chef's reunion episode. These are the ones where that hour <b>read the season back to itself</b>.",
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('passes the "<N> seasons" construction in a tagline (survivor-pillars shape)', () => {
    // survivor-pillars closes on "Four seasons that hold the show
    // up" — counts seasons, not shows/franchises.
    makeThemeWithRawTagline(
      tmp,
      'survivor-pillars',
      'Four seasons that hold the show up: the original experiment, the tactical era apex, the post-pandemic reset, and the steady-state new normal. <b>Pull any one of them out and the canon falls over.</b>',
    )
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })

  it('reports the live catalog at zero offenders across both fields (rewrite drained every tagline in this tick)', () => {
    // The production content tree is the source of truth — when
    // this test runs with the default content root, the live
    // catalog must read zero across the union of description AND
    // tagline scans. Pins the post-rewrite state.
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeDescriptionCountTailIssues()).toEqual([])
  })
})

// Critique pass-13 MED finding (Survivor S40 Winners at War twist
// names on /themes/best-finales). Pins the
// `collectThemedEntrySpoilerIssues` invariant so a future authoring
// pass cannot regress a themed-list entry blurb back into naming
// season-specific twist mechanics — spoiler discipline is P0 per
// CLAUDE.md.
function makeThemeWithRawEntryBlurb(
  root: string,
  slug: string,
  entryBlurb: string,
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: "Editorial setup that closes on its own observation."
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: ${JSON.stringify(entryBlurb)}
---
`,
  )
}

describe('content-check — themed-list entry-blurb spoiler names (critique pass-13)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-themed-entry-spoiler-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags an entry blurb that names "Edge of Extinction"', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'best-finales',
      'The closing run lands. Edge of Extinction reshapes the home stretch, and the final tribal carries the weight of a roster that has played this game before.',
    )
    const issues = collectThemedEntrySpoilerIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.file).toBe(
      'content/themes/best-finales.md (entry #1 blurb)',
    )
    expect(issues[0]?.message).toMatch(/Edge of Extinction/)
    expect(issues[0]?.message).toMatch(/no spoilers/i)
  })

  it('flags an entry blurb that names "fire-token economy"', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'best-finales',
      'The fire-token economy compresses into real currency by the final tribal.',
    )
    const issues = collectThemedEntrySpoilerIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.message).toMatch(/fire token/)
  })

  it('flags the singular "fire token" and plural "fire tokens" forms', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      'A fire token changes hands at the right moment.',
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      'Fire tokens compress into real currency.',
    )
    const issues = collectThemedEntrySpoilerIssues()
    expect(issues.length).toBe(2)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/a-shape.md (entry #1 blurb)',
      'content/themes/b-shape.md (entry #1 blurb)',
    ])
  })

  it('flags "Redemption Island" (paired returnee mechanic)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'best-returnees',
      'Redemption Island reshapes the home stretch on this season.',
    )
    const issues = collectThemedEntrySpoilerIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]?.message).toMatch(/Redemption Island/)
  })

  it('case-insensitive matching catches lower-cased twist names', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'best-finales',
      'edge of extinction reshapes the home stretch.',
    )
    const issues = collectThemedEntrySpoilerIssues()
    expect(issues.length).toBe(1)
  })

  it('passes a blurb that lands the closing-run quality without naming a twist mechanic', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'best-finales',
      "The milestone framing earns itself in the closing run. Every move lands heavier than it would in another season's room, and the final tribal carries the weight of a roster that has played this game before.",
    )
    expect(collectThemedEntrySpoilerIssues()).toEqual([])
  })

  it('does not false-positive on incidental words ("edge of the table", "tokens" alone)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      'The crew sits on the edge of the table awaiting the verdict.',
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      'The cast burned through their immunity tokens of trust by the merge.',
    )
    expect(collectThemedEntrySpoilerIssues()).toEqual([])
  })

  it('reports zero offenders against multiple clean entries on one theme', () => {
    const file = path.join(tmp, 'themes', 'clean-theme.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: clean-theme
title: "Clean theme"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: "A clean editorial sentence."
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t1"
    blurb: "A blurb that lands without naming any twist mechanic."
  - show: alpha
    season: 2
    rank: 2
    title: "t2"
    blurb: "A second blurb that closes on its own editorial observation."
---
`,
    )
    expect(collectThemedEntrySpoilerIssues()).toEqual([])
  })

  it('reports the live catalog at zero offenders (Winners at War blurb rewrite drained the only known offender)', () => {
    // The production content tree is the source of truth — when
    // this test runs with the default content root (no
    // setContentRoot override), the live catalog must read zero.
    // Pins the post-rewrite state so a future authoring pass
    // cannot regress a themed-list entry blurb back into naming
    // a canonical twist mechanic.
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemedEntrySpoilerIssues()).toEqual([])
  })
})

describe('content-check — cliche repetition (critique pass-25, issue #280)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-cliche-repetition-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite the phrase appears once on the HvV pull)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('passes at threshold (3 occurrences)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every later season measures itself against this one.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "The franchise's later runs are still measured against.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The bar every all-star season measures itself against.",
    )
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('flags every occurrence when count exceeds the threshold', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every later season measures itself against this one.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "The franchise's later runs are still measured against.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The bar every all-star season measures itself against.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'd-shape',
      "The reference point every later run gets measured against.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(4)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/a-shape.md (entry #1 blurb)',
      'content/themes/b-shape.md (entry #1 blurb)',
      'content/themes/c-shape.md (entry #1 blurb)',
      'content/themes/d-shape.md (entry #1 blurb)',
    ])
    for (const issue of issues) {
      expect(issue.message).toMatch(/cliche-repetition drift/)
      expect(issue.message).toMatch(/measures\/measured against/)
      expect(issue.message).toMatch(/appears 4 times/)
    }
  })

  it('counts multiple hits inside a single field', () => {
    // One theme entry can carry two hits — the threshold is
    // measured cross-corpus, not cross-file, so a single field
    // with four hits still flips the gate.
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every later season measures itself against this one, the bar later runs measure against, the reference everything gets measured against, the season the franchise measures itself against.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(4)
    expect(
      issues.every(
        (i) => i.file === 'content/themes/a-shape.md (entry #1 blurb)',
      ),
    ).toBe(true)
  })

  it('catches every form (measures itself against, measured against, measure against)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every later season measures itself against this one.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "The franchise's later runs are still measured against.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The bar later back-half runs measure against the template.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'd-shape',
      "Every later season measures against this one's template.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(4)
  })

  it('is case-insensitive', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every later season MEASURES ITSELF AGAINST this one.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "The franchise's later runs are still Measured Against.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The bar later runs measure against the template.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'd-shape',
      "Every later season measures itself against this one.",
    )
    expect(collectClicheRepetitionIssues().length).toBe(4)
  })

  it('does not false-positive on incidental words ("the measure of the room", "measured response")', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The cast takes the measure of the room across the first three episodes.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A measured response from the host carries every cocktail party.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "Every later season measures itself against this one and earns its slot on craft.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'd-shape',
      "A different editorial closer that stays plain without reaching for cliche.",
    )
    // 1 hit < threshold 3 → zero issues.
    expect(collectClicheRepetitionIssues()).toEqual([])
  })
})

describe('content-check — cliche repetition: "at full volume" (critique pass-29, issue #301)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-cliche-full-volume-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite the walked surfaces carry zero hits)', () => {
    // The off-corpus surfaces — content/themes/best-post-merge.md
    // `title:` field (load-bearing themed-list title) and
    // content/legal/about.md's quote of that title (required by
    // collectAboutListTitleQuoteIssues) — sit outside this scanner's
    // source set, so post-rewrite the walked count is zero.
    setContentRoot(null)
    __resetContentCache()
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('passes at threshold (2 occurrences across themed-list entry blurbs)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame plays at full volume — every conversation freighted with everything.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A returnee house playing its late rounds at full volume.",
    )
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('flags every occurrence when count exceeds the threshold', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame plays at full volume — every conversation freighted with everything.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A returnee house playing its late rounds at full volume.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The edit lets every confrontation play at full volume.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(3)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/a-shape.md (entry #1 blurb)',
      'content/themes/b-shape.md (entry #1 blurb)',
      'content/themes/c-shape.md (entry #1 blurb)',
    ])
    for (const issue of issues) {
      expect(issue.message).toMatch(/cliche-repetition drift/)
      expect(issue.message).toMatch(/at full volume/)
      expect(issue.message).toMatch(/appears 3 times/)
    }
  })

  it('counts multiple hits inside a single field', () => {
    // One theme entry carrying three hits flips the gate at threshold 2.
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame plays at full volume, the post-merge runs at full volume, and the finale lands at full volume.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(3)
    expect(
      issues.every(
        (i) => i.file === 'content/themes/a-shape.md (entry #1 blurb)',
      ),
    ).toBe(true)
  })

  it('is case-insensitive', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame plays AT FULL VOLUME across every conversation.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A returnee house playing its late rounds At Full Volume.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The edit lets every confrontation play at full volume.",
    )
    expect(collectClicheRepetitionIssues().length).toBe(3)
  })

  it('does not false-positive on incidental words ("at full size", "loud volume")', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Twenty former champions taking the season to its full size.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A loud volume of confessional moments across the post-merge run.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "The endgame plays at full volume across every conversation.",
    )
    // 1 hit < threshold 2 → zero issues.
    expect(collectClicheRepetitionIssues()).toEqual([])
  })
})

describe('content-check — cliche repetition: "freighted" (critique pass-30, issue #302)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-cliche-freighted-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite the walked surfaces sit at threshold)', () => {
    // /themes/best-finales entry #02 (Survivor S20 HvV) keeps a
    // single occurrence; entry #05 (Traitors S02) was rewritten to
    // drop the participial intensifier. Walked count is 1, under
    // the threshold of 2.
    setContentRoot(null)
    __resetContentCache()
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('passes at threshold (2 occurrences across themed-list entry blurbs)', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame compounds — every conversation freighted with everything the season had been.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "Paranoia compounding, every banishment freighted, the table smaller each night.",
    )
    expect(collectClicheRepetitionIssues()).toEqual([])
  })

  it('flags every occurrence when count exceeds the threshold', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The endgame compounds — every conversation freighted with everything the season had been.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "Paranoia compounding, every banishment freighted, the table smaller each night.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "Every cooking decision freighted with the stakes of the season.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(3)
    expect(issues.map((i) => i.file).sort()).toEqual([
      'content/themes/a-shape.md (entry #1 blurb)',
      'content/themes/b-shape.md (entry #1 blurb)',
      'content/themes/c-shape.md (entry #1 blurb)',
    ])
    for (const issue of issues) {
      expect(issue.message).toMatch(/cliche-repetition drift/)
      expect(issue.message).toMatch(/freighted/)
      expect(issue.message).toMatch(/appears 3 times/)
    }
  })

  it('counts multiple hits inside a single field', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every conversation freighted, every move freighted, every banishment freighted with the weight of the season.",
    )
    const issues = collectClicheRepetitionIssues()
    expect(issues.length).toBe(3)
    expect(
      issues.every(
        (i) => i.file === 'content/themes/a-shape.md (entry #1 blurb)',
      ),
    ).toBe(true)
  })

  it('is case-insensitive', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "Every conversation FREIGHTED with the weight of the season.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "Every banishment Freighted, the table smaller each night.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "Every cooking decision freighted with stakes.",
    )
    expect(collectClicheRepetitionIssues().length).toBe(3)
  })

  it('does not false-positive on incidental words ("freight", "fraught")', () => {
    makeThemeWithRawEntryBlurb(
      tmp,
      'a-shape',
      "The freight of an all-returnee roster carries the closing run.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'b-shape',
      "A fraught endgame plays out across the merge.",
    )
    makeThemeWithRawEntryBlurb(
      tmp,
      'c-shape',
      "Every conversation freighted with the weight of the season.",
    )
    // 1 hit < threshold 2 → zero issues. "freight" + "fraught" are
    // unrelated lexemes — the \b-anchored regex must not catch
    // either.
    expect(collectClicheRepetitionIssues()).toEqual([])
  })
})

function makeMultiEntryTheme(
  root: string,
  slug: string,
  opts: {
    category?: string
    tagline?: string
    entries: { title: string; blurb: string }[]
  },
): void {
  const file = path.join(root, 'themes', `${slug}.md`)
  mkdirSync(path.dirname(file), { recursive: true })
  const entryYaml = opts.entries
    .map(
      (e, i) =>
        `  - show: alpha\n    season: ${i + 1}\n    rank: ${i + 1}\n    title: ${JSON.stringify(e.title)}\n    blurb: ${JSON.stringify(e.blurb)}`,
    )
    .join('\n')
  writeFileSync(
    file,
    `---
slug: ${slug}
title: "${slug}"
tagline: ${JSON.stringify(opts.tagline ?? 'tag')}
category: ${opts.category ?? 'tone'}
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-05-19
featured: false
description: "Editorial setup that closes on its own observation."
entries:
${entryYaml}
---
`,
  )
}

describe('content-check — themed-list body-copy phrase repetition (critique pass-28, issue #297)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-themed-phrase-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite, best-finales sits at 2 of 7 entries on `closing run`)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeBodyPhraseRepetitionIssues()).toEqual([])
  })

  it('flags a 7-entry list where a noun phrase appears in 5 of 7 entries', () => {
    makeMultiEntryTheme(tmp, 'templated', {
      entries: [
        {
          title: 'A final leg that proves the closing run is built right.',
          blurb: 'The closing run is where this season turns a cult favorite into a network anchor.',
        },
        {
          title: 'Returnees playing the back half at full volume.',
          blurb: 'The endgame plays at full volume — every conversation freighted with everything.',
        },
        {
          title: 'The deepest knife-skill cast carries the kitchen all the way home.',
          blurb: 'Las Vegas runs the most technically loaded roster and the closing run never lets the level drop.',
        },
        {
          title: 'Twenty former champions taking the season to its full size.',
          blurb: 'The milestone framing earns itself in the closing run.',
        },
        {
          title: 'The Round Table tightening into the closing run the format was built for.',
          blurb: 'The breakout season runs its endgame the way the format promised.',
        },
        {
          title: 'A finale built on real artistry.',
          blurb: 'The closing run lands a season whose cultural footprint outgrew its airing.',
        },
        {
          title: 'The endgame where the modern alliance game finally takes itself seriously.',
          blurb: 'The summer rewards the alliance play the season spent building.',
        },
      ],
    })
    const issues = collectThemeBodyPhraseRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/themes/templated.md')
    expect(issues[0]!.message).toMatch(/"closing run"/)
    expect(issues[0]!.message).toMatch(/5 of 7 entries/)
  })

  it('passes a 7-entry list where the load-bearing phrase sits at the threshold floor (3 of 7)', () => {
    makeMultiEntryTheme(tmp, 'edge-case', {
      tagline: 'The closing run is where a season either pays off its promise.',
      entries: [
        {
          title: 'A final leg that proves the format is built right.',
          blurb: 'The Race always ends on a live sprint, racing hard into the last pit stop.',
        },
        {
          title: 'Returnees playing the back half at full volume.',
          blurb: 'The endgame plays at full volume — every conversation freighted.',
        },
        {
          title: 'The deepest knife-skill cast carries the kitchen all the way home.',
          blurb: 'Las Vegas runs the most technically loaded roster and the closing run never drops.',
        },
        {
          title: 'Twenty former champions taking the season to its full size.',
          blurb: 'The milestone framing earns itself in the closing run.',
        },
        {
          title: 'The Round Table tightening into the final banishment.',
          blurb: 'The breakout season runs its endgame the way the format promised.',
        },
        {
          title: 'A final lip-sync that pays off a finale built on artistry.',
          blurb: 'The crown coronation lands a season whose cultural footprint outgrew its airing.',
        },
        {
          title: 'The endgame where the modern alliance game finally takes itself seriously.',
          blurb: 'A closing run sharp enough to hold against every era that followed it.',
        },
      ],
    })
    expect(collectThemeBodyPhraseRepetitionIssues()).toEqual([])
  })

  it('counts the phrase against an entry iff its title OR blurb contains it', () => {
    makeMultiEntryTheme(tmp, 'split', {
      entries: [
        { title: 'A closing run that opens the season.', blurb: 'b' },
        { title: 'second title', blurb: 'A closing run that does the work.' },
        { title: 'A closing run again.', blurb: 'b' },
        { title: 'A closing run carries the cast.', blurb: 'b' },
        { title: 'no phrase here', blurb: 'no phrase here either' },
      ],
    })
    const issues = collectThemeBodyPhraseRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"closing run"/)
    expect(issues[0]!.message).toMatch(/4 of 5 entries/)
  })

  it('exempts `category: single` (intra-canon) lists where show-name refs naturally repeat', () => {
    makeMultiEntryTheme(tmp, 'pillars', {
      category: 'single',
      entries: [
        { title: 'A pillar season.', blurb: 'Survivor returnees define the era.' },
        { title: 'Another pillar.', blurb: 'Survivor returnees set the bar.' },
        { title: 'A third pillar.', blurb: 'Survivor returnees raise the stakes.' },
        { title: 'A fourth pillar.', blurb: 'Survivor returnees prove the format.' },
        { title: 'A fifth pillar.', blurb: 'Survivor returnees pay it forward.' },
      ],
    })
    expect(collectThemeBodyPhraseRepetitionIssues()).toEqual([])
  })

  it('skips lists with fewer than 5 entries (statistical floor)', () => {
    makeMultiEntryTheme(tmp, 'tiny', {
      entries: [
        { title: 'A closing run that opens.', blurb: 'b' },
        { title: 'A closing run that drives.', blurb: 'b' },
        { title: 'A closing run that lands.', blurb: 'b' },
        { title: 'A closing run that ends.', blurb: 'b' },
      ],
    })
    expect(collectThemeBodyPhraseRepetitionIssues()).toEqual([])
  })

  it('ignores stopword-only bigrams (the / of / and / etc.)', () => {
    makeMultiEntryTheme(tmp, 'stopwords', {
      entries: [
        { title: 'and the end of the season', blurb: 'the season ends here' },
        { title: 'in the end the season', blurb: 'the cast at the end' },
        { title: 'at the end of season', blurb: 'and the season is the end' },
        { title: 'on the end of season', blurb: 'and the end the cast' },
        { title: 'by the end of season', blurb: 'the end and the cast' },
      ],
    })
    // No content-bearing bigram crosses the 50% floor; "the end"
    // is filtered as a stopword-leading bigram.
    expect(collectThemeBodyPhraseRepetitionIssues()).toEqual([])
  })

  it('is case-insensitive', () => {
    makeMultiEntryTheme(tmp, 'mixed-case', {
      entries: [
        { title: 'A CLOSING RUN that opens.', blurb: 'b' },
        { title: 'A Closing Run that drives.', blurb: 'b' },
        { title: 'a closing run that lands.', blurb: 'b' },
        { title: 'A closing Run that ends.', blurb: 'b' },
        { title: 'no phrase', blurb: 'no phrase' },
      ],
    })
    const issues = collectThemeBodyPhraseRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"closing run"/)
  })
})

describe('content-check — themed-list synonym-cluster repetition (critique pass-36, issue #337)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-synonym-cluster-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite, best-finales sits at 2 of 7 entries on the `finale` synonym cluster)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })

  it('flags the pre-rewrite best-finales shape (5 of 7 entries reaching for `endgame` / `closing run`)', () => {
    makeMultiEntryTheme(tmp, 'cluster-trigger', {
      entries: [
        {
          title: 'A clean opener that does not reach for the cluster.',
          blurb: 'The Race always ends on a foot race to the mat, racing hard into the last pit stop.',
        },
        {
          title: 'A title that does not name the cluster.',
          blurb: 'The endgame compounds — every conversation freighted with everything the show had been by 2010.',
        },
        {
          title: 'A title that names something else.',
          blurb: 'Restaurant Wars takes the season into its endgame on a kitchen split, and the cooking never drops.',
        },
        {
          title: 'Twenty former champions taking the season to its full size.',
          blurb: 'The all-winner premise pays back in the closing run. Every move lands heavier than another season.',
        },
        {
          title: 'The Round Table tightening into the final banishment.',
          blurb: 'The breakout season runs its endgame the way the format always promised — paranoia compounding.',
        },
        {
          title: 'A finale built on craft and real artistry.',
          blurb: 'Season 6 spends its run building toward a finale of working drag artists.',
        },
        {
          title: 'The era where the modern alliance game finally takes itself seriously.',
          blurb: 'The closing run rewards the alliance play the summer spent building.',
        },
      ],
    })
    const issues = collectThemeSynonymClusterIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/themes/cluster-trigger.md')
    expect(issues[0]!.message).toMatch(/"finale" cluster/)
    expect(issues[0]!.message).toMatch(/5 of 7 entries/)
    expect(issues[0]!.message).toMatch(/#2, #3, #4, #5, #7/)
  })

  it('passes when the cluster sits at the floor (2 of 7 hits, below the strict floor of 3)', () => {
    makeMultiEntryTheme(tmp, 'cluster-under-floor', {
      entries: [
        {
          title: 'A title that names something else.',
          blurb: 'Restaurant Wars takes the season into its endgame on a kitchen split, and the cooking never drops.',
        },
        {
          title: 'The era where the modern alliance game finally takes itself seriously.',
          blurb: 'The closing run rewards the alliance play the summer spent building.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
        { title: 'fifth title', blurb: 'A fifth sentence on a different angle.' },
      ],
    })
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })

  it('exempts `category: single` (intra-canon) lists', () => {
    makeMultiEntryTheme(tmp, 'pillars-cluster', {
      category: 'single',
      entries: [
        { title: 'A pillar that names the endgame.', blurb: 'The endgame defines the era.' },
        { title: 'Another pillar.', blurb: 'The closing run sets the bar.' },
        { title: 'A third pillar.', blurb: 'A last act raises the stakes.' },
        { title: 'A fourth pillar.', blurb: 'The final stretch proves the format.' },
        { title: 'A fifth pillar.', blurb: 'The endgame pays it forward.' },
      ],
    })
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })

  it('skips lists with fewer than 5 entries', () => {
    makeMultiEntryTheme(tmp, 'tiny-cluster', {
      entries: [
        { title: 'A title.', blurb: 'The endgame compounds.' },
        { title: 'Another title.', blurb: 'A closing run lands.' },
        { title: 'A third title.', blurb: 'The last act pays off.' },
        { title: 'A fourth title.', blurb: 'The final stretch holds.' },
      ],
    })
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })

  it('counts each entry at most once per cluster even if multiple cluster phrases appear', () => {
    makeMultiEntryTheme(tmp, 'cluster-multi-hit', {
      entries: [
        {
          title: 'A title that names two cluster phrases.',
          blurb: 'The endgame compounds and the closing run pays back in one stretch.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })

  it('uses word-boundary matching (`endgames` does not match `endgame`)', () => {
    makeMultiEntryTheme(tmp, 'cluster-boundary', {
      entries: [
        {
          title: 'Where endgames historically diverge.',
          blurb: 'The body talks about endgames across the era, never naming a single one.',
        },
        {
          title: 'A second look at the same idea.',
          blurb: 'Across endgames, the same beat shows up again and again.',
        },
        {
          title: 'A third take.',
          blurb: 'Endgames have always been the proving ground for the format.',
        },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
        { title: 'fifth title', blurb: 'A fifth sentence on a different angle.' },
      ],
    })
    // `endgames` is a different word from `endgame`; \b-bounded match
    // must not catch the plural form.
    expect(collectThemeSynonymClusterIssues()).toEqual([])
  })
})

describe('content-check — themed-list deck-vs-body opener divergence (critique pass-33, issue #319)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-deck-body-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite — best-finales #03 + best-post-merge #1 drained)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeDeckBodyOpenerDivergenceIssues()).toEqual([])
  })

  it('flags an entry whose blurb opener shares a 3-token content sequence with the title', () => {
    makeMultiEntryTheme(tmp, 'trigram-match', {
      entries: [
        {
          title: 'Modern Survivor post-merge grammar gets written here.',
          blurb:
            'Cagayan keeps modern Survivor post-merge alive through every late tribal until the back-half plays like a final exam.',
        },
        { title: 'fine title', blurb: 'Fine sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    const issues = collectThemeDeckBodyOpenerDivergenceIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/themes/trigram-match.md (entry #1 blurb)',
    )
    expect(issues[0]!.message).toMatch(/3-token content sequence/)
    expect(issues[0]!.message).toMatch(/"modern survivor post-merge"/)
  })

  it('flags an entry whose blurb opener has >50% content-token overlap (>=2 shared) with the title', () => {
    makeMultiEntryTheme(tmp, 'overlap-match', {
      entries: [
        {
          title: 'Where modern Survivor post-merge grammar gets written.',
          blurb:
            'The post-merge is where the modern grammar finally consolidated for Survivor.',
        },
        { title: 'fine title', blurb: 'Fine sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    const issues = collectThemeDeckBodyOpenerDivergenceIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/content tokens with the title/)
    expect(issues[0]!.message).toMatch(/\(\d+%\)/)
  })

  it('passes a deck/body pair that shares only a single content token', () => {
    makeMultiEntryTheme(tmp, 'one-token', {
      entries: [
        {
          title: 'The deepest knife-skill cast carries the kitchen all the way home.',
          blurb:
            'Restaurant Wars takes the season into its endgame on a kitchen split, and the late-stage cooking never lets the level drop.',
        },
        { title: 'fine title', blurb: 'Fine sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    expect(collectThemeDeckBodyOpenerDivergenceIssues()).toEqual([])
  })

  it('only measures the first sentence of the blurb against the title', () => {
    // A trigram that lives in the SECOND sentence of the blurb must
    // not trip the check — the critique class is specifically about
    // the body OPENER restating the deck.
    makeMultiEntryTheme(tmp, 'second-sentence-safe', {
      entries: [
        {
          title: 'Modern Survivor post-merge grammar consolidates here.',
          blurb:
            'The endgame compounds tribal by tribal. Modern Survivor post-merge grammar consolidates across every late-round vote.',
        },
        { title: 'fine title', blurb: 'Fine sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    expect(collectThemeDeckBodyOpenerDivergenceIssues()).toEqual([])
  })

  it('exempts `category: single` (intra-canon) lists', () => {
    makeMultiEntryTheme(tmp, 'pillars', {
      category: 'single',
      entries: [
        {
          title: 'A jury-phase house where every eviction felt load-bearing.',
          blurb:
            'The jury-phase house keeps every eviction load-bearing across a roster of franchise veterans.',
        },
        { title: 'A second pillar.', blurb: 'A second pillar carries the era.' },
        { title: 'A third pillar.', blurb: 'A third pillar raises the bar.' },
        { title: 'A fourth pillar.', blurb: 'A fourth pillar locks the format.' },
        { title: 'A fifth pillar.', blurb: 'A fifth pillar pays it forward.' },
      ],
    })
    expect(collectThemeDeckBodyOpenerDivergenceIssues()).toEqual([])
  })

  it('is case-insensitive on the trigram match', () => {
    makeMultiEntryTheme(tmp, 'case', {
      entries: [
        {
          title: 'MODERN survivor POST-MERGE grammar gets WRITTEN here.',
          blurb:
            'Cagayan keeps modern Survivor post-merge alive through every late tribal.',
        },
        { title: 'fine title', blurb: 'Fine sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
        { title: 'third title', blurb: 'A third sentence with no overlap whatsoever.' },
        { title: 'fourth title', blurb: 'A fourth sentence about a different point.' },
      ],
    })
    const issues = collectThemeDeckBodyOpenerDivergenceIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/3-token content sequence/)
    expect(issues[0]!.message).toMatch(/"modern survivor post-merge"/)
  })
})

describe('content-check — themed-list within-entry headline/body echo (critique pass-38, issue #341)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-headline-body-echo-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags an entry whose title and blurb share a verbatim content bigram (the pre-rewrite #05 shape)', () => {
    makeMultiEntryTheme(tmp, 'best-finales-shape', {
      entries: [
        {
          title:
            'The Round Table tightening into the final banishment the format was built for.',
          blurb:
            'Each Round Table tightens the math — fewer chairs, sharper paranoia, banishments paid back across nights instead of episodes.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
        { title: 'another fine title', blurb: 'Another sentence with its own beat.' },
      ],
    })
    const issues = collectThemeEntryHeadlineBodyEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/themes/best-finales-shape.md (entry #1 blurb)',
    )
    expect(issues[0]!.message).toMatch(/headline-to-body echo/)
    expect(issues[0]!.message).toMatch(/"round table"/)
  })

  it('flags an entry whose title and blurb share a verbatim content bigram in the blurb close (the pre-rewrite #06 shape)', () => {
    makeMultiEntryTheme(tmp, 'crown-shape', {
      entries: [
        {
          title: 'The crown coronation pays off a finale built on craft.',
          blurb:
            'Season 6 spends its run building toward a finale of working drag artists. The crown coronation lands a season whose cultural footprint outgrew its Logo airing.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    const issues = collectThemeEntryHeadlineBodyEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"crown coronation"/)
  })

  it('passes once the headline noun-phrase is dropped from the body (the post-rewrite #05 shape)', () => {
    makeMultiEntryTheme(tmp, 'rewrite-05', {
      entries: [
        {
          title:
            'The Round Table tightening into the final banishment the format was built for.',
          blurb:
            'Each banishment round tightens the math — fewer chairs, sharper paranoia, votes paid back across nights instead of episodes.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemeEntryHeadlineBodyEchoIssues()).toEqual([])
  })

  it('passes once the headline noun-phrase is dropped from the body (the post-rewrite #06 shape)', () => {
    makeMultiEntryTheme(tmp, 'rewrite-06', {
      entries: [
        {
          title: 'The crown coronation pays off a finale built on craft.',
          blurb:
            'Season 6 spends its run building toward a finale of working drag artists. The coronation seals a season whose cultural footprint outgrew its Logo airing.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemeEntryHeadlineBodyEchoIssues()).toEqual([])
  })

  it('exempts `category: single` (intra-canon) lists', () => {
    makeMultiEntryTheme(tmp, 'pillars-echo', {
      category: 'single',
      entries: [
        {
          title: 'A jury-phase house where every eviction felt load-bearing.',
          blurb:
            'The jury-phase house keeps every eviction load-bearing across a roster of franchise veterans.',
        },
        { title: 'A second pillar.', blurb: 'A second pillar carries the era.' },
      ],
    })
    expect(collectThemeEntryHeadlineBodyEchoIssues()).toEqual([])
  })

  it('ignores stopword-anchored bigrams (e.g. "the round" alone does not flag)', () => {
    // Title shares only the stopword `the` with the blurb — no content
    // bigram is verbatim across the pair, so the entry passes.
    makeMultiEntryTheme(tmp, 'stopword-only', {
      entries: [
        {
          title: 'The verdict the jury delivers on the era.',
          blurb:
            'A late conversation rewrites the season — the texture finally lands without softening the cruelty.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemeEntryHeadlineBodyEchoIssues()).toEqual([])
  })

  it('flags multiple shared bigrams together on the same entry (pluralised message)', () => {
    makeMultiEntryTheme(tmp, 'multi-echo', {
      entries: [
        {
          title: 'The crown coronation pays off the round table finale.',
          blurb:
            'The crown coronation lands a season whose round table finale outgrew its first run.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    const issues = collectThemeEntryHeadlineBodyEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/noun-phrases/)
    expect(issues[0]!.message).toMatch(/"crown coronation"/)
    expect(issues[0]!.message).toMatch(/"round table"/)
  })

  it('does not flag a pair whose title and blurb share only a stopword pair (no content bigram)', () => {
    // Title's only multi-word phrasing is `the era`/`the jury` — both
    // anchored on stopwords. The blurb shares no content bigram. Pass.
    makeMultiEntryTheme(tmp, 'stopword-pair', {
      entries: [
        {
          title: 'A verdict from the era.',
          blurb: 'The closing run holds the season together until the last vote.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemeEntryHeadlineBodyEchoIssues()).toEqual([])
  })
})

describe('content-check — themed-list within-entry verbatim phrase echo (critique pass-40, issue #365)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-verbatim-echo-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags an entry whose title and blurb share a verbatim 5-or-more-word phrase (the pre-rewrite #02 shape)', () => {
    makeMultiEntryTheme(tmp, 'verdict-shape', {
      entries: [
        {
          title:
            'The all-star format at its ceiling, closing on a final tribal that reads like a verdict on the returnee era.',
          blurb:
            'Twenty returnees split into heroes and villains compress everything Survivor had been by 2010 into one cast. The jury reads like a court built from the show\'s own history, and the vote plays as a verdict on the returnee era it was about to enter.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    const issues = collectThemedEntryVerbatimPhraseEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/themes/verdict-shape.md (entry #1 blurb)',
    )
    expect(issues[0]!.message).toMatch(/verbatim phrase echo/)
    expect(issues[0]!.message).toMatch(/verdict on the returnee era/)
  })

  it('passes once the verbatim phrase is dropped from the blurb (the post-rewrite #02 shape)', () => {
    makeMultiEntryTheme(tmp, 'verdict-rewrite', {
      entries: [
        {
          title:
            'The all-star format at its ceiling, closing on a final tribal that reads like a verdict on the returnee era.',
          blurb:
            'Twenty returnees split into heroes and villains compress everything Survivor had been by 2010 into one cast. The jury reads like a court built from the show\'s own history, and the closing argument carries a decade of receipts the players have on each other.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemedEntryVerbatimPhraseEchoIssues()).toEqual([])
  })

  it('does not flag a 4-word verbatim echo (below the 5-gram floor)', () => {
    // Title and blurb share the 4-gram `a final tribal that` — four
    // tokens, one below the floor. The next token diverges
    // ("reads" in the title, "lands" in the blurb), so no 5-gram
    // window matches. The bigram-level invariant above catches
    // shorter content overlaps; this one is reserved for verbatim
    // runs long enough that natural prose almost never produces them.
    makeMultiEntryTheme(tmp, 'four-gram', {
      entries: [
        {
          title: 'A final tribal that reads like the season.',
          blurb:
            'The closing run pays the season back. A final tribal that lands as the verdict it earned.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    expect(collectThemedEntryVerbatimPhraseEchoIssues()).toEqual([])
  })

  it('exempts `category: single` (intra-canon) lists', () => {
    makeMultiEntryTheme(tmp, 'pillars-verbatim', {
      category: 'single',
      entries: [
        {
          title:
            'A jury-phase house where every eviction felt load-bearing for the alliance.',
          blurb:
            'The jury-phase house where every eviction felt load-bearing for the alliance, carried across a roster of franchise veterans.',
        },
        { title: 'A second pillar.', blurb: 'A second pillar carries the era.' },
      ],
    })
    expect(collectThemedEntryVerbatimPhraseEchoIssues()).toEqual([])
  })

  it('emits every shared 5-gram window when a longer verbatim run echoes', () => {
    // Title and blurb share the 6-token run
    // `closing on a final tribal that`, which slides across two
    // 5-gram windows — `closing on a final tribal` and
    // `on a final tribal that`. The message reports both so a
    // future drift authoring more of the run shows up at full size.
    makeMultiEntryTheme(tmp, 'longer-run', {
      entries: [
        {
          title:
            'The all-star format at its ceiling, closing on a final tribal that reads like a court.',
          blurb:
            'Twenty returnees compress the show into one cast. The breakout is closing on a final tribal that earns every prior beat.',
        },
        { title: 'fine title', blurb: 'A sentence advances the editorial point.' },
      ],
    })
    const issues = collectThemedEntryVerbatimPhraseEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/closing on a final tribal/)
    expect(issues[0]!.message).toMatch(/on a final tribal that/)
    expect(issues[0]!.message).toMatch(/5-word phrases/)
  })

  it('passes the live catalog (post-rewrite floor 0)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemedEntryVerbatimPhraseEchoIssues()).toEqual([])
  })
})

describe('content-check — back-half hyphenation drift (critique pass-30, issue #305)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-back-half-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-rewrite — best-post-merge entries + HvV episode_heat_caption are hyphenated)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectBackHalfHyphenIssues()).toEqual([])
  })

  it('flags a themed-list entry blurb that uses the unhyphenated form', () => {
    makeMultiEntryTheme(tmp, 'templated', {
      entries: [
        {
          title: 'A premise the season earns.',
          blurb: 'Big Brother runs on its back half as the alliances tighten.',
        },
        {
          title: 'Hyphenated sibling stays clean.',
          blurb: 'The back-half plays heavy.',
        },
      ],
    })
    const issues = collectBackHalfHyphenIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/themes/templated.md (entry #1 blurb)')
    expect(issues[0]!.message).toMatch(/back-half hyphenation drift/)
    expect(issues[0]!.message).toMatch(/issue #305/)
  })

  it('flags a season `episode_heat_caption` that uses the unhyphenated form', () => {
    makeShow(tmp, 'alpha')
    const seasonFile = path.join(
      tmp,
      'shows',
      'alpha',
      'seasons',
      '20-twentieth.md',
    )
    mkdirSync(path.dirname(seasonFile), { recursive: true })
    writeFileSync(
      seasonFile,
      `---
show: alpha
number: 20
title: twentieth
episode_heat: [med, hot, hot, hot]
episode_heat_caption: "peak run · the back half"
---

${sixtyWords}
`,
    )
    const issues = collectBackHalfHyphenIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/alpha/seasons/20-twentieth.md (episode_heat_caption)',
    )
    expect(issues[0]!.message).toMatch(/back-half hyphenation drift/)
  })

  it('case-insensitive match catches `Back Half` and possessive `season\'s back half`', () => {
    makeMultiEntryTheme(tmp, 'mixed-case', {
      entries: [
        { title: 'Back Half drama.', blurb: 'b' },
        { title: 'Season possessive form.', blurb: "The sixth season's back half is the run." },
      ],
    })
    const issues = collectBackHalfHyphenIssues()
    expect(issues.length).toBe(2)
    expect(issues.map((i) => i.file)).toEqual([
      'content/themes/mixed-case.md (entry #1 title)',
      'content/themes/mixed-case.md (entry #2 blurb)',
    ])
  })

  it('does not flag the canonical hyphenated form (`back-half`) — the form the rewrite picked', () => {
    makeMultiEntryTheme(tmp, 'clean', {
      tagline: 'The back-half stretches at full volume.',
      entries: [
        { title: 'The back-half plays heavy.', blurb: 'back-half pressure.' },
      ],
    })
    expect(collectBackHalfHyphenIssues()).toEqual([])
  })
})

// Critique pass-31 HIGH (issue #306): cross-surface editorial-byline
// parity. /about admits the operator is one person; the rendered
// chrome bylines and the catalog-level `curator` / `editor`
// frontmatter must NOT pluralize to "tiered.tv Editors". The
// invariant goes silent when /about removes both singular anchors
// (a future plural editorship rewrites the admission first).
describe('content-check — editorial-byline singular parity (critique pass-31)', () => {
  let tmp: string

  function makeThemeWithCurator(
    root: string,
    slug: string,
    curator: string,
  ): void {
    const file = path.join(root, 'themes', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "${curator}"
last_revised: 2026-05-19
featured: false
description: "${slug}"
entries:
  - show: alpha
    season: 1
    rank: 1
    title: "t"
    blurb: "b"
---
`,
    )
  }

  function makeCanonWithEditor(
    root: string,
    show: string,
    editor: string,
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
show: ${show}
editor: ${editor}
---

## 1. Title 1

${ninetyWords}
`,
    )
  }

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-byline-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog (post-drain: every curator/editor reads singular)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('passes when every theme curator + canon editor reads singular and /about admits one person', () => {
    makeThemeWithCurator(tmp, 'one-list', 'tiered.tv editor')
    makeShow(tmp, 'alpha')
    makeCanonWithEditor(tmp, 'alpha', 'tiered.tv editor')
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('flags a themed-list whose curator regressed to "tiered.tv Editors" while /about still admits one person', () => {
    makeThemeWithCurator(tmp, 'regressed', 'tiered.tv Editors')
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/themes/regressed.md')
    expect(issues[0]!.message).toMatch(/editorial-byline drift/)
    expect(issues[0]!.message).toMatch(/tiered\.tv Editors/)
    expect(issues[0]!.message).toMatch(/issue #306/)
  })

  it('flags a canon editor field that regressed to "tiered.tv Editors"', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithEditor(tmp, 'alpha', 'tiered.tv Editors')
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/alpha/canon.md')
    expect(issues[0]!.message).toMatch(/editorial-byline drift/)
    expect(issues[0]!.message).toMatch(/tiered\.tv Editors/)
  })

  it('also catches the lowercase plural form ("tiered.tv editors")', () => {
    makeThemeWithCurator(tmp, 'lower-plural', 'tiered.tv editors')
    makeAboutWithBody(tmp, "the editor's call — one person, one position")
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/tiered\.tv editors/)
  })

  it('goes silent (no flags) when /about removes both singular anchors — a future plural editorship is legal', () => {
    makeThemeWithCurator(tmp, 'regressed', 'tiered.tv Editors')
    makeShow(tmp, 'alpha')
    makeCanonWithEditor(tmp, 'alpha', 'tiered.tv Editors')
    makeAboutWithBody(
      tmp,
      'A small editorial collective. The canon is shared.',
    )
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('tolerates the absence of /about (no-op rather than crash)', () => {
    makeThemeWithCurator(tmp, 'regressed', 'tiered.tv Editors')
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('does not flag a named editor (e.g. "M. Reyes") — only the plural tiered.tv form is in scope', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithEditor(tmp, 'alpha', 'M. Reyes')
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  // Critique pass-46 MED (issue #388): extends the conditional
  // singular-anchor discipline to the per-show tier_s/a/b/c_blurb
  // fields. While /about admits one person, the tier-band chrome
  // must not carry plural-narrator action forms (we'd defend, we
  // trust, we rank, we recommend, etc.) sitting one scroll below
  // the canon-methodology singular-I narrator.
  function makeCanonWithTierBlurbs(
    root: string,
    show: string,
    blurbs: {
      tier_s_blurb?: string
      tier_a_blurb?: string
      tier_b_blurb?: string
      tier_c_blurb?: string
    },
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    const fields = (Object.entries(blurbs) as Array<[string, string | undefined]>)
      .filter(([, v]) => typeof v === 'string')
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n')
    writeFileSync(
      file,
      `---
show: ${show}
editor: tiered.tv editor
${fields}
---

## 1. Title 1

${ninetyWords}
`,
    )
  }

  it("flags a canon tier_s_blurb that ships the plural-we contraction (\"we'd defend\")", () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_s_blurb:
        "Format-defining or unrepeatable. A season we'd defend at a bar.",
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/alpha/canon.md')
    expect(issues[0]!.message).toMatch(/tier_s_blurb/)
    expect(issues[0]!.message).toMatch(/plural-narrator action form/)
    expect(issues[0]!.message).toMatch(/issue #388/)
  })

  it('flags a canon tier_a_blurb carrying the plural "we trust" form', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_a_blurb:
        'Deep canon. The seasons we trust to deliver across a kitchen-table replay.',
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/tier_a_blurb/)
    expect(issues[0]!.message).toMatch(/we trust/)
  })

  it('flags a canon tier_c_blurb carrying the plural "We rank" form', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_c_blurb:
        'Mixed and uneven. We rank them honestly — the texture is historical more than rewarding.',
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/tier_c_blurb/)
    expect(issues[0]!.message).toMatch(/We rank/)
  })

  it('flags a canon tier_b_blurb carrying the plural "we recommend" form (preventive coverage at the middle tier)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_b_blurb:
        'Strong but era-bound — seasons we recommend when the next slot up is contested.',
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    const issues = collectEditorialBylineSingularIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/tier_b_blurb/)
    expect(issues[0]!.message).toMatch(/we recommend/)
  })

  it('passes when tier blurbs read singular-I (post-rotation form)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_s_blurb:
        "Format-defining or unrepeatable. A season I'd defend at a bar.",
      tier_a_blurb:
        'Deep canon. The seasons I trust to deliver across a kitchen-table replay.',
      tier_b_blurb:
        'Classic-era stalwarts — strong shapes that surrounding seasons have used to define themselves.',
      tier_c_blurb:
        'Mixed and uneven. I rank them honestly — the texture is more historical than rewarding.',
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('does not flag tier blurbs that simply contain the word "we" without a plural-narrator action verb (e.g. "what we get is")', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_b_blurb:
        'Strong era-bound runs. The kind of season that holds up regardless of how we got there.',
    })
    makeAboutWithBody(tmp, 'An experiment. Built and operated by one person.')
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })

  it('tier-blurb invariant goes silent when /about removes the singular anchors (a future plural editorship is legal at every chrome layer)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithTierBlurbs(tmp, 'alpha', {
      tier_s_blurb: "Format-defining. A season we'd defend at a bar.",
      tier_c_blurb: 'Mixed and uneven. We rank them honestly.',
    })
    makeAboutWithBody(
      tmp,
      'A small editorial collective. The canon is shared.',
    )
    expect(collectEditorialBylineSingularIssues()).toEqual([])
  })
})

describe('content-check — canon-rationale closing-formula adjacency (critique pass-32, issue #312)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-canon-closing-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeCanonWithClosers(
    root: string,
    show: string,
    closers: Array<{ season: number; title: string; closer: string }>,
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    const headings = closers
      .map(
        (c) =>
          `## ${c.season}. ${c.title}\n\n${ninetyWords} ${c.closer}\n`,
      )
      .join('\n')
    writeFileSync(file, `---\nshow: ${show}\n---\n\n${headings}\n`)
  }

  it('passes at the live catalog (no adjacent self-naming-closer pair after the HvV rotation)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectCanonRationaleClosingFormulaIssues()).toEqual([])
  })

  it('passes when only one entry carries the self-naming formula (single occurrence is fine)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          "tiered.tv's canon places it first because no other season has shaped the genre.",
      },
      {
        season: 2,
        title: 'Two',
        closer: 'A second slot earned on the cast bench alone.',
      },
    ])
    expect(collectCanonRationaleClosingFormulaIssues()).toEqual([])
  })

  it('passes for non-self-naming closers (the "The canon places it..." form is fine)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          'The canon places it first because no other season has shaped the genre.',
      },
      {
        season: 2,
        title: 'Two',
        closer:
          'The canon places it second because no other returnee run has the same depth.',
      },
    ])
    expect(collectCanonRationaleClosingFormulaIssues()).toEqual([])
  })

  it('flags two adjacent entries that both close with the self-naming brand-stamp formula', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          "tiered.tv's canon places it first because no other season has shaped the genre.",
      },
      {
        season: 2,
        title: 'Two',
        closer:
          "tiered.tv's canon places it second because no other returnee run sustains the pressure.",
      },
    ])
    const issues = collectCanonRationaleClosingFormulaIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/alpha/canon.md')
    expect(issues[0]!.message).toMatch(/closing-formula adjacency drift/)
    expect(issues[0]!.message).toMatch(/canonical_position 1 \(One\) and 2 \(Two\)/)
    expect(issues[0]!.message).toMatch(/issue #312/)
  })

  it('does not flag two carriers separated by a non-carrier (only adjacency trips the gate)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeSeason(tmp, 'alpha', 3, 'three', { canonical_position: 3 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          "tiered.tv's canon places it first because no other season has shaped the genre.",
      },
      {
        season: 2,
        title: 'Two',
        closer: 'A second slot earned on the cast bench alone.',
      },
      {
        season: 3,
        title: 'Three',
        closer:
          "tiered.tv's canon places it third because no other run has the same density.",
      },
    ])
    expect(collectCanonRationaleClosingFormulaIssues()).toEqual([])
  })

  it('flags every adjacent pair when three carriers run in a row', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeSeason(tmp, 'alpha', 3, 'three', { canonical_position: 3 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          "tiered.tv's canon places it first because no other season has shaped the genre.",
      },
      {
        season: 2,
        title: 'Two',
        closer:
          "tiered.tv's canon places it second because no other returnee run sustains the pressure.",
      },
      {
        season: 3,
        title: 'Three',
        closer:
          "tiered.tv's canon places it third because no other run has the same density.",
      },
    ])
    const issues = collectCanonRationaleClosingFormulaIssues()
    expect(issues.length).toBe(2)
    expect(issues[0]!.message).toMatch(/canonical_position 1 .* and 2/)
    expect(issues[1]!.message).toMatch(/canonical_position 2 .* and 3/)
  })

  it('is case-insensitive (catches a future authoring pass titlecasing the closer)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'one', { canonical_position: 1 })
    makeSeason(tmp, 'alpha', 2, 'two', { canonical_position: 2 })
    makeCanonWithClosers(tmp, 'alpha', [
      {
        season: 1,
        title: 'One',
        closer:
          "Tiered.tv's Canon Places It First Because No Other season has shaped the genre.",
      },
      {
        season: 2,
        title: 'Two',
        closer:
          "tiered.tv's canon places it second because no other returnee run sustains the pressure.",
      },
    ])
    const issues = collectCanonRationaleClosingFormulaIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/closing-formula adjacency drift/)
  })

  it('tolerates a show without a canon (no-op rather than crash)', () => {
    makeShow(tmp, 'alpha')
    expect(collectCanonRationaleClosingFormulaIssues()).toEqual([])
  })
})

describe('content-check — canon meth_who_p plural-collective editor voice (critique pass-35, issue #329)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-canon-meth-who-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeCanonWithMethWho(
    root: string,
    show: string,
    methWho: string,
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
show: ${show}
editor: Test Editor
last_revised: 2026-05-14
meth_who_h: Who ranks
meth_who_p: ${methWho}
weekly_question: Question of the week?
---

## 1. Title

${ninetyWords}
`,
    )
    makeSeason(root, show, 1, 'title', { canonical_position: 1 })
  }

  it('passes for a singular-voice override (first-person "I")', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "tiered.tv's editor. I've watched Alpha since the original pilot and I've replayed every season that lands on this list. The ranking is one editor's read first, calibrated against what reasonable Alpha fans agree on after a long argument runs its course. I'm not claiming to be objective. I'm trying to be honest.",
    )
    expect(collectCanonMethWhoPluralEditorIssues()).toEqual([])
  })

  it('passes for a singular-voice override (third-person "the editor")', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "tiered.tv's editor. The editor has watched Alpha since the original pilot and replays every season that lands on this list. The ranking is the editor's read first, calibrated against what reasonable Alpha fans agree on after a long argument runs its course. The canon isn't claiming objectivity. It's an honest argument.",
    )
    expect(collectCanonMethWhoPluralEditorIssues()).toEqual([])
  })

  it('flags the plural possessive `tiered.tv\'s editors` (independent signal)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "tiered.tv's editors. The canon is one editor's read, calibrated against what reasonable fans agree on. The ranking starts as an editor's read, then gets fine-tuned against what informed viewers agree on after a long argument runs its course. The canon stays honest about its limits.",
    )
    const issues = collectCanonMethWhoPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/alpha/canon.md (meth_who_p)')
    expect(issues[0]!.message).toMatch(/plural-collective editor voice/)
    expect(issues[0]!.message).toMatch(/plural possessive/)
    expect(issues[0]!.message).toMatch(/issue #329/)
  })

  it('flags plural-collective pronouns (independent signal)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "The canon ranker. We've watched Alpha since the original pilot and we are trying to be honest about each season's strengths. The ranking is one editor's read first, calibrated against what reasonable Alpha fans agree on after a long argument runs its course. We aren't claiming objectivity.",
    )
    const issues = collectCanonMethWhoPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/first-person-plural pronouns/)
  })

  it('flags both signals together in one issue (single hit per show)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "tiered.tv's editors. We've watched Alpha since the original pilot and we've replayed every season that lands on this list. The ranking is one editor's read first, calibrated against what reasonable Alpha fans agree on after a long argument. We aren't claiming objectivity. We are trying to be honest.",
    )
    const issues = collectCanonMethWhoPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/plural possessive/)
    expect(issues[0]!.message).toMatch(/AND/)
    expect(issues[0]!.message).toMatch(/first-person-plural/)
  })

  it('is case-insensitive on both signals', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "TIERED.TV's Editors. We've Watched Alpha since the original pilot and We've replayed every season that lands on this list. The Ranking is one editor's read first, calibrated against what reasonable Alpha fans agree on after a long argument. We Aren't claiming objectivity. We Are trying to be honest.",
    )
    const issues = collectCanonMethWhoPluralEditorIssues()
    expect(issues.length).toBe(1)
  })

  it('skips shows whose canon omits the meth_who_p field (no-op)', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 1, 'title', { canonical_position: 1 })
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'Title' }])
    expect(collectCanonMethWhoPluralEditorIssues()).toEqual([])
  })

  it('tolerates a show without a canon (no-op rather than crash)', () => {
    makeShow(tmp, 'alpha')
    expect(collectCanonMethWhoPluralEditorIssues()).toEqual([])
  })

  it('does not false-positive on the substring "weight" (matches only word-bounded `we`)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethWho(
      tmp,
      'alpha',
      "tiered.tv's editor. The editor weights each season's craft and consequence equally; objectivity is not the bar, honesty is. The ranking starts as the editor's read, then gets fine-tuned against what reasonable fans agree on after a long argument runs its course. The canon stays honest about its limits.",
    )
    expect(collectCanonMethWhoPluralEditorIssues()).toEqual([])
  })
})

describe('content-check — canon meth_who_p closing-sentence cross-show echo (critique pass-41, issue #374)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-canon-meth-who-closer-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeCanonWithMethWhoCloser(
    root: string,
    show: string,
    methWho: string,
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
show: ${show}
editor: Test Editor
last_revised: 2026-05-14
meth_who_h: Who ranks
meth_who_p: ${JSON.stringify(methWho)}
weekly_question: Question of the week?
---

## 1. Title

${ninetyWords}
`,
    )
    makeSeason(root, show, 1, 'title', { canonical_position: 1 })
  }

  it('passes at the live catalog post-drain (5 distinct closers across 9 carriers)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectCanonMethWhoClosingPairEchoIssues()).toEqual([])
  })

  const preamble =
    "tiered.tv's editor. I've watched this show since the original pilot and I've replayed every season that lands on this list. The ranking is one editor's read first, calibrated against what reasonable fans agree on after a long argument runs its course."

  it('passes when each carrier carries a unique closing sentence', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    makeCanonWithMethWhoCloser(
      tmp,
      'alpha',
      `${preamble} It's a read, not a verdict.`,
    )
    makeCanonWithMethWhoCloser(
      tmp,
      'bravo',
      `${preamble} The point isn't to be right; it's to be honest.`,
    )
    makeCanonWithMethWhoCloser(
      tmp,
      'charlie',
      `${preamble} Honest about the show, calibrated against the room.`,
    )
    expect(collectCanonMethWhoClosingPairEchoIssues()).toEqual([])
  })

  it('passes at the strict-at-floor-2 boundary (2 carriers may share a closer)', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    makeCanonWithMethWhoCloser(
      tmp,
      'alpha',
      `${preamble} It's a read, not a verdict.`,
    )
    makeCanonWithMethWhoCloser(
      tmp,
      'bravo',
      `${preamble} It's a read, not a verdict.`,
    )
    makeCanonWithMethWhoCloser(
      tmp,
      'charlie',
      `${preamble} The point isn't to be right; it's to be honest.`,
    )
    expect(collectCanonMethWhoClosingPairEchoIssues()).toEqual([])
  })

  it('flags the historical defect — the 12-word literal shared across 3 carriers', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    const shared = `${preamble} I'm not claiming to be objective. I'm trying to be honest.`
    makeCanonWithMethWhoCloser(tmp, 'alpha', shared)
    makeCanonWithMethWhoCloser(tmp, 'bravo', shared)
    makeCanonWithMethWhoCloser(tmp, 'charlie', shared)
    const issues = collectCanonMethWhoClosingPairEchoIssues()
    expect(issues.length).toBe(3)
    const files = issues.map((i) => i.file).sort()
    expect(files).toEqual([
      'content/shows/alpha/canon.md (meth_who_p)',
      'content/shows/bravo/canon.md (meth_who_p)',
      'content/shows/charlie/canon.md (meth_who_p)',
    ])
    expect(issues[0]!.message).toMatch(/closing-sentence cross-show echo/)
    expect(issues[0]!.message).toMatch(/i'm trying to be honest/i)
    expect(issues[0]!.message).toMatch(/3 carriers/)
    expect(issues[0]!.message).toMatch(/issue #374/)
  })

  it('is case-insensitive on the closer comparison', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    const a = `${preamble} IT'S A READ, NOT A VERDICT.`
    const b = `${preamble} It's a read, not a verdict.`
    const c = `${preamble} it's a read, not a verdict.`
    makeCanonWithMethWhoCloser(tmp, 'alpha', a)
    makeCanonWithMethWhoCloser(tmp, 'bravo', b)
    makeCanonWithMethWhoCloser(tmp, 'charlie', c)
    const issues = collectCanonMethWhoClosingPairEchoIssues()
    expect(issues.length).toBe(3)
  })

  it('groups carriers independently — two distinct echoes both above floor each flag their own group', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    makeShow(tmp, 'delta')
    makeShow(tmp, 'echo')
    makeShow(tmp, 'foxtrot')
    const closerOne = `${preamble} It's a read, not a verdict.`
    const closerTwo = `${preamble} The point isn't to be right; it's to be honest.`
    makeCanonWithMethWhoCloser(tmp, 'alpha', closerOne)
    makeCanonWithMethWhoCloser(tmp, 'bravo', closerOne)
    makeCanonWithMethWhoCloser(tmp, 'charlie', closerOne)
    makeCanonWithMethWhoCloser(tmp, 'delta', closerTwo)
    makeCanonWithMethWhoCloser(tmp, 'echo', closerTwo)
    makeCanonWithMethWhoCloser(tmp, 'foxtrot', closerTwo)
    const issues = collectCanonMethWhoClosingPairEchoIssues()
    expect(issues.length).toBe(6)
    const files = issues.map((i) => i.file).sort()
    expect(files).toEqual([
      'content/shows/alpha/canon.md (meth_who_p)',
      'content/shows/bravo/canon.md (meth_who_p)',
      'content/shows/charlie/canon.md (meth_who_p)',
      'content/shows/delta/canon.md (meth_who_p)',
      'content/shows/echo/canon.md (meth_who_p)',
      'content/shows/foxtrot/canon.md (meth_who_p)',
    ])
  })

  it('skips shows whose canon omits the meth_who_p field (no-op)', () => {
    makeShow(tmp, 'alpha')
    makeShow(tmp, 'bravo')
    makeShow(tmp, 'charlie')
    makeSeason(tmp, 'alpha', 1, 'title', { canonical_position: 1 })
    makeCanon(tmp, 'alpha', [{ rank: 1, season: 1, title: 'Title' }])
    makeSeason(tmp, 'bravo', 1, 'title', { canonical_position: 1 })
    makeCanon(tmp, 'bravo', [{ rank: 1, season: 1, title: 'Title' }])
    makeSeason(tmp, 'charlie', 1, 'title', { canonical_position: 1 })
    makeCanon(tmp, 'charlie', [{ rank: 1, season: 1, title: 'Title' }])
    expect(collectCanonMethWhoClosingPairEchoIssues()).toEqual([])
  })

  it('tolerates a show without a canon (no-op rather than crash)', () => {
    makeShow(tmp, 'alpha')
    expect(collectCanonMethWhoClosingPairEchoIssues()).toEqual([])
  })
})

describe('content-check — show tagline plural-collective editor voice (critique pass-41, issue #356)', () => {
  let tmp: string

  function makeShowWithTagline(
    root: string,
    slug: string,
    tagline: string,
  ): void {
    const file = path.join(root, 'shows', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: A blurb.
tagline: ${JSON.stringify(tagline)}
tier: B
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
    )
  }

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-tagline-plural-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog post-drain (Survivor + Amazing Race rewritten to singular)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectShowTaglinePluralEditorIssues()).toEqual([])
  })

  it('passes for a singular-voice tagline (first-person "I")', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "Strangers on a beach, voting each other off until one is left standing. I've ranked every single one.",
    )
    expect(collectShowTaglinePluralEditorIssues()).toEqual([])
  })

  it('passes for a third-person voice tagline (no editor-pronoun at all)', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      'A franchise built on long arcs and quiet finales. The format that taught reality how to slow down.',
    )
    expect(collectShowTaglinePluralEditorIssues()).toEqual([])
  })

  it('flags the historical defect — Survivor\'s pre-drain `We\'ve ranked` closer', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "Strangers on a beach, voting each other off until one is left standing. We've ranked every single one.",
    )
    const issues = collectShowTaglinePluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/alpha.md (tagline)')
    expect(issues[0]!.message).toMatch(/plural-collective editor voice/)
    expect(issues[0]!.message).toMatch(/first-person-plural pronouns/)
    expect(issues[0]!.message).toMatch(/issue #356/)
  })

  it('flags the plural possessive `tiered.tv\'s editors` (independent signal)', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "A long-running format. tiered.tv's editors have ranked every season since the original pilot.",
    )
    const issues = collectShowTaglinePluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/plural possessive/)
  })

  it('flags both signals together in one issue (single hit per show)', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "A long-running format. tiered.tv's editors have ranked every season; we are still arguing about the order.",
    )
    const issues = collectShowTaglinePluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/plural possessive/)
    expect(issues[0]!.message).toMatch(/AND/)
    expect(issues[0]!.message).toMatch(/first-person-plural/)
  })

  it('is case-insensitive on both signals', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "A long-running format. TIERED.TV's Editors have ranked every season; We've replayed every one.",
    )
    const issues = collectShowTaglinePluralEditorIssues()
    expect(issues.length).toBe(1)
  })

  it('does not false-positive on the substring "weight" (matches only word-bounded `we`)', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      'A long-running format that weights craft and consequence in equal measure.',
    )
    expect(collectShowTaglinePluralEditorIssues()).toEqual([])
  })

  it('tolerates a show whose tagline is empty or absent (no-op)', () => {
    const file = path.join(tmp, 'shows', 'alpha.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: alpha
name: alpha
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: A blurb.
tagline: "A tagline."
tier: B
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
    )
    expect(collectShowTaglinePluralEditorIssues()).toEqual([])
  })

  it('flags each carrier independently when more than one show drifts', () => {
    makeShowWithTagline(
      tmp,
      'alpha',
      "Strangers on a beach. We've ranked every season.",
    )
    makeShowWithTagline(
      tmp,
      'beta',
      "Strangers in a kitchen. We've ranked every service.",
    )
    const issues = collectShowTaglinePluralEditorIssues()
    expect(issues.length).toBe(2)
    const files = issues.map((i) => i.file).sort()
    expect(files).toEqual([
      'content/shows/alpha.md (tagline)',
      'content/shows/beta.md (tagline)',
    ])
  })
})

describe('content-check — canon methodology sibling-field plural-collective editor voice (critique pass-41, issue #357)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-canon-meth-sib-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  const fortyWordsBody = Array.from(
    { length: 40 },
    (_, i) => `tok${i}`,
  ).join(' ')

  function makeCanonWithMethSiblings(
    root: string,
    show: string,
    siblings: {
      meth_how_h: string
      meth_how_p: string
      meth_when_h: string
      meth_when_p: string
    },
  ): void {
    const file = path.join(root, 'shows', show, 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
show: ${show}
editor: Test Editor
last_revised: 2026-05-14
meth_who_h: Who ranks
meth_who_p: "tiered.tv's editor. I've watched this show since the original pilot and I've replayed every season that lands on this list. The ranking is one editor's read first, calibrated against what reasonable fans agree on after a long argument. I'm not claiming to be objective. I'm trying to be honest."
meth_how_h: ${JSON.stringify(siblings.meth_how_h)}
meth_how_p: ${JSON.stringify(siblings.meth_how_p)}
meth_when_h: ${JSON.stringify(siblings.meth_when_h)}
meth_when_p: ${JSON.stringify(siblings.meth_when_p)}
weekly_question: Question of the week?
---

## 1. Title

${ninetyWords}
`,
    )
    makeSeason(root, show, 1, 'title', { canonical_position: 1 })
  }

  it('passes at the live catalog post-drain (all 13 canons rewritten to singular voice)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })

  it('passes for singular-voice siblings (long head form)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How do I weigh it?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. The ranking starts as one editor's read first, then gets fine-tuned against what reasonable fans agree on after a long argument. I weigh each season on its own terms and stay honest about the limits.",
      meth_when_h: 'When do I revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift my read on a player's original season — sometimes the original hardens, sometimes it softens. I revisit the bottom of the canon less often than the top.",
    })
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })

  it('passes for singular-voice siblings (short head form)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How I weigh it',
      meth_how_p:
        "I rank seasons on format execution, casting energy, production confidence, and how much each one mattered to the franchise's arc. A breakout that defined the show's reputation outranks a constrained transitional year. Outcomes never factor in — a season's results carry no weight here, only how well the hour itself runs.",
      meth_when_h: 'When I revisit',
      meth_when_p:
        'The canon moves when a new season airs and settles, or when the community vote shifts enough to argue a reorder. I revisit after each run concludes and reassess the older seasons against it. The order below reflects the show through its sixth season; later seasons slot in on merit.',
    })
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })

  it('flags a plural-collective head on meth_how_h', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How do we weigh it?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. The ranking starts as one editor's read first, then gets fine-tuned against what reasonable fans agree on after a long argument. I weigh each season on its own terms and stay honest about the limits.",
      meth_when_h: 'When do I revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift my read on a player's original season — sometimes the original hardens, sometimes it softens. I revisit the bottom of the canon less often than the top.",
    })
    const issues = collectCanonMethSiblingsPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/alpha/canon.md (meth_how_h)',
    )
    expect(issues[0]!.message).toMatch(/plural-collective editor voice/)
    expect(issues[0]!.message).toMatch(/issue #357/)
  })

  it('flags a plural-collective body on meth_when_p (we / our independent signals)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How do I weigh it?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. The ranking starts as one editor's read first, then gets fine-tuned against what reasonable fans agree on after a long argument. I weigh each season on its own terms and stay honest about the limits.",
      meth_when_h: 'When do I revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift our read on a player's original season — sometimes the original hardens, sometimes it softens. We revisit the bottom of the canon less often than the top.",
    })
    const issues = collectCanonMethSiblingsPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/alpha/canon.md (meth_when_p)',
    )
    expect(issues[0]!.message).toMatch(/plural possessive `our`/)
    expect(issues[0]!.message).toMatch(/first-person-plural pronoun/)
  })

  it('flags each offending sibling field independently when more than one drifts', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How do we weigh it?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. We weigh each season on its own terms. The ranking starts as one editor's read first, then gets fine-tuned against what reasonable fans agree on after a long argument running on for hours.",
      meth_when_h: 'When do we revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift our read on a player's original season — sometimes the original hardens, sometimes it softens. We revisit the bottom of the canon less often than the top.",
    })
    const issues = collectCanonMethSiblingsPluralEditorIssues()
    expect(issues.length).toBe(4)
    const files = issues.map((i) => i.file).sort()
    expect(files).toEqual([
      'content/shows/alpha/canon.md (meth_how_h)',
      'content/shows/alpha/canon.md (meth_how_p)',
      'content/shows/alpha/canon.md (meth_when_h)',
      'content/shows/alpha/canon.md (meth_when_p)',
    ])
  })

  it('is case-insensitive on plural-we / plural-our signals', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How Do We Weigh It?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. The ranking starts as one editor's read first, then gets fine-tuned against what reasonable fans agree on after a long argument. I weigh each season on its own terms and stay honest about the limits.",
      meth_when_h: 'When do I revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift my read on a player's original season — sometimes the original hardens, sometimes it softens. I revisit the bottom of the canon less often than the top.",
    })
    const issues = collectCanonMethSiblingsPluralEditorIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/alpha/canon.md (meth_how_h)',
    )
  })

  it('does not false-positive on the substring "were" (matches only word-bounded `we`)', () => {
    makeShow(tmp, 'alpha')
    makeCanonWithMethSiblings(tmp, 'alpha', {
      meth_how_h: 'How do I weigh it?',
      meth_how_p:
        "Four lenses, applied in this order — cast, format, place, and argument. The lenses were chosen to balance craft and consequence. I weigh each season on its own terms and stay honest about the limits of the ranking after a long argument.",
      meth_when_h: 'When do I revisit?',
      meth_when_p:
        "After every season finale, and after any returnee event that recasts a prior run. Returnee seasons especially can shift my read on a player's original season — sometimes the original hardens, sometimes it softens. I revisit the bottom of the canon less often than the top.",
    })
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })

  it('skips shows whose canon omits the sibling fields (no-op)', () => {
    makeShow(tmp, 'alpha')
    const file = path.join(tmp, 'shows', 'alpha', 'canon.md')
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
show: alpha
editor: Test Editor
last_revised: 2026-05-14
meth_who_h: Who ranks
meth_who_p: ${fortyWordsBody}
weekly_question: Question of the week?
---

## 1. Title

${ninetyWords}
`,
    )
    makeSeason(tmp, 'alpha', 1, 'title', { canonical_position: 1 })
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })

  it('tolerates a show without a canon (no-op rather than crash)', () => {
    makeShow(tmp, 'alpha')
    expect(collectCanonMethSiblingsPluralEditorIssues()).toEqual([])
  })
})

// Critique pass-33 MED (issue #317): season `eyebrow` carrying a
// single calendar-season label (spring/summer/fall/autumn/winter)
// must agree with `premiere_date` under the Northern Hemisphere
// meteorological convention. Span eyebrows opt out (multi-label
// disclosure). The collector ships LAX during the corpus drain, so
// it's exercised here as a pure helper (failures are inspected
// directly; main() routes them to console.warn).
describe('content-check — season-eyebrow calendar-season parity (critique pass-33, issue #317)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-eyebrow-cal-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeSeasonWithEyebrow(
    root: string,
    show: string,
    n: number,
    slug: string,
    opts: { eyebrow: string; premiere_date?: string },
  ): void {
    const file = path.join(
      root,
      'shows',
      show,
      'seasons',
      `${String(n).padStart(2, '0')}-${slug}.md`,
    )
    mkdirSync(path.dirname(file), { recursive: true })
    const pd =
      opts.premiere_date != null ? `\npremiere_date: ${opts.premiere_date}` : ''
    writeFileSync(
      file,
      `---
show: ${show}
number: ${n}
title: ${slug}
eyebrow: "${opts.eyebrow}"${pd}
---

${sixtyWords}
`,
    )
  }

  it('flags a single-label eyebrow whose premiere_date falls in a different calendar season', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired spring 2010 · Filmed in Samoa',
      premiere_date: '2010-02-11',
    })
    const issues = collectSeasonEyebrowCalendarIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/alpha/seasons/01-one.md (eyebrow)',
    )
    expect(issues[0]!.message).toMatch(/season-eyebrow calendar drift/)
    expect(issues[0]!.message).toMatch(/eyebrow names "spring"/)
    expect(issues[0]!.message).toMatch(/falls in winter/)
    expect(issues[0]!.message).toMatch(/issue #317/)
  })

  it('passes a single-label eyebrow whose premiere_date falls inside that season', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired spring 2010 · Filmed in Samoa',
      premiere_date: '2010-04-01',
    })
    expect(collectSeasonEyebrowCalendarIssues()).toEqual([])
  })

  it('skips a span eyebrow (multi-label disclosure opts the season out)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired winter–spring 2010 · Filmed in Samoa',
      premiere_date: '2010-02-11',
    })
    expect(collectSeasonEyebrowCalendarIssues()).toEqual([])
  })

  it('skips an eyebrow without any calendar-season label', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Filmed in Samoa · CBS Thursday 8/7c',
      premiere_date: '2010-02-11',
    })
    expect(collectSeasonEyebrowCalendarIssues()).toEqual([])
  })

  it('skips a season without premiere_date (the invariant needs both halves)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired spring 2010 · Filmed in Samoa',
    })
    expect(collectSeasonEyebrowCalendarIssues()).toEqual([])
  })

  it('treats "autumn" as a synonym for "fall"', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired autumn 2010 · UK broadcast',
      premiere_date: '2010-10-15',
    })
    expect(collectSeasonEyebrowCalendarIssues()).toEqual([])
  })

  it('flags a winter eyebrow whose premiere date sits in summer', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithEyebrow(tmp, 'alpha', 1, 'one', {
      eyebrow: 'Aired winter 2010',
      premiere_date: '2010-07-15',
    })
    const issues = collectSeasonEyebrowCalendarIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/eyebrow names "winter"/)
    expect(issues[0]!.message).toMatch(/falls in summer/)
  })
})

describe('content-check — watch_list cross-callout phrase repetition (critique pass-32, issue #325)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-watchlist-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeSeasonWithWatchList(
    root: string,
    show: string,
    n: number,
    slug: string,
    items: Array<{ episode_label: string; body: string }>,
  ): void {
    const file = path.join(
      root,
      'shows',
      show,
      'seasons',
      `${String(n).padStart(2, '0')}-${slug}.md`,
    )
    mkdirSync(path.dirname(file), { recursive: true })
    const watchListYaml = items
      .map(
        (it) =>
          `  - episode_label: "${it.episode_label}"\n    body: "${it.body}"`,
      )
      .join('\n')
    writeFileSync(
      file,
      `---
show: ${show}
number: ${n}
title: ${slug}
watch_list:
${watchListYaml}
---

${sixtyWords}
`,
    )
  }

  it('flags the HvV-class case: a body re-uses a content-bearing word that appears in another item\'s label', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithWatchList(tmp, 'alpha', 1, 'one', [
      { episode_label: 'Opener · cold open', body: 'A clean staging.' },
      { episode_label: 'Early · long take', body: 'Watch the patience.' },
      { episode_label: 'Mid · merge', body: 'The merge plays clean.' },
      {
        episode_label: 'Late · third act',
        body: 'The cold-open of the late-game stretch is doing real work.',
      },
    ])
    const issues = collectWatchListPhraseRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toMatch(/seasons\/01-one\.md \(watch_list\)/)
    expect(issues[0]!.message).toMatch(/watch_list cross-callout phrase repetition/)
    expect(issues[0]!.message).toMatch(/"cold open"/)
    expect(issues[0]!.message).toMatch(/issue #325/)
  })

  it('flags two bodies sharing a 2-word content phrase', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithWatchList(tmp, 'alpha', 1, 'one', [
      {
        episode_label: 'Opener · note',
        body: 'The first minute does real work setting the table.',
      },
      {
        episode_label: 'Late · note',
        body: 'The first minute of the back half also does real work.',
      },
    ])
    const issues = collectWatchListPhraseRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"first minute"/)
    expect(issues[0]!.message).toMatch(/"real work"/)
  })

  it('does not flag label-vs-label collisions (structural label tokens are exempt)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithWatchList(tmp, 'alpha', 1, 'one', [
      { episode_label: 'Opener · cold open', body: 'Different beat here.' },
      { episode_label: 'Late · cold open', body: 'Another beat entirely.' },
    ])
    expect(collectWatchListPhraseRepetitionIssues()).toEqual([])
  })

  it('passes a watch_list with distinct vocabulary across items', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithWatchList(tmp, 'alpha', 1, 'one', [
      { episode_label: 'Opener · note', body: 'The opening shot does work.' },
      { episode_label: 'Mid · note', body: 'A long confessional follows.' },
      { episode_label: 'Late · note', body: 'The merge plays cleanly.' },
    ])
    expect(collectWatchListPhraseRepetitionIssues()).toEqual([])
  })

  it('skips a season without a watch_list', () => {
    makeShow(tmp, 'alpha')
    const file = path.join(
      tmp,
      'shows',
      'alpha',
      'seasons',
      '01-bare.md',
    )
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---\nshow: alpha\nnumber: 1\ntitle: bare\n---\n\n${sixtyWords}\n`,
    )
    expect(collectWatchListPhraseRepetitionIssues()).toEqual([])
  })

  it('skips stopword-only repetitions (the bigram extractor drops stop tokens)', () => {
    makeShow(tmp, 'alpha')
    makeSeasonWithWatchList(tmp, 'alpha', 1, 'one', [
      {
        episode_label: 'Opener · note',
        body: 'In the moment, the show settles.',
      },
      {
        episode_label: 'Late · note',
        body: 'In the moment, the cast holds steady.',
      },
    ])
    // "in the" and "the moment" all carry stopwords on at least one
    // side; the only purely content adjacency is none — pure stopword
    // chains do not trip the gate.
    expect(collectWatchListPhraseRepetitionIssues()).toEqual([])
  })
})

// Critique pass-35 HIGH (issue #328): themed-list entries that claim
// the named show+season is the "first" all-returnee / all-star /
// returnee outing must agree with the site's known first-of-class
// allowlist. The HvV title rewrite drains the only offender in the
// corpus; this suite pins the floor.
describe('content-check — themed-list factual "first" returnee/all-star claim (critique pass-35, issue #328)', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-first-claim-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  function makeThemeWithEntryText(
    root: string,
    slug: string,
    entry: {
      show: string
      season: number
      rank?: number
      title: string
      blurb: string
    },
  ): void {
    const file = path.join(root, 'themes', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: ${slug}
title: "${slug}"
tagline: "tag"
category: tone
sentiment: hold
status: stable
curator: "tiered.tv editor"
last_revised: 2026-06-06
featured: false
description: "${slug}"
entries:
  - show: ${entry.show}
    season: ${entry.season}
    rank: ${entry.rank ?? 1}
    title: "${entry.title.replace(/"/g, '\\"')}"
    blurb: "${entry.blurb.replace(/"/g, '\\"')}"
---
`,
    )
  }

  it('passes at the live catalog (no offending "first all-returnee" claim after the HvV rotation)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectThemeFactualFirstClaimIssues()).toEqual([])
  })

  it('flags the historical defect — the original HvV title naming HvV as the first all-returnee season', () => {
    makeShow(tmp, 'survivor')
    makeSeason(tmp, 'survivor', 20, 'heroes-vs-villains', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'survivor',
      season: 20,
      rank: 2,
      title:
        'The first all-returnee season closing on a final tribal that reads like a verdict.',
      blurb:
        'The endgame compounds — every conversation freighted with everything Survivor had been by 2010.',
    })
    const issues = collectThemeFactualFirstClaimIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/themes/best-finales.md (entry #2 title)',
    )
    expect(issues[0]!.message).toMatch(/first <returnee\|all-star\|all-returnee>/)
    expect(issues[0]!.message).toMatch(/allowlisted as first-of-class at season\(s\) 8/)
    expect(issues[0]!.message).toMatch(/issue #328/)
  })

  it('passes for the allowlisted first-of-class entry (Survivor S8 All-Stars)', () => {
    makeShow(tmp, 'survivor')
    makeSeason(tmp, 'survivor', 8, 'all-stars', {})
    makeThemeWithEntryText(tmp, 'best-returnees', {
      show: 'survivor',
      season: 8,
      rank: 1,
      title:
        'The first all-returnee season — historic, uneven, foundational to every returnee run after.',
      blurb: 'The franchise reaches for the all-star format too early and writes the blueprint anyway.',
    })
    expect(collectThemeFactualFirstClaimIssues()).toEqual([])
  })

  it('flags a "first all-star" claim on a non-allowlisted show', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 5, 'allstars', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'alpha',
      season: 5,
      rank: 1,
      title: "The first all-star season the format ever tried.",
      blurb: 'Body copy unrelated to the claim.',
    })
    const issues = collectThemeFactualFirstClaimIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/not allowlisted as first-of-class/)
  })

  it('flags the claim when it appears in the blurb rather than the title', () => {
    makeShow(tmp, 'survivor')
    makeSeason(tmp, 'survivor', 20, 'heroes-vs-villains', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'survivor',
      season: 20,
      rank: 2,
      title: 'A clean editorial title.',
      blurb:
        'Heroes vs. Villains is the first all-returnee season the franchise produced — the closing run pays it off.',
    })
    const issues = collectThemeFactualFirstClaimIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/themes/best-finales.md (entry #2 blurb)',
    )
  })

  it('passes for the rewritten HvV title (no "first" anywhere near the returnee/all-star tokens)', () => {
    makeShow(tmp, 'survivor')
    makeSeason(tmp, 'survivor', 20, 'heroes-vs-villains', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'survivor',
      season: 20,
      rank: 2,
      title:
        'The all-star format at its ceiling, closing on a final tribal that reads like a verdict on the returnee era.',
      blurb: 'The endgame compounds — every conversation freighted with everything Survivor had been by 2010.',
    })
    expect(collectThemeFactualFirstClaimIssues()).toEqual([])
  })

  it('is case-insensitive (catches a Title Case future authoring pass)', () => {
    makeShow(tmp, 'survivor')
    makeSeason(tmp, 'survivor', 20, 'heroes-vs-villains', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'survivor',
      season: 20,
      rank: 2,
      title:
        'The First All-Returnee Season Closing On A Final Tribal That Reads Like A Verdict.',
      blurb: 'Body copy.',
    })
    const issues = collectThemeFactualFirstClaimIssues()
    expect(issues.length).toBe(1)
  })

  it('does not flag a sentence where "first" is far from the returnee token', () => {
    makeShow(tmp, 'alpha')
    makeSeason(tmp, 'alpha', 5, 'allstars', {})
    makeThemeWithEntryText(tmp, 'best-finales', {
      show: 'alpha',
      season: 5,
      rank: 1,
      title:
        'The first leg sets the tone, and the back half holds the line on every returnee debate.',
      blurb: 'Body copy.',
    })
    // "first leg" is followed by ~70 chars before "returnee" — outside
    // the 40-char window the regex bounds. Not flagged.
    expect(collectThemeFactualFirstClaimIssues()).toEqual([])
  })
})

describe('content-check — show blurb/tagline count restate (critique pass-37, issue #333)', () => {
  let tmp: string

  function makeShowWithBlurbTagline(
    root: string,
    slug: string,
    opts: { blurb: string; tagline: string },
  ): void {
    const file = path.join(root, 'shows', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(
      file,
      `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: ${JSON.stringify(opts.blurb)}
tagline: ${JSON.stringify(opts.tagline)}
tier: B
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
    )
  }

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-count-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('flags 12 shows at the live catalog (this commit drains Survivor; the other 12 catch in subsequent drain ticks)', () => {
    setContentRoot(null)
    __resetContentCache()
    const issues = collectShowBlurbTaglineCountRepetitionIssues()
    // Survivor was the critique-named offender drained this commit.
    // The corpus sweep names 12 others (amazing-race, bachelor,
    // bachelorette, bake-off, big-brother, dragrace, love-island-uk,
    // love-island-us, project-runway, the-challenge, top-chef,
    // traitors) — same lax→strict pattern as
    // SEASON_EYEBROW_CALENDAR_STRICT / WATCHLIST_PHRASE_REPETITION_STRICT.
    // The invariant ships warn-only; the next drain ticks rewrite each
    // show's tagline and the final drain tick flips strict + this
    // expectation lands at zero.
    expect(issues.length).toBe(12)
    const offenders = issues.map((i) => i.file).sort()
    expect(offenders).not.toContain('content/shows/survivor.md')
  })

  it('flags a show whose blurb AND tagline both open on `<N> seasons`', () => {
    makeShowWithBlurbTagline(tmp, 'doubled', {
      blurb: '50 seasons. One torch at a time.',
      tagline:
        '50 seasons of strangers on a beach. The format that invented itself in episode one.',
    })
    const issues = collectShowBlurbTaglineCountRepetitionIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/doubled.md')
    expect(issues[0]!.message).toMatch(/hero\/body count-restate/)
    expect(issues[0]!.message).toMatch(/<N> seasons/)
  })

  it('allows a blurb-only count opener (the count belongs somewhere)', () => {
    makeShowWithBlurbTagline(tmp, 'blurb-only', {
      blurb: '50 seasons. One torch at a time.',
      tagline:
        'Strangers on a beach, voting each other off until one is left standing.',
    })
    expect(collectShowBlurbTaglineCountRepetitionIssues()).toEqual([])
  })

  it('allows a tagline-only count opener', () => {
    makeShowWithBlurbTagline(tmp, 'tagline-only', {
      blurb: 'One torch at a time.',
      tagline:
        '50 seasons of strangers on a beach, and the format still asks the same first question.',
    })
    expect(collectShowBlurbTaglineCountRepetitionIssues()).toEqual([])
  })

  it('allows a singular `season` opener (covers a one-season show)', () => {
    makeShowWithBlurbTagline(tmp, 'singular', {
      blurb: '1 season. The story stayed contained.',
      tagline:
        '1 season of stage and tarmac, and a casting bench that resolved itself in eight episodes.',
    })
    // Both still open on `<N> season(s)` — the regex is `\d+\s+seasons?`,
    // so this DOES flag. The case here documents the wider definition.
    expect(collectShowBlurbTaglineCountRepetitionIssues().length).toBe(1)
  })

  it('does not flag when the count is in the middle of the sentence', () => {
    makeShowWithBlurbTagline(tmp, 'embedded', {
      blurb: 'One torch at a time across 50 seasons.',
      tagline:
        'A franchise that has spent 50 seasons rediscovering what reality competition can do.',
    })
    expect(collectShowBlurbTaglineCountRepetitionIssues()).toEqual([])
  })

  it('is case-insensitive on the `seasons` token', () => {
    makeShowWithBlurbTagline(tmp, 'mixed-case', {
      blurb: '50 Seasons. One torch at a time.',
      tagline:
        '50 SEASONS of strangers on a beach, and the format keeps reinventing itself.',
    })
    expect(collectShowBlurbTaglineCountRepetitionIssues().length).toBe(1)
  })
})

describe('content-check — show tagline band-template echo (critique pass-41, issue #359)', () => {
  let tmp: string

  function makeShowInBand(
    root: string,
    slug: string,
    opts: {
      tier: 'S' | 'A' | 'B'
      tagline: string
      card_tagline?: string
    },
  ): void {
    const file = path.join(root, 'shows', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    const cardLine = opts.card_tagline
      ? `card_tagline: ${JSON.stringify(opts.card_tagline)}\n`
      : ''
    writeFileSync(
      file,
      `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: "One torch at a time."
tagline: ${JSON.stringify(opts.tagline)}
${cardLine}tier: ${opts.tier}
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
    )
  }

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'tiered-content-check-band-'))
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('reads zero issues at the live catalog (post-drain — A-tier carriers below floor 7)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectShowTaglineBandTemplateEchoIssues()).toEqual([])
  })

  it('flags a band where 7 of 8 shows share the same first-two-word lemma', () => {
    for (let i = 1; i <= 7; i++) {
      makeShowInBand(tmp, `templated-${i}`, {
        tier: 'A',
        tagline: `${10 + i} seasons of fill-in-the-blank that scans as templated.`,
      })
    }
    makeShowInBand(tmp, 'distinct', {
      tier: 'A',
      tagline: 'Strangers on a beach, voting each other off until one remains.',
    })
    const issues = collectShowTaglineBandTemplateEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/ (tier A)')
    expect(issues[0]!.message).toMatch(/tier-A band tagline template echo/)
    expect(issues[0]!.message).toMatch(/7 of 8 shows/)
    expect(issues[0]!.message).toMatch(/"<N> seasons"/)
  })

  it('allows 6 of 7 shows sharing a lemma — the floor of 6 carriers per band', () => {
    for (let i = 1; i <= 6; i++) {
      makeShowInBand(tmp, `templated-${i}`, {
        tier: 'A',
        tagline: `${10 + i} seasons of the same templated opener as the others.`,
      })
    }
    makeShowInBand(tmp, 'distinct', {
      tier: 'A',
      tagline: 'Strangers on a beach, voting each other off until one remains.',
    })
    expect(collectShowTaglineBandTemplateEchoIssues()).toEqual([])
  })

  it('reads the rendered tile field — `card_tagline` overrides `tagline` for the lemma', () => {
    const cardOpeners = [
      'Strangers on a beach hashing out the same vote.',
      'Amateur bakers in a white tent under judging clocks.',
      'Professional cooks in unfamiliar kitchens racing the fire.',
      'One woman with the keys to the calendar all season.',
      'Mallorca villa, fire pit, text messages read aloud at dusk.',
      'Queens at a Los Angeles workroom sewing through challenges.',
      'Reality veterans hurling themselves at each other for the final.',
    ]
    for (let i = 0; i < cardOpeners.length; i++) {
      makeShowInBand(tmp, `carrier-${i}`, {
        tier: 'A',
        tagline: `${10 + i} seasons of the same templated opener.`,
        card_tagline: cardOpeners[i]!,
      })
    }
    // All 7 shows share `<N> seasons` in `tagline`, but the rendered
    // tile reads `card_tagline` — which varies. The invariant follows
    // the renderer (ShowsTile.tsx:63), so no echo is flagged.
    expect(collectShowTaglineBandTemplateEchoIssues()).toEqual([])
  })

  it('normalizes leading digits — "15 seasons" and "40 seasons" collapse to one lemma', () => {
    const taglines = [
      '15 seasons of bakers under a tent.',
      '40 seasons of veterans hurling themselves at each other.',
      '22 seasons of professional cooks racing the clock.',
      '6 seasons of singles in a villa.',
      '11 seasons of an original people keep adapting.',
      '20 seasons of designers at sewing machines.',
      '28 seasons of one franchise running uninterrupted.',
    ]
    for (let i = 0; i < taglines.length; i++) {
      makeShowInBand(tmp, `digit-${i}`, { tier: 'A', tagline: taglines[i]! })
    }
    const issues = collectShowTaglineBandTemplateEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"<N> seasons"/)
  })

  it('partitions by tier — same lemma across S and A counts independently', () => {
    // 4 S-tier shares + 4 A-tier shares: each band is below floor 7
    // when computed independently, so no issue fires.
    for (let i = 1; i <= 4; i++) {
      makeShowInBand(tmp, `s-${i}`, {
        tier: 'S',
        tagline: `The format that defined ${i}.`,
      })
      makeShowInBand(tmp, `a-${i}`, {
        tier: 'A',
        tagline: `The format that defined ${i}.`,
      })
    }
    expect(collectShowTaglineBandTemplateEchoIssues()).toEqual([])
  })

  it('is case-insensitive on the lemma comparison', () => {
    for (let i = 1; i <= 7; i++) {
      makeShowInBand(tmp, `case-${i}`, {
        tier: 'A',
        tagline:
          i % 2 === 0
            ? `${10 + i} SEASONS of mixed-case templated openers.`
            : `${10 + i} seasons of mixed-case templated openers.`,
      })
    }
    const issues = collectShowTaglineBandTemplateEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/7 of 7 shows/)
  })

  it('strips em-dashes and surrounding punctuation when reading the first two words', () => {
    // "She holds the calendar" vs "She holds the keys" — both should
    // collapse to lemma "she holds" so the band's similarity is detected
    // even when the first three words diverge later.
    for (let i = 1; i <= 7; i++) {
      makeShowInBand(tmp, `she-${i}`, {
        tier: 'A',
        tagline: `She holds variation ${i} of the same opener.`,
      })
    }
    const issues = collectShowTaglineBandTemplateEchoIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.message).toMatch(/"she holds"/)
  })
})

describe('content-check — show tile-rendered field first-person voice (critique pass-42, issue #363)', () => {
  let tmp: string

  function makeTileShow(
    root: string,
    slug: string,
    opts: {
      tier: 'S' | 'A' | 'B'
      tagline: string
      card_tagline?: string
    },
  ): void {
    const file = path.join(root, 'shows', `${slug}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    const cardLine = opts.card_tagline
      ? `card_tagline: ${JSON.stringify(opts.card_tagline)}\n`
      : ''
    writeFileSync(
      file,
      `---
slug: ${slug}
name: ${slug}
palette:
  primary: "#000000"
  ink: "#FFFFFF"
  paper: "#777777"
seasons: 1
status: airing
blurb: "One torch at a time."
tagline: ${JSON.stringify(opts.tagline)}
${cardLine}tier: ${opts.tier}
network: "Test"
est_year: 2000
genre_tag: "Reality"
featured: false
---
`,
    )
  }

  beforeEach(() => {
    tmp = mkdtempSync(
      path.join(tmpdir(), 'tiered-content-check-tile-voice-'),
    )
    setContentRoot(tmp)
    __resetContentCache()
  })

  afterEach(() => {
    setContentRoot(null)
    __resetContentCache()
    rmSync(tmp, { recursive: true, force: true })
  })

  it('passes at the live catalog post-drain (Amazing Race card_tagline overrides the first-person tagline)', () => {
    setContentRoot(null)
    __resetContentCache()
    expect(collectShowCardTaglineVoiceConsistencyIssues()).toEqual([])
  })

  it('passes for a third-person tile-rendered field (no first-person markers)', () => {
    makeTileShow(tmp, 'alpha', {
      tier: 'A',
      tagline:
        'The longest-running travel competition on television — a route mechanic that has held its shape for years.',
    })
    expect(collectShowCardTaglineVoiceConsistencyIssues()).toEqual([])
  })

  it('flags the historical defect — Amazing Race-shaped first-person `I\'ve` close on a bare tagline', () => {
    makeTileShow(tmp, 'amazing-shape', {
      tier: 'A',
      tagline:
        "38 seasons of strangers running through airports. I've ranked every leg of every one.",
    })
    const issues = collectShowCardTaglineVoiceConsistencyIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/amazing-shape.md (tagline)',
    )
    expect(issues[0]!.message).toMatch(/tier-A/)
    expect(issues[0]!.message).toMatch(/first-person-singular voice/)
    expect(issues[0]!.message).toMatch(/issue #363/)
  })

  it('reads the rendered tile field — `card_tagline` overrides the `tagline` check (Survivor pattern)', () => {
    // Survivor's full `tagline` carries `I've ranked every single one.`
    // but its `card_tagline` is third-person — the tile-rendered field
    // (and the field the invariant checks) is `card_tagline`. No issue.
    makeTileShow(tmp, 'survivor-shape', {
      tier: 'S',
      tagline:
        "Strangers on a beach, voting each other off until one is left standing. I've ranked every single one.",
      card_tagline:
        'The format that invented itself in episode one, and is still finding new ways to ask who you really are.',
    })
    expect(collectShowCardTaglineVoiceConsistencyIssues()).toEqual([])
  })

  it('flags a `card_tagline` that re-introduces a first-person marker (regression pin)', () => {
    makeTileShow(tmp, 'regressed', {
      tier: 'A',
      tagline: 'A safe third-person hero tagline.',
      card_tagline: 'My favorite season of the bunch landed in the back half.',
    })
    const issues = collectShowCardTaglineVoiceConsistencyIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe('content/shows/regressed.md (card_tagline)')
    expect(issues[0]!.message).toMatch(/`card_tagline`/)
  })

  it('catches every first-person marker variant (`I` / `I\'ve` / `I\'m` / `my`)', () => {
    const variants: Array<{ slug: string; line: string }> = [
      { slug: 'bare-i', line: 'A long-running format that I keep coming back to.' },
      { slug: 'contracted-ive', line: "A long-running format. I've watched every season." },
      { slug: 'contracted-im', line: "A long-running format. I'm here for the long arcs." },
      { slug: 'possessive-my', line: 'A long-running format and my pick for the genre.' },
    ]
    for (const v of variants) {
      makeTileShow(tmp, v.slug, { tier: 'A', tagline: v.line })
    }
    const issues = collectShowCardTaglineVoiceConsistencyIssues()
    const flagged = issues.map((i) => i.file).sort()
    expect(flagged).toEqual([
      'content/shows/bare-i.md (tagline)',
      'content/shows/contracted-im.md (tagline)',
      'content/shows/contracted-ive.md (tagline)',
      'content/shows/possessive-my.md (tagline)',
    ])
  })

  it('does not false-positive on substrings containing the markers (e.g., "myth", "Iliad", "mind")', () => {
    makeTileShow(tmp, 'substrings', {
      tier: 'A',
      tagline:
        'A myth of competition built on mythical underdogs, the Iliad of reality television, all about the mind games.',
    })
    expect(collectShowCardTaglineVoiceConsistencyIssues()).toEqual([])
  })

  it('case-insensitive on the markers — catches sentence-initial `My` and uppercase `I` alike', () => {
    // The regex carries the `i` flag so sentence-initial possessive
    // `My favorite season...` (uppercase M) trips the same as the
    // mid-sentence lowercase form. Bare lowercase `i` standalone
    // ALSO trips (rare in editorial copy; the false-positive cost
    // is acceptable for catching the sentence-initial regression).
    makeTileShow(tmp, 'sentence-initial-my', {
      tier: 'A',
      tagline: 'My favorite season of the bunch landed in the back half.',
    })
    const issues = collectShowCardTaglineVoiceConsistencyIssues()
    expect(issues.length).toBe(1)
    expect(issues[0]!.file).toBe(
      'content/shows/sentence-initial-my.md (tagline)',
    )
  })

  it('flags each carrier independently when more than one show drifts', () => {
    makeTileShow(tmp, 'alpha', {
      tier: 'A',
      tagline: "A format I've watched every season of.",
    })
    makeTileShow(tmp, 'beta', {
      tier: 'A',
      tagline: 'A format and my pick of the genre.',
    })
    const issues = collectShowCardTaglineVoiceConsistencyIssues()
    expect(issues.length).toBe(2)
    const files = issues.map((i) => i.file).sort()
    expect(files).toEqual([
      'content/shows/alpha.md (tagline)',
      'content/shows/beta.md (tagline)',
    ])
  })
})
