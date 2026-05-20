import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as errorsModule from '../errors'
import * as featuredModule from '../featured'
import * as loadersModule from '../loaders'
import * as pathsModule from '../paths'

import type {
  CanonEntry,
  CanonFile,
  CommunityRankHint,
  EraBand,
  LegalDoc,
  Season,
  SeasonFrontmatter,
  Show,
  ShowFrontmatter,
  ShowTier,
  Theme,
  ThemeCategory,
  ThemeEntry,
  ThemeFrontmatter,
  ThemeSentiment,
  ThemeStats,
  ThemeStatus,
  WatchListItem,
} from '../index'

const EXPECTED_RUNTIME_KEYS = [
  '__resetContentCache',
  'ContentValidationError',
  'getAllSeasons',
  'getAllShows',
  'getAllThemes',
  'getCanon',
  'getFeaturedShow',
  'getFeaturedShowSlug',
  'getFeaturedThemes',
  'getLegalDoc',
  'getRelatedThemes',
  'getSeason',
  'getSeasonBySlug',
  'getShow',
  'getShowsForTheme',
  'getTheme',
  'getThemeStats',
  'getThemesByCategory',
  'loadAllContent',
  'setContentRoot',
] as const

describe('@/content barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every ./loaders runtime export verbatim (===, not a wrapped reference)', () => {
      expect(barrel.__resetContentCache).toBe(loadersModule.__resetContentCache)
      expect(barrel.getAllSeasons).toBe(loadersModule.getAllSeasons)
      expect(barrel.getAllShows).toBe(loadersModule.getAllShows)
      expect(barrel.getAllThemes).toBe(loadersModule.getAllThemes)
      expect(barrel.getCanon).toBe(loadersModule.getCanon)
      expect(barrel.getFeaturedThemes).toBe(loadersModule.getFeaturedThemes)
      expect(barrel.getLegalDoc).toBe(loadersModule.getLegalDoc)
      expect(barrel.getRelatedThemes).toBe(loadersModule.getRelatedThemes)
      expect(barrel.getSeason).toBe(loadersModule.getSeason)
      expect(barrel.getSeasonBySlug).toBe(loadersModule.getSeasonBySlug)
      expect(barrel.getShow).toBe(loadersModule.getShow)
      expect(barrel.getShowsForTheme).toBe(loadersModule.getShowsForTheme)
      expect(barrel.getTheme).toBe(loadersModule.getTheme)
      expect(barrel.getThemeStats).toBe(loadersModule.getThemeStats)
      expect(barrel.getThemesByCategory).toBe(loadersModule.getThemesByCategory)
      expect(barrel.loadAllContent).toBe(loadersModule.loadAllContent)
    })

    it('forwards ./errors ContentValidationError verbatim', () => {
      expect(barrel.ContentValidationError).toBe(errorsModule.ContentValidationError)
    })

    it('forwards ./featured runtime exports verbatim', () => {
      expect(barrel.getFeaturedShow).toBe(featuredModule.getFeaturedShow)
      expect(barrel.getFeaturedShowSlug).toBe(featuredModule.getFeaturedShowSlug)
    })

    it('forwards ./paths setContentRoot verbatim', () => {
      expect(barrel.setContentRoot).toBe(pathsModule.setContentRoot)
    })
  })

  describe('public-surface key snapshot', () => {
    it('exposes exactly the documented 20 runtime keys, nothing more, nothing less', () => {
      const keys = Object.keys(barrel).sort()
      expect(keys).toEqual([...EXPECTED_RUNTIME_KEYS].sort())
    })

    it('every documented runtime key resolves to a defined value (no undefined holes)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(barrel[key as keyof typeof barrel]).toBeDefined()
      }
    })

    it('every function-shaped runtime export is in fact a function (catches accidental value/type swap)', () => {
      const functionExports: ReadonlyArray<keyof typeof barrel> = [
        '__resetContentCache',
        'getAllSeasons',
        'getAllShows',
        'getAllThemes',
        'getCanon',
        'getFeaturedShow',
        'getFeaturedShowSlug',
        'getFeaturedThemes',
        'getLegalDoc',
        'getRelatedThemes',
        'getSeason',
        'getSeasonBySlug',
        'getShow',
        'getShowsForTheme',
        'getTheme',
        'getThemeStats',
        'getThemesByCategory',
        'loadAllContent',
        'setContentRoot',
      ]
      for (const key of functionExports) {
        expect(typeof barrel[key]).toBe('function')
      }
    })

    it('ContentValidationError is the constructable Error subclass (not a stale value)', () => {
      expect(typeof barrel.ContentValidationError).toBe('function')
      const err = new barrel.ContentValidationError('boom', 'x.md')
      expect(err).toBeInstanceOf(Error)
      expect(err).toBeInstanceOf(barrel.ContentValidationError)
    })
  })

  describe('private-helper non-leak from ./paths', () => {
    it('does not expose internal path helpers — only setContentRoot is public', () => {
      const leaked: string[] = []
      const privateHelpers = [
        'getContentRoot',
        'showsDir',
        'showFile',
        'seasonsDir',
        'canonFile',
        'themesDir',
        'themeFile',
        'legalDir',
        'legalFile',
        'calendarFile',
      ] as const
      for (const helper of privateHelpers) {
        if (helper in barrel) leaked.push(helper)
      }
      expect(leaked).toEqual([])
    })

    it('confirms the private helpers DO exist on the source module (so the non-leak check above is meaningful)', () => {
      expect(pathsModule.getContentRoot).toBeDefined()
      expect(pathsModule.showsDir).toBeDefined()
      expect(pathsModule.showFile).toBeDefined()
      expect(pathsModule.seasonsDir).toBeDefined()
      expect(pathsModule.canonFile).toBeDefined()
      expect(pathsModule.themesDir).toBeDefined()
      expect(pathsModule.themeFile).toBeDefined()
      expect(pathsModule.legalDir).toBeDefined()
      expect(pathsModule.legalFile).toBeDefined()
      expect(pathsModule.calendarFile).toBeDefined()
    })
  })

  describe('type re-exports compile through the barrel', () => {
    // The top-of-file `import type { ... } from '../index'` block is the
    // load-bearing assertion here: if any of the 18 type names ever drops
    // off the barrel (or is renamed at source without barrel update),
    // typecheck fails before this suite even runs. The runtime checks
    // below pin a single value of each type through the barrel as a
    // belt-and-braces guarantee that the names round-trip cleanly.
    it('accepts each type name in a type-only position via the barrel', () => {
      const tier: ShowTier = 'S'
      const themeCategory: ThemeCategory = 'tone'
      const themeStatus: ThemeStatus = 'growing'
      const themeSentiment: ThemeSentiment = 'hold'
      expect(tier).toBe('S')
      expect(themeCategory).toBe('tone')
      expect(themeStatus).toBe('growing')
      expect(themeSentiment).toBe('hold')

      // Force the structural type names into the test scope so a future
      // accidental removal of any of them from the barrel surfaces here
      // (in addition to the import-block typecheck). The values are
      // immaterial — the test fails at compile time if any of these
      // names disappears from `../index`.
      type RuntimeShapes = {
        canonEntry?: CanonEntry
        canonFile?: CanonFile
        communityRankHint?: CommunityRankHint
        eraBand?: EraBand
        legalDoc?: LegalDoc
        season?: Season
        seasonFrontmatter?: SeasonFrontmatter
        show?: Show
        showFrontmatter?: ShowFrontmatter
        theme?: Theme
        themeEntry?: ThemeEntry
        themeFrontmatter?: ThemeFrontmatter
        themeStats?: ThemeStats
        watchListItem?: WatchListItem
      }
      const sample: RuntimeShapes = {}
      expect(sample).toEqual({})
    })
  })
})
