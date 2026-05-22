import Link from 'next/link'
import type { ReactNode } from 'react'

type HomeListsStackProps = {
  showsCovered: number
  children: ReactNode
}

export function HomeListsStack({ showsCovered, children }: HomeListsStackProps) {
  // Mirrors the ListsHero accent logic (critique #98) so the home and
  // /themes surfaces stay honest from one source — the catalog's real
  // show coverage — instead of a hardcoded "cross-canon" claim.
  const isCrossCanon = showsCovered > 1

  return (
    <section
      className="home-lists"
      data-testid="home-list-section"
      data-coverage={isCrossCanon ? 'cross-canon' : 'single-canon'}
    >
      <div className="section-head">
        <h2>
          Themed lists,{' '}
          <em>{isCrossCanon ? 'cross-canon.' : 'inside one canon.'}</em>
        </h2>
        <Link href="/themes" prefetch={false} className="section-link">
          All lists →
        </Link>
      </div>
      <div className="lists-stack" data-testid="home-lists-stack">
        <div className="lists-stack-inner">{children}</div>
      </div>
    </section>
  )
}
