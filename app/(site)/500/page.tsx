import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Logo from '@/components/site/Logo'
import { whatsappDisplay, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Something went wrong',
  robots: { index: false, follow: false },
}

export default function ServerErrorPage() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <Logo className="justify-center" />
          <p className="mt-8 font-display text-6xl text-primary sm:text-7xl">500</p>
          <h1 className="mt-2 text-2xl text-ink sm:text-3xl">Something went wrong on our side</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            This is our fault, not yours. Your family data is safe. Please try again in a moment, or
            message us on WhatsApp and a person will help you straight away.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className="btn btn-primary w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the dashboard
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp {whatsappDisplay}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted">
            If WhatsApp is not convenient, email hello@abigailfamily.co.ke and we will reply within
            one working day.
          </p>
        </div>
      </div>
    </section>
  )
}
