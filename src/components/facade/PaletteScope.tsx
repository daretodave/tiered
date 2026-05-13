import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { getShow } from '@/content/loaders'
import { type Palette, paletteCssVars } from '@/lib/facade'

type PaletteScopeProps = {
  show?: string
  palette?: Palette | null
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'>

export function PaletteScope({
  show,
  palette,
  children,
  className,
  ...rest
}: PaletteScopeProps) {
  let resolved: Palette | null = null

  if (palette) {
    resolved = palette
  } else if (show) {
    const fromContent = getShow(show)
    if (fromContent) {
      resolved = fromContent.palette
    } else if (process.env['NODE_ENV'] !== 'production') {
      console.warn(`PaletteScope: show "${show}" not found in content/; using ceremonial fallback`)
    }
  }

  const style = paletteCssVars(resolved) as CSSProperties
  const dataShow = show ?? undefined

  return (
    <div
      data-show={dataShow}
      data-testid="palette-scope"
      style={style}
      className={className}
      {...rest}
    >
      {children}
    </div>
  )
}
