import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import { values } from '../data/values'
import styles from './ValueTimeline.module.css'

export default function ValueTimeline() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      const el = root.current!
      const line = el.querySelector<HTMLElement>('[data-line]')!
      const dots = gsap.utils.toArray<HTMLElement>('[data-dot]', el)
      const items = gsap.utils.toArray<HTMLElement>('[data-item]', el)
      const vertical = window.matchMedia('(max-width: 900px)').matches

      gsap.from(items, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })

      gsap.fromTo(
        line,
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 40%', scrub: true },
        },
      )

      dots.forEach((dot, i) => {
        gsap.fromTo(
          dot,
          { scale: 0.5, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: `top ${80 - (i / dots.length) * 40}%`,
              end: `top ${80 - ((i + 0.5) / dots.length) * 40}%`,
              scrub: true,
            },
          },
        )
      })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.timeline} ref={root}>
      <div className={styles.track} />
      <div className={styles.line} data-line />
      {values.map((v) => (
        <div className={styles.item} data-item key={v.title}>
          <span className={styles.dot} data-dot />
          <h3 className={styles.title}>{v.title}</h3>
          <p className={styles.text}>{v.text}</p>
        </div>
      ))}
    </div>
  )
}
