export function HomeDualCallout() {
  return (
    <section className="dual" data-testid="home-dual-callout">
      <div className="dual-cell" data-testid="home-dual-curated">
        <div className="dual-tag">01 · Curated</div>
        <h3 className="dual-title">Editor&apos;s Canon</h3>
        <p className="dual-blurb">
          A single, ordered list written by an editor who has watched the whole
          show twice. <b>Stable, opinionated, signed.</b> Revised after every
          finale, and after returnee seasons that recast a prior run.
        </p>
      </div>
      <div className="dual-cell" data-testid="home-dual-live">
        <div className="dual-tag">02 · Live</div>
        <h3 className="dual-title">Community Rank</h3>
        <p className="dual-blurb">
          One reader, one vote per season — does it belong in the community top
          10? <b>Plain. Restless. Honest.</b> The numbers shift each week. Every
          voter has watched the season end to end.
        </p>
      </div>
    </section>
  )
}
