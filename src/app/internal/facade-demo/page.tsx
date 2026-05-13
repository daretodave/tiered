import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FacadeDemo } from './FacadeDemo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Facade primitives — demo',
  robots: { index: false, follow: false },
}

export default function FacadeDemoPage() {
  if (process.env['INTERNAL_DEMOS'] !== '1') notFound()
  return <FacadeDemo />
}
