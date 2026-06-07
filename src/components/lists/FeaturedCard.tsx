import Link from 'next/link'
import type { Show, Theme } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'
import { formatThemeStatus } from '@/lib/themes-format'

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
  const entryCount = theme.entries.length
  const isSingleShow = shows.length === 1
  const showLabel = isSingleShow
    ? shows[0]?.name ?? 'Single-show'
    : 'Cross-canon'
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
        <span>
          {showLabel} · {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <h3>{theme.title}</h3>
      <p className="feat-blurb">{theme.description}</p>
      <div className="feat-foot">
        <span data-testid="lists-featured-status">{status}</span>
        <b>{cta}</b>
      </div>
    </Link>
  )
}
