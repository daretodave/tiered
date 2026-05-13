import type { CSSProperties, HTMLAttributes } from 'react'

export type RankSentiment =
  | 'warm-up'
  | 'warm-down'
  | 'neutral'
  | 'hold'
  | 'verdict'
  | 'consensus'

type RankShiftPillProps = {
  delta: number
  sentiment: RankSentiment
} & Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'>

function arrow(delta: number): string {
  if (delta > 0) return '↑'
  if (delta < 0) return '↓'
  return '—'
}

/**
 * <RankShiftPill> — design port of `design/compositions/interactions.jsx`
 * lines 145–158 + `design/compositions/screens.css` lines 534–540.
 *
 * The little ↑3 / ↓2 / — tag that signals a recent rank change. Built
 * but not yet rendered in the production product — phase 19d ships it
 * with a demo route (gated behind `INTERNAL_DEMOS=1`) so the brand
 * pattern is ready when the 72-hour shift signal lands.
 *
 * Color flows through the screens.css `--s-*` sentiment aliases so
 * the pill picks up the same warm-up / warm-down / hold / etc. tones
 * the rest of the sentiment system uses.
 */
export function RankShiftPill({ delta, sentiment, className, ...rest }: RankShiftPillProps) {
  const tokenVar = `--s-${sentiment}`
  const style: CSSProperties = {
    color: `var(${tokenVar})`,
    background: `color-mix(in oklab, var(${tokenVar}) 16%, transparent)`,
  }
  const compiled = `rank-pill${className ? ` ${className}` : ''}`
  const sign = arrow(delta)
  const abs = Math.abs(delta)
  return (
    <span
      className={compiled}
      style={style}
      data-testid="rank-shift-pill"
      data-sentiment={sentiment}
      data-delta={delta}
      aria-label={
        delta > 0
          ? `rank up ${abs}`
          : delta < 0
            ? `rank down ${abs}`
            : 'no rank change'
      }
      {...rest}
    >
      <span aria-hidden="true">{sign}</span>
      {abs !== 0 && <span>{abs}</span>}
    </span>
  )
}
