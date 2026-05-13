import Link from 'next/link'
import type { ReactNode } from 'react'

type HomeHeroProps = {
  featuredShowName: string
  art: ReactNode
}

// Phase 16 — the cold-search landing hero. Mirrors the
// .home-hero composition in design/compositions/screens.jsx.
// Copy is locked (bearings + spec); the only show-specific
// substitution is the eyebrow line.

export function HomeHero({ featuredShowName, art }: HomeHeroProps) {
  return (
    <section className="home-hero" data-testid="home-hero">
      <div className="home-hero-art" data-testid="home-hero-art">
        {art}
      </div>
      <div className="home-hero-copy">
        <div className="home-hero-eyebrow" data-testid="home-hero-eyebrow">
          Currently featured · {featuredShowName}
        </div>
        <h1 className="home-hero-title">
          The seasons,
          <br />
          ranked. <em>No spoilers.</em>
        </h1>
        <p className="home-hero-blurb">
          Two rankings for every show. One written by an editor with the whole
          series in their head, one voted by the people who lived through it.
        </p>
        <div className="home-hero-actions">
          <Link
            href="/shows"
            prefetch={false}
            className="btn-primary"
            data-testid="home-cta-shows"
          >
            Browse all shows
          </Link>
          <Link
            href="/about"
            prefetch={false}
            className="btn-ghost"
            data-testid="home-cta-about"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  )
}
