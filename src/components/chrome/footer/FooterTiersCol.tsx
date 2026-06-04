import Link from 'next/link'
import { getAllShows } from '@/content/loaders'
import { Bullet } from '@/components/atoms/Bullet'
import { TIER_ORDER } from '@/components/shows/tierMeta'

export function FooterTiersCol() {
  // Sort by editorial tier first (S → A → B) so the flagship leads chrome
  // navigation on every page; fall back to slug for stable ordering inside
  // a tier. Without this, the alphabetical-first three shows ship as the
  // catalog grows and the flagship can drift out of the column entirely.
  const shows = [...getAllShows()]
    .sort((a, b) => {
      const tierDelta =
        TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
      return tierDelta !== 0 ? tierDelta : a.slug.localeCompare(b.slug)
    })
    .slice(0, 3)
  return (
    <nav
      className="site-footer-col"
      aria-label="Shows"
      data-testid="site-footer-tiers-col"
    >
      <h2 className="site-footer-col-head">Shows</h2>
      <ul>
        {shows.map((s) => (
          <li key={s.slug}>
            <Link href={`/shows/${s.slug}`} prefetch={false}>
              <Bullet color={s.palette.primary} size={8} />
              <span>{s.name}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/shows"
            prefetch={false}
            className="site-footer-col-link-meta"
          >
            All shows →
          </Link>
        </li>
      </ul>
    </nav>
  )
}
