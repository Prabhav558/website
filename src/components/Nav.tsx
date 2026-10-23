import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import { useSmoothScroll } from '../lib/smooth-scroll'
import { PORTAL_EVENT, portal } from '../lib/portal'
import Logo from './Logo'
import PillButton from './PillButton'
import s from './Nav.module.css'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const { scrollTo, stop, start } = useSmoothScroll()
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)

  // Scroll spy
  useEffect(() => {
    const triggers = links.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (portal.active && (id === 'home' || id === 'projects')) return
          if (self.isActive) setActive(id)
        },
      }),
    )
    const onPortal = (e: Event) => setActive((e as CustomEvent<string>).detail)
    window.addEventListener(PORTAL_EVENT, onPortal)
    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener(PORTAL_EVENT, onPortal)
    }
  }, [])

  // Sliding underline
  const place = useCallback(
    (animate: boolean) => {
      const link = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
      const line = lineRef.current
      if (!link || !line || link.offsetWidth === 0) return
      const vars = { x: link.offsetLeft, scaleX: link.offsetWidth }
      if (animate && !reducedMotion) gsap.to(line, { ...vars, duration: 0.55, ease: 'power3.out', overwrite: true })
      else gsap.set(line, vars)
    },
    [active],
  )

  useLayoutEffect(() => {
    place(placed.current)
    placed.current = true
  }, [place])

  useEffect(() => {
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize).catch(() => {})
    return () => window.removeEventListener('resize', onResize)
  }, [place])

  // Mobile overlay: lock scroll, close on Escape
  useEffect(() => {
    if (!open) return
    stop()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, start, stop])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(`#${id}`)
  }

  return (
    <header className={s.header}>
      <nav className={s.nav} aria-label="Primary">
        <a href="#home" className={s.logo} onClick={go('home')} aria-label="Home">
          <Logo />
        </a>

        <ul className={s.links} ref={listRef}>
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                data-id={l.id}
                className={s.link}
                aria-current={active === l.id ? 'true' : undefined}
                onClick={go(l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <span ref={lineRef} className={s.underline} aria-hidden="true" />
        </ul>

        <div className={s.cta}>
          <PillButton href="#contact">Let's talk</PillButton>
        </div>

        <button
          type="button"
          className={s.burger}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? s.barOpen : ''} />
          <span className={open ? s.barOpen : ''} />
        </button>
      </nav>

      <div id="mobile-menu" className={`${s.overlay} ${open ? s.overlayOpen : ''}`} aria-hidden={!open} inert={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={go(l.id)} aria-current={active === l.id ? 'true' : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <PillButton href="#contact" onClick={() => setOpen(false)}>
          Let's talk
        </PillButton>
      </div>
    </header>
  )
}
