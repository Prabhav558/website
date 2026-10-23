/** Shared state for the hero -> projects "fly through the ring" scroll transition. */
export const PORTAL_MQ = '(min-width: 901px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)'
export const PORTAL_EVENT = 'portal-section'
export const portal = { active: false, endY: 0 }

// Hero artwork geometry (art-space = pixels of the original 1672x941 hero image)
export const ART_W = 1672
export const ART_H = 941
export const HOLE_X = 850
export const HOLE_Y = 355
export const HOLE_R = 118

/** Where the ring hole sits on screen at zoom 1 (image is cover-fitted and centred), and the zoom that makes it fill the screen. */
export function holeGeom(w: number, h: number) {
  const k = Math.max(w / ART_W, h / ART_H)
  const x = w / 2 + (HOLE_X - ART_W / 2) * k
  const y = h / 2 + (HOLE_Y - ART_H / 2) * k
  const far = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y))
  return { k, x, y, maxZoom: (far * 1.08) / (HOLE_R * k) }
}

/** Zoom driven by the scroll timeline; HeroCanvas registers its draw function here. */
export const heroZoom = { t: 0, draw: () => {} }
