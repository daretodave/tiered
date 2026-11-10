

Trap hit while building this: `season.body` (the frontmatter
override) has zero live instances across all 1067 season files —
a check reading it directly finds nothing on the real catalog.
The rendered "shape of the season" text almost always falls back
to `blurb_md` once `lede` is set; resolve it as `body ?? (lede-gated
blurb_md)`, mirroring the new `effectiveSeasonShapeBody()` /
the existing `seasonShapeSectionRenders()` boolean in
`scripts/content-check.ts`.

The live-corpus count for this gate, once reading the correct
field, is 787 instances — not the ~20 the spec's Why section
estimated from sampled critique passes. Expected: critique sampled
a fraction of shows reactively, this gate checks all of them. The
spec's own contingency ("if the corpus drain shows it's too noisy
... tune it in a follow-up chunk") already covers this; draining
the corpus is unchanged follow-on work (ordinary `/ship-content`
rotation, same pattern as spec 48's 48.1-48.5 chunks). Chunk 50.2
(the curator-brief update) is next.
