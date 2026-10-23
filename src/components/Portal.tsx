import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { PORTAL_EVENT, PORTAL_MQ, heroZoom, portal } from '../lib/portal'

const emit = (id: 'home' | 'projects') =>
  window.dispatchEvent(new CustomEvent(PORTAL_EVENT, { detail: id }))

/**
 * Pins Hero + Projects in one viewport and scrubs a camera move through the ring:
 * the hero artwork zooms into the hole, then the Projects scene settles in from a zoomed state.
 * Below the desktop breakpoint (or with reduced motion) both sections just stack normally.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()

    mm.add(PORTAL_MQ, () => {
      el.classList.add('portal-on')
      portal.active = true

      const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
      const hero = q('#home')
      const heroUi = q('[data-portal-fade]')
      const proj = q('#projects')
      const projBg = q('#projects [data-bg]')

      heroZoom.t = 0
      heroZoom.draw()
      gsap.set(proj, { autoAlpha: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: true, // Lenis already smooths the scroll; extra scrub easing only adds lag
          anticipatePin: 1,
          onRefresh: (self) => {
            portal.endY = self.end
          },
          onUpdate: (self) => emit(self.progress > 0.62 ? 'projects' : 'home'),
          onEnterBack: () => emit('projects'),
          onLeave: () => emit('projects'),
          onLeaveBack: () => emit('home'),
        },
      })

      // Camera dollies into the ring
      // (the canvas re-samples the artwork each frame; zoom is exponential so the move feels steady)
      tl.fromTo(
        heroZoom,
        { t: 0 },
        { t: 1, ease: 'power1.in', duration: 1, onUpdate: () => heroZoom.draw() },
        0,
      )
      tl.to(heroUi, { opacity: 0, y: -90, ease: 'power2.in', duration: 0.28 }, 0)

      // ...and comes out the other side into the projects scene
      tl.to(proj, { autoAlpha: 1, duration: 0.4 }, 0.62)
      tl.fromTo(
        projBg,
        { scale: 1.8, transformOrigin: '50% 42%' },
        { scale: 1, ease: 'power2.out', duration: 0.9 },
        0.62,
      )
      tl.to(hero, { autoAlpha: 0, duration: 0.2 }, 0.85)
      tl.from('#projects [data-reveal="header"]', { y: 36, opacity: 0, duration: 0.35, stagger: 0.06 }, 0.95)
      tl.from('#projects .project-card', { y: 70, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.0)

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        el.classList.remove('portal-on')
        portal.active = false
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className="portal">
      {children}
    </div>
  )
}
