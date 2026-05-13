import type { ReactNode, SVGProps } from 'react'
import { slotCoords } from '@/lib/facade'

type FriezeProps = {
  children?: ReactNode
} & Omit<SVGProps<SVGGElement>, 'children'>

export function Frieze({ children, ...rest }: FriezeProps) {
  const { x, y, width, height } = slotCoords.frieze
  return (
    <g data-testid="frieze" data-slot="frieze" {...rest}>
      {children ?? (
        <g
          stroke="var(--show-ink, var(--color-ink-0))"
          strokeWidth={3}
          fill="none"
          data-testid="frieze-default"
        >
          <line x1={x} y1={y + 10} x2={x + width} y2={y + 10} />
          <line x1={x} y1={y + height - 10} x2={x + width} y2={y + height - 10} />
        </g>
      )}
    </g>
  )
}
