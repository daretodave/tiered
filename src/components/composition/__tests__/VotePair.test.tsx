import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { VotePair } from '../VotePair'

// Flush the fetch().then(json).then(dispatch) microtask chain.
// `waitFor` polls on real/fake timers and deadlocks under
// `vi.useFakeTimers`, so we drain microtasks explicitly instead.
async function flushAsync() {
  await act(async () => {
    for (let i = 0; i < 6; i++) await Promise.resolve()
  })
}

// Mount fires a GET /api/vote read-back; a click fires a POST.
// `fetchMock` lets each test script the JSON each call resolves
// to (keyed by method) so the optimistic + reconcile paths are
// both exercised deterministically.
type VoteBody = {
  ok: boolean
  value: number
  count: number
  signedIn?: boolean
}

function jsonResponse(body: VoteBody) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as unknown as Response)
}

describe('<VotePair>', () => {
  let getBody: VoteBody
  let postBody: VoteBody
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    getBody = { ok: true, value: 0, count: 0 }
    postBody = { ok: true, value: 1, count: 1 }
    fetchMock = vi.fn((input: unknown, init?: { method?: string }) => {
      const method = init?.method ?? 'GET'
      return jsonResponse(method === 'POST' ? postBody : getBody)
    })
    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the initial count and renders enabled buttons', () => {
    render(<VotePair initialCount={10} targetType="season" targetId="survivor:20" />)
    expect(screen.getByTestId('vote-count').textContent).toBe('+10')
    expect(screen.getByTestId('vote-up')).toBeEnabled()
    expect(screen.getByTestId('vote-down')).toBeEnabled()
  })

  it('clicking up increments the count, locks both buttons, and POSTs to /api/vote', () => {
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    expect(screen.getByTestId('vote-count').textContent).toBe('+6')
    expect(screen.getByTestId('vote-up')).toBeDisabled()
    expect(screen.getByTestId('vote-down')).toBeDisabled()
    const postCalls = fetchMock.mock.calls.filter(
      (c) => (c[1] as { method?: string } | undefined)?.method === 'POST',
    )
    expect(postCalls.length).toBe(1)
  })

  it('clicking down decrements the count', () => {
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-down'))
    expect(screen.getByTestId('vote-count').textContent).toBe('+4')
  })

  it('reads the viewer existing vote + true net on mount and reflects it', async () => {
    getBody = { ok: true, value: 1, count: 42 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('+42')
    expect(screen.getByTestId('vote-pair').getAttribute('data-vote-value')).toBe('1')
  })

  it('POSTs the retract value 0 when re-clicking the already-voted direction', async () => {
    getBody = { ok: true, value: 1, count: 10 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    expect(screen.getByTestId('vote-pair').getAttribute('data-vote-value')).toBe('1')
    fireEvent.click(screen.getByTestId('vote-up'))
    const postCall = fetchMock.mock.calls.find(
      (c) => (c[1] as { method?: string } | undefined)?.method === 'POST',
    )
    const sent = JSON.parse((postCall?.[1] as { body: string }).body)
    expect(sent.value).toBe(0)
    // Optimistic net dropped by the prior +1.
    expect(screen.getByTestId('vote-count').textContent).toBe('+9')
  })

  it('reconciles the count to the server aggregate after the POST resolves', async () => {
    postBody = { ok: true, value: 1, count: 3 }
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    expect(screen.getByTestId('vote-count').textContent).toBe('+6') // optimistic
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('+3')
  })

  it('a vote that races the mount fetch is not clobbered by the stale snapshot', async () => {
    getBody = { ok: true, value: 0, count: 0 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up')) // before GET resolves
    await flushAsync()
    // hydrate is a no-op post-click; optimistic +1 survives.
    expect(screen.getByTestId('vote-pair').getAttribute('data-vote-value')).toBe('1')
  })

  it('unlocks the buttons after the lock window elapses', () => {
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    expect(screen.getByTestId('vote-up')).toBeDisabled()
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(screen.getByTestId('vote-up')).toBeEnabled()
  })

  it('flashes the clicked direction during the lock window', () => {
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    expect(screen.getByTestId('vote-up').className).toContain('flash')
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(screen.getByTestId('vote-up').className).not.toContain('flash')
  })

  it('drops the slide transform when prefers-reduced-motion matches', () => {
    const original = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('reduce'),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    })
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    const num = screen.getByTestId('vote-count')
    expect(num.style.transform).toBe('none')
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: original,
    })
  })

  // --- issue #64: clean integers, voted affordance, load-in ---

  it('reflects the voted direction via aria-pressed + a voted class', async () => {
    getBody = { ok: true, value: 1, count: 7 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const up = screen.getByTestId('vote-up')
    const down = screen.getByTestId('vote-down')
    expect(up.getAttribute('aria-pressed')).toBe('true')
    expect(down.getAttribute('aria-pressed')).toBe('false')
    expect(up.className).toContain('voted')
    expect(up.getAttribute('aria-label')).toMatch(/remove your up vote/i)
    expect(screen.getByTestId('vote-pair').getAttribute('data-voted')).toBe('up')
  })

  it('gates a graceful fade-in via data-hydrated until the mount read resolves', async () => {
    getBody = { ok: true, value: 0, count: 9 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    expect(
      screen.getByTestId('vote-pair').getAttribute('data-hydrated'),
    ).toBe('false')
    await flushAsync()
    expect(
      screen.getByTestId('vote-pair').getAttribute('data-hydrated'),
    ).toBe('true')
    expect(screen.getByTestId('vote-count').textContent).toBe('+9')
  })

  it('rounds any stray fractional server count to a clean integer', async () => {
    getBody = { ok: true, value: 0, count: 2.6 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('+3')
  })

  // --- pluralize-aware label (critique pass-5 LOW): the visible
  // unit must agree with the displayed count so a net of exactly
  // 1 doesn't render "1 NET VOTES".
  describe('pluralize-aware label', () => {
    function labelText() {
      return screen
        .getByTestId('vote-pair')
        .querySelector('.vote-label')?.textContent
    }

    it('renders the plural form when the count is 0', () => {
      // No-vote state carries the "community · " qualifier per
      // #199; the substring assertion lets the pluralize-aware
      // section stay focused on its concern (unit agreement).
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      expect(labelText()?.endsWith(' net votes')).toBe(true)
    })

    it('renders the singular form when the count is exactly 1', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.getByTestId('vote-count').textContent).toBe('+1')
      expect(labelText()).toBe('net vote')
    })

    it('renders the singular form when the count is exactly -1', async () => {
      getBody = { ok: true, value: -1, count: -1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.getByTestId('vote-count').textContent).toBe('-1')
      expect(labelText()).toBe('net vote')
    })

    it('renders the plural form when the count is 2', () => {
      render(<VotePair initialCount={2} targetType="season" targetId="survivor:20" />)
      expect(labelText()?.endsWith(' net votes')).toBe(true)
    })

    it('honors custom singular + plural label props', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(
        <VotePair
          initialCount={0}
          targetType="season"
          targetId="survivor:20"
          label="approvals"
          labelSingular="approval"
        />,
      )
      await flushAsync()
      expect(labelText()).toBe('approval')
    })

    it('flips to the plural label after a singular-count round-trip retract', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(labelText()).toBe('net vote')
      // Re-click up to retract; optimistic value+count drop to 0,
      // so the unit pluralizes AND the no-vote "community · "
      // qualifier kicks in (#199).
      fireEvent.click(screen.getByTestId('vote-up'))
      expect(labelText()).toBe('community · net votes')
    })

    it('keeps the action-describing aria-labels on the plural form regardless of count', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      // Displayed unit pluralizes, but aria describes the action.
      expect(labelText()).toBe('net vote')
      expect(
        screen.getByTestId('vote-pair').getAttribute('aria-label'),
      ).toBe('Vote on net votes')
      expect(
        screen.getByTestId('vote-down').getAttribute('aria-label'),
      ).toBe('Vote down net votes')
    })
  })

  // --- #160 (critique pass-6): YOUR VOTE block disambiguation ---
  // --- #189 (critique pass-12): no-vote cap was dropped ---
  // --- critique pass-27: no-vote cap restored as a state declaration ---
  //
  // Every signed-in member sees a state pill above the buttons
  // declaring the *current state* of their vote, in three shapes:
  //   value 0  → "you haven't voted yet" (data-vote-state='none')
  //   value 1  → "you voted higher"      (data-vote-state='up')
  //   value -1 → "you voted lower"       (data-vote-state='down')
  // Anon viewers never see the pill — the affordance is
  // viewer-identity bearing.
  //
  // Pass-12 #189 had dropped the no-vote shape on the theory
  // that VoteRowHead's "cast vote" head meta already owned the
  // signed-in-no-vote channel. Pass-27 reopened that: a signed-in
  // non-voter on the season page reading "YOUR VOTE / CAST VOTE
  // / Does this belong in the community top 10? / +1 / COMMUNITY
  // · NET VOTE" could not tell at a glance whether the +1 was
  // the community net or their own already-cast vote. The "cast
  // vote" meta is an *action* nudge; the cap declares *state*.
  // Together they finish the disambiguation. So the pill triad
  // is symmetric, with the no-vote shape descriptive (not a
  // re-nudge of the same action).
  describe('state pill (signed-in viewers — three-state triad)', () => {
    it('renders no state pill when /api/vote reports signedIn:false', async () => {
      getBody = { ok: true, value: 0, count: 0, signedIn: false }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.queryByTestId('vote-state-cap')).toBeNull()
      expect(
        screen.getByTestId('vote-pair-stack').getAttribute('data-signed-in'),
      ).toBe('false')
    })

    it('renders "you haven\'t voted yet" for a signed-in viewer with value 0', async () => {
      getBody = { ok: true, value: 0, count: 7, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      const cap = screen.getByTestId('vote-state-cap')
      expect(cap.textContent).toBe("you haven't voted yet")
      expect(cap.getAttribute('data-vote-state')).toBe('none')
      expect(
        screen.getByTestId('vote-pair-stack').getAttribute('data-signed-in'),
      ).toBe('true')
    })

    it('the no-vote cap reads the same regardless of the community count value', async () => {
      // Pass-27 pin: the cap declares the viewer's STATE, not the
      // count's value — so a negative net (e.g. -9) must not flip
      // the cap copy to anything sentiment-coloured. The cap stays
      // descriptive of the *vote*, not of the community-net sign.
      for (const count of [-9, -1, 0, 1, 9]) {
        getBody = { ok: true, value: 0, count, signedIn: true }
        const { unmount } = render(
          <VotePair initialCount={0} targetType="season" targetId="survivor:20" />,
        )
        await flushAsync()
        const cap = screen.getByTestId('vote-state-cap')
        expect(cap.textContent).toBe("you haven't voted yet")
        expect(cap.getAttribute('data-vote-state')).toBe('none')
        unmount()
      }
    })

    it('renders "you voted higher" for a signed-in viewer with value 1', async () => {
      getBody = { ok: true, value: 1, count: 7, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      const cap = screen.getByTestId('vote-state-cap')
      expect(cap.textContent).toBe('you voted higher')
      expect(cap.getAttribute('data-vote-state')).toBe('up')
    })

    it('renders "you voted lower" for a signed-in viewer with value -1', async () => {
      getBody = { ok: true, value: -1, count: -3, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      const cap = screen.getByTestId('vote-state-cap')
      expect(cap.textContent).toBe('you voted lower')
      expect(cap.getAttribute('data-vote-state')).toBe('down')
    })

    it('the cap flips on click (signed-in-no-vote → signed-in-with-vote)', async () => {
      getBody = { ok: true, value: 0, count: 5, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      // Pre-click: the cap declares the no-vote state.
      const beforeCap = screen.getByTestId('vote-state-cap')
      expect(beforeCap.textContent).toBe("you haven't voted yet")
      expect(beforeCap.getAttribute('data-vote-state')).toBe('none')
      // Click up — cap updates to the optimistic post-vote state.
      fireEvent.click(screen.getByTestId('vote-up'))
      const afterCap = screen.getByTestId('vote-state-cap')
      expect(afterCap.textContent).toBe('you voted higher')
      expect(afterCap.getAttribute('data-vote-state')).toBe('up')
    })

    it("never reveals the pill when /api/vote omits signedIn (defensive default)", async () => {
      // A bad-actor proxy could strip the field; absence must not
      // accidentally surface the pill to an anon viewer.
      getBody = { ok: true, value: 0, count: 0 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.queryByTestId('vote-state-cap')).toBeNull()
    })
  })

  // --- #190 (critique pass-13) + #199 (critique pass-14):
  // community-source qualifier on the count's label for the
  // unacted reader (anon OR authed, value === 0). The head
  // ("cast vote") owns the imperative; the label here
  // owns the *source* of the rendered number so "1 net vote"
  // isn't read as "you have 1 net vote" — and, for the anon
  // first-paint reader, isn't read as the same shape as the
  // adjacent "EDITOR'S CANON #02" rank.
  describe('community-source qualifier (no-vote viewer, anon or authed)', () => {
    function labelText() {
      return screen
        .getByTestId('vote-pair')
        .querySelector('.vote-label')?.textContent
    }

    it('prefixes the label with "community · " when authed-not-yet-voted (plural)', async () => {
      getBody = { ok: true, value: 0, count: 7, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(labelText()).toBe('community · net votes')
    })

    it('prefixes the label with "community · " when authed-not-yet-voted (singular)', async () => {
      getBody = { ok: true, value: 0, count: 1, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.getByTestId('vote-count').textContent).toBe('+1')
      expect(labelText()).toBe('community · net vote')
    })

    it('prefixes the label with "community · " for anon viewers too — pass-14 #199 (plural)', async () => {
      getBody = { ok: true, value: 0, count: 7, signedIn: false }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(labelText()).toBe('community · net votes')
    })

    it('prefixes the label with "community · " for anon viewers too — pass-14 #199 (singular)', async () => {
      getBody = { ok: true, value: 0, count: 1, signedIn: false }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.getByTestId('vote-count').textContent).toBe('+1')
      expect(labelText()).toBe('community · net vote')
    })

    it('omits the qualifier for authed-and-voted viewers — the cap already disambiguates', async () => {
      getBody = { ok: true, value: 1, count: 7, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(labelText()).toBe('net votes')
    })

    it('drops the qualifier on click (signed-in-no-vote → signed-in-with-vote)', async () => {
      getBody = { ok: true, value: 0, count: 5, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(labelText()).toBe('community · net votes')
      // Optimistic state.value flips to 1; the cap takes over the
      // disambiguation channel, so the qualifier must vanish.
      fireEvent.click(screen.getByTestId('vote-up'))
      expect(labelText()).toBe('net votes')
    })

    it('honors custom singular + plural labels when prefixing', async () => {
      getBody = { ok: true, value: 0, count: 1, signedIn: true }
      render(
        <VotePair
          initialCount={0}
          targetType="season"
          targetId="survivor:20"
          label="approvals"
          labelSingular="approval"
        />,
      )
      await flushAsync()
      expect(labelText()).toBe('community · approval')
    })

    it('SSR fallback (pre-hydrate) carries the qualifier — initial state.value is 0 for everyone, so anon and authed render structurally identical', () => {
      // Before the mount fetch resolves, state.value defaults to
      // 0 and the no-vote qualifier applies. Anon's hydrated
      // state stays at 0 and matches; an authed-voted viewer
      // hydrates to value 1 and drops the qualifier on the next
      // paint. The SSR-default-to-anon-with-qualifier is the
      // honest first paint for both viewer classes.
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      expect(labelText()).toBe('community · net votes')
    })
  })

  // --- critique pass-23 #264: explicit-sign count rendering ---
  //
  // The label promises signed math ("NET VOTE" = upvotes − downvotes),
  // so the rendered numeral must carry an explicit sign. A bare `1`
  // under "COMMUNITY · NET VOTE" reads as either "1 total vote cast"
  // or the season's rank — neither is what the widget shows. Pin:
  // positive → leading `+`, negative → leading `-`, zero → bare.
  describe('explicit-sign count rendering', () => {
    function countText() {
      return screen.getByTestId('vote-count').textContent
    }

    it('prefixes positive integers with "+"', () => {
      render(<VotePair initialCount={1} targetType="season" targetId="survivor:20" />)
      expect(countText()).toBe('+1')
    })

    it('prefixes larger positive integers with "+"', () => {
      render(<VotePair initialCount={42} targetType="season" targetId="survivor:20" />)
      expect(countText()).toBe('+42')
    })

    it('prefixes negative integers with "-" (free from toLocaleString)', () => {
      render(<VotePair initialCount={-3} targetType="season" targetId="survivor:20" />)
      expect(countText()).toBe('-3')
    })

    it('renders zero bare — no sign earns its place for an even net', () => {
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      expect(countText()).toBe('0')
    })

    it('signs the count after a click that flips the optimistic net positive', () => {
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      expect(countText()).toBe('0')
      fireEvent.click(screen.getByTestId('vote-up'))
      expect(countText()).toBe('+1')
    })

    it('signs the count after a click that flips the optimistic net negative', () => {
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      fireEvent.click(screen.getByTestId('vote-down'))
      expect(countText()).toBe('-1')
    })

    it('regression guard: an unsigned positive integer must never render', () => {
      // The pre-#264 bug rendered the bare integer for positives.
      // Pin against a regression that drops the prefix.
      render(<VotePair initialCount={7} targetType="season" targetId="survivor:20" />)
      expect(countText()).not.toMatch(/^\d/)
      expect(countText()).toMatch(/^[+\-0]/)
    })

    it('signs the server-reconciled count after the POST resolves (positive)', async () => {
      postBody = { ok: true, value: 1, count: 12 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      fireEvent.click(screen.getByTestId('vote-up'))
      await flushAsync()
      expect(countText()).toBe('+12')
    })

    it('signs the server-reconciled count after the POST resolves (negative)', async () => {
      postBody = { ok: true, value: -1, count: -5 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      fireEvent.click(screen.getByTestId('vote-down'))
      await flushAsync()
      expect(countText()).toBe('-5')
    })
  })
})
