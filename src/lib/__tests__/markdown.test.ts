import { describe, expect, it } from 'vitest'
import { parseInline, parseMarkdownBlocks } from '../markdown'

// Consolidated from the former sibling src/lib/markdown.test.ts (§5a
// colocation; finding #84). Every prior case is retained verbatim in
// the first two describe blocks; the remaining blocks add edge
// coverage. No source change — markdown.ts is the parser behind
// <Prose>, which renders every editorial surface (season bodies,
// canon rationales, themed-list copy, /about /terms /privacy).

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

// --- edge coverage (new) ---

describe('parseMarkdownBlocks — edges', () => {
  it('normalizes CRLF line endings', () => {
    expect(parseMarkdownBlocks('# A\r\n\r\n## B')).toEqual([
      { type: 'heading', level: 1, text: 'A' },
      { type: 'heading', level: 2, text: 'B' },
    ])
  })

  it('does not treat 5+ hashes as a heading — regex caps at 4 + whitespace', () => {
    // HEADING_RE is /^(#{1,4})\s+.../ so with 5 hashes the char after
    // any <=4-hash prefix is still '#', never whitespace -> no match.
    // The `Math.min(hashes.length, 4)` clamp in markdown.ts is therefore
    // unreachable through this regex (the group can never exceed 4);
    // a 5-hash line falls through to a paragraph.
    expect(parseMarkdownBlocks('##### E')).toEqual([
      { type: 'paragraph', text: '##### E' },
    ])
  })

  it('requires whitespace after hashes — no-space hash is a paragraph', () => {
    expect(parseMarkdownBlocks('#NoSpace')).toEqual([
      { type: 'paragraph', text: '#NoSpace' },
    ])
  })

  it('trims surrounding whitespace from heading text', () => {
    expect(parseMarkdownBlocks('#   Spaced title   ')).toEqual([
      { type: 'heading', level: 1, text: 'Spaced title' },
    ])
  })

  it('skips leading and trailing blank lines', () => {
    expect(parseMarkdownBlocks('\n\n# A\n\n')).toEqual([
      { type: 'heading', level: 1, text: 'A' },
    ])
  })

  it('returns [] for an empty string', () => {
    expect(parseMarkdownBlocks('')).toEqual([])
  })

  it('returns [] for whitespace-only source', () => {
    expect(parseMarkdownBlocks('\n  \n\t\n')).toEqual([])
  })

  it('absorbs a non-list line into the open list item (no blank-line break)', () => {
    // Inside a list block, a non-"- " line with an open buffer is
    // appended to that item — the list does NOT terminate on a
    // heading-looking line until a blank line appears.
    expect(parseMarkdownBlocks('- a\n# H')).toEqual([
      { type: 'list', items: ['a # H'] },
    ])
  })

  it('terminates the list on a blank line, then starts the heading', () => {
    expect(parseMarkdownBlocks('- a\n\n# H')).toEqual([
      { type: 'list', items: ['a'] },
      { type: 'heading', level: 1, text: 'H' },
    ])
  })

  it('breaks a paragraph when a heading line follows without a blank line', () => {
    expect(parseMarkdownBlocks('body text\n# H')).toEqual([
      { type: 'paragraph', text: 'body text' },
      { type: 'heading', level: 1, text: 'H' },
    ])
  })

  it('breaks a paragraph when a list line follows without a blank line', () => {
    expect(parseMarkdownBlocks('body text\n- item')).toEqual([
      { type: 'paragraph', text: 'body text' },
      { type: 'list', items: ['item'] },
    ])
  })

  it('joins three continuation lines into one list item', () => {
    expect(parseMarkdownBlocks('- one\n  two\n  three\n- next')).toEqual([
      { type: 'list', items: ['one two three', 'next'] },
    ])
  })

  it('parses a single list item with no continuation', () => {
    expect(parseMarkdownBlocks('- only')).toEqual([
      { type: 'list', items: ['only'] },
    ])
  })
})

describe('parseMarkdownBlocks — heading anchor ids', () => {
  it('parses {#id} suffix as the heading id', () => {
    expect(parseMarkdownBlocks('## How voting works {#voting}')).toEqual([
      { type: 'heading', level: 2, text: 'How voting works', id: 'voting' },
    ])
  })

  it('omits id field when no anchor suffix present', () => {
    const [block] = parseMarkdownBlocks('## Plain heading')
    expect(block).toEqual({ type: 'heading', level: 2, text: 'Plain heading' })
    expect((block as { id?: string }).id).toBeUndefined()
  })

  it('strips the anchor suffix from the rendered text', () => {
    expect(parseMarkdownBlocks('### Become an editor {#editors}')).toEqual([
      { type: 'heading', level: 3, text: 'Become an editor', id: 'editors' },
    ])
  })

  it('accepts kebab ids with digits', () => {
    expect(parseMarkdownBlocks('## Section two {#section-2}')).toEqual([
      { type: 'heading', level: 2, text: 'Section two', id: 'section-2' },
    ])
  })

  it('rejects ids containing uppercase or other chars — suffix becomes part of text', () => {
    // The HEADING_RE anchor capture only accepts [a-z0-9][a-z0-9-]*;
    // anything else fails the optional group, so the trailing token
    // is captured as part of the heading text.
    const out = parseMarkdownBlocks('## Cap {#NotKebab}')
    expect(out[0]).toMatchObject({
      type: 'heading',
      level: 2,
      text: 'Cap {#NotKebab}',
    })
    expect((out[0] as { id?: string }).id).toBeUndefined()
  })

  it('rejects ids starting with a hyphen', () => {
    const out = parseMarkdownBlocks('## Skip {#-bad}')
    expect((out[0] as { id?: string }).id).toBeUndefined()
  })

  it('preserves trailing whitespace tolerance after the id', () => {
    expect(parseMarkdownBlocks('## Title {#anchor}   ')).toEqual([
      { type: 'heading', level: 2, text: 'Title', id: 'anchor' },
    ])
  })

  it('applies to every supported heading level', () => {
    const source = '# A {#a}\n\n## B {#b}\n\n### C {#c}\n\n#### D {#d}'
    expect(parseMarkdownBlocks(source)).toEqual([
      { type: 'heading', level: 1, text: 'A', id: 'a' },
      { type: 'heading', level: 2, text: 'B', id: 'b' },
      { type: 'heading', level: 3, text: 'C', id: 'c' },
      { type: 'heading', level: 4, text: 'D', id: 'd' },
    ])
  })
})

describe('parseInline — edges', () => {
  it('treats an unterminated ** run as literal text', () => {
    expect(parseInline('a **b')).toEqual([{ type: 'text', value: 'a **b' }])
  })

  it('treats an unterminated * run as literal text', () => {
    expect(parseInline('a *b')).toEqual([{ type: 'text', value: 'a *b' }])
  })

  it('treats an unterminated code span as literal text', () => {
    expect(parseInline('use `pnpm')).toEqual([
      { type: 'text', value: 'use `pnpm' },
    ])
  })

  it('emits an empty strong for ****', () => {
    expect(parseInline('****')).toEqual([{ type: 'strong', value: '' }])
  })

  it('emits an empty code span for a bare backtick pair', () => {
    expect(parseInline('``')).toEqual([{ type: 'code', value: '' }])
  })

  it('prefers strong over em when ** leads', () => {
    expect(parseInline('**x**')).toEqual([{ type: 'strong', value: 'x' }])
  })

  it('does NOT recurse markers — inner markup stays literal in the value', () => {
    expect(parseInline('**a *b* c**')).toEqual([
      { type: 'strong', value: 'a *b* c' },
    ])
  })

  it('coalesces literal text around a failed marker into one token', () => {
    expect(parseInline('a*b')).toEqual([{ type: 'text', value: 'a*b' }])
  })

  it('parses em containing spaces', () => {
    expect(parseInline('*a b*')).toEqual([{ type: 'em', value: 'a b' }])
  })

  it('keeps adjacent tokens distinct with no text between', () => {
    expect(parseInline('**a**`c`')).toEqual([
      { type: 'strong', value: 'a' },
      { type: 'code', value: 'c' },
    ])
  })

  it('requires ( immediately after ] for a link — otherwise literal', () => {
    expect(parseInline('[a] (b)')).toEqual([{ type: 'text', value: '[a] (b)' }])
  })

  it('treats a link missing its closing paren as literal text', () => {
    expect(parseInline('[a](b')).toEqual([{ type: 'text', value: '[a](b' }])
  })

  it('parses a link with empty href', () => {
    expect(parseInline('[a]()')).toEqual([
      { type: 'link', value: 'a', href: '' },
    ])
  })

  it('parses a link with empty link text', () => {
    expect(parseInline('[](x)')).toEqual([
      { type: 'link', value: '', href: 'x' },
    ])
  })

  it('parses multiple links separated by text', () => {
    expect(parseInline('[a](/a) and [b](/b)')).toEqual([
      { type: 'link', value: 'a', href: '/a' },
      { type: 'text', value: ' and ' },
      { type: 'link', value: 'b', href: '/b' },
    ])
  })

  it('returns [] for empty input', () => {
    expect(parseInline('')).toEqual([])
  })
})
