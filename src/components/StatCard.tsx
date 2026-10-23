import type { ReactNode } from 'react'
import GlassCard from './GlassCard'
import ArrowButton from './ArrowButton'
import s from './StatCard.module.css'

interface Props {
  value: string
  label: string
  href?: string
  icon?: ReactNode
  showArrow?: boolean
}

export default function StatCard({ value, label, href, icon, showArrow = true }: Props) {
  return (
    <GlassCard className={s.card}>
      <div className={s.top}>
        <p className={s.value}>{value}</p>
        {icon && <span className={s.icon}>{icon}</span>}
      </div>
      <div className={s.bottom}>
        <p className={s.label}>{label}</p>
        {showArrow && <ArrowButton href={href} label={`${label}: view`} variant="light" />}
      </div>
    </GlassCard>
  )
}
