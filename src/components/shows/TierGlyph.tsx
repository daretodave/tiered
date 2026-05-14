import type { ShowTier } from '@/content'

type TierGlyphProps = {
  tier: ShowTier
}

const TIER_CLASS: Record<ShowTier, string> = {
  S: 's',
  A: 'a',
  B: 'b',
}

export function TierGlyph({ tier }: TierGlyphProps) {
  return (
    <span
      className={`tier-glyph ${TIER_CLASS[tier]}`}
      data-testid="tier-glyph"
      data-tier={tier}
      aria-hidden="true"
    >
      <span className="bar b1" />
      <span className="bar b2" />
      <span className="bar b3" />
    </span>
  )
}
