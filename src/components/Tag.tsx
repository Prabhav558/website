import type { ReactNode } from 'react'
import s from './Tag.module.css'

export default function Tag({ children }: { children: ReactNode }) {
  return <li className={s.tag}>{children}</li>
}
