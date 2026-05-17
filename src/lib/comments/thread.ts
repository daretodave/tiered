// Pure helpers for the season-page comment thread read path.
// No Supabase, no React — just the shaping + ordering rules so
// they can be unit-tested in isolation and reused by the API
// route and the client thread component.

// Comment vote scoring lands in a later phase; until then every
// comment carries an effective score of 0. The threshold + sort
// are implemented honestly now so the read path doesn't need a
// rewrite when scores arrive.
export const AUTO_COLLAPSE_THRESHOLD = -2

export type CommentStatus = 'published' | 'pending' | 'hidden' | 'removed'

// The shape the client thread renders. `held` marks a comment that
// is visible to its own author only (pending mod review) — the
// public read path never includes held rows.
export type ThreadComment = {
  id: string
  body: string
  author: string
  createdAt: string
  score: number
  held: boolean
  collapsed: boolean
}

// A raw row as selected from public.comments (+ resolved author
// handle). Status is carried so the shaper can enforce the
// public/own-pending split in one place.
export type RawComment = {
  id: string
  body: string
  author: string | null
  created_at: string
  status: CommentStatus
  score?: number | null
}

export function isCollapsed(score: number): boolean {
  return score <= AUTO_COLLAPSE_THRESHOLD
}

// Public viewers only ever see `published`. The author of a
// `pending` row sees it as held-for-review. `hidden` / `removed`
// (AI block, flag auto-hide, mod action) are never surfaced on the
// public page to anyone — mod queue only. Spoiler/abuse P0.
export function isVisibleToPublic(status: CommentStatus): boolean {
  return status === 'published'
}

export function isOwnHeldVisible(status: CommentStatus): boolean {
  return status === 'pending'
}

function authorLabel(author: string | null): string {
  const a = (author ?? '').trim()
  return a.length > 0 ? a : 'reader'
}

// Order: highest weighted score first, newest breaks ties
// (bearings §Standing decisions — sort default for comments).
// Own held rows are pinned above the published list so the author
// immediately sees what they just posted; within each group the
// score/recency order holds.
export function sortThread(comments: ThreadComment[]): ThreadComment[] {
  return [...comments].sort((a, b) => {
    if (a.held !== b.held) return a.held ? -1 : 1
    if (b.score !== a.score) return b.score - a.score
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export function shapeComment(raw: RawComment, held: boolean): ThreadComment {
  const score = Number(raw.score ?? 0) || 0
  return {
    id: raw.id,
    body: raw.body,
    author: authorLabel(raw.author),
    createdAt: raw.created_at,
    score,
    held,
    collapsed: !held && isCollapsed(score),
  }
}

// Build the rendered thread from the public published rows plus
// (optionally) the viewer's own non-published rows. Enforces the
// visibility split centrally: published → everyone; pending →
// author only (held); hidden/removed → nobody.
export function buildThread(input: {
  published: RawComment[]
  ownPending?: RawComment[]
}): { comments: ThreadComment[]; publishedCount: number } {
  const published = input.published
    .filter((r) => isVisibleToPublic(r.status))
    .map((r) => shapeComment(r, false))
  const held = (input.ownPending ?? [])
    .filter((r) => isOwnHeldVisible(r.status))
    .map((r) => shapeComment(r, true))
  return {
    comments: sortThread([...held, ...published]),
    publishedCount: published.length,
  }
}

// Relative-time label for the comment meta line. `now` is injected
// so the formatter stays pure + deterministic under test.
export function formatWhen(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return 'just now'
  const sec = Math.max(0, Math.round((now - then) / 1000))
  if (sec < 45) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day}d ago`
  const wk = Math.round(day / 7)
  if (wk < 5) return `${wk}w ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.round(day / 365)}y ago`
}
