import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  getAllSeasons,
  getAllShows,
  getAllThemes,
  getCanon,
  getSeason,
  getSeasonBySlug,
  getShow,
} from '@/content'
import type { Season, Show, Theme } from '@/content'
import { ShowPaletteScope } from '@/components/show/ShowPaletteScope'
import {
  AdjacentSeasons,
  AppearsInList,
  CommentThreadLive,
  SeasonEpStrip,
  SeasonHero,
  SeasonInfoCard,
  SeasonStatsStrip,
  SeasonTOC,
  SeasonTOCMobile,
  ShieldBadge,
  VotePair,
  VoteRowHead,
  WatchList,
  type AdjacentSide,
  type AppearsInRow,
  type SeasonStat,
  type TOCSection,
} from '@/components/composition'
import { Bullet } from '@/components/atoms/Bullet'
import {
  buildJsonLd,
  buildMetadata,
  canonicalUrl,
  clipToSeoBudget,
  jsonLdScriptProps,
} from '@/lib/seo'
import { resolveSeasonSlugAlias } from '@/lib/season/slug-aliases'
import { seasonWatchOrderLine } from '@/lib/season/watch-order'

type Params = { show: string; slug: string }

export function generateStaticParams(): Params[] {
  const out: Params[] = []
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      out.push({ show: show.slug, slug: season.slug })
    }
  }
  return out
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const show = getShow(params.show)
  if (!show) {
    return buildMetadata({
      title: 'Season',
      description: '',
      path: `/shows/${params.show}/season/${params.slug}`,
      noIndex: true,
    })
  }
  const season = getSeasonBySlug(show.slug, params.slug)
  if (!season) {
    return buildMetadata({
      title: `${show.name} season`,
      description: '',
      path: `/shows/${show.slug}/season/${params.slug}`,
      noIndex: true,
    })
  }
  return buildMetadata({
    title: seasonDisplayTitle(show, season),
    description: descriptionFor(show.name, season),
    path: `/shows/${show.slug}/season/${season.slug}`,
    image: `/shows/${show.slug}/season/${season.slug}/opengraph-image`,
    feeds: [
      {
        url: canonicalUrl(`/feed/${show.slug}.xml`),
        title: `${show.name} — tiered.tv`,
      },
    ],
  })
}

// CRITIQUE pass 68 MED: a season titled with the generic "Season N"
// label stutters against the "S<N>" prefix ("Jersey Shore S1 —
// Season 1"), since both segments carry the same information. Drop
// the redundant "S<N>" prefix in that case only — a real season
// title ("Heroes vs. Villains") still pairs with it for contrast.
//
// CRITIQUE pass 73 MED: a milestone-named season ("Survivor 50")
// hits the same stutter — the title already carries both the show
// name and the season number, so the "S50" prefix repeats
// information a second time ("Survivor S50 — Survivor 50"). Extend
// the guard to drop the prefix whenever the title already contains
// both the show name and the season number.
export function seasonDisplayTitle(show: Show, season: Season): string {
  if (season.title === `Season ${season.number}`) {
    return `${show.name} — ${season.title}`
  }
  if (
    season.title.includes(show.name) &&
    season.title.includes(String(season.number))
  ) {
    return `${show.name} — ${season.title}`
  }
  return `${show.name} S${season.number} — ${season.title}`
}

// CRITIQUE pass 10 MED: prefer the curator's lede (the line a reader
// would quote to a friend) over the flat "Vote and discuss…" template.
// The template fallback survives for seasons authored without a lede;
// the rare lede that overruns the SEO budget goes through
// `clipToSeoBudget` (critique pass 62/67 — clause-boundary aware, not
// a raw word-boundary cut).
function descriptionFor(showName: string, season: Season): string {
  const lede = season.lede?.trim()
  if (!lede) {
    return `Vote and discuss ${showName} season ${season.number}: ${season.title}.`
  }
  return clipToSeoBudget(lede)
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function ledeOf(season: Season): string {
  if (season.lede) return season.lede
  return season.blurb_md.trim()
}

function bodyOf(season: Season): string | undefined {
  if (season.body) return season.body
  if (season.lede) {
    const rest = season.blurb_md.trim()
    return rest.length > 0 ? rest : undefined
  }
  return undefined
}

// Genre tags that describe an elimination/scored game, where the
// cast competes against each other for a prize or survival. Every
// other genre_tag (docusoap, dating, lifestyle, docuseries, etc.)
// gets the genre-neutral "cast member(s)" noun instead — a Housewife
// or a matched couple isn't a "player" by any reading a viewer would
// recognize (critique pass-75).
export function isCompetitionGenre(genreTag: string): boolean {
  const t = genreTag.toLowerCase()
  return t.includes('competition') || t === 'survival reality' || t === 'social deduction'
}

export function statsFor(season: Season, genreTag: string): SeasonStat[] {
  const premieredVal = season.premiere_date
    ? new Date(season.premiere_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : season.aired_year
      ? String(season.aired_year)
      : undefined
  const epsVal = season.ep_count ?? season.episodes
  const castNoun = isCompetitionGenre(genreTag)
    ? season.cast_size === 1
      ? 'player'
      : 'players'
    : season.cast_size === 1
      ? 'cast member'
      : 'cast members'
  return [
    { key: 'Filmed', value: season.location, caption: season.filming_caption },
    { key: 'Premiered', value: premieredVal, caption: season.premiere_caption },
    {
      key: 'Episodes',
      value: epsVal != null ? String(epsVal) : undefined,
      caption: season.episodes_caption,
    },
    {
      key: 'Format',
      value: season.format_summary,
      caption: season.format_caption,
    },
    {
      key: 'Cast size',
      value: season.cast_size != null ? `${season.cast_size} ${castNoun}` : season.cast_note,
      caption: season.cast_size_caption,
    },
    { key: 'Host', value: season.host, caption: season.host_caption },
  ]
}

function adjacentByCanon(
  show: Show,
  seasons: Season[],
  current: Season,
): { prev: AdjacentSide | null; next: AdjacentSide | null } {
  const ranked = seasons
    .filter((s) => typeof s.canonical_position === 'number')
    .sort((a, b) => (a.canonical_position ?? 0) - (b.canonical_position ?? 0))
  const pos = ranked.findIndex((s) => s.number === current.number)
  const toSide = (s: Season | undefined | null): AdjacentSide | null => {
    if (!s) return null
    return {
      href: `/shows/${show.slug}/season/${s.slug}`,
      rank: s.canonical_position ?? null,
      title: s.title,
      caption: s.tag,
    }
  }
  if (pos === -1) {
    const ordered = [...seasons].sort((a, b) => a.number - b.number)
    const idx = ordered.findIndex((s) => s.number === current.number)
    return {
      prev: toSide(idx > 0 ? ordered[idx - 1] : null),
      next: toSide(idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null),
    }
  }
  return {
    prev: toSide(pos > 0 ? ranked[pos - 1] : null),
    next: toSide(pos < ranked.length - 1 ? ranked[pos + 1] : null),
  }
}

function appearsInRowsFor(
  show: Show,
  season: Season,
  themes: Theme[],
  canonRank: number | null,
): AppearsInRow[] {
  const rows: AppearsInRow[] = []
  for (const t of themes) {
    const hit = t.entries.find(
      (e) => e.show === show.slug && e.season === season.number,
    )
    if (!hit) continue
    rows.push({
      href: `/themes/${t.slug}`,
      name: t.title,
      meta: `list · ${t.entries.length} ${t.entries.length === 1 ? 'entry' : 'entries'}`,
    })
  }
  if (canonRank != null) {
    // Phase 33: canon consolidated into the show page; canon is the
    // default ranking view there.
    rows.push({
      href: `/shows/${show.slug}`,
      name: `${show.name} — Editor's Canon`,
      meta: `Editor's Canon · #${pad2(canonRank)}`,
    })
  }
  return rows
}

function paragraphsOf(body: string): string[] {
  return body
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

export function whereItSitsCopy(
  show: Show,
  canonRank: number | null,
  canonTotal: number,
  rationale?: string,
): string {
  if (canonRank == null || canonTotal === 0) {
    return `Canon position not assigned yet — the editors' draft is still in progress for ${show.name}. Check back as the canon fills in.`
  }
  if (canonTotal === 1) {
    return rationale
      ? `Sole entry in the ${show.name} Editor's Canon so far. ${rationale}`
      : `Sole entry in the ${show.name} Editor's Canon so far. Adjacent picks land as the canon grows.`
  }
  // critique-pass-49 MED (Section 03 body was a two-sentence stub
  // that only restated facts already shown in the hero pill above +
  // the "Adjacent in the canon" section below). Every canon entry
  // already carries an 80-120 word editorial `rationale` — the
  // actual argument for why the season sits at this slot — so this
  // section now quotes it instead of pointing at section 05 with no
  // content of its own. `rationale` is undefined only when the
  // season carries a legacy `canonical_position` with no matching
  // canon.md entry (no rationale exists to quote yet).
  return rationale
    ? `Slot #${pad2(canonRank)} of ${canonTotal} in the ${show.name} Editor's Canon. ${rationale}`
    : `Slot #${pad2(canonRank)} of ${canonTotal} in the ${show.name} Editor's Canon. The seasons on either side show what I ranked it against.`
}

// Section 05 ("Adjacent in the canon") subhead. critique-pass-29 LOW:
// the prior literal "Read next." framed both adjacent cards as the
// reader's forward path, but the section can render a canon-above
// neighbor (slot #N-1) alongside a canon-below one (slot #N+1) — for
// a reader on slot #02, slot #01 is read-previous, not read-next.
// "Either direction." reads honestly against any pair the section
// renders and preserves the page's eyebrow + h2 rhythm.
export const ADJACENT_SECTION_H2 = 'Either direction.' as const

// critique-pass-56/68 MED (systemic across every single-season show):
// the TOC array and the inline article-eyebrow numbers were each
// hardcoded ('01'..'06'), so an absent optional section (no
// watch_list, no adjacent season, no themed-list cross-refs) left a
// gap in the visible ordinal sequence instead of the sections
// renumbering to stay consecutive. Both the TOC and the inline
// eyebrows now derive their number from the same filtered array
// index, so the two never drift from each other and never skip.
// Exported so the colocated page test can pin the renumbering.
export function buildSections(opts: {
  shapeHasCopy: boolean
  watchVisible: boolean
  adjacentVisible: boolean
  appearsInCount: number
}): TOCSection[] {
  const defs = [
    { id: 's-take', label: 'The take', visible: true },
    { id: 's-shape', label: 'The shape of the season', visible: opts.shapeHasCopy },
    { id: 's-where', label: 'Where it sits in the canon', visible: true },
    { id: 's-watch', label: 'What to watch for', visible: opts.watchVisible },
    { id: 's-related', label: 'Adjacent in the canon', visible: opts.adjacentVisible },
    { id: 's-appears', label: 'Also appears in', visible: opts.appearsInCount > 0 },
  ] as const
  return defs
    .filter((d) => d.visible)
    .map((d, i) => ({ id: d.id, num: String(i + 1).padStart(2, '0'), label: d.label }))
}

// Section 01 ("The take") H2. critique-pass-47 MED (issue #393): the
// default H2 rendered the season title with a trailing period
// (`{season.title}.`), which on HvV reads as a literal restate of
// the page H1 above. Sections 02–06 carry editorial fragments that
// preview each section's argument; Section 01 was the only one that
// degenerated into a page-title restate. `take_h2` is the optional
// frontmatter override — a 2-to-5-word editorial fragment in the
// same register as 02–06. When absent the legacy title-as-H2
// default holds (the lax→strict catalog drain proceeds tick by
// tick; see `scripts/content-check.ts` §
// collectSeasonSectionSubheadIssues). Exported so the colocated
// page test can pin both branches.
export function takeH2For(season: Season): string {
  return season.take_h2 ?? `${season.title}.`
}

// SeasonHero byline. critique-pass-38 MED (issue #339): the byline
// `Canon entry by the tiered.tv editor` and the RankScale headLabel
// `Editor's Canon` stack the same attribution claim twice in the same
// module head when the season is canon-ranked. The RankScale + slot
// card (`#02 of 50`) carry the attribution implicitly there, so the
// byline becomes redundant. For non-canon-ranked seasons the RankScale
// renders the `not yet ranked` state and the byline carries the only
// attribution surface — keep it.
export function seasonHeroBylineFor(canonRank: number | null) {
  if (canonRank != null) return null
  return (
    <span>
      Canon entry by <span className="who">the tiered.tv editor</span>
    </span>
  )
}

// 31a: digit-form back-compat. URLs like `/shows/survivor/season/4`
// resolve the season by number and 308 to its canonical slug form.
// Decided to do this in the page instead of middleware so the
// resolver can use the existing content loaders without forcing
// the middleware onto an experimental Node.js runtime — the
// user-visible behavior (`/season/4` → `/season/marquesas`) is
// identical, and Next.js's permanentRedirect emits a 308.
//
// Same precedent extended to the show-prefixed numeric form
// (`/season/<show.slug>-<n>` — e.g. `/season/survivor-20`), which
// readers and external links plausibly construct from the show
// slug + season number. Looked up only when the literal slug
// isn't a real season, so canonical slugs that legitimately end
// in `-<n>` (e.g. `survivor-46`) still serve directly.
const DIGIT_PARAM_RE = /^\d+$/

export default async function SeasonPage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  if (DIGIT_PARAM_RE.test(params.slug)) {
    const n = Number.parseInt(params.slug, 10)
    const bySeason = getSeason(show.slug, n)
    if (bySeason) {
      permanentRedirect(`/shows/${show.slug}/season/${bySeason.slug}`)
    }
    notFound()
  }
  const aliasTarget = resolveSeasonSlugAlias(show.slug, params.slug)
  if (aliasTarget) {
    permanentRedirect(`/shows/${show.slug}/season/${aliasTarget}`)
  }
  const season = getSeasonBySlug(show.slug, params.slug)
  if (!season) {
    const prefix = `${show.slug}-`
    if (params.slug.startsWith(prefix)) {
      const rest = params.slug.slice(prefix.length)
      if (DIGIT_PARAM_RE.test(rest)) {
        const n = Number.parseInt(rest, 10)
        const bySeason = getSeason(show.slug, n)
        if (bySeason) {
          permanentRedirect(`/shows/${show.slug}/season/${bySeason.slug}`)
        }
      }
    }
    notFound()
  }

  const seasons = getAllSeasons(show.slug)
  const themes = getAllThemes()
  const canonFile = getCanon(show.slug)
  const canonHit = canonFile?.entries.find((e) => e.season === season.number)
  const canonRank = canonHit?.rank ?? season.canonical_position ?? null
  const canonTotal = canonFile?.entries.length ?? show.seasons

  const articleLd = buildJsonLd({
    type: 'Article',
    headline: seasonDisplayTitle(show, season),
    description: (season.lede ?? season.blurb_md).slice(0, 200),
    path: `/shows/${show.slug}/season/${season.slug}`,
    author: 'tiered.tv editor',
    ...(season.premiere_date ? { datePublished: season.premiere_date } : {}),
  })
  const crumbsLd = buildJsonLd({
    type: 'BreadcrumbList',
    trail: [
      { name: 'Shows', path: '/shows' },
      { name: show.name, path: `/shows/${show.slug}` },
      { name: `Season ${season.number}`, path: `/shows/${show.slug}/season/${season.slug}` },
    ],
  })

  const seasonTargetId = `${show.slug}:${season.number}`
  const { prev, next } = adjacentByCanon(show, seasons, season)
  const appearsIn = appearsInRowsFor(show, season, themes, canonRank)
  const voteQuestion =
    season.vote_question ?? 'Does this belong in the community top 10?'

  const lede = ledeOf(season)
  const body = bodyOf(season)
  const bodyParagraphs = body ? paragraphsOf(body) : []
  const whereItSits = whereItSitsCopy(
    show,
    canonRank,
    canonTotal,
    canonHit?.rationale,
  )

  const stats = statsFor(season, show.genre_tag)
  const populatedStats = stats.filter(
    (s) => (s.value && s.value.length > 0) || (s.caption && s.caption.length > 0),
  )
  const statsVisible = populatedStats.length >= 3
  const epHeatVisible = (season.episode_heat?.length ?? 0) > 0
  const watchVisible = (season.watch_list?.length ?? 0) > 0
  const shapeHasCopy = bodyParagraphs.length > 0
  const adjacentVisible = Boolean(prev || next)

  const shieldLines: readonly string[] = [
    'No spoilers — reviewed by an editor',
    seasonWatchOrderLine(season),
  ]

  const sections: TOCSection[] = buildSections({
    shapeHasCopy,
    watchVisible,
    adjacentVisible,
    appearsInCount: appearsIn.length,
  })
  const numFor = (id: string) => sections.find((s) => s.id === id)?.num ?? ''

  return (
    <ShowPaletteScope show={show.slug}>
      <script {...jsonLdScriptProps({ id: 'ld-season', data: articleLd })} />
      <script {...jsonLdScriptProps({ id: 'ld-season-breadcrumb', data: crumbsLd })} />
      <div className="screen season-page" data-testid="season-page-screen">
        <SeasonHero
          crumb={
            <>
              <Bullet color="var(--show-primary)" size={9} />
              <a href="/shows">Shows</a>
              <span aria-hidden="true">/</span>
              <a href={`/shows/${show.slug}`}>{show.name}</a>
              <span aria-hidden="true">/</span>
              <span>Season {season.number}</span>
            </>
          }
          eyebrow={season.eyebrow}
          title={season.title}
          displayTitle={season.display_title}
          lede={lede}
          byline={seasonHeroBylineFor(canonRank)}
          infoCard={
            <SeasonInfoCard
              canonRank={canonRank}
              canonTotal={canonTotal}
              canonMeta={`${canonTotal} ${canonTotal === 1 ? 'season' : 'seasons'}`}
              voteQuestion={voteQuestion}
              voteRowHead={
                <VoteRowHead targetType="season" targetId={seasonTargetId} />
              }
              voteSlot={
                <VotePair
                  initialCount={0}
                  targetType="season"
                  targetId={seasonTargetId}
                  subject={`${show.name} ${season.title}`}
                />
              }
              shieldLines={shieldLines}
            />
          }
        />

        {statsVisible ? <SeasonStatsStrip stats={populatedStats} /> : null}

        {epHeatVisible ? (
          <SeasonEpStrip
            heat={season.episode_heat}
            caption={season.episode_heat_caption}
          />
        ) : null}

        <div className="body-grid">
          <SeasonTOC sections={sections} />

          <article className="article" data-testid="season-article">
            <SeasonTOCMobile sections={sections} />
            <section id="s-take" data-testid="section-take">
              <div className="article-eyebrow"><span className="num">{numFor('s-take')}</span><span>The take</span></div>
              <h2>{takeH2For(season)}</h2>
              {season.pull ? (
                <blockquote className="season-pull" data-testid="season-pull">
                  {season.pull}
                </blockquote>
              ) : null}
            </section>

            {shapeHasCopy ? (
              <section id="s-shape" data-testid="section-shape">
                <div className="article-eyebrow"><span className="num">{numFor('s-shape')}</span><span>The shape of the season</span></div>
                <h2>A rhythm worth tracking.</h2>
                {bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ) : null}

            <section id="s-where" data-testid="section-where">
              <div className="article-eyebrow"><span className="num">{numFor('s-where')}</span><span>Where it sits in the canon</span></div>
              <h2>
                {canonRank != null
                  ? `The #${pad2(canonRank)} slot.`
                  : 'Awaiting a canon slot.'}
              </h2>
              <p>{whereItSits}</p>
              <ShieldBadge />
            </section>

            {watchVisible ? (
              <section id="s-watch" data-testid="section-watch">
                <div className="article-eyebrow"><span className="num">{numFor('s-watch')}</span><span>What to watch for</span></div>
                <h2>{`${season.watch_list?.length ?? 0} moments, no spoilers.`}</h2>
                <WatchList items={season.watch_list} />
              </section>
            ) : null}

            {adjacentVisible ? (
              <section id="s-related" data-testid="section-related">
                <div className="article-eyebrow"><span className="num">{numFor('s-related')}</span><span>Adjacent in the canon</span></div>
                <h2>{ADJACENT_SECTION_H2}</h2>
                <AdjacentSeasons prev={prev} next={next} />
              </section>
            ) : null}

            {appearsIn.length > 0 ? (
              <section id="s-appears" data-testid="section-appears">
                <div className="article-eyebrow"><span className="num">{numFor('s-appears')}</span><span>Also appears in</span></div>
                <h2 id="appears-in-heading">Cross-references.</h2>
                <AppearsInList rows={appearsIn} />
              </section>
            ) : null}
          </article>

          <aside className="thread" data-testid="season-thread" aria-label="Reader thread">
            <CommentThreadLive
              targetType="season"
              targetId={seasonTargetId}
              signInHref={`/sign-in?return=/shows/${show.slug}/season/${season.slug}`}
            />
          </aside>
        </div>
      </div>
    </ShowPaletteScope>
  )
}
