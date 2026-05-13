import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  LAUNCH_SHOWS,
  missingShows,
} from '../lib/launch-shows.mjs'
import { main as contentQuotaMain } from '../content-quota.mjs'

test('LAUNCH_SHOWS has 13 entries (matches bearings + build plan)', () => {
  assert.equal(LAUNCH_SHOWS.length, 13)
})

test('LAUNCH_SHOWS slugs are unique kebab-case', () => {
  const slugs = LAUNCH_SHOWS.map((s) => s.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
  }
})

test('LAUNCH_SHOWS includes the 3 phase-5 pioneers + 2 phase-20 backfills', () => {
  const slugs = new Set(LAUNCH_SHOWS.map((s) => s.slug))
  for (const expected of [
    'survivor',
    'top-chef',
    'dragrace',
    'amazing-race',
    'big-brother',
  ]) {
    assert.ok(slugs.has(expected), `missing ${expected}`)
  }
})

test('missingShows returns the empty list when every launch slug is covered', () => {
  const all = LAUNCH_SHOWS.map((s) => s.slug)
  assert.deepEqual(missingShows(all), [])
})

test('missingShows returns the full list when nothing is covered', () => {
  assert.equal(missingShows([]).length, LAUNCH_SHOWS.length)
})

test('missingShows ignores unknown covered slugs', () => {
  const covered = ['survivor', 'top-chef', 'dragrace', 'not-a-real-show']
  const missing = missingShows(covered)
  assert.equal(missing.length, LAUNCH_SHOWS.length - 3)
  assert.ok(missing.every((s) => s.slug !== 'survivor'))
})

function mkTempContentDir(slugs) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-quota-'))
  for (const slug of slugs) {
    fs.writeFileSync(path.join(dir, `${slug}.md`), `---\nslug: ${slug}\n---\n`)
  }
  return dir
}

test('contentQuotaMain exits 0 when every launch show is covered', (t) => {
  const dir = mkTempContentDir(LAUNCH_SHOWS.map((s) => s.slug))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  assert.equal(contentQuotaMain([dir]), 0)
})

test('contentQuotaMain exits 1 when any launch show is missing', (t) => {
  const dir = mkTempContentDir(['survivor', 'top-chef'])
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  assert.equal(contentQuotaMain([dir]), 1)
})

test('contentQuotaMain exits 1 against an empty / missing directory', (t) => {
  const dir = path.join(os.tmpdir(), `content-quota-absent-${Date.now()}`)
  t.after(() => {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
  })
  assert.equal(contentQuotaMain([dir]), 1)
})
