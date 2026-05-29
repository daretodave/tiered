import { Fragment, type ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// src/app/(default)/layout.tsx is the untinted default-chrome layout — the
// wrapper EVERY default-chrome route inherits (home, /shows, /themes,
// /about, the legal pages, /u/[handle], /mod, /sign-in). It is the sibling
// to the root layout (#211) and the per-show SEGMENT layout (#212), and
// simpler than both: no params, no getShow, no notFound branch, no palette
// scope. But it carries two contracts that are the INVERSE of the per-show
// layout and dark to a hermetic e2e walk (which reads the painted page, not
// the layout's prop construction):
//
//   (1) bare <Header />/<Footer /> — UNTINTED. The per-show layout passes
//       `tinted` so the chrome takes on the show palette; the default layout
//       passes nothing so the chrome stays default-paper. A regression
//       cross-wiring `tinted` onto the default layout would put show-palette
//       chrome on every non-show route.
//   (2) <Wrap> bounds the content to 1240px — the whole "non-show routes get
//       a bounded container; show + season routes stay full-bleed" page-width
//       law (phase 19b). A regression dropping <Wrap> would let default
//       routes run full-bleed like a show page.
//   (3) <main id="main" className="flex-1"> is nested INSIDE <Wrap> — not a
//       direct fragment child the way it is in the per-show layout. It is the
//       skip-link target + the flex shell.
//   (4) SkipToMain rendered FIRST — the skip link must be the first focusable
//       element (an a11y ordering the axe walk checks for presence, not
//       authored position).
//   (5) SearchHost fed from getSearchIndex().
//
// The imported chrome components + the loader are mocked to stable stub
// functions so the returned element tree can be identified by reference and
// inspected directly (the layout returns a fragment of components, not host
// DOM that jsdom can cleanly render) — the same tree-inspection approach the
// root-layout test (#211) and the per-show layout test (#212) use.

const { getSearchIndexMock } = vi.hoisted(() => ({
  getSearchIndexMock: vi.fn(),
}))

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
vi.mock('@/components/chrome/Wrap', () => ({
  Wrap: function WrapMock() {
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
import { Wrap } from '@/components/chrome/Wrap'
import { SearchHost } from '@/components/search/SearchHost'
import DefaultLayout from '../layout'

type El = ReactElement<Record<string, unknown>>

const SEARCH_ITEMS = [{ kind: 'show', slug: 'survivor', title: 'Survivor' }]
const KIDS = <div data-testid="layout-children" />

function childrenOf(el: El): El[] {
  const c = (el.props as { children?: unknown }).children
  if (c == null) return []
  return (Array.isArray(c) ? c : [c]) as El[]
}

function renderTree(): El {
  return DefaultLayout({ children: KIDS }) as unknown as El
}

function find(type: unknown): El | undefined {
  return childrenOf(renderTree()).find((c) => c?.type === type)
}

beforeEach(() => {
  getSearchIndexMock.mockReset()
  getSearchIndexMock.mockReturnValue(SEARCH_ITEMS)
})

// --------------------------------------------------------------------
// shell composition + ordering
// --------------------------------------------------------------------

describe('DefaultLayout — shell composition', () => {
  it('returns a Fragment as the top element — not a host wrapper', () => {
    expect(renderTree().type).toBe(Fragment)
  })

  it('renders five children in order: SkipToMain, Header, Wrap, Footer, SearchHost', () => {
    const kids = childrenOf(renderTree())
    expect(kids).toHaveLength(5)
    expect(kids[0]?.type).toBe(SkipToMain)
    expect(kids[1]?.type).toBe(Header)
    expect(kids[2]?.type).toBe(Wrap)
    expect(kids[3]?.type).toBe(Footer)
    expect(kids[4]?.type).toBe(SearchHost)
  })

  it('renders SkipToMain first — the skip link must be the first focusable element', () => {
    expect(childrenOf(renderTree())[0]?.type).toBe(SkipToMain)
  })
})

// --------------------------------------------------------------------
// bounded width (Wrap) — the page-width law (phase 19b)
// --------------------------------------------------------------------

describe('DefaultLayout — bounded width', () => {
  it('wraps content in <Wrap> — non-show routes get the bounded container, not full-bleed', () => {
    // Show + season routes stay full-bleed (their segment layout has no
    // <Wrap>); every default route is bounded by this <Wrap>. A regression
    // dropping it would let default routes run edge-to-edge like a show page.
    expect(find(Wrap)).toBeDefined()
  })

  it('nests <main> inside <Wrap> — not as a direct fragment child', () => {
    // The structural difference from the per-show layout, where <main> is a
    // direct fragment child. Here the bounded container is the parent of main.
    const wrap = find(Wrap)
    const main = childrenOf(wrap as El).find((c) => c?.type === 'main')
    expect(main?.type).toBe('main')
  })

  it('the <main> is <main id="main" className="flex-1"> wrapping children — the skip-link target + flex shell', () => {
    const wrap = find(Wrap)
    const main = childrenOf(wrap as El).find((c) => c?.type === 'main')
    expect(main?.props.id).toBe('main')
    expect(main?.props.className).toBe('flex-1')
    expect(main?.props.children).toBe(KIDS)
  })

  it('does not render <main> as a direct fragment child — it lives under Wrap', () => {
    expect(childrenOf(renderTree()).some((c) => c?.type === 'main')).toBe(false)
  })
})

// --------------------------------------------------------------------
// untinted chrome — the inverse of the per-show SEGMENT layout
// --------------------------------------------------------------------

describe('DefaultLayout — untinted chrome', () => {
  it('renders the Header WITHOUT tinted — default-paper chrome, not show-palette', () => {
    // The per-show layout passes `tinted` so the chrome takes on the show
    // palette; the default layout must not. A regression to `<Header tinted />`
    // would cross-wire show-palette chrome onto every non-show route.
    expect(find(Header)?.props.tinted).not.toBe(true)
  })

  it('renders the Footer WITHOUT tinted — default-paper chrome, not show-palette', () => {
    expect(find(Footer)?.props.tinted).not.toBe(true)
  })
})

// --------------------------------------------------------------------
// search host
// --------------------------------------------------------------------

describe('DefaultLayout — search host', () => {
  it('feeds SearchHost the items from getSearchIndex()', () => {
    expect(find(SearchHost)?.props.items).toBe(SEARCH_ITEMS)
  })

  it('calls getSearchIndex exactly once per render — no loader fan-out', () => {
    renderTree()
    expect(getSearchIndexMock).toHaveBeenCalledTimes(1)
  })
})
