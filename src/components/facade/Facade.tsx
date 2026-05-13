import type { ReactNode, SVGProps } from 'react'
import { FACADE_VIEWBOX, viewBoxToString } from '@/lib/facade'

type FacadeProps = {
  children?: ReactNode
  title?: string
} & Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'children'>

export function Facade({ children, title, role = 'img', ...rest }: FacadeProps) {
  return (
    <svg
      viewBox={viewBoxToString(FACADE_VIEWBOX)}
      xmlns="http://www.w3.org/2000/svg"
      role={role}
      aria-label={title}
      data-testid="facade"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}
