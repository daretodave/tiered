import Link from 'next/link'
import type { Theme } from '@/content'

type AdjacentListsProps = {
  theme: Theme
  related: Theme[]
}

const CATEGORY_LABELS: Record<Theme['category'], string> = {
  tone: 'tone',
  craft: 'craft',
  era: 'era',
  single: 'single-show',
}

function tagFor(theme: Theme, other: Theme, side: 'left' | 'right'): string {
  if (theme.category === other.category) {
    const cat = CATEGORY_LABELS[other.category]
    return side === 'left' ? `↩ similar ${cat} list` : `${cat} list ↪`
  }
  return side === 'left' ? '↩ cross-canon list' : 'cross-canon list ↪'
}

export function AdjacentLists({ theme, related }: AdjacentListsProps) {
  if (related.length === 0) return null
  const pair = related.slice(0, 2)

  return (
    <section className="adjacent" data-testid="list-adjacent">
      <div className="adj-head">More lists in this vein</div>
      <div className="adj-grid">
        {pair.map((other, ix) => {
          const side: 'left' | 'right' = ix === 0 ? 'left' : 'right'
          return (
            <Link
              key={other.slug}
              href={`/themes/${other.slug}`}
              prefetch={false}
              className={`adj-link${side === 'right' ? ' adj-next' : ''}`}
              data-testid="list-adjacent-link"
              data-slug={other.slug}
            >
              <span className="adj-tag">{tagFor(theme, other, side)}</span>
              <span className="adj-title">{other.title}</span>
              <span className="adj-blurb">{other.description}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
