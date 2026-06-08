import Link from 'next/link'
import type { Theme } from '@/content'
import { formatListMetaLine } from '@/lib/themes-format'

type HomeListRowProps = {
  theme: Theme
}

export function HomeListRow({ theme }: HomeListRowProps) {
  const sentiment = theme.sentiment

  return (
    <Link
      href={`/themes/${theme.slug}`}
      prefetch={false}
      className="list-row"
      data-testid="home-list-row"
      data-theme={theme.slug}
      data-sentiment={sentiment}
    >
      <span
        className="list-row-dot"
        data-testid="home-list-row-dot"
        style={{ background: `var(--s-${sentiment})` }}
        aria-hidden="true"
      />
      <div className="list-row-body">
        <div className="list-row-title">{theme.title}</div>
        <div className="list-row-blurb">{theme.description}</div>
      </div>
      <span className="list-row-meta" data-testid="home-list-row-meta">
        {formatListMetaLine(theme)}
      </span>
      <span className="list-row-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
