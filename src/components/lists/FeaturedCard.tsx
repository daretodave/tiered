import Link from 'next/link'
import type { Show, Theme } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'
import {
  featuredPullText,
  formatListMetaLine,
  formatThemeStatus,
} from '@/lib/themes-format'

type FeaturedCardProps = {
  theme: Theme
  shows: Show[]
  big?: boolean
  today?: Date
}

export function FeaturedCard({
  theme,
  shows,
  big = false,
  today,
}: FeaturedCardProps) {
  // Critique pass-40 #355 closure: the tag previously surfaced
  // `{showLabel} · {entryCount} entries` where showLabel conflated
  // `Cross-canon` / `Single-show` (coverage scope) with the entry
  // count. Coverage scope is declared globally by `<ListsHero>` at
  // the top of the /themes page (cross-canon / single-canon / mixed
  // accent), and per-card the bullet-cluster immediately to the left
  // of this line already shows one dot per distinct show. The tag
  // now uses the canonical `{N} shows · {M} entries` shape shared
  // by the home list-row, the index list-row, and the list-detail
  // meta-strip — same accounting voice everywhere.
  const metaLine = formatListMetaLine(theme, shows)
  const status = formatThemeStatus(theme.status, theme.last_revised, today)
  // Unified across `big` and small variants per critique pass-35 #348:
  // the three featured-this-month sibling cards frame identically, so
  // the CTA stays in one form across all three. The `big` flag still
  // drives the visual emphasis (`.feat-card.big` styling) — only the
  // CTA literal is now invariant. The noun-bearing `the list` form
  // names the action target so the verb doesn't dangle.
  const cta = 'read the list →'

  return (
    <Link
      href={`/themes/${theme.slug}`}
      prefetch={false}
      className={`feat-card${big ? ' big' : ''}`}
      data-testid="lists-featured-card"
      data-slug={theme.slug}
      data-big={big ? 'true' : 'false'}
    >
      <div className="feat-tag">
        <span className="feat-bullets" data-testid="lists-featured-bullets">
          {shows.map((show) => (
            <Bullet
              key={show.slug}
              color={show.palette.primary}
              size={9}
            />
          ))}
        </span>
        <span data-testid="lists-featured-meta">{metaLine}</span>
      </div>
      <h3>{theme.title}</h3>
      {/* Critique pass-46 #397 closure: the featured rail previously
          rendered `theme.description` verbatim, the same ~35-word
          paragraph the index `<ListRow>` renders below. A reader
          scanning /themes top-to-bottom read three duplicate
          paragraphs in one viewport. The rail now renders a short
          pull — the curator-authored `featured_pull` when present,
          else the first sentence of `description` — so the long form
          stays canonical at the index card. */}
      <p className="feat-blurb">{featuredPullText(theme)}</p>
      <div className="feat-foot">
        <span data-testid="lists-featured-status">{status}</span>
        <b>{cta}</b>
      </div>
    </Link>
  )
}
