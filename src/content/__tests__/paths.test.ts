import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  calendarFile,
  canonFile,
  getContentRoot,
  legalDir,
  legalFile,
  seasonsDir,
  setContentRoot,
  showFile,
  showsDir,
  themeFile,
  themesDir,
} from '../paths'

afterEach(() => {
  setContentRoot(null)
})

describe('getContentRoot / setContentRoot', () => {
  it('defaults to <cwd>/content when no override is set', () => {
    setContentRoot(null)
    expect(getContentRoot()).toBe(path.resolve(process.cwd(), 'content'))
  })

  it('returns the override verbatim when one is set (absolute path)', () => {
    setContentRoot('/tmp/some-fixture')
    expect(getContentRoot()).toBe('/tmp/some-fixture')
  })

  it('passes the override verbatim — relative paths stay relative, not resolved', () => {
    setContentRoot('relative/fixture')
    expect(getContentRoot()).toBe('relative/fixture')
  })

  it('clears the override when set back to null (singleton lifecycle)', () => {
    setContentRoot('/tmp/x')
    expect(getContentRoot()).toBe('/tmp/x')
    setContentRoot(null)
    expect(getContentRoot()).toBe(path.resolve(process.cwd(), 'content'))
  })

  it('overwrites the override on consecutive sets (no stacking)', () => {
    setContentRoot('/tmp/a')
    setContentRoot('/tmp/b')
    expect(getContentRoot()).toBe('/tmp/b')
  })
})

describe('path helpers compose under an active root', () => {
  it('resolve every documented helper under the override', () => {
    setContentRoot('/tmp/root')
    expect(showsDir()).toBe(path.join('/tmp/root', 'shows'))
    expect(showFile('survivor')).toBe(path.join('/tmp/root', 'shows', 'survivor.md'))
    expect(seasonsDir('survivor')).toBe(
      path.join('/tmp/root', 'shows', 'survivor', 'seasons'),
    )
    expect(canonFile('survivor')).toBe(
      path.join('/tmp/root', 'shows', 'survivor', 'canon.md'),
    )
    expect(themesDir()).toBe(path.join('/tmp/root', 'themes'))
    expect(themeFile('endgame')).toBe(path.join('/tmp/root', 'themes', 'endgame.md'))
    expect(legalDir()).toBe(path.join('/tmp/root', 'legal'))
    expect(legalFile('privacy')).toBe(path.join('/tmp/root', 'legal', 'privacy.md'))
    expect(calendarFile()).toBe(path.join('/tmp/root', 'calendar.yml'))
  })

  it('re-resolve dynamically when the root changes mid-test', () => {
    setContentRoot('/tmp/one')
    expect(showsDir()).toBe(path.join('/tmp/one', 'shows'))
    expect(calendarFile()).toBe(path.join('/tmp/one', 'calendar.yml'))
    setContentRoot('/tmp/two')
    expect(showsDir()).toBe(path.join('/tmp/two', 'shows'))
    expect(calendarFile()).toBe(path.join('/tmp/two', 'calendar.yml'))
  })

  it('preserve slug fidelity (dashes, dots, underscores, mixed case)', () => {
    setContentRoot('/r')
    expect(showFile('survivor-uk')).toBe(path.join('/r', 'shows', 'survivor-uk.md'))
    expect(canonFile('a.b')).toBe(path.join('/r', 'shows', 'a.b', 'canon.md'))
    expect(seasonsDir('Show-Mix')).toBe(path.join('/r', 'shows', 'Show-Mix', 'seasons'))
    expect(themeFile('endgame_arc')).toBe(path.join('/r', 'themes', 'endgame_arc.md'))
  })

  it('return plain strings, not URL / Path objects', () => {
    setContentRoot('/r')
    expect(typeof showsDir()).toBe('string')
    expect(typeof showFile('x')).toBe('string')
    expect(typeof seasonsDir('x')).toBe('string')
    expect(typeof canonFile('x')).toBe('string')
    expect(typeof themesDir()).toBe('string')
    expect(typeof themeFile('x')).toBe('string')
    expect(typeof legalDir()).toBe('string')
    expect(typeof legalFile('x')).toBe('string')
    expect(typeof calendarFile()).toBe('string')
  })
})

describe('path helpers default to the project content dir', () => {
  it('show + season + canon helpers resolve under <cwd>/content/shows', () => {
    setContentRoot(null)
    const root = path.resolve(process.cwd(), 'content')
    expect(showsDir()).toBe(path.join(root, 'shows'))
    expect(showFile('survivor')).toBe(path.join(root, 'shows', 'survivor.md'))
    expect(seasonsDir('survivor')).toBe(
      path.join(root, 'shows', 'survivor', 'seasons'),
    )
    expect(canonFile('survivor')).toBe(
      path.join(root, 'shows', 'survivor', 'canon.md'),
    )
  })

  it('theme + legal + calendar helpers resolve under <cwd>/content', () => {
    setContentRoot(null)
    const root = path.resolve(process.cwd(), 'content')
    expect(themesDir()).toBe(path.join(root, 'themes'))
    expect(themeFile('endgame')).toBe(path.join(root, 'themes', 'endgame.md'))
    expect(legalDir()).toBe(path.join(root, 'legal'))
    expect(legalFile('tos')).toBe(path.join(root, 'legal', 'tos.md'))
    expect(calendarFile()).toBe(path.join(root, 'calendar.yml'))
  })
})
