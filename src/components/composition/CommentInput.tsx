'use client'

import { useEffect, useRef, useState } from 'react'
import { detectSpoiler } from '@/lib/spoiler/local'

type CommentTarget = 'season' | 'show' | 'comment'

type CommentInputProps = {
  targetType: CommentTarget
  targetId: string
  onPosted?: (status: 'accepted' | 'pending') => void
}

type PostError = {
  kind: 'spoiler' | 'rate_limited' | 'auth_required' | 'invalid' | 'rpc' | 'network'
  message: string
}

type PostState = 'idle' | 'submitting' | 'success'

/**
 * <CommentInput> — design port of `design/compositions/interactions.jsx`
 * lines 76–143. Renders the "Add a thought" stub by default; clicking
 * expands into a textarea with the spoiler-promise reminder, a local
 * spoiler pre-filter (UX hint only — the server is the truth gate),
 * and a Post / Cancel foot.
 *
 * Authed-only — the parent (a server component) decides whether to
 * render this or the signed-out <CommentInputStub>.
 */
export function CommentInput({ targetType, targetId, onPosted }: CommentInputProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)
  const [state, setState] = useState<PostState>('idle')
  const [error, setError] = useState<PostError | null>(null)
  const [posted, setPosted] = useState<'accepted' | 'pending' | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  const spoiler = touched ? detectSpoiler(value) : null
  const canPost = value.trim().length > 0 && !spoiler && state !== 'submitting'

  useEffect(() => {
    if (open && taRef.current) taRef.current.focus()
  }, [open])

  function close() {
    setOpen(false)
    setValue('')
    setTouched(false)
    setError(null)
    setState('idle')
  }

  async function submit() {
    if (!canPost) return
    setState('submitting')
    setError(null)
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, body: value.trim() }),
      })
      const json = (await res.json().catch(() => null)) as
        | {
            ok: boolean
            status?: 'accepted' | 'pending'
            error?: string
            detail?: string
          }
        | null
      if (!res.ok || !json?.ok) {
        const code = json?.error ?? 'rpc'
        const kind: PostError['kind'] =
          code === 'auth_required'
            ? 'auth_required'
            : code === 'rate_limited'
              ? 'rate_limited'
              : code === 'invalid_body' || code === 'invalid_input'
                ? 'invalid'
                : 'rpc'
        setError({
          kind,
          message:
            json?.detail ??
            (kind === 'rate_limited'
              ? 'Easy — please wait before posting again.'
              : kind === 'auth_required'
                ? 'Sign in to comment.'
                : 'Something went wrong. Try again in a moment.'),
        })
        setState('idle')
        return
      }
      const status = json.status === 'pending' ? 'pending' : 'accepted'
      setPosted(status)
      setState('success')
      onPosted?.(status)
      // Close on success — the visible thread is server-rendered;
      // a follow-up nav picks up the new comment.
      window.setTimeout(() => {
        close()
        setPosted(null)
      }, 1500)
    } catch (_err) {
      setError({
        kind: 'network',
        message: 'Network hiccup. Try again in a moment.',
      })
      setState('idle')
    }
  }

  const containerClass = [
    'comment',
    open ? 'open' : '',
    spoiler || error ? 'warn' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClass} data-testid="comment-input">
      {!open && (
        <button
          type="button"
          className="comment-stub"
          onClick={() => setOpen(true)}
          data-testid="comment-stub"
        >
          <span className="comment-stub-text">Add a thought · no spoilers, please.</span>
          <span className="comment-stub-mono">{'⏎'}</span>
        </button>
      )}
      {open && (
        <div className="comment-open">
          <div className="comment-reminder" data-testid="comment-reminder">
            <span className="comment-shield" aria-hidden="true">
              {'●'}
            </span>
            <span>
              No spoilers — past or future. Talk about the season, not the result.
            </span>
          </div>
          <textarea
            ref={taRef}
            className="comment-ta"
            placeholder="Say what you actually think."
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (!touched) setTouched(true)
              if (error) setError(null)
            }}
            rows={3}
            data-testid="comment-input-textarea"
            disabled={state === 'submitting'}
          />
          {spoiler && (
            <div className="comment-flag" role="alert" data-testid="comment-spoiler-flag">
              <span className="comment-flag-dot" aria-hidden="true">
                {'✱'}
              </span>
              <span>
                {'“'}
                <b>{spoiler.phrase}</b>
                {'”'} reads like a spoiler. Reword before posting.
              </span>
            </div>
          )}
          {!spoiler && error && (
            <div className="comment-flag" role="alert" data-testid="comment-error">
              <span className="comment-flag-dot" aria-hidden="true">
                {'✱'}
              </span>
              <span>{error.message}</span>
            </div>
          )}
          {posted && (
            <div className="comment-toast" role="status" data-testid="comment-posted">
              {posted === 'pending'
                ? 'Posted — pending mod review.'
                : 'Posted.'}
            </div>
          )}
          <div className="comment-foot">
            <button
              type="button"
              className="comment-cancel"
              onClick={close}
              data-testid="comment-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              className="comment-post"
              onClick={submit}
              disabled={!canPost}
              data-testid="comment-post"
            >
              {state === 'submitting' ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
