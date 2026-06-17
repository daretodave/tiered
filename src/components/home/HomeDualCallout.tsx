import Link from 'next/link'

export function HomeDualCallout() {
  return (
    <section className="dual" data-testid="home-dual-callout">
      <div className="dual-cell" data-testid="home-dual-curated">
        <div className="dual-tag">01 · Curated</div>
        <h3 className="dual-title">Editor&apos;s Canon</h3>
        <p className="dual-blurb">
          A single, ordered list I write after watching the show through twice.
          <b> Stable, opinionated, signed.</b> Revised after every finale, and
          after returnee seasons that recast a prior run.
        </p>
      </div>
      <div className="dual-cell" data-testid="home-dual-live">
        <div className="dual-tag">02 · Live</div>
        <h3 className="dual-title">Community Rank</h3>
        <p className="dual-blurb">
          One vote per season — does it belong in your community top 10?{' '}
          <b>Plain. Restless. Honest.</b> The numbers shift each week. When
          signed-in, you self-attest you watched the season end to end;
          anonymous votes count at 0.1×, accounts under 7 days at 0.25×,
          tenured accounts at 1.0×.{' '}
          <Link href="/sign-in" className="dual-signin-link">
            Sign in
          </Link>{' '}
          to count at full weight.
        </p>
      </div>
    </section>
  )
}
