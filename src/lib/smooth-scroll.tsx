import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './gsap'
import { portal } from './portal'

const NAV_OFFSET = 16

interface ScrollApi {
  scrollTo: (target: string | HTMLElement) => void
  stop: () => void
  start: () => void
}

const Ctx = createContext<ScrollApi>({ scrollTo: () => {}, stop: () => {}, start: () => {} })

export const useSmoothScroll = () => useContext(Ctx)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.1, syncTouch: false })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => {})

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback((target: string | HTMLElement) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!el) return
    // While Hero + Projects are pinned together, their anchors map to scroll positions, not element offsets
    if (portal.active && (el.id === 'home' || el.id === 'projects')) {
      const y = el.id === 'home' ? 0 : portal.endY
      if (lenisRef.current) lenisRef.current.scrollTo(y)
      else window.scrollTo(0, y)
      return
    }
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(el, { offset: el.id === 'home' ? 0 : -NAV_OFFSET })
      return
    }
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [])

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo,
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [scrollTo],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
