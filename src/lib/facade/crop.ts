import { SIGIL_VIEWBOX_SIZE } from './slots'

export type ViewBox = readonly [number, number, number, number]

export function deriveSigilViewBox(
  facade: ViewBox,
  cropSize: number = SIGIL_VIEWBOX_SIZE,
): ViewBox {
  const [fx, fy, fw] = facade
  const cx = fx + fw / 2
  return [cx - cropSize / 2, fy, cropSize, cropSize] as const
}

export function viewBoxToString(vb: ViewBox): string {
  return `${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}`
}
