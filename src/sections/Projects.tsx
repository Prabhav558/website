import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'
import { PORTAL_MQ } from '../lib/portal'
import Background from '../components/Background'
import { asset } from '../lib/assets'
import Eyebrow from '../components/Eyebrow'
import ProjectCard from '../components/ProjectCard'
import { projects, projectsIntro } from '../data/projects'
import styles from './Projects.module.css'

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // On desktop the Portal timeline drives this entrance as part of the ring fly-through
    if (reducedMotion || window.matchMedia(PORTAL_MQ).matches) return
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal="header"]', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      })
      gsap.from('.project-card', {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '[data-reveal="grid"]', start: 'top 85%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={rootRef} className={styles.section}>
      <Background variant="projects" src={asset('bg-projects')} />
      <div className={styles.fadeTop} aria-hidden="true" />
      <div className={styles.fadeBottom} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headLeft}>
            <div data-reveal="header">
              <Eyebrow>{projectsIntro.eyebrow}</Eyebrow>
            </div>
            <h2 className={styles.title} data-reveal="header">
              {projectsIntro.title}
              <span className={styles.accent}>{projectsIntro.titleAccent}</span>
            </h2>
            <p className={styles.sub} data-reveal="header">
              {projectsIntro.sub}
            </p>
          </div>
          <p className={styles.aside} data-reveal="header">
            {projectsIntro.aside}
          </p>
        </header>
        <div className={styles.grid} data-reveal="grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
