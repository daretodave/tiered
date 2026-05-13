# Phase 17 — SEO meta + sitemaps + structured data

> **The SEO bullseye phase.** Pantheon's promise is cold-search
> arrivers — phase 17 closes the loop on metadata, OG images,
> JSON-LD, and sitemap completeness so the site looks right in
> Google + Twitter + Slack previews.
>
> Substrate already shipped (phases 1–16): `buildMetadata`,
> `buildJsonLd` for CollectionPage / ItemList / Article /
> BreadcrumbList, a site-wide `/opengraph-image.tsx`,
> `sitemap.ts`. This phase adds the per-route layers + FAQ
> JSON-LD on /about + a sitemap-completeness e2e.

## Goal

By the end of this phase:

- **Per-route OG images**. Dynamic `opengraph-image.tsx` files
  under each canonical surface that needs a branded preview:
  - `src/app/shows/[show]/opengraph-image.tsx`
  - `src/app/shows/[show]/canon/opengraph-image.tsx`
  - `src/app/shows/[show]/community/opengraph-image.tsx`
  - `src/app/shows/[show]/season/[n]/opengraph-image.tsx`
  - `src/app/themes/[theme]/opengraph-image.tsx`
  Each derives palette from the show frontmatter and emits a
  1200×630 PNG via `next/og` ImageResponse. Template lives in
  `src/lib/og/template.tsx` so the surface files stay terse.
- **FAQ JSON-LD on /about**. The schema.org `FAQPage` type
  with 4-5 canonical Q&A pairs locked in code (spoiler policy,
  weighted votes, AI moderation, etc.). New helper
  `buildJsonLd({type:'FAQPage', faqs:[...]})`.
- **Sitemap completeness e2e**. The current
  `seo.spec.ts › sitemap.xml lists every public canonical URL`
  test asserts every URL in `canonical-urls.ts` appears in the
  sitemap. Phase 17 extends it with:
  - Count check: sitemap entry count equals expected canonical
    URL count minus the excluded set.
  - lastmod / changefreq / priority elements present on every
    entry (the existing sitemap.ts emits these; we just assert
    them).
- **Per-route OG image e2e**. New `seo.spec.ts` cases assert
  that each per-route opengraph-image URL returns 200 +
  `image/png` Content-Type. Generic shape only (we don't
  pixel-diff the PNG output).
- **/about FAQ JSON-LD e2e**. New seo.spec.ts case asserts the
  `application/ld+json` script with `@type=FAQPage` is present
  and parses to at least 4 questions.

## Outputs

```
src/lib/og/template.tsx                              # shared ImageResponse template
src/lib/og/template.test.tsx                         # smoke test on template factory
src/lib/seo.ts                                       # +FAQPage in buildJsonLd
src/lib/seo.test.ts                                  # +FAQPage assertions

src/app/shows/[show]/opengraph-image.tsx
src/app/shows/[show]/canon/opengraph-image.tsx
src/app/shows/[show]/community/opengraph-image.tsx
src/app/shows/[show]/season/[n]/opengraph-image.tsx
src/app/themes/[theme]/opengraph-image.tsx

src/app/about/page.tsx                               # +FAQ JSON-LD
src/app/about/__tests__/page.test.tsx                # FAQ data shape test (if extractable)

apps/e2e/tests/seo.spec.ts                           # +per-route OG + FAQ + completeness count
```

## Decisions made upfront — DO NOT ASK

- **Dynamic ImageResponse per route, NOT pre-built PNG.** The
  build-plan row mentions "OG image rendered to PNG via
  scripts/build-icons.mjs extension." Next's native edge
  ImageResponse already renders PNG at request time with
  cache-control headers. Adding a build-step PNG generator
  duplicates the path and adds CI friction; the edge runtime
  serves the same output. Documented in commit.
- **OG template is text-only (no SVG facade rasterization
  in v1).** Rasterizing the inline facade SVG inside an
  ImageResponse means transferring the SVG path data into the
  satori renderer — possible but adds complexity. Phase 17
  ships a TEXT-FORWARD OG card per route: show name, surface
  label, palette-derived background. The art-forward OG card
  is a follow-up once we can validate it across all per-show
  facades.
- **FAQ count = 4 canonical questions.** Locked in code. The
  list:
  1. "Are these spoiler-free?" — yes, defined in spec.md
  2. "How is the canon ranking made?" — editorial loop
  3. "How is the community ranking weighted?" — weight rules
  4. "What about AI moderation?" — gpt-5-mini pre-filter
  Source content from spec.md + bearings.
- **FAQ lives inline in /about page** (not in content/). The
  prose body of about.md stays untouched; the FAQ is a
  structured-data layer for crawlers. Visible FAQ rendering
  on the page (HTML `<details>` accordion) is OUT OF SCOPE —
  this phase just adds the JSON-LD so crawlers see Q&A pairs.
  HTML accordion lands in a follow-up.
- **Per-route OG image inherits page metadata.** `buildMetadata`
  already wires `openGraph.images` to `/opengraph-image`
  (canonical); Next.js automatically prefers a colocated
  `opengraph-image.tsx` when present. We don't need to
  override the metadata builder.
- **BreadcrumbList JSON-LD is left as-is**. The current shape
  (`itemListElement[].item`) matches schema.org v2 spec; v3
  prefers `@id` but accepts `item`. Leave until a SEO audit
  flags it.
- **Article JSON-LD on season pages is left as-is**. Already
  shipped phase 9; phase 17 doesn't tighten the shape.
- **No `metadataBase`** added this phase. The Next warning
  ("metadataBase property in metadata export is not set...")
  surfaces in test logs but doesn't break canonical URL
  emission since `buildMetadata` returns absolute URLs.
  Setting it correctly requires choosing the production
  hostname — bearings line 470 says "custom domain is
  deferred" so we stay at `pantheon-coral.vercel.app`. Setting
  metadataBase to that hostname IS a one-line fix; we DO IT
  this phase since it suppresses noise + future-proofs.
- **No structured-data testing service integration**. Validating
  JSON-LD against schema.org's RDA validator is out of scope.
  We assert shape via runtime e2e + zod-shaped helpers.

## Out of scope

- HTML accordion rendering of FAQ on /about.
- Pre-built PNG OG image assets via scripts/build-icons.mjs.
- Facade-art-forward OG card (raster the facade SVG inside the
  ImageResponse).
- BreadcrumbList shape tightening to @id.
- Open Graph article:published_time / article:author tags on
  season pages.
- twitter:creator handle (deferred until handle exists).
- Pantheon's own /search query JSON-LD (SearchAction on the
  WebSite shape — separate phase).

## Mobile reflow / responsive

N/A — OG images are crawler-facing. /about page already mobile-
safe.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `src/lib/seo.ts FAQPage` | seo.test.ts: emits @type=FAQPage with mainEntity array | covered via /about in seo.spec.ts |
| `src/lib/og/template.tsx` | template.test.tsx: factory returns ImageResponse instance | covered via per-route OG e2e |
| `/shows/[show]/opengraph-image` | covered by e2e | seo.spec.ts: status 200 + image/png |
| (...other per-route OG image surfaces) | covered by e2e | same |
| `/about` FAQ JSON-LD | covered by e2e | seo.spec.ts: script@type=application/ld+json contains @type=FAQPage with >=4 mainEntity items |

## Verify gate

`pnpm verify` — same composition. Sitemap completeness e2e
already gates the URL contract.

## Commit body template

```
feat: SEO + structured data — phase 17

- Per-route opengraph-image.tsx for shows/canon/community/season/theme.
- FAQ JSON-LD on /about with 4 canonical questions.
- buildJsonLd extended with FAQPage.
- metadataBase set to suppress Next warning.
- seo.spec.ts extended.

Decisions:
- Dynamic ImageResponse (not pre-built PNG).
- Text-forward OG cards in v1; art-forward is a follow-up.

Closes #<issue>
```

## DoD

- `pnpm verify` green.
- Each per-route opengraph-image URL returns 200 + image/png.
- `/about` emits FAQPage JSON-LD with ≥4 questions.
- Sitemap entry count matches expected canonical URL count.
- Vercel deploy ready.
- Mirror issue closed.

## Follow-ups (out of scope)

- HTML accordion rendering of FAQ on /about.
- Facade-art-forward OG cards.
- WebSite + SearchAction JSON-LD on /.
- twitter:creator handle.
- Pre-built PNG OG assets in /public.
- BreadcrumbList @id tightening.
