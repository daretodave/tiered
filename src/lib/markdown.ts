// Minimal markdown renderer for prose pages (about / terms / privacy).
// Handles the grammar used by content/legal/*.md:
//   - ATX headings (# / ## / ### / ####)
//   - Paragraphs (blank-line separated)
//   - Unordered list blocks ("- " prefix; multi-line items)
//   - Inline: **bold**, *italic*, `code`, [text](url)
//
// Not a general-purpose CommonMark engine. If we adopt one later
// (remark, marked), this module's API stays the same.

export type MdBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string; id?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export type MdInline =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; value: string; href: string }

const HEADING_RE = /^(#{1,4})\s+(.+?)(?:\s+\{#([a-z0-9][a-z0-9-]*)\})?\s*$/
const LIST_ITEM_RE = /^-\s+(.+)$/

export function parseMarkdownBlocks(source: string): MdBlock[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: MdBlock[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (line.trim() === '') {
      i++
      continue
    }

    const headingMatch = line.match(HEADING_RE)
    if (headingMatch) {
      const hashes = headingMatch[1] ?? '#'
      const level = Math.min(hashes.length, 4) as 1 | 2 | 3 | 4
      const text = (headingMatch[2] ?? '').trim()
      const id = headingMatch[3]
      blocks.push(id ? { type: 'heading', level, text, id } : { type: 'heading', level, text })
      i++
      continue
    }

    if (LIST_ITEM_RE.test(line)) {
      const items: string[] = []
      let buffer = ''
      while (i < lines.length) {
        const current = lines[i] ?? ''
        if (current.trim() === '') break
        const itemMatch = current.match(LIST_ITEM_RE)
        if (itemMatch) {
          if (buffer) items.push(buffer.trim())
          buffer = itemMatch[1] ?? ''
        } else if (buffer) {
          buffer += ` ${current.trim()}`
        } else {
          break
        }
        i++
      }
      if (buffer) items.push(buffer.trim())
      blocks.push({ type: 'list', items })
      continue
    }

    // Paragraph: gather until blank line or block-starter.
    const paragraphLines: string[] = [line.trim()]
    i++
    while (i < lines.length) {
      const current = lines[i] ?? ''
      if (current.trim() === '') break
      if (HEADING_RE.test(current)) break
      if (LIST_ITEM_RE.test(current)) break
      paragraphLines.push(current.trim())
      i++
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return blocks
}

export function parseInline(text: string): MdInline[] {
  const tokens: MdInline[] = []
  let i = 0
  const len = text.length

  const isAt = (s: string) => text.startsWith(s, i)
  const findEnd = (token: string): number => {
    const ix = text.indexOf(token, i + token.length)
    return ix === -1 ? -1 : ix
  }
  const pushText = (slice: string) => {
    if (slice.length === 0) return
    const last = tokens[tokens.length - 1]
    if (last && last.type === 'text') last.value += slice
    else tokens.push({ type: 'text', value: slice })
  }

  while (i < len) {
    if (isAt('**')) {
      const end = findEnd('**')
      if (end !== -1) {
        tokens.push({ type: 'strong', value: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }
    if (isAt('*')) {
      const end = text.indexOf('*', i + 1)
      if (end !== -1 && end > i + 1) {
        tokens.push({ type: 'em', value: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }
    if (isAt('`')) {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        tokens.push({ type: 'code', value: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1)
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2)
        if (closeParen !== -1) {
          tokens.push({
            type: 'link',
            value: text.slice(i + 1, closeBracket),
            href: text.slice(closeBracket + 2, closeParen),
          })
          i = closeParen + 1
          continue
        }
      }
    }

    pushText(text[i] ?? '')
    i++
  }

  return tokens
}
