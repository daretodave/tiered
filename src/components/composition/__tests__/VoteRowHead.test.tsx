import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { VoteRowHead } from '../VoteRowHead'

// Flush the fetch().then(json).then(setState) microtask chain.
async function flushAsync() {
  await act(async () => {
    for (let i = 0; i < 6; i++) await Promise.resolve()
  })
}

type VoteGetBody = {
  ok: boolean
  value: number
  count: number
  signedIn: boolean
}

function jsonResponse(body: VoteGetBody) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as unknown as Response)
}

describe('<VoteRowHead>', () => {
  let getBody: VoteGetBody
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    getBody = { ok: true, value: 0, count: 0, signedIn: false }
    fetchMock = vi.fn(() => jsonResponse(getBody))
    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the anon copy before the fetch resolves (SSR-safe default)', () => {
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('anon')
    expect(head).toHaveTextContent('Cast a vote')
    expect(head).toHaveTextContent('counts more once you sign in')
  })

  it('keeps the anon copy after the fetch resolves with signedIn=false', async () => {
    getBody = { ok: true, value: 0, count: 0, signedIn: false }
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('anon')
    expect(head).toHaveTextContent('Cast a vote')
    expect(head).toHaveTextContent('counts more once you sign in')
  })

  it('swaps to the signed-in-no-vote copy when signedIn=true and value=0', async () => {
    getBody = { ok: true, value: 0, count: 7, signedIn: true }
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('signed-in-no-vote')
    expect(head).toHaveTextContent('Your vote')
    expect(head).toHaveTextContent('cast vote')
    // The vote is a one-time per-reader act; only the recompute is
    // weekly. The meta must not carry a "this week" qualifier that
    // would read as a time-windowed ballot (critique pass-15).
    expect(head).not.toHaveTextContent('this week')
    // Critique pass-22: the prior "cast yours" possessive-elision
    // fragment was the only clever-fragment CTA on the entire
    // authed walk and broke plan/bearings's "plain sentences over
    // clever ones" cue. Negative-pin the regression so a future
    // edit cannot silently reintroduce the elision form without
    // tripping the unit gate.
    expect(head.textContent ?? '').not.toMatch(/cast yours/i)
  })

  it('swaps to the signed-in-with-vote copy when signedIn=true and value=1', async () => {
    getBody = { ok: true, value: 1, count: 7, signedIn: true }
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('signed-in-with-vote')
    expect(head).toHaveTextContent('Your vote')
    expect(head).toHaveTextContent('change within 72h')
  })

  it('swaps to the signed-in-with-vote copy when signedIn=true and value=-1', async () => {
    getBody = { ok: true, value: -1, count: -3, signedIn: true }
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('signed-in-with-vote')
    expect(head).toHaveTextContent('Your vote')
    expect(head).toHaveTextContent('change within 72h')
  })

  it('falls back to the anon copy when the fetch fails', async () => {
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error('network down')))
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('anon')
    expect(head).toHaveTextContent('Cast a vote')
  })

  it('keeps the anon default when the response is not ok=true', async () => {
    getBody = { ok: false, value: 0, count: 0, signedIn: true }
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('anon')
  })

  it('seeds signed-in-no-vote (not anon) when initialSignedIn is true, before the fetch resolves', () => {
    getBody = { ok: true, value: 0, count: 0, signedIn: true }
    render(
      <VoteRowHead targetType="season" targetId="survivor:20" initialSignedIn />,
    )
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('signed-in-no-vote')
    expect(head).toHaveTextContent('Your vote')
    expect(head).toHaveTextContent('cast vote')
  })

  it('reconciles the initialSignedIn seed to signed-in-with-vote once the fetch resolves a cast vote', async () => {
    getBody = { ok: true, value: 1, count: 7, signedIn: true }
    render(
      <VoteRowHead targetType="season" targetId="survivor:20" initialSignedIn />,
    )
    await flushAsync()
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('signed-in-with-vote')
    expect(head).toHaveTextContent('change within 72h')
  })

  it('still renders the anon default when initialSignedIn is omitted (unauthed / cached routes unaffected)', () => {
    render(<VoteRowHead targetType="season" targetId="survivor:20" />)
    const head = screen.getByTestId('vote-row-head')
    expect(head.getAttribute('data-vote-head-state')).toBe('anon')
  })

  it('passes the correct query params to /api/vote', () => {
    render(<VoteRowHead targetType="comment" targetId="survivor:20:abc" />)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = String(fetchMock.mock.calls[0]?.[0] ?? '')
    expect(url).toContain('/api/vote?')
    expect(url).toContain('targetType=comment')
    expect(url).toContain('targetId=survivor%3A20%3Aabc')
  })
})
