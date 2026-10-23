import { useState, type FormEvent } from 'react'
import PillButton from './PillButton'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'sending' | 'success' | 'error'
type Errors = { name?: string; email?: string; message?: string }

const EMAIL = 'prabhavsingh@example.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [note, setNote] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const botcheck = fd.get('botcheck') === 'on'

    const next: Errors = {}
    if (!name) next.name = 'Please enter your name.'
    if (!email) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(email)) next.email = 'Please enter a valid email address.'
    if (!message) next.message = 'Please tell me a little about your idea.'
    setErrors(next)
    if (Object.keys(next).length) return

    if (botcheck) {
      setStatus('success')
      form.reset()
      return
    }

    const key = (import.meta.env as Record<string, string | undefined>).VITE_WEB3FORMS_KEY
    if (!key) {
      setNote('Form not configured yet — email me directly:')
      setStatus('error')
      return
    }

    setNote('')
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          name,
          email,
          message,
          subject: 'New portfolio message',
          botcheck: false,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean }
      if (!res.ok || data.success === false) throw new Error('failed')
      setStatus('success')
      form.reset()
    } catch {
      setNote('Something went wrong sending your message. Email me directly:')
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <input
        type="checkbox"
        name="botcheck"
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.field} data-field>
        <label htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
        />
        {errors.name && <p id="cf-name-err" className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.field} data-field>
        <label htmlFor="cf-email">Email</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-err' : undefined}
        />
        {errors.email && <p id="cf-email-err" className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.field} data-field>
        <label htmlFor="cf-message">What are you building?</label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          placeholder="Tell me about your idea..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
        />
        {errors.message && <p id="cf-message-err" className={styles.error}>{errors.message}</p>}
      </div>

      <div data-field>
        <PillButton type="submit" arrow full disabled={sending} className={styles.submit}>
          {sending ? 'SENDING…' : 'SEND MESSAGE'}
        </PillButton>
      </div>

      <div aria-live="polite">
        {status === 'success' && (
          <p className={styles.success}>Thanks! Your message is on its way. I will get back to you soon.</p>
        )}
        {status === 'error' && (
          <p className={styles.errorNote}>
            {note} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        )}
      </div>
    </form>
  )
}
