import { useSmoothScroll } from '../lib/smooth-scroll'
import { ArrowRight, ArrowUpRight } from './Icons'
import s from './ArrowButton.module.css'

interface Props {
  href?: string
  label: string
  variant?: 'light' | 'red'
  onClick?: () => void
  className?: string
}

export default function ArrowButton({ href, label, variant = 'light', onClick, className = '' }: Props) {
  const { scrollTo } = useSmoothScroll()
  const cls = `${s.btn} ${variant === 'red' ? s.red : s.light} ${className}`
  const icon = variant === 'red' ? <ArrowRight size={16} /> : <ArrowUpRight size={15} />
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={label}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault()
            if (href.length > 1) scrollTo(href)
          }
          onClick?.()
        }}
      >
        {icon}
      </a>
    )
  }
  return (
    <button type="button" className={cls} aria-label={label} onClick={onClick}>
      {icon}
    </button>
  )
}
