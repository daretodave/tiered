import {
  Column,
  Facade,
  Frieze,
  Ornament,
  PaletteScope,
  Pediment,
  Sigil,
} from '@/components/facade'
import { slotCoords } from '@/lib/facade'

const DEMO_PALETTE = {
  primary: '#C9551A',
  ink: '#1A1410',
  paper: '#F5EFE6',
}

function PedimentInIsolation() {
  return (
    <section aria-labelledby="demo-pediment">
      <h2 id="demo-pediment">Pediment (slot)</h2>
      <p>Default classical pediment outline. Phase 5 fills with per-show motifs.</p>
      <svg viewBox="0 0 1200 280" data-testid="demo-pediment-svg" style={{ width: '100%', height: 'auto', background: 'var(--show-paper)' }}>
        <Pediment />
      </svg>
    </section>
  )
}

function ColumnsInIsolation() {
  return (
    <section aria-labelledby="demo-column">
      <h2 id="demo-column">Columns (left / center / right)</h2>
      <p>
        Slot x coords: left {slotCoords.columns.left.x}, center {slotCoords.columns.center.x}, right{' '}
        {slotCoords.columns.right.x}.
      </p>
      <svg viewBox="0 0 1200 800" data-testid="demo-columns-svg" style={{ width: '100%', height: 'auto', background: 'var(--show-paper)' }}>
        <Column position="left" />
        <Column position="center" />
        <Column position="right" />
      </svg>
    </section>
  )
}

function FriezeInIsolation() {
  return (
    <section aria-labelledby="demo-frieze">
      <h2 id="demo-frieze">Frieze (slot)</h2>
      <p>Default twin-line band between pediment and columns.</p>
      <svg viewBox="0 0 1200 80" data-testid="demo-frieze-svg" style={{ width: '100%', height: 'auto', background: 'var(--show-paper)' }}>
        <g transform="translate(0 -280)">
          <Frieze />
        </g>
      </svg>
    </section>
  )
}

function OrnamentInIsolation() {
  return (
    <section aria-labelledby="demo-ornament">
      <h2 id="demo-ornament">Ornament</h2>
      <p>Default six-ray sunburst at sizes 40, 80, 120.</p>
      <svg viewBox="0 0 480 160" data-testid="demo-ornament-svg" style={{ width: '100%', height: 'auto', background: 'var(--show-paper)' }}>
        <Ornament cx={80} cy={80} size={40} />
        <Ornament cx={240} cy={80} size={80} />
        <Ornament cx={400} cy={80} size={120} />
      </svg>
    </section>
  )
}

function AssembledFacadeAndSigil() {
  const motif = (
    <>
      <Pediment />
      <Frieze />
      <Column position="left" />
      <Column position="center" />
      <Column position="right" />
      <Ornament cx={200} cy={500} />
      <Ornament cx={600} cy={500} />
      <Ornament cx={1000} cy={500} />
    </>
  )
  const sigilMotif = (
    <>
      <Pediment />
      <Column position="center" />
    </>
  )
  return (
    <section aria-labelledby="demo-assembled">
      <h2 id="demo-assembled">Assembled facade + derived sigil</h2>
      <p>
        Sigil shares the same children as the facade; only the viewBox crop differs (0 0 1200 800 →
        440 0 320 320). No separate sigil artwork.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 24, alignItems: 'start' }}>
        <Facade title="Demo facade" style={{ background: 'var(--show-paper)', width: '100%', height: 'auto' }}>
          {motif}
        </Facade>
        <Sigil title="Demo sigil" size={240} style={{ background: 'var(--show-paper)' }}>
          {sigilMotif}
        </Sigil>
      </div>
    </section>
  )
}

export function FacadeDemo() {
  return (
    <PaletteScope palette={DEMO_PALETTE}>
      <article style={{ padding: '32px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <h1>Facade primitives — demo</h1>
        <p>
          Internal harness for the SVG layout primitives shipped in phase 4. Each slot primitive
          renders its default architectural placeholder; phase 5 swaps in per-show motifs.
        </p>
        <PedimentInIsolation />
        <ColumnsInIsolation />
        <FriezeInIsolation />
        <OrnamentInIsolation />
        <AssembledFacadeAndSigil />
      </article>
    </PaletteScope>
  )
}
