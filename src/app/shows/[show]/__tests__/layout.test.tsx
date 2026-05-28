import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// src/app/shows/[show]/layout.tsx is the per-show SEGMENT layout — the
// load-bearing chrome wrapper every show home AND every season page
// (the highest-traffic page family, 13 shows × ~298 season slugs)
// inherits. None of the contracts it carries are pinned by a hermetic
// e2e walk (the walk reads the rendered page, not the layout's prop
// construction): (1) the `notFound()` branch on an unknown show — a
// regression that fell through with `show: null` would crash on the
// `show.palette` read downstream, but e2e only ever walks known shows;
// (2) the per-show palette injection — `<ShowPaletteScope show palette
// asSegment>` is the whole "color does the visual work" mechanism
// (CLAUDE.md visual law), and `asSegment` is what makes it a layout-
// level scope rather than a page-level one; e2e sees the painted page,
// not which prop drove the paint, so a regression dropping `asSegment`
// or mis-threading the palette is dark to it; (3) the `tinted` Header +
// Footer — the prop that makes the chrome take on the show palette
// rather than the default paper; (4) SkipToMain rendered FIRST (the
// skip link must be the first focusable element — an a11y ordering the
// axe walk checks for presence but not authored position); (5) the
// `<main id="main" className="flex-1">` skip-link target + flex shell;
// (6) the SearchHost fed from getSearchIndex().
//
// The imported chrome components + loaders are mocked to stable stub
// functions so the returned element tree can be identified by reference
// and inspected directly (the layout returns a fragment of components,
// not host DOM that jsdom can cleanly render) — the same tree-inspection
// approach the root-layout test (#211) and the OG-image route tests use.
// `next/navigation`'s notFound is mocked as a thrower matching the
// runtime behavior, so the unknown-show path short-circuits before the
// palette read exactly as it does in production.

const { getShowMock, getSearchIndexMock, notFoundMock } = vi.hoisted(() => ({
  getShowMock: vi.fn(),
  getSearchIndexMock: vi.fn(),
  notFoundMock: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('next/navigation', () => ({ notFound: notFoundMock }))
vi.mock('@/content/loaders', () => ({ getShow: getShowMock }))
vi.mock('@/lib/searchIndex', () => ({ getSearchIndex: getSearchIndexMock }))
vi.mock('@/components/chrome/Footer', () => ({
  Footer: function FooterMock() {
    return null
  },
}))
vi.mock('@/components/chrome/Header', () => ({
  Header: function HeaderMock() {
    return null
  },
}))
vi.mock('@/components/chrome/SkipToMain', () => ({
  SkipToMain: function SkipToMainMock() {
    return null
  },
}))
vi.mock('@/components/show/ShowPaletteScope', () => ({
  ShowPaletteScope: function ShowPaletteScopeMock() {
    return null
  },
}))
vi.mock('@/components/search/SearchHost', () => ({
  SearchHost: function SearchHostMock() {
    return null
  },
}))

import { Footer } from '@/components/chrome/Footer'
import { Header } from '@/components/chrome/Header'
import { SkipToMain } from '@/components/chrome/SkipToMain'
import { SearchHost } from '@/components/search/SearchHost'
import { ShowPaletteScope } from '@/components/show/ShowPaletteScope'
import ShowSegmentLayout from '../layout'

type El = ReactElement<Record<string, unknown>>

const PALETTE = { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' }
const survivor = { slug: 'survivor', palette: PALETTE }
const SEARCH_ITEMS = [{ kind: 'show', slug: 'survivor', title: 'Survivor' }]
const KIDS = <div data-testid="layout-children" />

function childrenOf(el: El): El[] {
  const c = (el.props as { children?: unknown }).children
  if (c == null) return []
  return (Array.isArray(c) ? c : [c]) as El[]
}

function renderTree(show = 'survivor'): El {
  return ShowSegmentLayout({ params: { show }, children: KIDS }) as El
}

beforeEach(() => {
  getShowMock.mockReset()
  getSearchIndexMock.mockReset()
  notFoundMock.mockClear()
  getShowMock.mockReturnValue(survivor)
  getSearchIndexMock.mockReturnValue(SEARCH_ITEMS)
})

// --------------------------------------------------------------------
// show resolution + notFound branch
// --------------------------------------------------------------------

describe('ShowSegmentLayout — show resolution', () => {
  it('resolves the show via getShow(params.show) passed verbatim — no transformation', () => {
    renderTree('rupauls-drag-race')
    expect(getShowMock).toHaveBeenCalledWith('rupauls-drag-race')
  })

  it('calls getShow exactly once per render — no loader fan-out', () => {
    renderTree()
    expect(getShowMock).toHaveBeenCalledTimes(1)
  })

  it('calls notFound() when the show is unknown — never falls through to the palette read', () => {
    // notFound is a thrower in production; if it were a no-op the layout
    // would continue to `show.palette` and crash with a TypeError. The
    // throw is the short-circuit, so the render must abort here.
    getShowMock.mockReturnValue(undefined)
    expect(() => renderTree('no-such-show')).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('treats a null show identically to undefined — defensive against loader signature drift', () => {
    getShowMock.mockReturnValue(null)
    expect(() => renderTree('no-such-show')).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('does not reach getSearchIndex on the unknown-show path — notFound aborts before it', () => {
    getShowMock.mockReturnValue(undefined)
    try {
      renderTree('no-such-show')
    } catch {}
    expect(getSearchIndexMock).not.toHaveBeenCalled()
  })

  it('never calls notFound on the happy path', () => {
    renderTree()
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

// --------------------------------------------------------------------
// per-show palette injection (the visual-law mechanism)
// --------------------------------------------------------------------

describe('ShowSegmentLayout — palette scope', () => {
  it('wraps the segment in ShowPaletteScope as the top element', () => {
    expect(renderTree().type).toBe(ShowPaletteScope)
  })

  it("passes the RESOLVED show's slug to ShowPaletteScope — not the raw URL param", () => {
    // The contract is `show={show.slug}`. Mock the resolved slug to differ
    // from the param so a regression to `show={params.show}` is caught.
    getShowMock.mockReturnValue({ slug: 'survivor', palette: PALETTE })
    const scope = renderTree('survivor-alias')
    expect(scope.props.show).toBe('survivor')
  })

  it('threads the show palette object through to ShowPaletteScope by reference', () => {
    const scope = renderTree()
    expect(scope.props.palette).toBe(PALETTE)
  })

  it('sets asSegment — the layout-level scope flag, not a page-level scope', () => {
    // asSegment is load-bearing: it is what distinguishes the segment
    // layout's palette wrapper (covering chrome + all child routes) from
    // a page-level ShowPaletteScope. A regression dropping it would scope
    // the palette too narrowly and de-tint the chrome.
    expect(renderTree().props.asSegment).toBe(true)
  })
})

// --------------------------------------------------------------------
// tinted chrome
// --------------------------------------------------------------------

describe('ShowSegmentLayout — tinted chrome', () => {
  function find(type: unknown): El | undefined {
    return childrenOf(renderTree()).find((c) => c?.type === type)
  }

  it('renders the Header with tinted — chrome takes on the show palette', () => {
    expect(find(Header)?.props.tinted).toBe(true)
  })

  it('renders the Footer with tinted — chrome takes on the show palette', () => {
    expect(find(Footer)?.props.tinted).toBe(true)
  })
})

// --------------------------------------------------------------------
// shell composition + ordering
// --------------------------------------------------------------------

describe('ShowSegmentLayout — shell composition', () => {
  it('renders five children in order: SkipToMain, Header, main, Footer, SearchHost', () => {
    const kids = childrenOf(renderTree())
    expect(kids).toHaveLength(5)
    expect(kids[0]?.type).toBe(SkipToMain)
    expect(kids[1]?.type).toBe(Header)
    expect(kids[2]?.type).toBe('main')
    expect(kids[3]?.type).toBe(Footer)
    expect(kids[4]?.type).toBe(SearchHost)
  })

  it('renders SkipToMain first — the skip link must be the first focusable element', () => {
    expect(childrenOf(renderTree())[0]?.type).toBe(SkipToMain)
  })

  it('wraps children in <main id="main" className="flex-1"> — the skip-link target + flex shell', () => {
    const main = childrenOf(renderTree()).find((c) => c?.type === 'main')
    expect(main?.props.id).toBe('main')
    expect(main?.props.className).toBe('flex-1')
    expect(main?.props.children).toBe(KIDS)
  })
})

// --------------------------------------------------------------------
// search host
// --------------------------------------------------------------------

describe('ShowSegmentLayout — search host', () => {
  it('feeds SearchHost the items from getSearchIndex()', () => {
    const host = childrenOf(renderTree()).find((c) => c?.type === SearchHost)
    expect(host?.props.items).toBe(SEARCH_ITEMS)
  })

  it('calls getSearchIndex exactly once per render', () => {
    renderTree()
    expect(getSearchIndexMock).toHaveBeenCalledTimes(1)
  })
})
