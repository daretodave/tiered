import type { ShowTier } from '@/content'
import { TierGlyph } from './TierGlyph'
import { tierMeta } from './tierMeta'

type TierHeadProps = {
  tier: ShowTier
  count: number
}

export function TierHead({ tier, count }: TierHeadProps) {
  const meta = tierMeta(tier)
  const noun = count === 1 ? 'Show' : 'Shows'

  return (
    <div className="tier-head" data-testid="tier-head" data-tier={tier}>
      <TierGlyph tier={tier} />
      <div className="tier-letter-row">
        <h2 className="tier-letter">{tier}</h2>
        <div className="tier-desc">
          <span className="tier-tag">{meta.tag}</span>
          <h3 className="tier-name">{meta.name}</h3>
        </div>
      </div>
      <div className="tier-count" data-testid="tier-count">
        <b>{count}</b>
        <span>{noun}</span>
      </div>
    </div>
  )
}
