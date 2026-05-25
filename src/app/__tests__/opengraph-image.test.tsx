import { beforeEach, describe, expect, it, vi } from 'vitest'

// /opengraph-image (no segment) is the root-level OG share card every
// page on tiered.tv inherits when the destination route does not carve
// its own opengraph-image.tsx — /, /themes, /shows, /about, /sign-in,
// /u/[handle], /privacy, /terms, /internal/*, plus every social share
// whose URL bottoms out at the app root layout. Unlike the per-surface
// variants (show / season / themed-list), this one is hand-rolled JSX
// with hardcoded brand palette + brand-promise copy — it does not call
// into the shared `buildOgImage` template (separately covered at
// `src/lib/og/__tests__/template.test.tsx`). The right boundary to
// mock is therefore `next/og` itself: ImageResponse is replaced with a
// capturing class so the test walks the React element tree without
// satori (which needs the node runtime + a font, neither available
// under vitest's jsdom env).

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

function only(): Captured {
  expect(captured).toHaveLength(1)
  const c = captured[0]
  if (!c) throw new Error('expected one captured ImageResponse')
  return c
}

import OpenGraphImage, {
  alt,
  contentType,
  runtime,
  size,
} from '../opengraph-image'

beforeEach(() => {
  captured.length = 0
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "edge" — the root OG is intentionally edge (no content-layer reads, purely hand-rolled JSX)', () => {
    // Per-surface OG variants (show / season / themed-list) declare
    // 'nodejs' because they touch the file-system content loaders.
    // The root OG reads no content, so 'edge' is the right boundary
    // for perf — a regression to 'nodejs' would still build but lose
    // the edge characteristic on the highest-traffic share surface.
    expect(runtime).toBe('edge')
  })

  it('exports size = { width: 1200, height: 630 } — the OpenGraph 1.91:1 ratio Twitter + Facebook expect', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
  })

  it('exports size with exactly the width + height keys — no extra dimensions', () => {
    expect(Object.keys(size).sort()).toEqual(['height', 'width'])
  })

  it('exports contentType = "image/png" — readers cache by content-type', () => {
    expect(contentType).toBe('image/png')
  })

  it('exports alt with the brand promise verbatim — the literal string crawlers + screen readers surface on every default-OG share', () => {
    // The alt text is the brand promise (CLAUDE.md "Tone of voice").
    // A regression that drifted any character here would silently
    // corrupt the brand promise on every page that inherits the
    // default OG — which is most of the app.
    expect(alt).toBe('tiered.tv — the seasons, ranked. no spoilers.')
  })
})

describe('OpenGraphImage — ImageResponse construction', () => {
  it('threads the exported size into ImageResponse options', () => {
    OpenGraphImage()
    expect(only().options).toEqual({ width: 1200, height: 630 })
  })

  it('returns the constructed ImageResponse instance — the route is the construction site, no wrapping', () => {
    const result = OpenGraphImage()
    expect((result as unknown as Captured).element).toBe(only().element)
  })

  it('constructs exactly one ImageResponse per call — no fan-out, no double-render', () => {
    OpenGraphImage()
    expect(captured).toHaveLength(1)
  })
})

describe('OpenGraphImage — rendered text content', () => {
  it('renders the "tiered.tv" wordmark — the brand mark crawlers + readers surface', () => {
    OpenGraphImage()
    const text = collectText(only().element)
    expect(text).toContain('tiered.tv')
  })

  it('renders "the seasons, ranked." — the first half of the brand promise', () => {
    OpenGraphImage()
    const text = collectText(only().element)
    expect(text).toContain('the seasons, ranked.')
  })

  it('renders "no spoilers." — the second half of the brand promise', () => {
    // Splitting the promise across two lines is intentional — the
    // 56px serif column reads as a beat-pause between the offer and
    // the constraint, which is the editorial point.
    OpenGraphImage()
    const text = collectText(only().element)
    expect(text).toContain('no spoilers.')
  })

  it('renders all three brand lines in document order — wordmark, then promise-first, then promise-second', () => {
    OpenGraphImage()
    const text = collectText(only().element)
    const i = (s: string) => text.indexOf(s)
    expect(i('tiered.tv')).toBeGreaterThan(-1)
    expect(i('the seasons, ranked.')).toBeGreaterThan(i('tiered.tv'))
    expect(i('no spoilers.')).toBeGreaterThan(i('the seasons, ranked.'))
  })
})

describe('OpenGraphImage — brand palette', () => {
  it('paints the card on the brand paper #0E0B08 — the root OG is brand-anchored, not show-anchored', () => {
    OpenGraphImage()
    expect(rootStyle(only().element).backgroundColor).toBe('#0E0B08')
  })

  it('sets the root color to the brand ink #F2EADB — the inherited text color for the card', () => {
    OpenGraphImage()
    expect(rootStyle(only().element).color).toBe('#F2EADB')
  })

  it('renders the wordmark in brand gold #E8B65A — the headline accent', () => {
    OpenGraphImage()
    const styles = collectStyles(only().element)
    const colors = styles.map((s) => s.color)
    expect(colors).toContain('#E8B65A')
  })

  it('renders the two body lines in the two distinct ink hexes #D8CFBE and #9D9485 — the offer reads brighter than the constraint', () => {
    // The promise-first line ("the seasons, ranked.") carries the
    // brighter ink; the promise-second line ("no spoilers.") carries
    // the muted ink. The visual hierarchy is intentional — the
    // constraint is read as a quiet footnote to the offer.
    OpenGraphImage()
    const styles = collectStyles(only().element)
    const colors = styles.map((s) => s.color)
    expect(colors).toContain('#D8CFBE')
    expect(colors).toContain('#9D9485')
  })
})

describe('OpenGraphImage — layout invariants', () => {
  it('uses a left-justified column layout — flex column, items aligned to flex-start', () => {
    // The 1200x630 card reads as an editorial block, not a centered
    // logo card. A regression to alignItems: 'center' would re-cast
    // the brand mark as a stamp and break the editorial register.
    OpenGraphImage()
    const root = rootStyle(only().element)
    expect(root.display).toBe('flex')
    expect(root.flexDirection).toBe('column')
    expect(root.alignItems).toBe('flex-start')
    expect(root.justifyContent).toBe('center')
  })

  it('fills the 1200x630 viewport — width and height both 100%', () => {
    OpenGraphImage()
    const root = rootStyle(only().element)
    expect(root.width).toBe('100%')
    expect(root.height).toBe('100%')
  })

  it('renders the wordmark at 140px and the two body lines at 56px — the headline-then-couplet type hierarchy', () => {
    OpenGraphImage()
    const sizes = collectStyles(only().element)
      .map((s) => s.fontSize)
      .filter((v) => typeof v === 'number')
    expect(sizes).toContain(140)
    // Two body lines at 56px (one for each half of the promise).
    expect(sizes.filter((v) => v === 56).length).toBe(2)
  })
})
