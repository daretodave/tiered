import type { ThemeStats } from '@/content'
import { canonRevisedLabelFromIso } from '@/lib/canon/last-revised'
import { plural } from '@/lib/themes-format'

type ListsHeroProps = {
  stats: ThemeStats
}

export function ListsHero({ stats }: ListsHeroProps) {
  const hasCross = stats.crossCanonCount > 0
  const hasSingle = stats.singleShowCount > 0
  const coverage: 'mixed' | 'cross-canon' | 'single-canon' =
    hasCross && hasSingle ? 'mixed' : hasCross ? 'cross-canon' : 'single-canon'
  const accent =
    coverage === 'mixed'
      ? 'Cross-canon and single-show.'
      : coverage === 'cross-canon'
        ? 'Cross-canon.'
        : 'Inside one canon.'
  // Critique pass-40 #353: the prior FEATURED + IN THE INDEX
  // partition only existed as a workaround for the chip mode-row
  // (which scoped only the non-featured grid). Now that the chip
  // grid covers the whole catalog, featured is an overlay subset
  // — not a disjoint partition. The opener names the total once
  // and treats featured as a spotlight descriptor when present.
  const opener =
    stats.featuredCount > 0
      ? `${stats.total} ${plural(stats.total, 'list', 'lists')} we'd defend in a group chat — ${stats.featuredCount} featured this month.`
      : `${stats.total} ${plural(stats.total, 'list', 'lists')} we'd defend in a group chat.`
  const closer = 'None of them spoil what they rank.'
  const middle = (() => {
    if (coverage === 'single-canon') {
      return 'Every list lives inside one canon today — cross-canon entries arrive as more catalogues fill in.'
    }
    if (coverage === 'cross-canon') {
      return 'Some span the catalog.'
    }
    // Mixed mode: both counts ≥ 1. Each clause picks singular vs plural
    // from the live count so the lede never claims "some" when there's
    // only one (closes the same plural-drift class as #133 / critique
    // pass-20: today's 11-cross / 1-single catalog reads "Some span the
    // catalog, one stays inside a single show."). Critique pass-34 #324
    // rotated the singular-branch closer from `one lives inside one
    // show` → `one stays inside a single show` to drop the doubled
    // bare-`one` parse-stumble (the original clause carried two
    // referents — one list + one show — through adjacent bare `one`
    // tokens with no syntactic disambiguator). `single show` keeps the
    // same semantic but distinguishes lexically from the leading `one`
    // subject; plural branch unaffected (no doubled-bare-`one` there).
    const crossPart =
      stats.crossCanonCount === 1
        ? 'One spans the catalog'
        : 'Some span the catalog'
    const singlePart =
      stats.singleShowCount === 1
        ? 'one stays inside a single show'
        : 'some live inside one show'
    return `${crossPart}, ${singlePart}.`
  })()
  const lede = `${opener} ${middle} ${closer}`

  return (
    <header
      className="lists-hero"
      data-testid="lists-hero"
      data-coverage={coverage}
    >
      <div className="lists-hero-eyebrow">tiered.tv / Lists</div>
      <h1 className="lists-hero-title">
        Themed lists.
        <br />
        <em>{accent}</em>
      </h1>
      <p className="lists-hero-lede">{lede}</p>
      <div className="lists-hero-stats" data-testid="lists-hero-stats">
        <div className="lists-stat" data-testid="lists-stat-total">
          <div className="lists-stat-val">{stats.total}</div>
          <div className="lists-stat-key">{plural(stats.total, 'List', 'Lists')}</div>
        </div>
        <div className="lists-stat" data-testid="lists-stat-shows">
          <div className="lists-stat-val">{stats.showsCovered}</div>
          <div className="lists-stat-key">Shows covered</div>
        </div>
        <div className="lists-stat" data-testid="lists-stat-revised">
          <div className="lists-stat-val">
            {canonRevisedLabelFromIso(stats.lastIndexRevision) ?? ''}
          </div>
          <div className="lists-stat-key">Lists revised</div>
        </div>
      </div>
    </header>
  )
}
