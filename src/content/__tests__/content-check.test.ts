import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { __resetContentCache } from '../loaders'
import { setContentRoot } from '../paths'
// scripts/content-check.ts exports its assertion logic so the same
// rules can be exercised in vitest without spawning a child process.
import {
  collectCalendarFailures,
  collectCrossShowIssues,
  collectFailures,
  collectThemeFailures,
  collectYearTenureIssues,
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
    // the `\b<tens>-<word> years\b` regex, so they pass silently.
    expect(collectYearTenureIssues(asOf)).toEqual([])
  })
})
