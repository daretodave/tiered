import type { Metadata } from 'next'
import {
  getAllThemes,
  getFeaturedThemes,
  getShow,
  getShowsForTheme,
  getThemeStats,
  getThemesByCategory,
} from '@/content'
import type { Show, Theme, ThemeCategory } from '@/content'
import { Wrap } from '@/components/chrome/Wrap'
import { ListsHero } from '@/components/lists/ListsHero'
import { ListsFilterController } from '@/components/lists/ListsFilterController'
import { ListsFeaturedRow } from '@/components/lists/ListsFeaturedRow'
import { ListsAllSection } from '@/components/lists/ListsAllSection'
import type { FilterKey } from '@/lib/themes-format'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Lists',
    description:
      'Themed lists across every tiered.tv canon — best premieres, best finales, cross-canon and single-show tiers, organized by what they admire.',
    path: '/themes',
  })
}

function resolveShows(theme: Theme): Show[] {
  const slugs = getShowsForTheme(theme)
  const out: Show[] = []
  for (const slug of slugs) {
    const s = getShow(slug)
    if (s) out.push(s)
  }
  return out
}

export default function ThemesIndexPage() {
  const themes = getAllThemes()
  const stats = getThemeStats()
  const byCategory = getThemesByCategory()
  const featured = getFeaturedThemes(3)

  const showsByTheme: Record<string, Show[]> = {}
  for (const t of themes) showsByTheme[t.slug] = resolveShows(t)

  // The featured rail is the curator's spotlight; the grid below is the
  // exhaustive index. Excluding featured from the grid keeps each list to
  // a single appearance on the page (critique pass-20).
  const featuredSlugs = new Set(featured.map((t) => t.slug))
  const byCategoryRest: Record<ThemeCategory, Theme[]> = {
    tone: byCategory.tone.filter((t) => !featuredSlugs.has(t.slug)),
    craft: byCategory.craft.filter((t) => !featuredSlugs.has(t.slug)),
    era: byCategory.era.filter((t) => !featuredSlugs.has(t.slug)),
    single: byCategory.single.filter((t) => !featuredSlugs.has(t.slug)),
  }

  const counts: Record<FilterKey, number> = {
    all:
      byCategoryRest.tone.length +
      byCategoryRest.craft.length +
      byCategoryRest.era.length +
      byCategoryRest.single.length,
    tone: byCategoryRest.tone.length,
    craft: byCategoryRest.craft.length,
    era: byCategoryRest.era.length,
    single: byCategoryRest.single.length,
  }

  const ld = {
    ...buildJsonLd({
      type: 'CollectionPage',
      name: 'Lists — tiered',
      description: 'Themed lists across every tiered.tv canon.',
      path: '/themes',
    }),
    numberOfItems: themes.length,
    hasPart: themes.slice(0, 10).map((t) => ({
      '@type': 'ItemList',
      name: t.title,
      url: `/themes/${t.slug}`,
    })),
  }

  if (themes.length === 0) {
    return (
      <Wrap>
        <script {...jsonLdScriptProps({ id: 'ld-themes-index', data: ld })} />
        <ListsHero stats={stats} />
        <p className="lists-all-wrap" style={{ paddingTop: 64, paddingBottom: 96 }}>
          Themed lists haven&rsquo;t shipped yet — this page populates as the loop drains the queue.
        </p>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <script {...jsonLdScriptProps({ id: 'ld-themes-index', data: ld })} />
      <ListsHero stats={stats} />
      <ListsFilterController counts={counts}>
        <ListsFeaturedRow featured={featured} showsByTheme={showsByTheme} />
        <ListsAllSection
          byCategory={byCategoryRest}
          showsByTheme={showsByTheme}
        />
      </ListsFilterController>
    </Wrap>
  )
}
