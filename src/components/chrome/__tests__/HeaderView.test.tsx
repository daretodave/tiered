import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeaderView } from '../HeaderView'

const ASHA = {
  handle: 'asha',
  displayLabel: '@asha',
  profileHref: '/u/asha',
} as const

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('<HeaderView>', () => {
  it('renders the BrandMark + tiered.tv wordmark linked to /', () => {
    render(<HeaderView />)
    expect(screen.getByTestId('brand-mark')).toBeInTheDocument()
    const brand = screen.getByTestId('site-header-brand')
    expect(brand).toHaveAttribute('href', '/')
    expect(brand).toHaveTextContent('tiered.tv')
  })

  it('renders the three nav links: Shows / Lists / About', () => {
    render(<HeaderView />)
    const nav = screen.getByRole('navigation', { name: /primary/i })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toEqual(['/shows', '/themes', '/about'])
  })

  it('renders the search trigger button (cmd+K overlay)', () => {
    render(<HeaderView />)
    const trigger = screen.getByTestId('site-header-search-trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveTextContent(/Search/i)
    expect(trigger.textContent).toMatch(/⌘K/)
    expect(screen.queryByTestId('site-header-search-link')).toBeNull()
  })

  it('renders the Sign in pill pointing to /sign-in when signed out', () => {
    render(<HeaderView />)
    const signIn = screen.getByTestId('site-header-signin-link')
    expect(signIn).toHaveAttribute('href', '/sign-in')
    expect(signIn).toHaveTextContent(/Sign in/i)
    expect(screen.queryByTestId('site-header-user-link')).toBeNull()
    expect(screen.queryByTestId('site-header-signout-link')).toBeNull()
    expect(screen.queryByTestId('site-header-user-trigger')).toBeNull()
    expect(screen.getByTestId('site-header')).toHaveAttribute(
      'data-signed-in',
      'false',
    )
  })

  it('renders the user handle + Sign out link when signed in', () => {
    render(<HeaderView user={ASHA} />)
    const handle = screen.getByTestId('site-header-user-link')
    expect(handle).toHaveAttribute('href', '/u/asha')
    expect(handle).toHaveTextContent('@asha')
    const signOut = screen.getByTestId('site-header-signout-link')
    expect(signOut).toHaveAttribute(
      'href',
      `/auth/logout?returnTo=${encodeURIComponent('https://tiered.tv/')}`,
    )
    // Auth0 rejects a relative post_logout_redirect_uri (#56): the
    // returnTo must decode to an absolute URL.
    const href = signOut.getAttribute('href') ?? ''
    const returnTo = decodeURIComponent(
      new URLSearchParams(href.split('?')[1]).get('returnTo') ?? '',
    )
    expect(returnTo).toMatch(/^https:\/\//)
    expect(signOut).toHaveTextContent(/Sign out/i)
    expect(screen.queryByTestId('site-header-signin-link')).toBeNull()
    expect(screen.getByTestId('site-header')).toHaveAttribute(
      'data-signed-in',
      'true',
    )
  })

  it('hydrates from /api/auth/me and flips a static signed-out header to the account chrome', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          signedIn: true,
          user: ASHA,
        }),
      }),
    )
    // SSR value is signed-out (the SSG/ISR bug condition).
    render(<HeaderView user={null} />)
    expect(screen.getByTestId('site-header-signin-link')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('site-header-user-link')).toHaveTextContent(
        '@asha',
      )
    })
    expect(screen.queryByTestId('site-header-signin-link')).toBeNull()
    expect(screen.getByTestId('site-header')).toHaveAttribute(
      'data-signed-in',
      'true',
    )
    expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.anything())
  })

  it('keeps the SSR value when /api/auth/me fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(
      <HeaderView
        user={{ handle: 'rui', displayLabel: '@rui', profileHref: '/u/rui' }}
      />,
    )
    expect(screen.getByTestId('site-header-user-link')).toHaveTextContent('@rui')
    // Give the rejected fetch a tick; state must not regress.
    await new Promise((r) => setTimeout(r, 0))
    expect(screen.getByTestId('site-header-user-link')).toHaveTextContent('@rui')
  })

  it('applies tinted class + data-tinted attribute when tinted={true}', () => {
    render(<HeaderView tinted />)
    const header = screen.getByTestId('site-header')
    expect(header.className).toContain('tinted')
    expect(header.getAttribute('data-tinted')).toBe('true')
  })

  it('does not apply tinted class by default', () => {
    render(<HeaderView />)
    const header = screen.getByTestId('site-header')
    expect(header.className).not.toContain('tinted')
    expect(header.getAttribute('data-tinted')).toBeNull()
  })

  // ---- Critique pass-23 #MED: mobile account-menu disclosure ------
  describe('mobile account menu (≤720px disclosure)', () => {
    it('renders the trigger button alongside the desktop pair on the authed branch', () => {
      render(<HeaderView user={ASHA} />)
      const trigger = screen.getByTestId('site-header-user-trigger')
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger).toHaveTextContent('@asha')
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-label', 'Account menu for @asha')
      // Both desktop variants still in the DOM (CSS swaps them).
      expect(screen.getByTestId('site-header-user-link')).toBeInTheDocument()
      expect(screen.getByTestId('site-header-signout-link')).toBeInTheDocument()
      // Menu starts closed.
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
    })

    it('opens the menu on trigger click with Your record + Sign out items', () => {
      render(<HeaderView user={ASHA} />)
      const trigger = screen.getByTestId('site-header-user-trigger')
      fireEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      const menu = screen.getByTestId('site-header-user-menu')
      expect(menu).toHaveAttribute('role', 'menu')
      const record = screen.getByTestId('site-header-user-menu-record')
      expect(record).toHaveAttribute('href', '/u/asha')
      expect(record).toHaveAttribute('role', 'menuitem')
      expect(record).toHaveTextContent('Your record')
      const signOut = screen.getByTestId('site-header-user-menu-signout')
      expect(signOut).toHaveAttribute(
        'href',
        `/auth/logout?returnTo=${encodeURIComponent('https://tiered.tv/')}`,
      )
      expect(signOut).toHaveAttribute('role', 'menuitem')
      expect(signOut).toHaveTextContent('Sign out')
      // aria-controls wires the trigger to the rendered menu's id.
      expect(trigger.getAttribute('aria-controls')).toBe(menu.getAttribute('id'))
    })

    it('toggles closed on a second trigger click', () => {
      render(<HeaderView user={ASHA} />)
      const trigger = screen.getByTestId('site-header-user-trigger')
      fireEvent.click(trigger)
      expect(screen.getByTestId('site-header-user-menu')).toBeInTheDocument()
      fireEvent.click(trigger)
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes the menu on Escape and returns focus to the trigger', () => {
      render(<HeaderView user={ASHA} />)
      const trigger = screen.getByTestId('site-header-user-trigger')
      fireEvent.click(trigger)
      expect(screen.getByTestId('site-header-user-menu')).toBeInTheDocument()
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('closes when a pointer event lands outside the menu + trigger', () => {
      render(
        <div>
          <span data-testid="outside-region">outside</span>
          <HeaderView user={ASHA} />
        </div>,
      )
      const trigger = screen.getByTestId('site-header-user-trigger')
      fireEvent.click(trigger)
      expect(screen.getByTestId('site-header-user-menu')).toBeInTheDocument()
      const outside = screen.getByTestId('outside-region')
      fireEvent.mouseDown(outside)
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
    })

    it('does not close when a pointer lands inside the menu (selecting an item)', () => {
      render(<HeaderView user={ASHA} />)
      fireEvent.click(screen.getByTestId('site-header-user-trigger'))
      const record = screen.getByTestId('site-header-user-menu-record')
      // The pointerdown phase fires before the click navigates — at
      // that moment the menu must still be open or the item never
      // resolves to a navigation. (Anchor click handler follows on
      // the same gesture and closes the menu via its own onClick.)
      fireEvent.mouseDown(record)
      expect(screen.getByTestId('site-header-user-menu')).toBeInTheDocument()
    })

    it('closes when a menu item is activated (click)', () => {
      render(<HeaderView user={ASHA} />)
      fireEvent.click(screen.getByTestId('site-header-user-trigger'))
      fireEvent.click(screen.getByTestId('site-header-user-menu-record'))
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
    })

    it('does not render the trigger when signed out', () => {
      render(<HeaderView />)
      expect(screen.queryByTestId('site-header-user-trigger')).toBeNull()
      expect(screen.queryByTestId('site-header-user-menu')).toBeNull()
    })
  })

  // ---- Critique pass-44 #MED: mobile-only disclosure chevron --------
  // The trigger renders the handle (e.g. `@e2e`) as a plain mono label
  // with no hover cue on mobile — a fresh-eyes peer reads it as a
  // static label, not as a menu, so the pass-23 mis-tap-guard closure
  // (sign-out behind a tap) had high discovery cost on mobile. The fix
  // adds a `::after` pseudo-element rendering `▾` inside the
  // `@media (max-width: 720px)` block of `src/styles/chrome.css`. The
  // chevron is mobile-only — the desktop branch already renders an
  // inline `Sign out` link as the interactive-surface signal, so a
  // chevron on `@handle` would double up. CSS pseudo-elements are
  // unreachable from jsdom's render tree, so the rule is pinned at
  // source (matches the FeaturedCard `.feat-foot` casing pin pattern
  // at `src/components/lists/__tests__/FeaturedCard.test.tsx:166`).
  describe('chrome.css `.site-header-user-trigger::after` mobile chevron pin (pass-44 #MED)', () => {
    const css = readFileSync(
      path.resolve(process.cwd(), 'src/styles/chrome.css'),
      'utf-8',
    )

    // chrome.css has three separate `@media (max-width: 720px)` blocks
    // (wrap padding, header chrome, footer cols). The chevron pin only
    // cares about the header-chrome one — the block that contains the
    // `.site-header-user-trigger` declaration. Locate that block by
    // finding the `@media` opener BEFORE the trigger rule's position.
    function headerMobileMediaBounds(): { start: number; end: number } {
      const rulePos = css.indexOf('.site-header-user-trigger::after')
      expect(rulePos).toBeGreaterThanOrEqual(0)
      const mediaRe = /@media \(max-width: 720px\)/g
      let start = -1
      for (
        let m = mediaRe.exec(css);
        m !== null && m.index < rulePos;
        m = mediaRe.exec(css)
      ) {
        start = m.index
      }
      expect(start).toBeGreaterThanOrEqual(0)
      const open = css.indexOf('{', start)
      let depth = 1
      let i = open + 1
      while (i < css.length && depth > 0) {
        const ch = css[i]
        if (ch === '{') depth += 1
        else if (ch === '}') depth -= 1
        i += 1
      }
      expect(depth).toBe(0)
      return { start, end: i }
    }

    it('the mobile media block declares `.site-header-user-trigger::after` with a non-`none` content property (chevron renders on mobile)', () => {
      const { start, end } = headerMobileMediaBounds()
      const block = css.slice(start, end)
      const ruleMatch = block.match(
        /\.site-header-user-trigger::after\s*\{([^}]*)\}/,
      )
      expect(ruleMatch).not.toBeNull()
      const body = ruleMatch?.[1] ?? ''
      expect(body).toMatch(/content:\s*['"]/)
      expect(body).not.toMatch(/content:\s*none/)
    })

    it('the `.site-header-user-trigger::after` rule does NOT appear outside the header mobile media block (desktop preserves the inline `Sign out` link as its disclosure signal)', () => {
      const { start, end } = headerMobileMediaBounds()
      const block = css.slice(start, end)
      const outside = css.slice(0, start) + css.slice(end)
      expect(outside).not.toMatch(/\.site-header-user-trigger::after/)
      // Sibling positive: the rule's one source of truth is the mobile slice.
      expect(block).toMatch(/\.site-header-user-trigger::after/)
    })
  })
})
