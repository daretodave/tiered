import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FooterMeta } from '../FooterMeta'

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

describe('<FooterMeta> container', () => {
  it('renders a <div> carrying the meta testid and class', () => {
    render(<FooterMeta />)
    const meta = screen.getByTestId('site-footer-meta')
    expect(meta.tagName).toBe('DIV')
    expect(meta.classList.contains('site-footer-meta')).toBe(true)
  })

  it('renders exactly two spans in rebellion / toggle order', () => {
    render(<FooterMeta />)
    const spans = Array.from(
      screen.getByTestId('site-footer-meta').querySelectorAll(':scope > span'),
    )
    expect(spans.map((s) => s.className)).toEqual([
      'site-footer-meta-rebellion',
      'site-footer-meta-toggle',
    ])
  })

  it('does not render a public version string', () => {
    // Critique pass 7: `v0.0.0` undercut every page's editorial-confidence
    // claims. The public footer carries no version; engineers read it from
    // package.json directly.
    render(<FooterMeta />)
    expect(
      screen.queryByTestId('site-footer-meta-version'),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('site-footer-meta').textContent ?? '').not.toMatch(
      /\bv\d+\.\d+\.\d+/,
    )
  })
})

describe('<FooterMeta> rebellion line', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the full rebellion copy in the rebellion span', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2031-07-15T12:00:00Z'))
    render(<FooterMeta />)
    const span = screen
      .getByTestId('site-footer-meta')
      .querySelector('.site-footer-meta-rebellion')
    expect(norm(span?.textContent ?? null)).toBe(
      '© 2031 tiered.tv · est. as a quiet rebellion against ranked lists that ruin the show',
    )
  })

  it('recomputes the copyright year from the system clock', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2044-01-02T00:00:00Z'))
    render(<FooterMeta />)
    const span = screen
      .getByTestId('site-footer-meta')
      .querySelector('.site-footer-meta-rebellion')
    // A second fixed year proves the © year is dynamic — a silent
    // hardcode (e.g. `© 2026`) cannot satisfy both this case and the
    // 2031 case above.
    expect(norm(span?.textContent ?? null)).toMatch(/^© 2044 tiered\.tv ·/)
  })
})

describe('<FooterMeta> theme toggle', () => {
  it('mounts the theme toggle button inside the toggle span', () => {
    render(<FooterMeta />)
    const toggleSpan = screen
      .getByTestId('site-footer-meta')
      .querySelector('.site-footer-meta-toggle')
    expect(toggleSpan).not.toBeNull()
    expect(toggleSpan?.querySelectorAll('button')).toHaveLength(1)
  })

  it('exposes the toggle with a switch-mode accessible name', () => {
    render(<FooterMeta />)
    expect(
      screen.getByRole('button', { name: /switch to (light|dark) mode/i }),
    ).toBeInTheDocument()
  })
})
