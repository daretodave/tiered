import type { ReactNode, SVGProps } from 'react'
import { slotCoords } from '@/lib/facade'

type PedimentProps = {
  children?: ReactNode
} & Omit<SVGProps<SVGGElement>, 'children'>

export function Pediment({ children, ...rest }: PedimentProps) {
  const { x, y, width, height } = slotCoords.pediment
  return (
    <g data-testid="pediment" data-slot="pediment" {...rest}>
      {children ?? (
        <path
          d={`M ${x + 30} ${y + height - 50} L ${x + width / 2} ${y + 18} L ${x + width - 30} ${y + height - 50} Z`}
          fill="none"
          stroke="var(--show-ink, var(--color-ink-0))"
          strokeWidth={6}
          strokeLinejoin="round"
          data-testid="pediment-default"
        />
      )}
    </g>
  )
}
