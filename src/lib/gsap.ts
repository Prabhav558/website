import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const reducedMotion: boolean =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * useGSAP-style helper: runs `setup` inside a gsap.context scoped to `scope`
 * and reverts everything (tweens, ScrollTriggers, SplitText) on cleanup.
 * Does nothing at all under prefers-reduced-motion, so content stays visible.
 */
export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context((c) => setup(c), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export { gsap, ScrollTrigger, SplitText }
