import Link from 'next/link'
import { themesContainingShow } from '@/lib/themes/byShow'

type FeaturedThemesProps = {
  show: string
}

// Renders an "Appears in" cross-link block on a show page,
// listing every themed list that contains at least one of the
// show's seasons. Returns null when no themes reference the
// show — the show page renders nothing extra in that case.

export function FeaturedThemes({ show }: FeaturedThemesProps) {
  const themes = themesContainingShow(show)
  if (themes.length === 0) return null

  return (
    <aside
      className="featured-themes"
      data-testid="featured-themes"
      aria-labelledby={`featured-themes-${show}`}
    >
      <h2
        id={`featured-themes-${show}`}
        className="featured-themes-head"
      >
        Featured in themes
      </h2>
      <ul className="featured-themes-list">
        {themes.map((theme) => (
          <li key={theme.slug}>
            <Link
              href={`/themes/${theme.slug}`}
              prefetch={false}
              className="featured-themes-link"
              data-testid="featured-theme-link"
            >
              {theme.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
