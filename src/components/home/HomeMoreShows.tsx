import Link from 'next/link'
import type { ReactNode } from 'react'

type HomeMoreShowsProps = {
  children: ReactNode
}

export function HomeMoreShows({ children }: HomeMoreShowsProps) {
  return (
    <section data-testid="home-more-shows">
      <div className="sub-row">
        <span className="sub-row-label" data-testid="home-more-shows-label">
          The rest of the index
        </span>
        <Link href="/shows" prefetch={false} className="sub-row-link">
          Browse all →
        </Link>
      </div>
      <div className="shows-grid rest" data-testid="home-more-shows-grid">
        {children}
      </div>
    </section>
  )
}
