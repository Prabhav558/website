import { useEffect, useRef } from 'react'
import { asset } from '../lib/assets'
import { ART_H, ART_W, heroZoom, holeGeom } from '../lib/portal'

// Close-up plate of the ring, used once the camera is deep inside (see scratchpad/upscale.py)
const PLATE = { x: 560, y: 190, f: 4 }
const BASE_F = 2

function load(src?: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/**
 * Draws the hero artwork onto a canvas at the current zoom. Zooming by re-sampling the source image each
 * frame (instead of CSS-scaling a giant layer) keeps it sharp and avoids the compositor tile glitches.
 */
export default function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    let base: HTMLImageElement | null = null
    let plate: HTMLImageElement | null = null
    let cw = 0
    let ch = 0
    let raf = 0
    let dead = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = Math.max(1, Math.round(canvas.clientWidth * dpr))
      ch = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }
    }

    const render = () => {
      raf = 0
      if (!base || !cw) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const { k, x: ox, y: oy, maxZoom } = holeGeom(w, h)
      const z = Math.pow(maxZoom, heroZoom.t)
      // screen point -> art-space point, for zoom about the ring hole
      const toArt = (px: number, py: number) => ({
        x: ART_W / 2 + (ox + (px - ox) / z - w / 2) / k,
        y: ART_H / 2 + (oy + (py - oy) / z - h / 2) / k,
      })
      const a = toArt(0, 0)
      const b = toArt(w, h)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.globalAlpha = 1
      ctx.drawImage(base, a.x * BASE_F, a.y * BASE_F, (b.x - a.x) * BASE_F, (b.y - a.y) * BASE_F, 0, 0, cw, ch)
      const mix = Math.min(1, Math.max(0, (z - 3) / 1.2))
      if (plate && mix > 0) {
        ctx.globalAlpha = mix
        ctx.drawImage(
          plate,
          (a.x - PLATE.x) * PLATE.f,
          (a.y - PLATE.y) * PLATE.f,
          (b.x - a.x) * PLATE.f,
          (b.y - a.y) * PLATE.f,
          0,
          0,
          cw,
          ch,
        )
        ctx.globalAlpha = 1
      }
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    heroZoom.draw = schedule

    resize()
    Promise.all([load(asset('bg-hero')), load(asset('bg-hero-hole'))]).then(([b, p]) => {
      if (dead) return
      base = b
      plate = p
      schedule()
    })

    const ro = new ResizeObserver(() => {
      resize()
      schedule()
    })
    ro.observe(canvas)

    return () => {
      dead = true
      ro.disconnect()
      cancelAnimationFrame(raf)
      heroZoom.draw = () => {}
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
