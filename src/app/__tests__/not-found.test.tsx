import { Fragment, type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

// src/app/not-found.tsx is the ROOT 404 boundary — it catches any URL
// with no matching segment anywhere (e.g. /account), which falls
// through past every route group's own not-found.tsx (route groups
// only catch notFound() calls or matched-but-missing children within
// their own subtree). Before this file existed, that case fell all
// the way through to Next's bare, chrome-less built-in 404 (CRITIQUE
// pass-120) — this test guards that the root boundary renders the
// same shared header/footer shell as (default)/not-found.tsx, not a
// stripped-down duplicate that could drift from it.
//
// Header is an async server component (reads auth0.getSession()), so
// it's mocked to a stub the same way (default)/__tests__/layout.test.tsx
// mocks it — the returned element tree is inspected by reference
// rather than rendered through jsdom.

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

import Link from 'next/link'
import { Footer } from '@/components/chrome/Footer'
import { Header } from '@/components/chrome/Header'
import { SkipToMain } from '@/components/chrome/SkipToMain'
import { Wrap } from '@/components/chrome/Wrap'
import RootNotFound from '../not-found'

type El = ReactElement<Record<string, unknown>>

function childrenOf(el: El): El[] {
  const c = (el.props as { children?: unknown }).children
  if (c == null) return []
  return (Array.isArray(c) ? c : [c]) as El[]
}

function renderTree(): El {
  return RootNotFound() as unknown as El
}

const norm = (s: unknown) =>
  (typeof s === 'string' ? s : '').replace(/\s+/g, ' ').trim()

describe('RootNotFound — shell composition', () => {
  it('returns a Fragment as the top element — not a host wrapper', () => {
    expect(renderTree().type).toBe(Fragment)
  })

  it('renders SkipToMain, Header, Wrap, Footer in order', () => {
    const kids = childrenOf(renderTree())
    expect(kids).toHaveLength(4)
    expect(kids[0]?.type).toBe(SkipToMain)
    expect(kids[1]?.type).toBe(Header)
    expect(kids[2]?.type).toBe(Wrap)
    expect(kids[3]?.type).toBe(Footer)
  })

  it('renders SkipToMain first — the skip link must be the first focusable element', () => {
    expect(childrenOf(renderTree())[0]?.type).toBe(SkipToMain)
  })

  it('renders the Header untinted — default-paper chrome, not show-palette', () => {
    const kids = childrenOf(renderTree())
    const header = kids.find((c) => c?.type === Header)
    expect(header?.props.tinted).not.toBe(true)
  })
})

describe('RootNotFound — bounded width + main target', () => {
  it('nests <main id="main" className="flex-1"> inside <Wrap>', () => {
    const wrap = childrenOf(renderTree()).find((c) => c?.type === Wrap)
    const main = childrenOf(wrap as El).find((c) => c?.type === 'main')
    expect(main?.props.id).toBe('main')
    expect(main?.props.className).toBe('flex-1')
  })
})

describe('RootNotFound — copy + recovery link', () => {
  function mainChildren(): El[] {
    const wrap = childrenOf(renderTree()).find((c) => c?.type === Wrap)
    const main = childrenOf(wrap as El).find((c) => c?.type === 'main') as El
    const section = childrenOf(main)[0] as El
    return childrenOf(section)
  }

  it('renders an h1 announcing the page is not found, in the editorial serif register', () => {
    const h1 = mainChildren().find((c) => c?.type === 'h1')
    expect(norm(h1?.props.children)).toContain('Not found.')
    expect((h1?.props.className as string)?.includes('font-serif')).toBe(true)
  })

  it('explains the page was not built or never existed', () => {
    const p = mainChildren().find((c) => c?.type === 'p')
    const text = norm(p?.props.children)
    expect(text).toMatch(/built yet/)
    expect(text).toMatch(/never existed/)
  })

  it('renders exactly one recovery link, pointing home', () => {
    const links = mainChildren().filter((c) => c?.type === Link)
    expect(links).toHaveLength(1)
    expect(links[0]?.props.href).toBe('/')
    expect(norm(links[0]?.props.children)).toBe('Back to tiered.tv')
  })
})
