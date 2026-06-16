import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CommentInput } from '../CommentInput'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  })
}

function mockFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => Response) {
  const fn = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => impl(input, init))
  Object.defineProperty(globalThis, 'fetch', { value: fn, configurable: true })
  return fn
}

describe('<CommentInput>', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the collapsed stub by default', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    expect(screen.getByTestId('comment-input')).toBeInTheDocument()
    expect(screen.getByTestId('comment-stub')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-input-textarea')).toBeNull()
  })

  describe('stub literal voice register (critique pass-44)', () => {
    // Closes CRITIQUE pass-44 MED: the authed composer stub's
    // `Add a thought · no spoilers, please.` literal added a
    // please-flavored softener to the spoiler clause that the
    // anon-branch sibling (`CommentInputStub` — `No plot, no
    // winners, no twists`) does not carry. The two stubs render
    // in the same surface slot on the same page; only the
    // auth-state branch picks which copy lands, so the register
    // must agree. Bearings voice cue (`plan/bearings.md:370`):
    // knowledgeable peer, plain sentences over clever ones. The
    // brand promise itself reads `the seasons, ranked. no
    // spoilers.` — no softener. Bidirectional pin: a positive
    // assertion that the stub opens with the canonical prefix AND
    // a negative assertion that no `please` survives anywhere in
    // the stub subtree.
    it('renders the "Add a thought · no spoilers." prefix on the collapsed stub', () => {
      render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
      const stubText = screen.getByTestId('comment-stub').querySelector('.comment-stub-text')
      expect(stubText).not.toBeNull()
      expect(stubText).toHaveTextContent(/^Add a thought · no spoilers\./)
    })

    it('does not include any "please" softener in the collapsed stub subtree', () => {
      render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
      const stub = screen.getByTestId('comment-stub')
      expect(stub.textContent ?? '').not.toMatch(/\bplease\b/i)
    })
  })

  describe('stub review-delay disclosure (critique pass-49, issue #423)', () => {
    // The composer stub never told the author that posts are held
    // for review before going public. The read-side "held for
    // review" affordance (phase-36) only renders after submission;
    // the composer should disclose this BEFORE the author commits.
    // Bidirectional pin: positive assertion on the new disclosure
    // phrase AND negative assertion that the stub does not end at
    // the bare "no spoilers." without any follow-on.
    it('includes the review-delay disclosure in the collapsed stub', () => {
      render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
      const stubText = screen.getByTestId('comment-stub').querySelector('.comment-stub-text')
      expect(stubText).not.toBeNull()
      expect(stubText).toHaveTextContent(/held briefly for review/)
    })

    it('stub text does not end at bare "no spoilers." without review disclosure', () => {
      render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
      const stubText = screen.getByTestId('comment-stub').querySelector('.comment-stub-text')
      expect(stubText?.textContent ?? '').not.toMatch(/^Add a thought · no spoilers\.$/)
    })
  })

  it('omits the "as @handle" attribution when no handle prop is supplied', () => {
    // Without a handle, neither stub nor open-state foot may render
    // any "as @..." caption — the affordance is gated entirely on
    // the prop so the legacy un-attributed shape stays intact.
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    expect(screen.queryByTestId('comment-stub-as')).toBeNull()
    expect(screen.queryByText(/as @/)).toBeNull()
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect(screen.queryByTestId('comment-foot-as')).toBeNull()
    expect(screen.queryByText(/as @/)).toBeNull()
  })

  it('renders "as @handle" in the stub and the open-state foot when handle is set', () => {
    // Closes CRITIQUE pass-18 MED: the un-acted authed surface must
    // name the publishing identity. The stub caption sits next to
    // the ⏎ glyph; the foot caption sits to the left of the
    // Cancel/Post pair so the user sees the attribution at the
    // moment they commit. Exact "as @e2e" matches the chrome
    // header's "@e2e" lockup.
    render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
    expect(screen.getByTestId('comment-stub-as')).toHaveTextContent('as @e2e')
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect(screen.getByTestId('comment-foot-as')).toHaveTextContent('as @e2e')
  })

  it('treats an empty-string handle as absent (defensive — empty handle is meaningless)', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" handle="" />)
    expect(screen.queryByTestId('comment-stub-as')).toBeNull()
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect(screen.queryByTestId('comment-foot-as')).toBeNull()
  })

  it('renders plain-English labels on both desktop and mobile stubs', () => {
    // Desktop previously showed `⏎` (critique pass-42 MED fix); critique
    // pass-53 MED found `⏎` reads as a keyboard-submit glyph rather than
    // a click-to-open affordance. Replaced with `Write` to parallel mobile's
    // `Tap to write`. Both nodes ship in the DOM unconditionally; CSS
    // (screens.css `.comment-stub-mono-mobile` + `@media (max-width: 560px)`)
    // decides which one paints at the active viewport. DOM-presence pins
    // the wiring; viewport-conditional paint is css-only and validated by
    // the e2e mobile reflow walker.
    render(<CommentInput targetType="season" targetId="survivor:20" handle="e2e" />)
    const mobileLabel = screen.getByTestId('comment-stub-mobile-label')
    expect(mobileLabel).toBeInTheDocument()
    expect(mobileLabel).toHaveTextContent(/tap to write/i)
    const desktopLabel = screen.getByTestId('comment-stub-desktop-label')
    expect(desktopLabel).toBeInTheDocument()
    expect(desktopLabel).toHaveTextContent('Write')
  })

  it('expands to the open state when the stub is clicked', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect(screen.getByTestId('comment-input-textarea')).toBeInTheDocument()
    expect(screen.getByTestId('comment-reminder')).toBeInTheDocument()
    expect(screen.getByTestId('comment-input')).toHaveClass('open')
  })

  it('disables Post when the textarea is empty', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect(screen.getByTestId('comment-post')).toBeDisabled()
  })

  it('enables Post for clean text', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'The location work in this season was incredible.' },
    })
    expect(screen.getByTestId('comment-post')).toBeEnabled()
  })

  it('shows the spoiler flag + warn class + disables Post when a phrase matches', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'she wins it, easy' },
    })
    expect(screen.getByTestId('comment-spoiler-flag')).toBeInTheDocument()
    expect(screen.getByTestId('comment-input')).toHaveClass('warn')
    expect(screen.getByTestId('comment-post')).toBeDisabled()
  })

  it('Cancel closes the input and clears state', () => {
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'Hello' },
    })
    fireEvent.click(screen.getByTestId('comment-cancel'))
    expect(screen.queryByTestId('comment-input-textarea')).toBeNull()
    fireEvent.click(screen.getByTestId('comment-stub'))
    expect((screen.getByTestId('comment-input-textarea') as HTMLTextAreaElement).value).toBe('')
  })

  it('posts to /api/comment and shows the accepted toast', async () => {
    const fetchMock = mockFetch(() =>
      jsonResponse({ ok: true, id: 'c1', status: 'accepted', count: 1, verdict: 'allow' }),
    )
    const onPosted = vi.fn()
    render(
      <CommentInput targetType="season" targetId="survivor:20" onPosted={onPosted} />,
    )
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'Great cast dynamics.' },
    })
    fireEvent.click(screen.getByTestId('comment-post'))
    await waitFor(() => {
      expect(screen.getByTestId('comment-posted')).toHaveTextContent('Posted.')
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/comment',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(onPosted).toHaveBeenCalledWith('accepted')
  })

  it('shows the "pending mod review" toast when status=pending', async () => {
    mockFetch(() =>
      jsonResponse({ ok: true, id: 'c2', status: 'pending', count: 1, verdict: 'allow' }),
    )
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'Solid season.' },
    })
    fireEvent.click(screen.getByTestId('comment-post'))
    await waitFor(() => {
      expect(screen.getByTestId('comment-posted')).toHaveTextContent('pending mod review')
    })
  })

  it('surfaces a rate-limit error without closing the input', async () => {
    mockFetch(() =>
      jsonResponse(
        { ok: false, error: 'rate_limited', detail: 'comment rate limit exceeded' },
        { status: 429 },
      ),
    )
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'Another take.' },
    })
    fireEvent.click(screen.getByTestId('comment-post'))
    await waitFor(() => {
      expect(screen.getByTestId('comment-error')).toBeInTheDocument()
    })
    expect(screen.getByTestId('comment-input-textarea')).toBeInTheDocument()
    expect(screen.getByTestId('comment-input')).toHaveClass('warn')
  })

  it('handles a network failure', async () => {
    Object.defineProperty(globalThis, 'fetch', {
      value: vi.fn(() => Promise.reject(new Error('boom'))),
      configurable: true,
    })
    render(<CommentInput targetType="season" targetId="survivor:20" />)
    fireEvent.click(screen.getByTestId('comment-stub'))
    fireEvent.change(screen.getByTestId('comment-input-textarea'), {
      target: { value: 'Take.' },
    })
    fireEvent.click(screen.getByTestId('comment-post'))
    await waitFor(() => {
      expect(screen.getByTestId('comment-error')).toHaveTextContent('Network hiccup')
    })
  })
})
