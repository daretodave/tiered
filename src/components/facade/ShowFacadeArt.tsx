import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readFacadeSvg(slug: string): string | null {
  const file = resolve(process.cwd(), 'public', 'shows', slug, 'facade.svg')
  try {
    const raw = readFileSync(file, 'utf8')
    return raw.replace(/^<\?xml.*?\?>\s*/, '')
  } catch {
    return null
  }
}

type ShowFacadeArtProps = {
  slug: string
  name: string
}

// Server-component reader for the per-show facade SVG. Inlines
// the SVG (after stripping the XML prolog) so the markup is in
// the document and Lighthouse doesn't penalize for a network
// fetch. Falls back to an empty styled placeholder if the file
// is missing — the show is still in flight from brander.

export function ShowFacadeArt({ slug, name }: ShowFacadeArtProps) {
  const svg = readFacadeSvg(slug)
  if (!svg) {
    return (
      <div
        data-testid="facade"
        data-show-facade-fallback={slug}
        aria-label={`${name} facade (not yet shipped)`}
        style={{ width: '100%', minHeight: 200 }}
      />
    )
  }
  return (
    <div
      data-testid="facade"
      data-show-facade={slug}
      aria-label={`${name} facade`}
      style={{ width: '100%', height: '100%' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
