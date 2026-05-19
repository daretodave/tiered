import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Consolidated from the §5a-violating sibling `src/lib/searchIndex.test.ts`
// into the colocated `__tests__/` path the next loop tick's discovery
// scans. Strict superset: every prior case is retained verbatim in the
// first describe (same real-fixture `setContentRoot` strategy — no
// mock-strategy switch, no parity loss), then new edge coverage is added
// in dedicated describes with their own fixtures so the verbatim block
// keeps running against the exact prior fixture.

// --- prior fixture (verbatim) -----------------------------------------

describe('getSearchIndex', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-search-index-'))
    mkdirSync(join(tmpRoot, 'shows', 'survivor', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'shows', 'top-chef', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'themes'), { recursive: true })

    writeFileSync(
      join(tmpRoot, 'shows', 'survivor.md'),
      `---
slug: survivor
name: Survivor
palette:
  primary: '#D55E36'
  ink: '#EFE2BD'
  paper: '#0E2A2A'
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
  primary: '#B86A2E'
  ink: '#EAE2D4'
  paper: '#1E160F'
seasons: 21
status: ended
blurb: A finished dish, every time.
tagline: Twenty-one seasons in the pass.
tier: A
network: "Bravo"
est_year: 2006
genre_tag: "Culinary competition"
featured: false
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'shows', 'survivor', 'seasons', '20-heroes-vs-villains.md'),
      `---
show: survivor
number: 20
title: Heroes vs. Villains
location: Samoa
host: Jeff Probst
format_changes: []
---

A returning-player season that delivered every promise of the format and most of the promises of the show itself. Twenty contestants, ten heroes, ten villains, every one of them played to win, and most of them played to be remembered for it. The editing is brutal and fair and somehow loving toward people who do terrible things on television. The cast was top-shelf and the game responded by sharpening every twist the producers had been hoarding for ten years.
`,
    )
    writeFileSync(
      join(tmpRoot, 'themes', 'best-premieres.md'),
      `---
slug: best-premieres
title: Best premieres ever
description: The cold opens that promised a season worth staying for.
tagline: The episodes that promised a season.
category: tone
sentiment: warm-up
last_revised: 2026-05-01
entries:
  - show: survivor
    season: 1
    rank: 1
    title: The literal first.
    blurb: The literal first.
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

  it('emits show + season + list + tier rows', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const items = getSearchIndex()
    const types = new Set(items.map((i) => i.type))
    expect(types.has('show')).toBe(true)
    expect(types.has('season')).toBe(true)
    expect(types.has('list')).toBe(true)
    expect(types.has('tier')).toBe(true)
  })

  it('routes shows to /shows/[slug]', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const shows = getSearchIndex().filter((i) => i.type === 'show')
    expect(shows.find((s) => s.name === 'Survivor')?.href).toBe('/shows/survivor')
  })

  it('formats season meta with show name + zero-padded number', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const seasons = getSearchIndex().filter((i) => i.type === 'season')
    const heroes = seasons.find((s) => s.name === 'Heroes vs. Villains')
    expect(heroes?.meta).toBe('Survivor · season 20')
    expect(heroes?.href).toBe('/shows/survivor/season/heroes-vs-villains')
    expect(heroes?.tier).toBe('S')
  })

  it('produces one tier row per tier with at least one show', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const tiers = getSearchIndex().filter((i) => i.type === 'tier')
    expect(tiers.map((t) => t.name).sort()).toEqual(['A tier', 'S tier'])
    expect(tiers[0]?.href.startsWith('/shows#tier-')).toBe(true)
  })

  it('routes lists to /themes/[slug] with show + entry meta', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const lists = getSearchIndex().filter((i) => i.type === 'list')
    const best = lists.find((l) => l.name === 'Best premieres ever')
    expect(best?.href).toBe('/themes/best-premieres')
    expect(best?.meta).toMatch(/1 show/)
  })

  // --- new edge coverage on the prior fixture (no fixture change) -----

  it('carries the show palette primary as the show + season color', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const items = getSearchIndex()
    const survivor = items.find((i) => i.type === 'show' && i.name === 'Survivor')
    expect(survivor?.color).toBe('#D55E36')
    const heroes = items.find(
      (i) => i.type === 'season' && i.name === 'Heroes vs. Villains',
    )
    // Seasons inherit their show's primary, not a per-season color.
    expect(heroes?.color).toBe('#D55E36')
  })

  it('renders airing + ended status as "canon + community" with pluralized season count', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const shows = getSearchIndex().filter((i) => i.type === 'show')
    expect(shows.find((s) => s.name === 'Survivor')?.meta).toBe(
      '47 seasons · canon + community',
    )
    expect(shows.find((s) => s.name === 'Top Chef')?.meta).toBe(
      '21 seasons · canon + community',
    )
  })

  it('colors a known-sentiment list from the sentiment palette and tiers ceremonial gold', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const items = getSearchIndex()
    const best = items.find((i) => i.type === 'list' && i.name === 'Best premieres ever')
    // best-premieres sentiment is warm-up → #E0843A (not the gold fallback).
    expect(best?.color).toBe('#E0843A')
    expect(best?.meta).toBe('1 show · 1 entry')
    for (const tier of items.filter((i) => i.type === 'tier')) {
      expect(tier.color).toBe('#E8B65A')
    }
  })

  it('emits exact S/A tier rows with tag-derived meta + #tier anchors', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const tiers = getSearchIndex().filter((i) => i.type === 'tier')
    const s = tiers.find((t) => t.name === 'S tier')
    const a = tiers.find((t) => t.name === 'A tier')
    expect(s?.meta).toBe('1 show · format-defining')
    expect(s?.href).toBe('/shows#tier-S')
    expect(a?.meta).toBe('1 show · deep canon')
    expect(a?.href).toBe('/shows#tier-A')
  })

  it('orders the index by section: every show, then seasons, then lists, then tiers', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const types = getSearchIndex().map((i) => i.type)
    const firstSeason = types.indexOf('season')
    const firstList = types.indexOf('list')
    const firstTier = types.indexOf('tier')
    const lastShow = types.lastIndexOf('show')
    const lastSeason = types.lastIndexOf('season')
    const lastList = types.lastIndexOf('list')
    expect(lastShow).toBeLessThan(firstSeason)
    expect(lastSeason).toBeLessThan(firstList)
    expect(lastList).toBeLessThan(firstTier)
  })
})

// --- pluralization + status + tier-order edges (own fixture) ----------

describe('getSearchIndex — pluralization, status, and tier order', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-search-index-edge-'))
    mkdirSync(join(tmpRoot, 'shows', 'solo', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'shows', 'paused', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'shows', 'recent', 'seasons'), { recursive: true })
    mkdirSync(join(tmpRoot, 'themes'), { recursive: true })

    // Single-season + S tier — exercises "1 season" + a single-digit
    // zero-padded season number.
    writeFileSync(
      join(tmpRoot, 'shows', 'solo.md'),
      `---
slug: solo
name: Solo
palette:
  primary: '#111111'
  ink: '#EEEEEE'
  paper: '#222222'
seasons: 1
status: ended
blurb: One and done.
tagline: A single season, ranked.
tier: S
network: "Net"
est_year: 2020
genre_tag: "Reality competition"
featured: false
---
`,
    )
    // Hiatus → "in review"; B tier.
    writeFileSync(
      join(tmpRoot, 'shows', 'paused.md'),
      `---
slug: paused
name: Paused
palette:
  primary: '#333333'
  ink: '#DDDDDD'
  paper: '#444444'
seasons: 4
status: hiatus
blurb: On a break.
tagline: Four seasons, then quiet.
tier: B
network: "Net"
est_year: 2018
genre_tag: "Reality competition"
featured: false
---
`,
    )
    // Second B-tier show so the B tier row pluralizes to "2 shows".
    writeFileSync(
      join(tmpRoot, 'shows', 'recent.md'),
      `---
slug: recent
name: Recent
palette:
  primary: '#555555'
  ink: '#CCCCCC'
  paper: '#666666'
seasons: 2
status: airing
blurb: Brand new.
tagline: Two seasons in.
tier: B
network: "Net"
est_year: 2025
genre_tag: "Reality competition"
featured: false
---
`,
    )
    writeFileSync(
      join(tmpRoot, 'shows', 'solo', 'seasons', '3-the-third.md'),
      `---
show: solo
number: 3
title: The Third
location: Somewhere
host: A Host
format_changes: []
---

A perfectly ordinary season blurb that exists only so the loader has a real season to index for the single-digit zero-pad assertion in this suite. It deliberately says nothing about who wins, who goes home, or how anything resolves, because spoilers are never the point of a fixture and the word count simply needs to land somewhere inside the fifty to eighty word window the season schema enforces on every blurb it parses.
`,
    )
    // Multi-entry, multi-show theme → "2 shows · 3 entries"; sentiment
    // consensus maps to its own palette color.
    writeFileSync(
      join(tmpRoot, 'themes', 'big-list.md'),
      `---
slug: big-list
title: A Big List
description: Several entries across more than one show.
tagline: More than one of everything.
category: craft
sentiment: consensus
last_revised: 2026-05-02
entries:
  - show: solo
    season: 1
    rank: 1
    title: First.
    blurb: First.
  - show: paused
    season: 2
    rank: 2
    title: Second.
    blurb: Second.
  - show: solo
    season: 3
    rank: 3
    title: Third.
    blurb: Third.
---
`,
    )
    // Sentiment omitted → schema defaults to 'hold' → #7A8F5C (a known
    // color, not the gold fallback — the literal '#E8B65A' fallback in
    // themeColor is unreachable through valid content since every
    // themeSentimentEnum value has a SENTIMENT_COLORS entry).
    writeFileSync(
      join(tmpRoot, 'themes', 'default-sentiment.md'),
      `---
slug: default-sentiment
title: Default Sentiment
description: No sentiment declared.
tagline: Lets the schema default decide.
category: tone
last_revised: 2026-05-03
entries:
  - show: recent
    season: 1
    rank: 1
    title: Only.
    blurb: Only.
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

  it('singularizes a one-season show and renders hiatus as "in review"', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const shows = getSearchIndex().filter((i) => i.type === 'show')
    expect(shows.find((s) => s.name === 'Solo')?.meta).toBe(
      '1 season · canon + community',
    )
    expect(shows.find((s) => s.name === 'Paused')?.meta).toBe(
      '4 seasons · in review',
    )
  })

  it('zero-pads a single-digit season number to two digits', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const third = getSearchIndex().find(
      (i) => i.type === 'season' && i.name === 'The Third',
    )
    expect(third?.meta).toBe('Solo · season 03')
    expect(third?.href).toBe('/shows/solo/season/the-third')
  })

  it('orders tier rows by TIER_ORDER (S, A, B) and skips empty tiers', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const tiers = getSearchIndex()
      .filter((i) => i.type === 'tier')
      .map((t) => t.name)
    // One S show, no A shows, two B shows → A tier is skipped, order is
    // TIER_ORDER not insertion/alpha.
    expect(tiers).toEqual(['S tier', 'B tier'])
  })

  it('pluralizes the B tier meta to "2 shows" with the lowercased tag', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const b = getSearchIndex().find((i) => i.type === 'tier' && i.name === 'B tier')
    expect(b?.meta).toBe('2 shows · recent additions · under review')
  })

  it('pluralizes list meta across shows + entries', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const big = getSearchIndex().find(
      (i) => i.type === 'list' && i.name === 'A Big List',
    )
    // 3 entries spanning solo + paused → 2 distinct shows.
    expect(big?.meta).toBe('2 shows · 3 entries')
    expect(big?.color).toBe('#D5A93D') // consensus
  })

  it('falls back to the schema-default "hold" sentiment color when sentiment is omitted', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    const def = getSearchIndex().find(
      (i) => i.type === 'list' && i.name === 'Default Sentiment',
    )
    expect(def?.color).toBe('#7A8F5C') // hold (schema default)
    expect(def?.meta).toBe('1 show · 1 entry')
  })
})

// --- empty content ----------------------------------------------------

describe('getSearchIndex — empty content', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'tiered-search-index-empty-'))
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

  it('returns an empty index when there is no content', async () => {
    const { getSearchIndex } = await import('../searchIndex')
    expect(getSearchIndex()).toEqual([])
  })
})
