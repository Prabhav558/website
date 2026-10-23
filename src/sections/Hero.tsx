import { useRef } from 'react'
import { gsap, useGsapContext } from '../lib/gsap'
import { PORTAL_MQ } from '../lib/portal'
import { heroCopy, heroStats } from '../data/stats'
import HeroCanvas from '../components/HeroCanvas'
import Eyebrow from '../components/Eyebrow'
import PillButton from '../components/PillButton'
import StatCard from '../components/StatCard'
import s from './Hero.module.css'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const bg = useRef<HTMLDivElement>(null)

  useGsapContext(() => {
    // Background parallax (on desktop the Portal transition owns the scroll motion instead)
    if (!window.matchMedia(PORTAL_MQ).matches) {
      gsap.to(bg.current, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    // Headline: masked line reveal
    const tl = gsap.timeline({ delay: 0.15 })
    tl.from('[data-line]', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12 }, 0)
    tl.from('[data-fade]', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.5)
    tl.from('[data-stat]', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.14 }, 0.8)
  }, root)

  return (
    <section id="home" ref={root} className={`section ${s.hero}`} aria-label="Introduction">
      <div ref={bg} className={s.bg} aria-hidden="true">
        <HeroCanvas className={s.canvas} />
        <div className={s.bgFade} />
      </div>
      <div className={s.inner} data-portal-fade>
        <div className={s.copy}>
          <div data-fade>
            <Eyebrow>{heroCopy.eyebrow}</Eyebrow>
          </div>
          <h1 className={`display ${s.title}`}>
            {heroCopy.lines.map((l) => (
              <span key={l.text} className={s.mask}>
                <span data-line className={`${s.line} ${l.accent ? 'accent' : ''}`}>
                  {l.text}
                </span>
              </span>
            ))}
          </h1>
          <p className={s.sub} data-fade>
            {heroCopy.sub}
          </p>
          <div data-fade className={s.cta}>
            <PillButton href="#projects" arrow>
              {heroCopy.cta}
            </PillButton>
          </div>
        </div>
        <div className={s.stats}>
          {heroStats.map((st) => (
            <div key={st.label} data-stat>
              <StatCard {...st} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
