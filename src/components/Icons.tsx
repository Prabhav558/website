const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const ArrowUpRight = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
)
export const MailIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 7 8.5-7" />
  </svg>
)
export const BarsIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...base} width={size} height={size} strokeWidth={2.2}>
    <path d="M6 20v-5M12 20V9M18 20V4" />
  </svg>
)
