import Link from 'next/link'
import type { Show, Theme } from '@/content'
import { Bullet } from '@/components/atoms/Bullet'
import { formatRevisedRelative, plural } from '@/lib/themes-format'
import { ListDetailTools } from './ListDetailTools'
import { parseTagline } from './parseTagline'

type ListDetailHeroProps = {
  theme: Theme
  shows: Show[]
}

export function ListDetailHero({ theme, shows }: ListDetailHeroProps) {
  const entryCount = theme.entries.length
  const showCount = shows.length
  const segments = parseTagline(theme.tagline)
  const revised = formatRevisedRelative(theme.last_revised)

  return (
    <header className="list-detail-hero" data-testid="list-hero">
      <nav className="crumb" aria-label="Breadcrumb">
        <ol>
          <li className="crumb-bullets" aria-hidden="true">
            <span className="bullet-stack">
              {shows.map((show) => (
                <Bullet
                  key={show.slug}
                  color={show.palette.primary}
                  size={9}
                />
              ))}
            </span>
          </li>
          <li>
            <Link href="/themes" prefetch={false}>
              Lists
            </Link>
          </li>
          <li className="crumb-sep" aria-hidden="true">
            /
          </li>
          <li>
            <span className="current">{theme.title}</span>
          </li>
        </ol>
      </nav>

      <h1 className="list-title" data-testid="list-title">
        {theme.title}
      </h1>

      <p className="list-blurb" data-testid="list-tagline">
        {segments.map((seg, ix) =>
          seg.kind === 'emph' ? (
            <b key={ix}>{seg.text}</b>
          ) : (
            <span key={ix}>{seg.text}</span>
          ),
        )}
      </p>

      <dl className="list-meta" data-testid="list-meta">
        <div className="meta-cell" data-testid="list-meta-entries">
          <dt className="meta-key">Entries</dt>
          <dd className="meta-val">
            {entryCount} {plural(entryCount, 'entry', 'entries')}
          </dd>
        </div>
        <div className="meta-cell" data-testid="list-meta-spans">
          <dt className="meta-key">Spans</dt>
          <dd className="meta-val">
            {showCount} {plural(showCount, 'show', 'shows')}
          </dd>
        </div>
        <div className="meta-cell" data-testid="list-meta-curator">
          <dt className="meta-key">Curated by</dt>
          <dd className="meta-val">{theme.curator}</dd>
        </div>
        <div className="meta-cell" data-testid="list-meta-revised">
          <dt className="meta-key">Last revised</dt>
          <dd className="meta-val">{revised}</dd>
        </div>
      </dl>

      <ListDetailTools themeSlug={theme.slug} themeTitle={theme.title} />
    </header>
  )
}
