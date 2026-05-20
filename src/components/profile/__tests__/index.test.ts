import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as ProfileCommentsModule from '../ProfileComments'
import * as ProfileEmptyModule from '../ProfileEmpty'
import * as ProfileHeaderModule from '../ProfileHeader'
import * as ProfileStatsModule from '../ProfileStats'

import type { ProfileCommentView, ProfileView } from '../index'

const EXPECTED_RUNTIME_KEYS = [
  'ProfileComments',
  'ProfileEmpty',
  'ProfileHeader',
  'ProfileStats',
] as const

describe('@/components/profile barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every component verbatim (===, not a wrapped reference)', () => {
      expect(barrel.ProfileComments).toBe(ProfileCommentsModule.ProfileComments)
      expect(barrel.ProfileEmpty).toBe(ProfileEmptyModule.ProfileEmpty)
      expect(barrel.ProfileHeader).toBe(ProfileHeaderModule.ProfileHeader)
      expect(barrel.ProfileStats).toBe(ProfileStatsModule.ProfileStats)
    })
  })

  describe('public-surface key snapshot', () => {
    it('exposes exactly the documented 4 runtime keys, nothing more, nothing less', () => {
      const keys = Object.keys(barrel).sort()
      expect(keys).toEqual([...EXPECTED_RUNTIME_KEYS].sort())
    })

    it('every documented runtime key resolves to a defined value (no undefined holes)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(barrel[key as keyof typeof barrel]).toBeDefined()
      }
    })

    it('every export is in fact a function (catches accidental value/type swap)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(typeof barrel[key as keyof typeof barrel]).toBe('function')
      }
    })

    it('the barrel exports nothing besides the 4 documented symbols (no helpers, no constants, no types-promoted-to-runtime)', () => {
      const documented = new Set<string>(EXPECTED_RUNTIME_KEYS)
      const extras = Object.keys(barrel).filter((k) => !documented.has(k))
      expect(extras).toEqual([])
    })
  })

  describe('type re-exports compile through the barrel', () => {
    // The top-of-file `import type { ... } from '../index'` block is the
    // load-bearing assertion: if either type name ever drops off the barrel
    // (or is renamed at source without barrel update), typecheck fails
    // before this suite even runs. The runtime check below pins one
    // structural shape per type through the barrel as a belt-and-braces
    // guarantee that the names round-trip cleanly.
    it('accepts each type name in a type-only position via the barrel', () => {
      const comment: ProfileCommentView = {
        id: 'c1',
        excerpt: 'sample',
        when: '2026-05-20',
        context: null,
      }
      expect(comment.context).toBeNull()

      const view: ProfileView = {
        handle: 'e2e',
        displayName: null,
        memberSince: '2026',
        publishedCommentCount: 0,
        votedSeasonCount: 0,
        votedShowCount: 0,
        comments: [],
        populated: false,
      }
      expect(view.populated).toBe(false)

      // Force both structural type names into the test scope so a future
      // accidental removal of either of them from the barrel surfaces here
      // (in addition to the import-block typecheck). The values are
      // immaterial — the test fails at compile time if either of these
      // names disappears from `../index`.
      type RuntimeShapes = {
        comment?: ProfileCommentView
        view?: ProfileView
      }
      const sample: RuntimeShapes = {}
      expect(sample).toEqual({})
    })
  })
})
