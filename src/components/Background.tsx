import { forwardRef, type ReactNode } from 'react'
import s from './Background.module.css'

interface Props {
  /** Image URL (see src/lib/assets.ts for the named slots). Falls back to the CSS placeholder. */
  src?: string
  variant: 'hero' | 'projects' | 'about' | 'contact' | 'card'
  className?: string
  children?: ReactNode
}

/**
 * Fills its positioned parent. The ref points at the inner layer (oversized vertically
 * by 8% on non-card variants) so sections can parallax it with yPercent (keep |yPercent| <= 6).
 */
const Background = forwardRef<HTMLDivElement, Props>(function Background({ src, variant, className = '', children }, ref) {
  const isCard = variant === 'card'
  return (
    <div className={s.root} aria-hidden="true">
      <div
        ref={ref}
        data-bg
        data-variant={variant}
        className={`${s.layer} ${isCard ? s.cardLayer : ''} ${src ? s.hasImg : `${s.placeholder} ${s[variant]}`} ${className}`}
        style={src ? { backgroundImage: `url(${src})` } : undefined}
      />
      {!isCard && variant !== 'hero' && <div className={s.fadeTop} />}
      <div className={isCard ? s.fadeCard : `${s.fadeBottom} ${variant === 'hero' ? s.fadeBottomHero : ''}`} />
      {children}
    </div>
  )
})
export default Background
