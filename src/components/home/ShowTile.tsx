import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Show } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'

export type ShowTileVariant = 'featured' | 'compact'

type ShowTileProps = {
  show: Show
  variant?: ShowTileVariant
}

// Season count is the authoritative editorial `show.seasons` field — never
// the seeded-file count, which lags during content drains and would
// contradict the blurb/tagline that quote the true aired-season number.
function metaCopy(show: Show, variant: ShowTileVariant) {
  const noun = `${show.seasons} season${show.seasons === 1 ? '' : 's'}`
  return variant === 'compact' ? noun : `${noun} · canon + community`
}

export function ShowTile({ show, variant = 'featured' }: ShowTileProps) {
  const tileStyle = {
    '--tile-paper': show.palette.paper,
    '--tile-ink': show.palette.ink,
    '--tile-primary': show.palette.primary,
  } as CSSProperties
  const bulletSize = variant === 'compact' ? 10 : 12
  const className = variant === 'compact' ? 'show-tile compact' : 'show-tile'

  return (
    <Link
      href={`/shows/${show.slug}`}
      prefetch={false}
      className={className}
      data-testid="home-show-tile"
      data-variant={variant}
      data-show={show.slug}
      style={tileStyle}
    >
      <div>
        <div className="show-tile-head">
          <Bullet color={show.palette.primary} size={bulletSize} />
          <span className="show-tile-tag">{show.genre_tag}</span>
        </div>
        <h3 className="show-tile-name">{show.name}</h3>
      </div>
      {variant === 'featured' ? (
        <p className="show-tile-blurb">{show.blurb}</p>
      ) : null}
      <div className="show-tile-foot">
        <span className="show-tile-meta" data-testid="home-show-tile-meta">
          {metaCopy(show, variant)}
        </span>
        <span className="show-tile-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
