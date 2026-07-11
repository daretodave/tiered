import { describe, expect, it } from 'vitest'
import { getAllShows, getCanon } from '../index'
import { buildTierBands, DEFAULT_TIER_HEADINGS } from '../../lib/canon/tier-bands'

// Critique pass-52 MED closure (issue #418, below-deck) generalized at
// pass-89 (issue #550, bachelor-in-paradise + dragrace-allstars): a
// canon tier band's heading and blurb render the identical sentence
// back to back whenever the band's `tier_<key>_blurb` frontmatter field
// is absent, because CanonTierBand.tsx falls back to
// `DEFAULT_TIER_HEADINGS[key]`, which for S tier equals the headline
// string verbatim ("The seasons that defend the show.").
//
// Every freshly-seeded show enters the catalog with exactly one canon
// entry at rank 1, which always lands in the S band (tierKeyForRank),
// so this recurs on every new show until its second ranked season
// lands. Rather than pin one show at a time, this test scans every
// show's canon and asserts the S band (whenever populated) carries a
// distinct tier_s_blurb — it fails automatically on the next
// freshly-seeded show that ships without one.

describe('canon S-tier blurb distinct from heading (pass-52 #418, generalized pass-89 #550)', () => {
  const headline = DEFAULT_TIER_HEADINGS.S

  for (const show of getAllShows()) {
    const canon = getCanon(show.slug)
    if (!canon) continue

    const bands = buildTierBands(canon.entries, {
      s: canon.tier_s_blurb,
      a: canon.tier_a_blurb,
      b: canon.tier_b_blurb,
      c: canon.tier_c_blurb,
    })
    const sBand = bands.find((b) => b.key === 'S')
    if (!sBand) continue

    it(`${show.slug}: S band defines a tier_s_blurb distinct from the heading`, () => {
      expect(sBand.blurb).toBeTruthy()
      expect(sBand.blurb).not.toBe(headline)
    })
  }
})
