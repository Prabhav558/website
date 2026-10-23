import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import Eyebrow from '../components/Eyebrow'
import GlassCard from '../components/GlassCard'
import Background from '../components/Background'
import { asset } from '../lib/assets'
import ValueTimeline from '../components/ValueTimeline'
import styles from './About.module.css'

export default function About() {
  const root = useRef<HTMLElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-rise]', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-copy]', start: 'top 80%', once: true },
      })

      const counter = { v: 0 }
      gsap.to(counter, {
        v: 20,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v))
        },
        scrollTrigger: { trigger: countRef.current, start: 'top 90%', once: true },
      })

      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className={styles.about} ref={root}>
      <Background variant="about" src={asset('bg-about')} />
      <div className={styles.visual} aria-hidden="true" />

      <div className={styles.copy} data-copy>
        <div data-rise>
          <Eyebrow>ABOUT ME</Eyebrow>
        </div>
        <h2 className={styles.heading} data-rise>
          Beyond the <span className={styles.accent}>Code</span>
        </h2>
        <p className={styles.para} data-rise>
          I'm a software engineer who loves building AI-powered products and human-centered
          systems. I enjoy turning ideas into real-world solutions that create meaningful
          impact, combining technology, design and purpose.
        </p>

        <div className={styles.cards}>
          <GlassCard className={styles.card}>
            <div className={styles.cardInner} data-rise>
              <svg className={styles.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="13" width="4" height="8" rx="1" fill="#e5141c" />
                <rect x="10" y="8" width="4" height="13" rx="1" fill="#e5141c" />
                <rect x="17" y="3" width="4" height="18" rx="1" fill="#e5141c" />
              </svg>
              <div className={styles.num}>
                <span ref={countRef}>{reducedMotion ? 20 : 0}</span>+
              </div>
              <div className={styles.label}>Projects &amp; Experiments</div>
            </div>
          </GlassCard>
          <GlassCard className={styles.card}>
            <div className={styles.cardInner} data-rise>
              <div className={styles.caps}>AI • SOFTWARE • SYSTEMS</div>
              <div className={styles.label}>
                Building at the intersection of technology and real world impact.
              </div>
            </div>
          </GlassCard>
        </div>

        <ValueTimeline />
      </div>
    </section>
  )
}
