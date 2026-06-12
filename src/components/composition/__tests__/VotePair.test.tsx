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
//
// Critique pass-34 MED: `count` is the distinct voter count on
// the target (not the signed net). The route handler shape ports
// `voterCount` into the `count` field for the client so the
// fixtures here stay shaped identically to the API response.
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

  it('renders the initial voter count and renders enabled buttons', () => {
    render(<VotePair initialCount={10} targetType="season" targetId="survivor:20" />)
    expect(screen.getByTestId('vote-count').textContent).toBe('10')
    expect(screen.getByTestId('vote-up')).toBeEnabled()
    expect(screen.getByTestId('vote-down')).toBeEnabled()
  })

  it('clicking up adds the viewer to the voter count, locks both buttons, and POSTs to /api/vote', () => {
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    // Voter count: 5 → 6 (the viewer was not a voter; now they are).
    expect(screen.getByTestId('vote-count').textContent).toBe('6')
    expect(screen.getByTestId('vote-up')).toBeDisabled()
    expect(screen.getByTestId('vote-down')).toBeDisabled()
    const postCalls = fetchMock.mock.calls.filter(
      (c) => (c[1] as { method?: string } | undefined)?.method === 'POST',
    )
    expect(postCalls.length).toBe(1)
  })

  it('clicking down from no-vote also adds the viewer to the voter count', () => {
    // Voter-count semantics: a downvote is still a vote — the
    // voter count tracks presence, not direction.
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-down'))
    expect(screen.getByTestId('vote-count').textContent).toBe('6')
  })

  it('reads the viewer existing vote + true voter count on mount and reflects it', async () => {
    getBody = { ok: true, value: 1, count: 42 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('42')
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
    // Optimistic voter count drops by one — the viewer is no
    // longer a voter on the target.
    expect(screen.getByTestId('vote-count').textContent).toBe('9')
  })

  it('reconciles the count to the server aggregate after the POST resolves', async () => {
    postBody = { ok: true, value: 1, count: 3 }
    render(<VotePair initialCount={5} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up'))
    expect(screen.getByTestId('vote-count').textContent).toBe('6') // optimistic
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('3')
  })

  it('a vote that races the mount fetch is not clobbered by the stale snapshot', async () => {
    getBody = { ok: true, value: 0, count: 0 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('vote-up')) // before GET resolves
    await flushAsync()
    // hydrate is a no-op post-click; optimistic +1 voter survives.
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
    expect(screen.getByTestId('vote-count').textContent).toBe('9')
  })

  it('rounds any stray fractional server count to a clean integer', async () => {
    getBody = { ok: true, value: 0, count: 2.6 }
    render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
    await flushAsync()
    expect(screen.getByTestId('vote-count').textContent).toBe('3')
  })

  // --- pluralize-aware label (critique pass-5 LOW / pass-34 MED /
  // pass-49 MED): the visible unit must agree with the displayed
  // count so a voter count of exactly 1 doesn't render
  // "1 votes so far". Pass-49 retargets the label from
  // "community vote(s)" → "vote(s) so far" — the bare-integer +
  // singular-noun pair `1 / COMMUNITY VOTE` was ambiguous between
  // the tally read and a counter widget value; the "so far"
  // suffix names the count as a tally with implicit time-context,
  // dropping the redundant `community` prefix (the surrounding
  // voteHelp + voteQuestion already carry the community framing).
  describe('pluralize-aware label', () => {
    function labelText() {
      return screen
        .getByTestId('vote-pair')
        .querySelector('.vote-label')?.textContent
    }

    it('renders the plural form when the count is 0', () => {
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      expect(labelText()).toBe('votes so far')
    })

    it('renders the singular form when the count is exactly 1', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      expect(screen.getByTestId('vote-count').textContent).toBe('1')
      expect(labelText()).toBe('vote so far')
    })

    it('renders the plural form when the count is 2', () => {
      render(<VotePair initialCount={2} targetType="season" targetId="survivor:20" />)
      expect(labelText()).toBe('votes so far')
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
      expect(labelText()).toBe('vote so far')
      // Re-click up to retract; optimistic voter count drops to 0,
      // so the unit pluralizes.
      fireEvent.click(screen.getByTestId('vote-up'))
      expect(labelText()).toBe('votes so far')
    })

    it('keeps the action-describing aria-labels on the plural form regardless of count', async () => {
      getBody = { ok: true, value: 1, count: 1 }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      // Displayed unit pluralizes, but aria describes the action.
      expect(labelText()).toBe('vote so far')
      expect(
        screen.getByTestId('vote-pair').getAttribute('aria-label'),
      ).toBe('Vote on votes so far')
      expect(
        screen.getByTestId('vote-down').getAttribute('aria-label'),
      ).toBe('Vote down votes so far')
    })
  })

  // --- critique pass-34 MED (#361) / pass-49 MED (#410):
  // cross-surface parity ---
  //
  // Three surfaces describe HvV's community state on adjacent
  // hops: ShiftCard (`1 vote`), canon-ladder COMMUNITY column
  // (`↑ 1 / #02`), and the season-page vote-pair (formerly
  // `0 community · net votes`, the signed sum). The pass-34
  // alignment re-pointed the vote-pair's integer + label from
  // the signed net → distinct voter count so it cites the same
  // canonical fact as the ShiftCard. Pass-49 re-words the label
  // from `community vote(s)` → `vote(s) so far` to drop the
  // bare-integer + singular-noun staccato; the integer is still
  // the distinct voter count, only the wording around it moves.
  // Pin: the rendered label text MUST end with `vote so far` or
  // `votes so far`, MUST NOT carry the pre-pass-34 `net vote(s)`
  // framing, and MUST NOT regress to the pass-34 bare
  // `community vote(s)` framing (the ambiguous form pass-49
  // closed). Tridirectional drift guard.
  describe('cross-surface parity (pass-34 #361 / pass-49 #410)', () => {
    function labelText() {
      return (
        screen
          .getByTestId('vote-pair')
          .querySelector('.vote-label')?.textContent ?? ''
      )
    }

    it('the label ends with /votes? so far$/ on every render state', async () => {
      const fixtures: VoteBody[] = [
        { ok: true, value: 0, count: 0, signedIn: false },
        { ok: true, value: 0, count: 5, signedIn: true },
        { ok: true, value: 1, count: 1, signedIn: true },
        { ok: true, value: -1, count: 9, signedIn: true },
        { ok: true, value: 0, count: 12, signedIn: false },
      ]
      for (const body of fixtures) {
        getBody = body
        const { unmount } = render(
          <VotePair initialCount={0} targetType="season" targetId="survivor:20" />,
        )
        await flushAsync()
        expect(labelText()).toMatch(/votes? so far$/)
        unmount()
      }
    })

    it('the label never carries the prior "net votes" framing on any render state', async () => {
      const fixtures: VoteBody[] = [
        { ok: true, value: 0, count: 0, signedIn: false },
        { ok: true, value: 0, count: 5, signedIn: true },
        { ok: true, value: 1, count: 1, signedIn: true },
        { ok: true, value: -1, count: 9, signedIn: true },
        { ok: true, value: 0, count: 12, signedIn: false },
      ]
      for (const body of fixtures) {
        getBody = body
        const { unmount } = render(
          <VotePair initialCount={0} targetType="season" targetId="survivor:20" />,
        )
        await flushAsync()
        expect(labelText()).not.toMatch(/net votes?/)
        unmount()
      }
    })

    it('the label never regresses to the bare "community vote(s)" framing (pass-49 #410)', async () => {
      // The pass-49 finding closed `1 / COMMUNITY VOTE` as the
      // ambiguous staccato. A future refactor that drops the
      // "so far" suffix and reverts to the bare `community
      // vote(s)` form must trip this gate at unit time.
      const fixtures: VoteBody[] = [
        { ok: true, value: 0, count: 0, signedIn: false },
        { ok: true, value: 0, count: 5, signedIn: true },
        { ok: true, value: 1, count: 1, signedIn: true },
        { ok: true, value: -1, count: 9, signedIn: true },
        { ok: true, value: 0, count: 12, signedIn: false },
      ]
      for (const body of fixtures) {
        getBody = body
        const { unmount } = render(
          <VotePair initialCount={0} targetType="season" targetId="survivor:20" />,
        )
        await flushAsync()
        expect(labelText()).not.toMatch(/^community votes?$/)
        unmount()
      }
    })

    it('renders the voter count as an unsigned non-negative integer', () => {
      // Voter count cannot be negative; the prior signed-net
      // rendering (e.g. `-3`) is gone. Pin against a regression
      // that re-points the integer back to the signed net.
      render(<VotePair initialCount={7} targetType="season" targetId="survivor:20" />)
      expect(screen.getByTestId('vote-count').textContent).toBe('7')
      expect(screen.getByTestId('vote-count').textContent).not.toMatch(/^[+\-]/)
    })

    it('floors the voter count at zero (never displays a negative integer)', async () => {
      // A retract from voter count = 0 (unreachable in practice
      // — the viewer can only retract if they previously voted —
      // but the floor is the safe guarantee) must not go negative.
      getBody = { ok: true, value: 1, count: 0, signedIn: true }
      render(<VotePair initialCount={0} targetType="season" targetId="survivor:20" />)
      await flushAsync()
      // Pre-click: voter count = 0 (server snapshot).
      expect(screen.getByTestId('vote-count').textContent).toBe('0')
      // Optimistic retract drops the count by 1 — floored at 0.
      fireEvent.click(screen.getByTestId('vote-up'))
      expect(screen.getByTestId('vote-count').textContent).toBe('0')
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

    it('the no-vote cap reads the same regardless of the voter count value', async () => {
      // The cap declares the viewer's STATE, not the count's
      // value — so a high or low voter count must not flip the
      // cap copy.
      for (const count of [0, 1, 9, 99]) {
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
      getBody = { ok: true, value: -1, count: 3, signedIn: true }
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
})
