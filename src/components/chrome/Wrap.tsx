import type { ReactNode } from 'react'

type WrapWidth = 'default' | 'narrow'

type WrapProps = {
  children: ReactNode
  className?: string
  width?: WrapWidth
}

export function Wrap({ children, className, width = 'default' }: WrapProps) {
  const widthClass = width === 'narrow' ? ' narrow' : ''
  return (
    <div
      data-testid="wrap"
      data-width={width}
      className={`wrap${widthClass}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}
