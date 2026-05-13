import { ImageResponse } from 'next/og'

// Shared OG image template factory. Per-route opengraph-image.tsx
// files call buildOgImage() with show palette + copy. Keeps the
// surface files terse (one default export per file).

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

export type OgPalette = {
  // Hex colors; satori-compatible.
  paper: string
  ink: string
  primary: string
}

const DEFAULT_PALETTE: OgPalette = {
  paper: '#0E0B08',
  ink: '#F2EADB',
  primary: '#E8B65A',
}

export type BuildOgImageArgs = {
  eyebrow: string
  title: string
  blurb?: string
  palette?: OgPalette
}

export function buildOgImage({
  eyebrow,
  title,
  blurb,
  palette,
}: BuildOgImageArgs): ImageResponse {
  const p = palette ?? DEFAULT_PALETTE
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: p.paper,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          color: p.ink,
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: p.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <span
            style={{
              width: 40,
              height: 1,
              backgroundColor: p.primary,
              display: 'block',
            }}
          />
          {eyebrow}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.04,
              letterSpacing: -1.6,
              color: p.ink,
              fontWeight: 500,
              display: 'flex',
            }}
          >
            {title}
          </div>
          {blurb ? (
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                color: p.ink,
                opacity: 0.82,
                maxWidth: 900,
                display: 'flex',
              }}
            >
              {blurb}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <span style={{ color: p.primary, fontWeight: 600 }}>Pantheon</span>
          <span style={{ color: p.ink, opacity: 0.6 }}>
            the seasons, ranked. no spoilers.
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}

// Note: per-route opengraph-image.tsx files must declare these
// as literal `export const` statements (Next.js's segment-config
// static analysis can't follow through an imported constant).
// We don't export them from here — see any per-route file for
// the canonical shape.
