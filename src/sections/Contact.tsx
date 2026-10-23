import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'
import Background from '../components/Background'
import { asset } from '../lib/assets'
import Eyebrow from '../components/Eyebrow'
import GlassCard from '../components/GlassCard'
import ContactForm from '../components/ContactForm'
import styles from './Contact.module.css'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top 65%', once: true }
      gsap.from('[data-left] > *', {
        x: -40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: st,
      })
      gsap.from('[data-card]', {
        x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: st,
      })
      gsap.from('[data-card] [data-field]', {
        y: 16, opacity: 0, duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'power3.out', scrollTrigger: st,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={root} className={styles.section}>
      <Background variant="contact" src={asset('bg-contact')} />
      <div className={styles.topFade} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.left} data-left>
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <h2 className={styles.title}>
            Let&rsquo;s build something
            <br />
            <span className={styles.red}>meaningful.</span>
          </h2>
          <p className={styles.sub}>
            I&rsquo;m always open to discussing new opportunities, interesting ideas or potential collaborations.
          </p>
          <GlassCard className={styles.emailCard}>
            <a className={styles.emailLink} href="mailto:prabhavsingh@example.com">
              <svg
                className={styles.mail}
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
              <span className={styles.emailText}>
                <span className={styles.emailLabel}>Email</span>
                <span className={styles.emailValue}>prabhavsingh@example.com</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>
          </GlassCard>
        </div>

        <div className={styles.formWrap} data-card>
          <GlassCard className={styles.formCard}>
            <ContactForm />
          </GlassCard>
        </div>
      </div>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Prabhav Singh. Built with care.
      </footer>
    </section>
  )
}
