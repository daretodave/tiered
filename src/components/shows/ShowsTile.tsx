import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Show } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'
import { ShowsStatusPill } from './ShowsStatusPill'

export type ShowsTileVariant = 'tall' | 'regular' | 'small'

type ShowsTileProps = {
  show: Show
  variant: ShowsTileVariant
  status?: { shipped: number; target: number }
}

function variantClass(variant: ShowsTileVariant): string {
  if (variant === 'tall') return 'show-tile tall'
  if (variant === 'small') return 'show-tile small'
  return 'show-tile'
}

function tagText(show: Show): string {
  return `${show.genre_tag} · ${show.network}`
}

function metaText(show: Show, status?: ShowsTileProps['status']): string {
  if (status) {
    return `${show.seasons} season${show.seasons === 1 ? '' : 's'} · canon in review`
  }
  return `${show.seasons} season${show.seasons === 1 ? '' : 's'} · canon + community · est. ${show.est_year}`
}

export function ShowsTile({ show, variant, status }: ShowsTileProps) {
  const tileStyle = {
    '--tile-paper': show.palette.paper,
    '--tile-ink': show.palette.ink,
    '--tile-primary': show.palette.primary,
  } as CSSProperties
  const bulletSize = variant === 'small' ? 10 : 12

  return (
    <Link
      href={`/shows/${show.slug}`}
      prefetch={false}
      className={variantClass(variant)}
      data-testid="shows-tile"
      data-variant={variant}
      data-show={show.slug}
      style={tileStyle}
    >
      <div>
        {status ? (
          <ShowsStatusPill shipped={status.shipped} target={status.target} />
        ) : null}
        <div
          className="show-tile-head"
          style={status ? { marginTop: 14 } : undefined}
        >
          <Bullet color={show.palette.primary} size={bulletSize} />
          <span className="show-tile-tag">{tagText(show)}</span>
        </div>
        <h3 className="show-tile-name">{show.name}</h3>
      </div>
      <p className="show-tile-tagline">{show.card_tagline ?? show.tagline}</p>
      <div className="show-tile-foot">
        <span className="show-tile-meta">{metaText(show, status)}</span>
        <span className="show-tile-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
