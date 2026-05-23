import { describe, expect, it } from 'vitest'
import { computeReadMinutes, totalReadWords } from '../read-minutes'

describe('totalReadWords', () => {
  it('returns 0 for an empty input', () => {
    expect(totalReadWords({})).toBe(0)
  })

  it('counts only lede when nothing else is present', () => {
    expect(
      totalReadWords({
        lede: 'A returnees season that finally lets the format show what it can do.',
      }),
    ).toBe(13)
  })

  it('sums lede + body + pull + whereItSits', () => {
    expect(
      totalReadWords({
        lede: 'one two three',
        body: 'four five six seven',
        pull: 'eight nine',
        whereItSits: 'ten eleven twelve thirteen',
      }),
    ).toBe(13)
  })

  it('includes every watch-list label and body', () => {
    expect(
      totalReadWords({
        watchList: [
          { episode_label: 'Ep 1 · cold open', body: 'three words here' },
          { episode_label: 'Ep 7 · long take', body: 'four more words here' },
        ],
      }),
    ).toBe(17)
  })

  it('tolerates missing episode_label on watch items', () => {
    expect(
      totalReadWords({
        watchList: [{ body: 'two words' }, { episode_label: null, body: 'three more here' }],
      }),
    ).toBe(5)
  })

  it('skips null/undefined fields without throwing', () => {
    expect(
      totalReadWords({
        lede: 'one two',
        body: null,
        pull: undefined,
        whereItSits: '',
        watchList: null,
      }),
    ).toBe(2)
  })

  it('collapses repeated whitespace and newlines', () => {
    expect(
      totalReadWords({
        body: 'paragraph one.\n\nparagraph two — three words.',
      }),
    ).toBe(7)
  })
})

describe('computeReadMinutes', () => {
  it('floors to 1 for an empty input (chip always shows at least 1)', () => {
    expect(computeReadMinutes({})).toBe(1)
  })

  it('returns 1 for a stub season (≤220 words across all surfaces)', () => {
    expect(
      computeReadMinutes({
        lede: 'forty words here.'.repeat(0) + Array(80).fill('word').join(' '),
        body: Array(100).fill('word').join(' '),
      }),
    ).toBe(1)
  })

  it('rounds up to 2 when a multi-section canon entry crosses ~330 words', () => {
    const watchItem = { episode_label: 'Ep 1 · cold open', body: Array(40).fill('word').join(' ') }
    expect(
      computeReadMinutes({
        lede: Array(35).fill('word').join(' '),
        body: Array(75).fill('word').join(' '),
        pull: Array(25).fill('word').join(' '),
        whereItSits: Array(35).fill('word').join(' '),
        watchList: [watchItem, watchItem, watchItem, watchItem],
      }),
    ).toBe(2)
  })

  it('returns 3 for a long canon entry approaching ~550 words', () => {
    expect(
      computeReadMinutes({
        lede: Array(60).fill('word').join(' '),
        body: Array(380).fill('word').join(' '),
        pull: Array(25).fill('word').join(' '),
        whereItSits: Array(60).fill('word').join(' '),
        watchList: [
          { episode_label: 'Ep 1', body: Array(20).fill('word').join(' ') },
          { episode_label: 'Ep 2', body: Array(20).fill('word').join(' ') },
        ],
      }),
    ).toBe(3)
  })

  it('matches the prior calc for a lede-only stub (regression guard)', () => {
    const lede = Array(110).fill('word').join(' ')
    const prior = Math.max(1, Math.round(110 / 220))
    expect(computeReadMinutes({ lede })).toBe(prior)
  })
})
