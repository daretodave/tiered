import type { ReactNode } from 'react'

// Phase 30: top hero of the season page. Crumb + eyebrow + display_title
// (with optional <em> colored accent) + lede + byline on the left; the
// SeasonInfoCard rides the right rail. Ported from
// design/tiered.tv · Heroes vs. Villains.html § header.hero.

type SeasonHeroProps = {
  crumb: ReactNode
  eyebrow?: string | null
  title: string
  displayTitle?: string | null
  lede: string
  byline?: ReactNode
  infoCard: ReactNode
}

type TitleNode =
  | { kind: 'text'; value: string }
  | { kind: 'accent'; value: string }
  | { kind: 'break' }

// display_title accepts a constrained HTML subset — `<em>...</em>` and
// `<br/>`. The schema regex (see src/content/schemas.ts) enforces shape,
// so a simple regex split is safe. <em> renders as `<span class="amp">`
// per the design's `.season-h1 .amp` style; <br/> renders as a literal
// line break.
const TITLE_TOKEN = /<em>([^<]+)<\/em>|<br\s*\/?>/gi

export function parseDisplayTitle(raw: string): TitleNode[] {
  const nodes: TitleNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  TITLE_TOKEN.lastIndex = 0
  while ((m = TITLE_TOKEN.exec(raw)) !== null) {
    if (m.index > last) {
      nodes.push({ kind: 'text', value: raw.slice(last, m.index) })
    }
    if (m[1] != null) {
      nodes.push({ kind: 'accent', value: m[1] })
    } else {
      nodes.push({ kind: 'break' })
    }
    last = m.index + m[0].length
  }
  if (last < raw.length) {
    nodes.push({ kind: 'text', value: raw.slice(last) })
  }
  return nodes
}

function renderTitle(displayTitle: string | null | undefined, fallback: string) {
  if (!displayTitle) {
    return <>{fallback}</>
  }
  const nodes = parseDisplayTitle(displayTitle)
  return (
    <>
      {nodes.map((n, i) => {
        if (n.kind === 'text') return <span key={i}>{n.value}</span>
        if (n.kind === 'accent') {
          return (
            <span key={i} className="amp" data-testid="display-title-accent">
              {n.value}
            </span>
          )
        }
        return <br key={i} />
      })}
    </>
  )
}

export function SeasonHero({
  crumb,
  eyebrow,
  title,
  displayTitle,
  lede,
  byline,
  infoCard,
}: SeasonHeroProps) {
  return (
    <header className="hero" data-testid="season-hero">
      <div className="hero-left">
        <div className="season-crumb" data-testid="season-crumb">
          {crumb}
        </div>
        {eyebrow ? (
          <div className="season-eyebrow" data-testid="season-eyebrow">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="season-h1" data-testid="season-h1">
          {renderTitle(displayTitle, title)}
        </h1>
        <p className="hero-lede" data-testid="hero-lede">
          {lede}
        </p>
        {byline ? (
          <div className="hero-byline" data-testid="hero-byline">
            {byline}
          </div>
        ) : null}
      </div>
      {infoCard}
    </header>
  )
}
