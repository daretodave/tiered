import Link from 'next/link'
import type { ReactNode } from 'react'

type HomeShowGridProps = {
  children: ReactNode
}

export function HomeShowGrid({ children }: HomeShowGridProps) {
  return (
    <section className="home-shows" data-testid="home-show-section">
      <div className="section-head">
        <h2>Tiers</h2>
        <Link href="/shows" prefetch={false} className="section-link">
          All shows →
        </Link>
      </div>
      <div className="home-show-grid" data-testid="home-show-grid">
        {children}
      </div>
    </section>
  )
}
