import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappHref } from '@/lib/site'

export default function CtaBand({
  title = 'Take the first calm step today',
  body = 'Create your family account, add one event, and invite your co-parent when you are ready. The free plan stays free.',
  primaryLabel = 'Create a Family Account',
  primaryHref = '/register',
}: {
  title?: string
  body?: string
  primaryLabel?: string
  primaryHref?: string
}) {
  return (
    <section className="relative overflow-hidden bg-charcoal py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-sky/20 blur-3xl"
      />
      <div className="container-page relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="section-title text-2xl text-white sm:text-3xl lg:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4 lg:w-auto">
          <Link href={primaryHref} className="btn btn-primary w-full sm:w-auto">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light-outline w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}
