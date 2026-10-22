import type { ReactNode } from 'react'

type SectionHeadingProps = {
  label?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
  as?: 'h1' | 'h2'
}

export default function SectionHeading({
  label,
  title,
  intro,
  align = 'center',
  tone = 'dark',
  className = '',
  as = 'h2',
}: SectionHeadingProps) {
  const Heading = as
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'
  return (
    <div className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {label ? (
        <span className={`section-label ${tone === 'light' ? 'text-primary' : ''}`}>{label}</span>
      ) : null}
      <Heading
        className={`section-title mt-2 text-2xl sm:text-3xl lg:text-4xl ${
          tone === 'light' ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </Heading>
      {intro ? (
        <p
          className={`mt-3 text-sm leading-relaxed sm:text-base ${
            tone === 'light' ? 'text-white/75' : 'text-muted'
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}
