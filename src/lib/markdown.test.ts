import { describe, expect, it } from 'vitest'
import { parseInline, parseMarkdownBlocks } from './markdown'

describe('parseMarkdownBlocks', () => {
  it('parses ATX headings of various levels', () => {
    const out = parseMarkdownBlocks('# A\n\n## B\n\n### C\n\n#### D')
    expect(out).toEqual([
      { type: 'heading', level: 1, text: 'A' },
      { type: 'heading', level: 2, text: 'B' },
      { type: 'heading', level: 3, text: 'C' },
      { type: 'heading', level: 4, text: 'D' },
    ])
  })

  it('parses single paragraph', () => {
    const out = parseMarkdownBlocks('Hello world.')
    expect(out).toEqual([{ type: 'paragraph', text: 'Hello world.' }])
  })

  it('joins wrapped paragraph lines with single space', () => {
    const out = parseMarkdownBlocks('First line\nsecond line\nthird line.')
    expect(out).toEqual([
      { type: 'paragraph', text: 'First line second line third line.' },
    ])
  })

  it('separates paragraphs on blank lines', () => {
    const out = parseMarkdownBlocks('one\n\ntwo')
    expect(out).toEqual([
      { type: 'paragraph', text: 'one' },
      { type: 'paragraph', text: 'two' },
    ])
  })

  it('parses unordered list block', () => {
    const out = parseMarkdownBlocks('- a\n- b\n- c')
    expect(out).toEqual([{ type: 'list', items: ['a', 'b', 'c'] }])
  })

  it('joins multi-line list items', () => {
    const out = parseMarkdownBlocks('- first item\n  continues\n- second')
    expect(out).toEqual([
      { type: 'list', items: ['first item continues', 'second'] },
    ])
  })

  it('mixes heading, list, paragraph', () => {
    const source = '# Title\n\nIntro.\n\n- one\n- two\n\n## Section\n\nMore.'
    const out = parseMarkdownBlocks(source)
    expect(out).toEqual([
      { type: 'heading', level: 1, text: 'Title' },
      { type: 'paragraph', text: 'Intro.' },
      { type: 'list', items: ['one', 'two'] },
      { type: 'heading', level: 2, text: 'Section' },
      { type: 'paragraph', text: 'More.' },
    ])
  })
})

describe('parseInline', () => {
  it('passes plain text through', () => {
    expect(parseInline('hello')).toEqual([{ type: 'text', value: 'hello' }])
  })

  it('parses bold with **', () => {
    expect(parseInline('a **b** c')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'strong', value: 'b' },
      { type: 'text', value: ' c' },
    ])
  })

  it('parses italic with *', () => {
    expect(parseInline('a *b* c')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'em', value: 'b' },
      { type: 'text', value: ' c' },
    ])
  })

  it('parses code spans', () => {
    expect(parseInline('use `pnpm verify`')).toEqual([
      { type: 'text', value: 'use ' },
      { type: 'code', value: 'pnpm verify' },
    ])
  })

  it('parses links', () => {
    expect(parseInline('see [About](/about) too')).toEqual([
      { type: 'text', value: 'see ' },
      { type: 'link', value: 'About', href: '/about' },
      { type: 'text', value: ' too' },
    ])
  })
})
