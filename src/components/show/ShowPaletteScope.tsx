import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { getShow } from '@/content/loaders'

type Palette = {
  paper: string
  ink: string
  primary: string
}

type ShowPaletteScopeProps = {
  show?: string
  palette?: Palette | null
  /**
   * When true, the scope div takes over the full segment: it fills the
   * body flex column (flex-1 + min-height: 100dvh), sets the show paper
   * as background, and the show ink as color. Use on a route segment
   * layout (e.g. `src/app/shows/[show]/layout.tsx`) so no Pantheon dark
   * paper bleeds through above / below / between sections. When false
   * (default), the scope is a region-level CSS-var injector only — no
   * background or sizing, suitable for wrapping a single hero block on
   * an otherwise-neutral page.
   */
  asSegment?: boolean
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'>

function paletteCssVars(palette: Palette | null | undefined): CSSProperties {
  if (!palette) return {}
  return {
    '--show-paper': palette.paper,
    '--show-ink': palette.ink,
    '--show-primary': palette.primary,
  } as CSSProperties
}

export function ShowPaletteScope({
  show,
  palette,
  asSegment = false,
  children,
  className,
  ...rest
}: ShowPaletteScopeProps) {
  let resolved: Palette | null = null

  if (palette) {
    resolved = palette
  } else if (show) {
    const fromContent = getShow(show)
    if (fromContent) resolved = fromContent.palette
  }

  const vars = paletteCssVars(resolved)
  const segmentStyle: CSSProperties = asSegment
    ? {
        background: 'var(--show-paper)',
        color: 'var(--show-ink)',
        minHeight: '100dvh',
      }
    : {}

  const segmentClass = asSegment ? 'flex flex-1 flex-col' : ''
  const composedClass = [segmentClass, className].filter(Boolean).join(' ') || undefined

  return (
    <div
      data-show={show ?? undefined}
      data-testid="show-palette-scope"
      data-segment={asSegment ? 'true' : undefined}
      style={{ ...vars, ...segmentStyle }}
      className={composedClass}
      {...rest}
    >
      {children}
    </div>
  )
}
