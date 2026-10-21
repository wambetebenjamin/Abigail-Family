type LogoProps = {
  tone?: 'dark' | 'light'
  className?: string
  showWordmark?: boolean
}

export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Abigail Family mark: two parents circling a child"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="24" r="11" stroke="#f86f2d" strokeWidth="2.2" opacity="0.9" />
      <circle cx="32" cy="24" r="11" stroke="#78d5ef" strokeWidth="2.2" opacity="0.9" />
      <circle cx="24" cy="24" r="5.2" fill="#f86f2d" />
      <circle cx="24" cy="24" r="5.2" stroke="#fff" strokeWidth="1.4" />
    </svg>
  )
}

export default function Logo({ tone = 'dark', className = '', showWordmark = true }: LogoProps) {
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {showWordmark ? (
        <span className="leading-none">
          <span
            className={`block font-display text-lg font-medium uppercase tracking-[0.14em] sm:text-xl ${titleColor}`}
          >
            Abigail
          </span>
          <span className="block text-[0.6rem] font-medium uppercase tracking-[0.4em] text-primary">
            Family
          </span>
        </span>
      ) : null}
    </span>
  )
}
