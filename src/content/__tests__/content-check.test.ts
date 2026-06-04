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
  collectCalendarFailures,
  collectClicheRepetitionIssues,
  collectCrossShowIssues,
  collectFailures,
  collectTaglineTemplatedTailIssues,
  collectThemeBodyPhraseRepetitionIssues,
  collectThemeDescriptionCountTailIssues,
  collectThemedEntrySpoilerIssues,
  collectThemeFailures,
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
curator: "tiered.tv Editors"
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
