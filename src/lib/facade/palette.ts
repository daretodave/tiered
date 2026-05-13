import type { CSSProperties } from 'react'

export type Palette = {
  primary: string
  ink: string
  paper: string
}

export function paletteCssVars(palette: Palette | null | undefined): CSSProperties {
  if (!palette) return {}
  return {
    '--show-paper': palette.paper,
    '--show-ink': palette.ink,
    '--show-primary': palette.primary,
  } as CSSProperties
}
