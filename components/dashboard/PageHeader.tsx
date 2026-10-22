import Link from 'next/link'
import type { ReactNode } from 'react'

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: { href: string; label: string } | ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl text-ink sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action && typeof action === 'object' && 'href' in action ? (
        <Link href={action.href} className="btn btn-primary w-full sm:w-auto">
          {action.label}
        </Link>
      ) : (
        action
      )}
    </div>
  )
}
