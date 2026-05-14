#!/usr/bin/env node
// scripts/build-icons.mjs
//
// Renders the favicon set (and Apple touch icon) from a single
// canonical source SVG at `public/sigil.svg`. Idempotent — re-run
// any time the source SVG changes, all derived rasters are
// regenerated.
//
//   pnpm build:icons
//
// Outputs:
//   public/favicon.ico          # multi-size 16/32/48
//   public/icon-{16,32,48,64,96,128,180,192,256,512,1024}.png
//   public/apple-touch-icon.png # 180x180
//
// Implementation: @resvg/resvg-js (pure JS, no native deps) + png-to-ico.
//
// Phase 1 ships package.json with the dependencies. Until then this
// script exists as the contract — running it pre-phase-1 fails on
// missing imports, which is expected.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPO_ROOT = resolve(__dirname, '..')

const SOURCE = resolve(REPO_ROOT, 'public/sigil.svg')
const OUT_DIR = resolve(REPO_ROOT, 'public')
const SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512, 1024]
const ICO_SIZES = [16, 32, 48]

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`Source SVG not found: ${SOURCE}`)
    console.error(`Phase 1 must ship public/sigil.svg before this runs.`)
    process.exit(1)
  }

  const { Resvg } = await import('@resvg/resvg-js')
  const pngToIco = (await import('png-to-ico')).default

  await mkdir(OUT_DIR, { recursive: true })
  const rawSvg = await readFile(SOURCE, 'utf8')

  // Two render variants from the same source SVG:
  //
  //   1. Tile variant (apple-touch-icon + icon-NN.png): cream stroke
  //      (#F2EADB) on a solid tiered.tv paper-1 tile (#15110C). Looks
  //      like an app tile when installed to a home screen — Stripe /
  //      Linear recipe.
  //
  //   2. Favicon variant (favicon.ico + favicon.svg): tiered.tv
  //      ceremonial gold (#E8B65A) on a TRANSPARENT background. Browser
  //      tabs handle dark/light tab chrome themselves; the gold mark
  //      pops against both. The favicon does not represent an
  //      installable app tile, so it doesn't carry the paper-1 bg.
  const TILE_INK = '#F2EADB'         // tiered.tv ink-0 (cream)
  const TILE_BG = '#15110C'          // tiered.tv paper-1
  const FAVICON_INK = '#E8B65A'      // tiered.tv primary-base (gold)
  const svgTile = rawSvg.replace(/currentColor/g, TILE_INK)
  const svgFavicon = rawSvg.replace(/currentColor/g, FAVICON_INK)

  console.log(`Rendering ${SIZES.length} tile PNG variants from ${SOURCE}...`)
  for (const size of SIZES) {
    const png = new Resvg(svgTile, {
      fitTo: { mode: 'width', value: size },
      background: TILE_BG,
    })
      .render()
      .asPng()
    const out = resolve(OUT_DIR, `icon-${size}.png`)
    await writeFile(out, png)
    console.log(`  -> ${out} (${png.length} bytes)`)
  }

  // Apple touch icon: 180x180 with the tile recipe (iOS quirk — no
  // transparency on the apple icon).
  const apple = new Resvg(svgTile, {
    fitTo: { mode: 'width', value: 180 },
    background: TILE_BG,
  })
    .render()
    .asPng()
  const appleOut = resolve(OUT_DIR, 'apple-touch-icon.png')
  await writeFile(appleOut, apple)
  console.log(`  -> ${appleOut}`)

  // favicon.svg: vector favicon for modern browsers (FF / Chrome /
  // Safari / Edge). Gold stroke, transparent background.
  const svgFaviconOut = resolve(OUT_DIR, 'favicon.svg')
  await writeFile(svgFaviconOut, svgFavicon)
  console.log(`  -> ${svgFaviconOut}`)

  // favicon.ico: bundle 16/32/48 PNGs rendered with the favicon recipe
  // (gold on transparent), independent of the tile icon-NN.png set
  // written above.
  const icoPngs = await Promise.all(
    ICO_SIZES.map(size =>
      Promise.resolve(
        new Resvg(svgFavicon, {
          fitTo: { mode: 'width', value: size },
          background: 'rgba(0,0,0,0)',
        })
          .render()
          .asPng(),
      ),
    ),
  )
  const ico = await pngToIco(icoPngs)
  const icoOut = resolve(OUT_DIR, 'favicon.ico')
  await writeFile(icoOut, ico)
  console.log(`  -> ${icoOut} (${ico.length} bytes, ${ICO_SIZES.length} sizes, gold on transparent)`)

  console.log('Done.')
}

main().catch(err => {
  console.error(err.message ?? err)
  process.exit(1)
})
