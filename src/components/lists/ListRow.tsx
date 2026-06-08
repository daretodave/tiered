import Link from 'next/link'
import type { Show, Theme } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'
import { formatListMetaLine, formatThemeStatus } from '@/lib/themes-format'

type ListRowProps = {
  theme: Theme
  shows: Show[]
  today?: Date
}

export function ListRow({ theme, shows, today }: ListRowProps) {
  // Critique pass-40 #355 closure: the meta row previously rendered
  // `{entryCount} entries` only — the index card was the lone
  // catalogue surface that dropped the show-count. Adopt the canonical
  // `{N} shows · {M} entries` shape shared by the home list-row, the
  // featured-rail card, and the list-detail meta-strip.
  const metaLine = formatListMetaLine(theme, shows)
  const status = formatThemeStatus(theme.status, theme.last_revised, today)

  return (
    <Link
      href={`/themes/${theme.slug}`}
      prefetch={false}
      className="list-row"
      data-testid="lists-row"
      data-slug={theme.slug}
    >
      <span className="list-row-bullets">
        {shows.map((show) => (
          <Bullet
            key={show.slug}
            color={show.palette.primary}
            size={10}
          />
        ))}
      </span>
      <span className="list-row-body">
        <span className="list-row-title">{theme.title}</span>
        <span className="list-row-blurb">{theme.description}</span>
      </span>
      <span className="list-row-meta" data-testid="lists-row-meta">
        {metaLine}
        <br />
        {status}
      </span>
      <span className="list-row-arrow">
        <b>read the list →</b>
      </span>
    </Link>
  )
}
