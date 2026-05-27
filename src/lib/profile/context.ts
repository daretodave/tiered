// Pure helpers for the public profile activity surface (phase 38).
// No Supabase, no React, no content loaders — just the shaping
// rules so they unit-test in isolation. The page resolves season
// slugs (for clean canonical hrefs) and renders; this module only
// decides what a raw comment row means and how it reads.

import type { CanonFile, Season } from '@/content/schemas'

export type RawProfileComment = {
  id: string
  body: string
  created_at: string
  target_type: 'season' | 'comment'
  target_id: string
}

// A season comment's target_id is `<show-slug>:<season-number>`
// (see the season page `seasonTargetId`). A reply's target is
// another comment's uuid — not a season, so it carries no
// show/season context here.
export type SeasonTarget = { showSlug: string; seasonNumber: number }

export function parseSeasonTarget(
  targetType: string,
  targetId: string,
): SeasonTarget | null {
  if (targetType !== 'season') return null
  const idx = targetId.lastIndexOf(':')
  if (idx <= 0 || idx === targetId.length - 1) return null
  const showSlug = targetId.slice(0, idx).trim()
  const n = Number.parseInt(targetId.slice(idx + 1), 10)
  if (!showSlug || !Number.isFinite(n) || n <= 0) return null
  return { showSlug, seasonNumber: n }
}

// Cosmetic excerpt — the body is already spoiler-gated at write
// time (phase 12 pre-filter + mod queue), so truncation is purely
// length control. Cut on a word boundary; append an ellipsis only
// when we actually trimmed something.
export function excerpt(body: string, max = 240): string {
  const clean = body.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const slice = clean.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice
  return `${cut.trimEnd()}…`
}

// "Member since May 2026" — month + year only. No day; a profile
// is not a precise timeline and coarse is friendlier. UTC-pinned
// so it renders identically on the server and under test.
export function formatMemberSince(iso: string): string {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return 'a while ago'
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(t))
}

export type ShapedProfileComment = {
  id: string
  excerpt: string
  createdAt: string
  season: SeasonTarget | null
}

export function shapeProfileComment(
  raw: RawProfileComment,
): ShapedProfileComment {
  return {
    id: raw.id,
    excerpt: excerpt(raw.body),
    createdAt: raw.created_at,
    season: parseSeasonTarget(raw.target_type, raw.target_id),
  }
}

// `users.display_name` is sourced from the Auth0 profile's `name`
// claim, and for an email magic-link / passwordless sign-in Auth0
// sets `name` to the member's email address. Rendering that on the
// public `/u/[handle]` page (the `<p>` byline and the JSON-LD
// `name`) exposes a real address to anonymous visitors. A genuine
// human display name never contains `@`, so any value carrying one
// is treated as email-shaped PII and dropped — the page falls back
// to `@handle`, which is already public by design.
export function publicDisplayName(value: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.includes('@')) return null
  return trimmed
}

// A profile is "populated" — and therefore worth indexing — when
// the member has at least one published comment OR a live vote on
// a real season. An empty profile stays noIndex so we never put a
// thin-content page in the index (phase 38 acceptance).
export function isPopulatedProfile(input: {
  publishedCommentCount: number
  votedSeasonCount: number
}): boolean {
  return input.publishedCommentCount > 0 || input.votedSeasonCount > 0
}

// The self-view empty-state CTA promises "vote on a season pair,"
// so it must land on a page that exposes VotePair above the fold —
// a season page, not the canon ladder. Pick the show's #1 canon
// entry's season; resolveSeason returns null if that season isn't
// in the catalog, in which case the page should fall back to the
// show home.
export function pickFeaturedSeason(
  canon: CanonFile | null,
  resolveSeason: (seasonNumber: number) => Season | null,
): Season | null {
  if (!canon) return null
  const top = canon.entries.reduce<typeof canon.entries[number] | null>(
    (best, e) => (best == null || e.rank < best.rank ? e : best),
    null,
  )
  if (!top) return null
  return resolveSeason(top.season)
}
