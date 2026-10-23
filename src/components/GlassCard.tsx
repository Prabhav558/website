import { forwardRef, createElement, type ReactNode, type JSX } from 'react'
import s from './GlassCard.module.css'

interface Props {
  children?: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const GlassCard = forwardRef<HTMLElement, Props>(function GlassCard({ children, className = '', as = 'div' }, ref) {
  return createElement(as, { ref, className: `${s.card} ${className}` }, children)
})
export default GlassCard
