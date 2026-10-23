export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} width="58" height="18" viewBox="0 0 58 18" fill="currentColor" role="img" aria-label="Prabhav logo">
      <path d="M0 17 16 2h8L9 17z" />
      <path d="M19 17 29 5.5 39 17z" />
      <path d="M34 2h8l16 15h-9z" />
    </svg>
  )
}
