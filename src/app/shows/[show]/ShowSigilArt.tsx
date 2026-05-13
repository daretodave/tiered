import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readSigilSvg(slug: string): string | null {
  const file = resolve(process.cwd(), 'public', 'shows', slug, 'sigil.svg')
  try {
    const raw = readFileSync(file, 'utf8')
    return raw.replace(/^<\?xml.*?\?>\s*/, '')
  } catch {
    return null
  }
}

type ShowSigilArtProps = {
  slug: string
  name: string
}

export function ShowSigilArt({ slug, name }: ShowSigilArtProps) {
  const svg = readSigilSvg(slug)
  if (!svg) {
    return (
      <div
        data-testid="show-sigil"
        data-show-sigil-fallback={slug}
        aria-label={`${name} sigil (not yet shipped)`}
        style={{ width: 240, height: 240 }}
      />
    )
  }
  return (
    <div
      data-testid="show-sigil"
      data-show-sigil={slug}
      aria-label={`${name} sigil`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
