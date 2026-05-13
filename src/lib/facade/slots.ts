export const FACADE_VIEWBOX = [0, 0, 1200, 800] as const
export const SIGIL_VIEWBOX_SIZE = 320

export const slotCoords = {
  pediment: { x: 0, y: 0, width: 1200, height: 280 },
  frieze: { x: 0, y: 280, width: 1200, height: 80 },
  columns: {
    left: { x: 80, y: 100, width: 20, height: 620 },
    center: { x: 590, y: 100, width: 20, height: 620 },
    right: { x: 1100, y: 100, width: 20, height: 620 },
  },
  ornament: { defaultSize: 80 },
} as const

export type ColumnPosition = keyof typeof slotCoords.columns
