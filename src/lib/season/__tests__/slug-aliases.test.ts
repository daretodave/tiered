import { describe, expect, it } from 'vitest'
import {
  SEASON_SLUG_ALIASES,
  resolveSeasonSlugAlias,
} from '../slug-aliases'

// `resolveSeasonSlugAlias` is consumed by the season page handler
// (`src/app/shows/[show]/season/[slug]/page.tsx`) to 308 legacy
// slugs to their canonical form. The redirect mechanism is SEO-
// load-bearing — a regression to 302/307 or to the wrong target
// silently drains accumulated authority off the legacy URL family.
// The e2e `redirects.spec.ts` walks the live 308 contract end-to-
// end; this colocated test pins the in-process resolution layer
// the page handler reads.

describe('SEASON_SLUG_ALIASES — registered redirects', () => {
  it('maps Survivor `heroes-villains` to the canonical `heroes-vs-villains` slug', () => {
    // Closes critique-pass-11 #185 — the natural-form `-vs-` slug a
    // reader would type (mirroring the editorial display title and
    // the other 4 vs.-named Survivor seasons) is canonical; the
    // bare `heroes-villains` form survives as a 308 alias.
    expect(SEASON_SLUG_ALIASES['survivor']?.['heroes-villains']).toBe(
      'heroes-vs-villains',
    )
  })

  it('every alias target is a non-empty kebab-case slug', () => {
    // Defensive: a regression that mapped a slug to '' or to a
    // value with bad characters would 308 to a 404 page. A bad
    // target string would silently break every external link.
    const slugRe = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    for (const aliases of Object.values(SEASON_SLUG_ALIASES)) {
      for (const target of Object.values(aliases)) {
        expect(target).toMatch(slugRe)
      }
    }
  })

  it('no alias maps to itself — a self-loop would 308 infinitely', () => {
    for (const aliases of Object.values(SEASON_SLUG_ALIASES)) {
      for (const [from, to] of Object.entries(aliases)) {
        expect(from).not.toBe(to)
      }
    }
  })
})

describe('resolveSeasonSlugAlias — handler', () => {
  it('returns the canonical slug for a registered alias', () => {
    expect(resolveSeasonSlugAlias('survivor', 'heroes-villains')).toBe(
      'heroes-vs-villains',
    )
  })

  it('returns null when the show has no aliases at all', () => {
    // The page handler's gate is `if (aliasTarget) permanentRedirect(...)`
    // — a regression returning '' or undefined would still falsy-skip
    // the redirect, but a regression returning the bare slug back
    // would 308 every season URL to itself. Pin the null contract.
    expect(resolveSeasonSlugAlias('bachelor', 'heroes-villains')).toBeNull()
  })

  it('returns null when the show is registered but the slug is not aliased', () => {
    // A canonical slug like 'heroes-vs-villains' itself must NOT
    // resolve through the alias map — the page handler would then
    // 308 the canonical URL elsewhere or into a loop.
    expect(resolveSeasonSlugAlias('survivor', 'heroes-vs-villains')).toBeNull()
    expect(resolveSeasonSlugAlias('survivor', 'borneo')).toBeNull()
  })

  it('returns null for empty strings', () => {
    expect(resolveSeasonSlugAlias('', '')).toBeNull()
    expect(resolveSeasonSlugAlias('survivor', '')).toBeNull()
    expect(resolveSeasonSlugAlias('', 'heroes-villains')).toBeNull()
  })

  it('never returns a slug that resolves through the alias map again', () => {
    // Two-hop chains would 308 → 308 → 200. The page handler does
    // one resolution per request; chains would silently double the
    // redirect cost and trip browser redirect limits at scale.
    for (const aliases of Object.values(SEASON_SLUG_ALIASES)) {
      for (const target of Object.values(aliases)) {
        for (const [show, showAliases] of Object.entries(
          SEASON_SLUG_ALIASES,
        )) {
          expect(
            showAliases[target],
            `alias target ${show}:${target} must not itself be an alias`,
          ).toBeUndefined()
        }
      }
    }
  })
})
