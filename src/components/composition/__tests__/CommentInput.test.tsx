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
