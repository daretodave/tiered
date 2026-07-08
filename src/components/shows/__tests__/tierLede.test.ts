import { describe, expect, it } from 'vitest'
import { tierLedeSentences } from '../tierLede'

describe('tierLedeSentences', () => {
  it('returns no sentences for an empty tier set', () => {
    expect(tierLedeSentences([])).toEqual([])
  })

  it('returns one sentence for a single populated tier', () => {
    expect(tierLedeSentences(['S'])).toEqual([
      'The S tier invented or perfected its format.',
    ])
  })

  it('describes only the populated tiers — B withheld when B is empty', () => {
    const sentences = tierLedeSentences(['S', 'A'])
    expect(sentences).toHaveLength(2)
    expect(sentences.join(' ')).toContain('S tier')
    expect(sentences.join(' ')).toContain('A tier')
    expect(sentences.join(' ')).not.toContain('B tier')
  })

  it('orders sentences by S → A → B regardless of input order', () => {
    expect(tierLedeSentences(['B', 'S'])).toEqual([
      'The S tier invented or perfected its format.',
      'The B tier I’m still working through — every season reviewed before it lands.',
    ])
  })

  it('renders all three sentences when every tier is populated', () => {
    const sentences = tierLedeSentences(['S', 'A', 'B'])
    expect(sentences).toHaveLength(3)
    expect(sentences[2]).toContain('still working through')
  })

  it('dedupes a repeated tier so a sentence is never doubled', () => {
    expect(tierLedeSentences(['S', 'S', 'A'])).toHaveLength(2)
  })
})
