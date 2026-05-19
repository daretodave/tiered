import { beforeEach, describe, expect, it, vi } from 'vitest'

// next/og's ImageResponse needs the satori runtime, which is not
// available under vitest's jsdom env. The module's only job is to
// construct an ImageResponse from a palette-defaulted React tree,
// so the correct boundary to assert against is `next/og` itself:
// we mock ImageResponse to capture (element, options) and walk the
// captured tree. This is a mock *addition* appropriate to a
// non-pure construction wrapper — there is no purer strategy this
// replaces (the prior sibling smoke-tested only export shape
// because it could not invoke the factory at all).

type Captured = { element: unknown; options: unknown }
const captured: Captured[] = []

vi.mock('next/og', () => ({
  ImageResponse: class {
    element: unknown
    options: unknown
    constructor(element: unknown, options: unknown) {
      this.element = element
      this.options = options
      captured.push({ element, options })
    }
  },
}))

// Walk a React element tree, collecting every rendered text node.
function collectText(node: unknown, acc: string[] = []): string[] {
  if (node == null || node === false || node === true) return acc
  if (typeof node === 'string' || typeof node === 'number') {
    acc.push(String(node))
    return acc
  }
  if (Array.isArray(node)) {
    for (const n of node) collectText(n, acc)
    return acc
  }
  if (typeof node === 'object' && 'props' in (node as { props?: unknown })) {
    collectText((node as { props?: { children?: unknown } }).props?.children, acc)
  }
  return acc
}

// Walk a React element tree, collecting every `style` object.
function collectStyles(
  node: unknown,
  acc: Record<string, unknown>[] = [],
): Record<string, unknown>[] {
  if (node == null || typeof node !== 'object') return acc
  if (Array.isArray(node)) {
    for (const n of node) collectStyles(n, acc)
    return acc
  }
  const props = (node as { props?: { style?: unknown; children?: unknown } })
    .props
  if (props) {
    if (props.style && typeof props.style === 'object') {
      acc.push(props.style as Record<string, unknown>)
    }
    collectStyles(props.children, acc)
  }
  return acc
}

function rootStyle(element: unknown): Record<string, unknown> {
  return (element as { props: { style: Record<string, unknown> } }).props.style
}

// The mock pushes exactly one entry per buildOgImage call; assert
// presence so the rest of the test reads against a defined value.
function only(): Captured {
  expect(captured).toHaveLength(1)
  const c = captured[0]
  if (!c) throw new Error('expected one captured ImageResponse')
  return c
}

beforeEach(() => {
  captured.length = 0
})

describe('og template module', () => {
  // --- Prior sibling cases, retained verbatim ---

  it('exports the route-shape constants', async () => {
    const mod = await import('../template')
    expect(mod.OG_SIZE.width).toBe(1200)
    expect(mod.OG_SIZE.height).toBe(630)
    expect(mod.OG_CONTENT_TYPE).toBe('image/png')
  })

  it('buildOgImage is a function', async () => {
    const mod = await import('../template')
    expect(typeof mod.buildOgImage).toBe('function')
  })

  // --- Added behavior coverage (next/og boundary mocked) ---

  it('OG_SIZE is exactly the 1200x630 pair and nothing else', async () => {
    const { OG_SIZE } = await import('../template')
    expect(Object.keys(OG_SIZE).sort()).toEqual(['height', 'width'])
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 })
  })

  it('threads OG_SIZE into the ImageResponse options', async () => {
    const { buildOgImage, OG_SIZE } = await import('../template')
    buildOgImage({ eyebrow: 'E', title: 'T' })
    expect(only().options).toEqual({
      width: OG_SIZE.width,
      height: OG_SIZE.height,
    })
  })

  it('returns the constructed ImageResponse instance', async () => {
    const { buildOgImage } = await import('../template')
    const result = buildOgImage({ eyebrow: 'E', title: 'T' })
    expect((result as unknown as Captured).element).toBe(only().element)
  })

  it('falls back to the default dark palette when palette is omitted', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({ eyebrow: 'Eyebrow', title: 'Title' })
    const element = only().element
    const style = rootStyle(element)
    expect(style.backgroundColor).toBe('#0E0B08')
    expect(style.color).toBe('#F2EADB')
    const primaries = collectStyles(element)
      .map((s) => s.backgroundColor ?? s.color)
      .filter(Boolean)
    expect(primaries).toContain('#E8B65A')
  })

  it('threads a custom palette through every color slot', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({
      eyebrow: 'Eyebrow',
      title: 'Title',
      palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
    })
    const element = only().element
    const style = rootStyle(element)
    expect(style.backgroundColor).toBe('#0E2A2A')
    expect(style.color).toBe('#EFE2BD')
    const colors = collectStyles(element).flatMap((s) => [
      s.backgroundColor,
      s.color,
    ])
    expect(colors).toContain('#D55E36')
    // The default palette must not leak when a custom one is given.
    expect(colors).not.toContain('#0E0B08')
    expect(colors).not.toContain('#E8B65A')
  })

  it('renders eyebrow, title, and the fixed brand footer text', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({ eyebrow: 'SEASON 20', title: 'Heroes vs. Villains' })
    const text = collectText(only().element)
    expect(text).toContain('SEASON 20')
    expect(text).toContain('Heroes vs. Villains')
    expect(text).toContain('tiered.tv')
    expect(text).toContain('the seasons, ranked. no spoilers.')
  })

  it('renders the blurb node when a blurb is supplied', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({
      eyebrow: 'E',
      title: 'T',
      blurb: 'Forty-seven seasons of strangers on a beach.',
    })
    const text = collectText(only().element)
    expect(text).toContain('Forty-seven seasons of strangers on a beach.')
  })

  it('omits the blurb node entirely when no blurb is supplied', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({ eyebrow: 'Eyebrow', title: 'Title' })
    const styles = collectStyles(only().element)
    // The blurb is the only node carrying opacity 0.82; its absence
    // means the conditional rendered `null`, not an empty box.
    expect(styles.some((s) => s.opacity === 0.82)).toBe(false)
    // The footer's 0.6-opacity promise span still renders.
    expect(styles.some((s) => s.opacity === 0.6)).toBe(true)
  })

  it('treats an empty-string blurb as absent (falsy guard)', async () => {
    const { buildOgImage } = await import('../template')
    buildOgImage({ eyebrow: 'E', title: 'T', blurb: '' })
    const styles = collectStyles(only().element)
    expect(styles.some((s) => s.opacity === 0.82)).toBe(false)
  })

  it('does not export the internal DEFAULT_PALETTE constant', async () => {
    const mod = await import('../template')
    expect('DEFAULT_PALETTE' in mod).toBe(false)
  })
})
