import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Logo from '@/components/site/Logo'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { whatsappDisplay, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex flex-1 items-center bg-surface py-16">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <Logo className="justify-center" />
            <p className="mt-8 font-display text-6xl text-primary sm:text-7xl">404</p>
            <h1 className="mt-2 text-2xl text-ink sm:text-3xl">This page has moved on</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              The link you followed does not exist any more. Nothing is wrong with your account, and
              nothing has been lost. Let us take you back to somewhere useful.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="btn btn-primary w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to the homepage
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {whatsappDisplay}
              </a>
            </div>
            <nav aria-label="Helpful links" className="mt-8">
              <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
                {[
                  { href: '/features', label: 'Features' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/about', label: 'About' },
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/legal/privacy-policy', label: 'Privacy' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-[44px] items-center text-slatedeep underline underline-offset-4 transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
