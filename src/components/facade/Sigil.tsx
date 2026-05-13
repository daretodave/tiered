import type { ReactNode, SVGProps } from 'react'
import { FACADE_VIEWBOX, deriveSigilViewBox, viewBoxToString } from '@/lib/facade'

type SigilProps = {
  size?: number
  children?: ReactNode
  title?: string
} & Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'children' | 'width' | 'height'>

export function Sigil({ size = 320, children, title, role = 'img', ...rest }: SigilProps) {
  const viewBox = deriveSigilViewBox(FACADE_VIEWBOX)
  return (
    <svg
      viewBox={viewBoxToString(viewBox)}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role={role}
      aria-label={title}
      data-testid="sigil"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}
