import Link from 'next/link'
import type { ReactNode } from 'react'

type HomeListGridProps = {
  children: ReactNode
}

export function HomeListGrid({ children }: HomeListGridProps) {
  return (
    <section className="home-lists" data-testid="home-list-section">
      <div className="section-head">
        <h2>Themed lists</h2>
        <Link href="/themes" prefetch={false} className="section-link">
          All lists →
        </Link>
      </div>
      <div className="home-list-grid" data-testid="home-list-grid">
        {children}
      </div>
    </section>
  )
}
