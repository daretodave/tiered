import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as preFilterModule from '../preFilter'

import type { ModerationVerdict, Verdict } from '../index'

// Mirrors `src/components/profile/__tests__/index.test.ts` — pure
// re-export barrels carry no logic of their own, but the §5a
// colocation gate (phase 42) requires every source module under
// src/lib/** to ship its own colocated test. This file pins:
// runtime symbols forward verbatim (identity equality, not
// wrapped), the public-surface key set is exactly the 4 documented
// runtime symbols, and the two type aliases compile through the
// barrel (the top-of-file `import type { ... } from '../index'`
// block is the load-bearing typecheck — it fails compilation if
// either name disappears from the barrel).

const EXPECTED_RUNTIME_KEYS = [
  'moderateComment',
  'verdictSchema',
  'VERDICTS',
  'CATEGORIES',
] as const

describe('@/lib/openai barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every runtime symbol verbatim (===, not a wrapped reference)', () => {
      expect(barrel.moderateComment).toBe(preFilterModule.moderateComment)
      expect(barrel.verdictSchema).toBe(preFilterModule.verdictSchema)
      expect(barrel.VERDICTS).toBe(preFilterModule.VERDICTS)
      expect(barrel.CATEGORIES).toBe(preFilterModule.CATEGORIES)
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

    it('moderateComment is a function and verdictSchema/VERDICTS/CATEGORIES are objects (catches accidental value/type swap)', () => {
      expect(typeof barrel.moderateComment).toBe('function')
      expect(typeof barrel.verdictSchema).toBe('object')
      expect(typeof barrel.VERDICTS).toBe('object')
      expect(typeof barrel.CATEGORIES).toBe('object')
    })

    it('the barrel exports nothing besides the 4 documented runtime symbols (no helpers, no constants, no types-promoted-to-runtime)', () => {
      const documented = new Set<string>(EXPECTED_RUNTIME_KEYS)
      const extras = Object.keys(barrel).filter((k) => !documented.has(k))
      expect(extras).toEqual([])
    })
  })

  describe('type re-exports compile through the barrel', () => {
    it('accepts both type names in a type-only position via the barrel', () => {
      const verdict: Verdict = 'allow'
      expect(verdict).toBe('allow')

      const m: ModerationVerdict = {
        verdict: 'allow',
        categories: [],
        confidence: 0.9,
        reason: 'no policy violation',
        redacted_phrase: null,
      }
      expect(m.verdict).toBe('allow')

      // Force both structural type names into the test scope so a
      // future accidental removal of either of them from the barrel
      // surfaces here (in addition to the import-block typecheck).
      type RuntimeShapes = {
        v?: Verdict
        mv?: ModerationVerdict
      }
      const sample: RuntimeShapes = {}
      expect(sample).toEqual({})
    })
  })
})
