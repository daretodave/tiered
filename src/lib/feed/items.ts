import { getAllSeasons, getAllShows, getAllThemes, getCanon, getShow } from '@/content'
import type { CanonFile } from '@/content'
import { canonicalUrl } from '@/lib/seo'
import type { FeedItem } from './rss'
import { parseIsoDate, seasonDate } from './dates'

// RSS convention — keep feeds bounded. Per-show feeds are well
// under this baseline cap.
export const BASE_FEED_LIMIT = 100

// The global feed's cap scales with catalog size: one canon-revision
// item per show plus one item per theme should never consume the
// whole window on its own, or season items (the actual new-content
// signal) get crowded out entirely once the catalog grows past the
// static baseline — which it already has (68 canons + 33 themes > 100).
// Rule 3's target is "hundreds" of themed lists over time
// (plan/bearings.md), so this must scale rather than need repeated
// manual re-bumping. 2x headroom keeps canon+theme items to at most
// half the window, guaranteeing room for recent season items.
export function feedLimit(canonThemeCount: number): number {
  return Math.max(BASE_FEED_LIMIT, canonThemeCount * 2)
}

// First sentence of a content blurb, whitespace-collapsed, bounded.
// The source is already P0 spoiler-clean (season blurb / theme
// description / canon editor line) so no extra scrubbing is needed.
function summarize(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  const m = clean.match(/^.*?[.!?](?=\s|$)/)
  return (m ? m[0] : clean).slice(0, 300)
}

function seasonItems(
  showSlug: string,
  showName: string,
  estYear: number,
): FeedItem[] {
  return getAllSeasons(showSlug).map((s) => ({
    title: `${showName} — ${s.title}`,
    url: canonicalUrl(`/shows/${showSlug}/season/${s.slug}`),
    date: seasonDate(s, estYear),
    description: summarize(s.lede ?? s.blurb_md),
  }))
}

function canonItem(
  showSlug: string,
  showName: string,
  canon: CanonFile | null,
): FeedItem | null {
  if (!canon?.last_revised) return null
  const d = parseIsoDate(canon.last_revised)
  if (!d) return null
  return {
    title: `${showName} — Editor's Canon revised`,
    // #canon fragment keeps this guid distinct from the show's
    // other items while still dereferencing to the live ranking.
    url: `${canonicalUrl(`/shows/${showSlug}`)}#canon`,
    date: d,
    description: `The ${showName} Editor's Canon was revised${
      canon.editor ? ` by ${canon.editor}` : ''
    }.`,
  }
}

function themeItem(theme: {
  slug: string
  title: string
  description: string
  last_revised: string
}): FeedItem {
  return {
    title: theme.title,
    url: canonicalUrl(`/themes/${theme.slug}`),
    date: parseIsoDate(theme.last_revised) ?? new Date(0),
    description: summarize(theme.description),
  }
}

// Newest first; guid asc tiebreak for total determinism.
function sortCap(items: FeedItem[], limit: number): FeedItem[] {
  return [...items]
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime() || a.url.localeCompare(b.url),
    )
    .slice(0, limit)
}

export function buildGlobalFeedItems(): FeedItem[] {
  const themes = getAllThemes()
  const out: FeedItem[] = []
  let canonThemeCount = themes.length
  for (const show of getAllShows()) {
    out.push(...seasonItems(show.slug, show.name, show.est_year))
    const c = canonItem(show.slug, show.name, getCanon(show.slug))
    if (c) {
      out.push(c)
      canonThemeCount++
    }
  }
  for (const t of themes) out.push(themeItem(t))
  return sortCap(out, feedLimit(canonThemeCount))
}

// null == unknown show (the route turns this into a 404).
export function buildShowFeedItems(showSlug: string): FeedItem[] | null {
  const show = getShow(showSlug)
  if (!show) return null
  const out: FeedItem[] = [...seasonItems(show.slug, show.name, show.est_year)]
  const c = canonItem(show.slug, show.name, getCanon(show.slug))
  if (c) out.push(c)
  return sortCap(out, BASE_FEED_LIMIT)
}
