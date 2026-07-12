import { describe, expect, it } from 'vitest'
import { getAllSeasons, getAllShows } from '../index'

// Critique pass-89 MED closure (issue #551, bachelor-in-paradise): the
// FILMED stat tile's caption is meant to add real production/location
// texture beyond the bare `location` field — every other stat tile
// (PREMIERED, HOST) already does this. A caption that reduces to
// "Filmed in <location>" verbatim adds nothing a reader can't already
// see in the tile's own value. The corpus-wide drain that established
// this convention (issue #498, 133 files) predates this repo's newest
// shows, so a repo-wide scan (this test) found a second recurrence on
// dragrace-uk series-3 alongside bachelor-in-paradise — both fixed in
// the same commit. Scans every season's `filming_caption` so the next
// freshly-seeded show with a bare restatement fails automatically
// instead of waiting for a future critique pass to notice it.
//
// Critique pass-91 widening: the original check only normalized against
// "Filmed in <location>", so a "Filmed at <location>" bare restatement
// (traitors-uk series-1) shipped green. Broadened to the full set of
// prepositions a caption plausibly opens with.

const FILMED_PREPOSITIONS = ['in', 'at', 'on', 'near']

function isBareRestatement(location: string, caption: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase()
  const normalizedCaption = normalize(caption)
  return FILMED_PREPOSITIONS.some(
    (preposition) => normalizedCaption === normalize(`Filmed ${preposition} ${location}`),
  )
}

describe('season filming_caption adds texture beyond location (pass-89 #551)', () => {
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      if (!season.location || !season.filming_caption) continue

      it(`${show.slug} ${season.slug}: filming_caption is not a bare "Filmed <preposition> <location>" restatement`, () => {
        expect(
          isBareRestatement(season.location as string, season.filming_caption as string),
        ).toBe(false)
      })
    }
  }
})
