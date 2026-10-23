import type { ReactNode } from 'react'
import s from './Eyebrow.module.css'

export default function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`${s.eyebrow} ${className}`}>
      <span>{children}</span>
      <span className={s.line} aria-hidden="true" />
    </p>
  )
}
