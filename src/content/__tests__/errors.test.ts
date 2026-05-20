import { describe, expect, it } from 'vitest'
import { ContentValidationError } from '../errors'

describe('ContentValidationError', () => {
  describe('shape contract', () => {
    it('extends the built-in Error', () => {
      const err = new ContentValidationError('boom', 'survivor.md')
      expect(err).toBeInstanceOf(Error)
      expect(err).toBeInstanceOf(ContentValidationError)
    })

    it('pins the .name field to the class name string', () => {
      const err = new ContentValidationError('boom', 'survivor.md')
      expect(err.name).toBe('ContentValidationError')
    })

    it('propagates the message string through super()', () => {
      const err = new ContentValidationError('palette must be a hex string', 'survivor.md')
      expect(err.message).toBe('palette must be a hex string')
    })

    it('exposes the file string as a public field', () => {
      const err = new ContentValidationError('boom', 'content/shows/survivor.md')
      expect(err.file).toBe('content/shows/survivor.md')
    })
  })

  describe('issues field', () => {
    it('defaults to an empty array when omitted', () => {
      const err = new ContentValidationError('boom', 'survivor.md')
      expect(err.issues).toEqual([])
      expect(Array.isArray(err.issues)).toBe(true)
    })

    it('preserves an explicit issues array verbatim', () => {
      const issues = [
        { path: 'palette.paper', message: 'expected hex string' },
        { path: 'seasons', message: 'expected positive integer' },
      ]
      const err = new ContentValidationError('multiple issues', 'survivor.md', issues)
      expect(err.issues).toEqual(issues)
    })

    it('accepts an explicit empty array (does not fall back to default)', () => {
      const explicit: Array<{ path: string; message: string }> = []
      const err = new ContentValidationError('boom', 'survivor.md', explicit)
      expect(err.issues).toBe(explicit)
    })

    it('keeps issues independent between two instances (no shared default)', () => {
      const a = new ContentValidationError('a', 'a.md')
      const b = new ContentValidationError('b', 'b.md')
      ;(a.issues as Array<{ path: string; message: string }>).push({
        path: 'x',
        message: 'mutated',
      })
      expect(b.issues).toEqual([])
    })
  })

  describe('content-check catch-site round-trip', () => {
    it('lets a catcher attribute the failure via .file and .message (the script contract)', () => {
      // Mirrors scripts/content-check.ts:203-204 and :222-223:
      //   if (err instanceof ContentValidationError) {
      //     failures.push({ file: err.file, message: err.message })
      //   }
      let caught: { file: string; message: string } | null = null
      try {
        throw new ContentValidationError(
          'unparseable YAML at content/calendar.yml',
          'content/calendar.yml',
        )
      } catch (err) {
        if (err instanceof ContentValidationError) {
          caught = { file: err.file, message: err.message }
        }
      }
      expect(caught).toEqual({
        file: 'content/calendar.yml',
        message: 'unparseable YAML at content/calendar.yml',
      })
    })

    it('carries structured issues through a throw/catch round-trip', () => {
      const issues = [{ path: 'rows.0.finale_date', message: 'expected ISO date' }]
      let payload: { file: string; issues: typeof issues } | null = null
      try {
        throw new ContentValidationError('row failed', 'content/calendar.yml', issues)
      } catch (err) {
        if (err instanceof ContentValidationError) {
          payload = { file: err.file, issues: err.issues }
        }
      }
      expect(payload).toEqual({
        file: 'content/calendar.yml',
        issues,
      })
    })
  })
})
