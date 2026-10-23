import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'
import Background from './Background'
import { asset } from '../lib/assets'
import Tag from './Tag'
import ArrowButton from './ArrowButton'
import type { Project } from '../data/projects'
import styles from './ProjectCard.module.css'

interface Props {
  project: Project
  /** Index used to vary the placeholder glow composition. */
  index: number
}

export default function ProjectCard({ project, index }: Props) {
  const cardRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const card = cardRef.current
    const img = imgRef.current
    const arrow = arrowRef.current
    if (!card || !img || !arrow) return

    const ctx = gsap.context(() => {
      const lift = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' })
      const imgScale = gsap.quickTo(img, 'scale', { duration: 0.8, ease: 'power3.out' })
      const ax = gsap.quickTo(arrow, 'x', { duration: 0.4, ease: 'power3.out' })
      const ay = gsap.quickTo(arrow, 'y', { duration: 0.4, ease: 'power3.out' })

      const enter = () => {
        lift(-6)
        imgScale(1.05)
        arrow.classList.add(styles.arrowHot)
      }
      const leave = () => {
        lift(0)
        imgScale(1)
        ax(0)
        ay(0)
        arrow.classList.remove(styles.arrowHot)
      }
      const move = (e: PointerEvent) => {
        const r = arrow.getBoundingClientRect()
        const cx = r.left + r.width / 2 - ((gsap.getProperty(arrow, 'x') as number) || 0)
        const cy = r.top + r.height / 2 - ((gsap.getProperty(arrow, 'y') as number) || 0)
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        if (Math.hypot(dx, dy) < 140) {
          ax(dx * 0.3)
          ay(dy * 0.3)
        } else {
          ax(0)
          ay(0)
        }
      }
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      card.addEventListener('pointermove', move)
      return () => {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
        card.removeEventListener('pointermove', move)
      }
    }, card)
    return () => ctx.revert()
  }, [])

  return (
    <article ref={cardRef} className={`${styles.card} project-card`}>
      <div className={styles.media}>
        <div ref={imgRef} className={styles.mediaInner}>
          {(() => {
            const src = project.image ?? asset(`project-${project.title.toLowerCase()}`)
            return <Background variant="card" src={src} className={src ? undefined : styles[`glow${index % 3}`]} />
          })()}
        </div>
        <div className={styles.mediaFade} aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <span className={styles.number}>{project.number}</span>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.row}>
          <p className={styles.desc}>{project.description}</p>
          <div ref={arrowRef} className={styles.arrow}>
            <ArrowButton variant="red" href={project.href ?? '#'} label={`View ${project.title}`} />
          </div>
        </div>
        <ul className={styles.tags}>
          {project.tags.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
