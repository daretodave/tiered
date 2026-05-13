import Link from 'next/link'
import type { Theme } from '@/content'

type ListTileProps = {
  theme: Theme
}

// Mirrors the .list-tile composition. Sentiment dot is hard-pinned
// to "hold" tone in v1 — the themed-list system doesn't model
// editorial sentiment yet; that's a follow-up.

export function ListTile({ theme }: ListTileProps) {
  const entryCount = theme.entries.length
  return (
    <Link
      href={`/themes/${theme.slug}`}
      prefetch={false}
      className="list-tile"
      data-testid="home-list-tile"
      data-theme={theme.slug}
    >
      <div
        className="list-tile-dot"
        style={{ background: 'var(--s-hold, var(--ink-3))' }}
      />
      <div>
        <div className="list-tile-title">{theme.title}</div>
        <div className="list-tile-meta">
          editorial · {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </div>
      </div>
      <div className="list-tile-arrow" aria-hidden="true">
        →
      </div>
    </Link>
  )
}
