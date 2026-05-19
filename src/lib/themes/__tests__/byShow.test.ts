import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Consolidated from the §5a-violating sibling `src/lib/themes/byShow.test.ts`
// into the colocated `__tests__/` path the next loop tick's discovery
// scans. Strict superset: every prior case is retained verbatim in the
// first describe (same real-fixture `setContentRoot` strategy — no
// mock-strategy switch, no parity loss), then new edge coverage is added
// in dedicated describes with their own fixtures so the verbatim block
// keeps running against the exact prior fixture.

// --- prior fixture (verbatim) -----------------------------------------

// Spin up a tiny content/ root with one show, two seasons, and
// two themed lists — one referencing the show, one not — to
// exercise themesContainingShow() without depending on the live
// content tree.

describe('themesContainingShow', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-bs-'))
    mkdirSync(join(tmpRoot, 'shows', 'survivor', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'shows', 'top-chef'), { recursive: true })
    mkdirSync(join(tmpRoot, 'themes'), { recursive: true })

    writeFileSync(
      join(tmpRoot, 'shows', 'survivor.md'),
      `---
slug: survivor
name: Survivor
palette:
  primary: '#aa3300'
  ink: '#111111'
  paper: '#fafafa'
seasons: 47
status: airing
blurb: One torch at a time.
tagline: 47 seasons of strangers on a beach.
tier: S
network: "CBS"
est_year: 2000
genre_tag: "Reality competition"
featured: true
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'shows', 'top-chef.md'),
      `---
slug: top-chef
name: Top Chef
palette:
  primary: '#003366'
  ink: '#111111'
  paper: '#fafafa'
seasons: 22
status: airing
blurb: Knives drawn, herbs fresh.
tagline: 22 seasons of professional cooks.
tier: A
network: "Bravo"
est_year: 2006
genre_tag: "Culinary competition"
featured: false
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'shows', 'survivor', 'seasons', '01-borneo.md'),
      `---
show: survivor
number: 1
title: Borneo
---

Sixteen Americans on a Malaysian island and a host with a torch — that was the pitch, and the format invented itself on camera. The cast plays like people who half-believe they're on a game show and half-believe they're on a documentary. CBS aired it across the summer of two thousand as appointment television, and the rough edges show in the best way.
`,
    )
    writeFileSync(
      join(tmpRoot, 'themes', 'survivor-only.md'),
      `---
slug: survivor-only
title: Survivor only
description: Themed list referencing only survivor seasons.
tagline: A pull-quote for the detail page.
category: single
last_revised: 2026-01-01
entries:
  - show: survivor
    season: 1
    rank: 1
    title: The founding text.
    blurb: The founding text.
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'themes', 'empty-theme.md'),
      `---
slug: empty-theme
title: Empty theme
description: Themed list referencing a show with no surviving entries.
tagline: Another pull-quote for the detail page.
category: tone
last_revised: 2026-01-02
entries:
  - show: survivor
    season: 1
    rank: 1
    title: irrelevant
    blurb: irrelevant
---
`,
    )

    const content = await import('@/content')
    content.setContentRoot(tmpRoot)
    content.__resetContentCache()
  })

  afterEach(async () => {
    const content = await import('@/content')
    content.__resetContentCache()
    content.setContentRoot(null)
    rmSync(tmpRoot, { recursive: true, force: true })
    vi.resetModules()
  })

  it('returns themes that contain the given show', async () => {
    const { themesContainingShow } = await import('../byShow')
    const themes = themesContainingShow('survivor')
    expect(themes.map((t) => t.slug).sort()).toEqual(['empty-theme', 'survivor-only'])
  })

  it('returns empty array when no themes reference the show', async () => {
    const { themesContainingShow } = await import('../byShow')
    expect(themesContainingShow('top-chef')).toEqual([])
  })

  it('returns empty array for unknown show', async () => {
    const { themesContainingShow } = await import('../byShow')
    expect(themesContainingShow('does-not-exist')).toEqual([])
  })
})

// --- new edge coverage -------------------------------------------------

// A richer themed-list set: multi-show themes, a theme that names the
// target show in several entries, a near-miss slug (prefix collision),
// and a theme that does not reference the show at all. `getAllThemes()`
// returns themes slug-ascending (loaders.ts:210), and themesContainingShow
// is an order-preserving `.filter()`, so the result order is the
// deterministic slug-ascending subset — asserted without re-sorting.

describe('themesContainingShow — selection + ordering edges', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-bs-edge-'))
    mkdirSync(join(tmpRoot, 'shows'), { recursive: true })
    mkdirSync(join(tmpRoot, 'themes'), { recursive: true })

    for (const [slug, name] of [
      ['survivor', 'Survivor'],
      ['survivor-australia', 'Survivor Australia'],
      ['top-chef', 'Top Chef'],
    ] as const) {
      writeFileSync(
        join(tmpRoot, 'shows', `${slug}.md`),
        `---
slug: ${slug}
name: ${name}
palette:
  primary: '#aa3300'
  ink: '#111111'
  paper: '#fafafa'
seasons: 10
status: ended
blurb: A blurb.
tagline: A tagline for ${name}.
tier: A
network: "Net"
est_year: 2001
genre_tag: "Reality competition"
featured: false
---
`,
      )
    }

    // z-* slugs sort last; the survivor-naming theme sorts first.
    writeFileSync(
      join(tmpRoot, 'themes', 'a-survivor-doubled.md'),
      `---
slug: a-survivor-doubled
title: Survivor doubled
description: Names survivor in two separate entries.
tagline: A pull-quote.
category: tone
last_revised: 2026-02-01
entries:
  - show: survivor
    season: 1
    rank: 1
    title: First survivor entry.
    blurb: First survivor entry.
  - show: top-chef
    season: 2
    rank: 2
    title: A top-chef entry.
    blurb: A top-chef entry.
  - show: survivor
    season: 7
    rank: 3
    title: Second survivor entry.
    blurb: Second survivor entry.
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'themes', 'm-prefix-collision.md'),
      `---
slug: m-prefix-collision
title: Prefix collision
description: Names only survivor-australia, never survivor.
tagline: A pull-quote.
category: single
last_revised: 2026-02-02
entries:
  - show: survivor-australia
    season: 1
    rank: 1
    title: An australia entry.
    blurb: An australia entry.
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'themes', 'z-mixed.md'),
      `---
slug: z-mixed
title: Mixed
description: Names survivor once among other shows.
tagline: A pull-quote.
category: tone
last_revised: 2026-02-03
entries:
  - show: top-chef
    season: 1
    rank: 1
    title: A top-chef entry.
    blurb: A top-chef entry.
  - show: survivor
    season: 4
    rank: 2
    title: A survivor entry.
    blurb: A survivor entry.
---
`,
    )

    const content = await import('@/content')
    content.setContentRoot(tmpRoot)
    content.__resetContentCache()
  })

  afterEach(async () => {
    const content = await import('@/content')
    content.__resetContentCache()
    content.setContentRoot(null)
    rmSync(tmpRoot, { recursive: true, force: true })
    vi.resetModules()
  })

  it('returns each matching theme exactly once even when the show appears in multiple entries', async () => {
    const { themesContainingShow } = await import('../byShow')
    const slugs = themesContainingShow('survivor').map((t) => t.slug)
    // a-survivor-doubled names survivor twice; it must appear once.
    expect(slugs.filter((s) => s === 'a-survivor-doubled')).toHaveLength(1)
  })

  it('preserves the slug-ascending order getAllThemes yields (no internal re-sort)', async () => {
    const { themesContainingShow } = await import('../byShow')
    expect(themesContainingShow('survivor').map((t) => t.slug)).toEqual([
      'a-survivor-doubled',
      'z-mixed',
    ])
  })

  it('matches the show slug exactly — a prefix-colliding slug does not match', async () => {
    const { themesContainingShow } = await import('../byShow')
    // Querying 'survivor' must not pull in m-prefix-collision, which
    // only references 'survivor-australia'.
    expect(themesContainingShow('survivor').map((t) => t.slug)).not.toContain(
      'm-prefix-collision',
    )
    // And the longer slug resolves only its own theme.
    expect(themesContainingShow('survivor-australia').map((t) => t.slug)).toEqual([
      'm-prefix-collision',
    ])
  })

  it('is case-sensitive on the show slug (slugs are lowercase)', async () => {
    const { themesContainingShow } = await import('../byShow')
    expect(themesContainingShow('Survivor')).toEqual([])
    expect(themesContainingShow('SURVIVOR')).toEqual([])
  })

  it('returns the full Theme objects with their entries intact', async () => {
    const { themesContainingShow } = await import('../byShow')
    const doubled = themesContainingShow('survivor').find(
      (t) => t.slug === 'a-survivor-doubled',
    )
    expect(doubled).toBeDefined()
    expect(doubled?.title).toBe('Survivor doubled')
    expect(doubled?.entries).toHaveLength(3)
    expect(doubled?.entries.map((e) => e.show)).toEqual([
      'survivor',
      'top-chef',
      'survivor',
    ])
  })

  it('returns a fresh array and does not surface a query for a show that exists only as a show file, not in any theme', async () => {
    const { themesContainingShow } = await import('../byShow')
    const a = themesContainingShow('survivor')
    const b = themesContainingShow('survivor')
    expect(a).not.toBe(b)
    expect(a.map((t) => t.slug)).toEqual(b.map((t) => t.slug))
    // survivor-australia has a show file and a theme; top-chef has a
    // show file and theme entries; a show with neither yields [].
    expect(themesContainingShow('never-listed')).toEqual([])
  })
})

// Empty content tree: no themes at all → [] (not a throw).
describe('themesContainingShow — empty content tree', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-bs-empty-'))
    mkdirSync(join(tmpRoot, 'shows'), { recursive: true })
    mkdirSync(join(tmpRoot, 'themes'), { recursive: true })
    const content = await import('@/content')
    content.setContentRoot(tmpRoot)
    content.__resetContentCache()
  })

  afterEach(async () => {
    const content = await import('@/content')
    content.__resetContentCache()
    content.setContentRoot(null)
    rmSync(tmpRoot, { recursive: true, force: true })
    vi.resetModules()
  })

  it('returns [] when there are no themes', async () => {
    const { themesContainingShow } = await import('../byShow')
    expect(themesContainingShow('survivor')).toEqual([])
  })
})
