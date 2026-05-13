import { describe, expect, it } from 'vitest'
import { parseTagline } from '../parseTagline'

describe('parseTagline', () => {
  it('returns a single text segment when no <b> is present', () => {
    const out = parseTagline('Plain tagline with no emphasis.')
    expect(out).toEqual([
      { kind: 'text', text: 'Plain tagline with no emphasis.' },
    ])
  })

  it('splits into before / emph / after when a single <b> span exists', () => {
    const out = parseTagline('lead-in <b>punchy bit</b> trail off')
    expect(out).toEqual([
      { kind: 'text', text: 'lead-in ' },
      { kind: 'emph', text: 'punchy bit' },
      { kind: 'text', text: ' trail off' },
    ])
  })

  it('handles an emphasis span that opens the tagline', () => {
    const out = parseTagline('<b>opener</b> tail.')
    expect(out).toEqual([
      { kind: 'emph', text: 'opener' },
      { kind: 'text', text: ' tail.' },
    ])
  })

  it('handles an emphasis span that closes the tagline', () => {
    const out = parseTagline('lead <b>closer.</b>')
    expect(out).toEqual([
      { kind: 'text', text: 'lead ' },
      { kind: 'emph', text: 'closer.' },
    ])
  })

  it('falls back to plain text if the markup is malformed', () => {
    const out = parseTagline('lead <b>open without close')
    expect(out).toEqual([{ kind: 'text', text: 'lead <b>open without close' }])
  })
})
