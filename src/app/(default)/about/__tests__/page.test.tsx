import { describe, expect, it } from 'vitest'
import { getLegalDoc } from '@/content'

// The FAQs array is private to the page module. We re-export
// behavior assertions via the JSON-LD that the e2e walks, but
// this unit-level test smoke-checks that the page module
// imports without crashing — primarily a guard against a stale
// content/legal/about.md filename or schema change breaking
// build.

describe('/about page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })
})

// Iterate finding #257 (issue #257): the prior copy described the
// VotePair as a `[+]` and `[−]` button pair, but the live UI ships
// up and down arrow buttons (chevron SVGs flanking a net-vote
// count) per src/components/composition/VotePair.tsx and the
// binding design source design/compositions/interactions.jsx. The
// new copy describes the actual affordance ("upvote and a downvote
// button"). This pin is bidirectional — asserts the new phrasing
// AND the absence of the old glyphs — matching the critique-pass-19
// #242 closure pattern (17ef819) so a future authoring pass cannot
// silently reintroduce the affordance drift.
describe('content/legal/about.md vote-affordance copy (#257)', () => {
  it('describes the live VotePair as upvote / downvote buttons', () => {
    const doc = getLegalDoc('about')
    expect(doc).not.toBeNull()
    expect(doc?.body_md).toMatch(/upvote and a downvote button/)
  })

  it('does not regress to the bracketed [+] / [−] glyphs that drifted from the live UI', () => {
    const doc = getLegalDoc('about')
    expect(doc?.body_md).not.toMatch(/\[\+\]/)
    expect(doc?.body_md).not.toMatch(/\[−\]/)
  })
})
