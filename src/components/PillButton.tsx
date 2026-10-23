import type { ReactNode } from 'react'
import { useSmoothScroll } from '../lib/smooth-scroll'
import { ArrowRight } from './Icons'
import s from './PillButton.module.css'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  arrow?: boolean
  full?: boolean
  disabled?: boolean
  className?: string
}

export default function PillButton({ children, href, onClick, type = 'button', arrow, full, disabled, className = '' }: Props) {
  const { scrollTo } = useSmoothScroll()
  const cls = `${s.pill} ${full ? s.full : ''} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight size={15} />}
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault()
            scrollTo(href)
          }
          onClick?.()
        }}
      >
        {inner}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}
