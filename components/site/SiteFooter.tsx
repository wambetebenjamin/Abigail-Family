import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react'
import Logo from '@/components/site/Logo'
import { legalLinks, site, whatsappDisplay, whatsappHref } from '@/lib/site'

const platformLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/register', label: 'Create a family account' },
  { href: '/login', label: 'Log in' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            A shared space for separated parents in Kenya: calmer coordination, clearer money, and
            children who always come first.
          </p>
          <p className="mt-4 font-display text-sm uppercase tracking-[0.12em] text-primary">
            {site.tagline}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abigail Family on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-primary hover:text-primary"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abigail Family on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abigail Family on LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-primary hover:text-primary"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="relative mb-6 font-display text-sm font-medium uppercase tracking-[0.16em] text-white after:absolute after:-bottom-3 after:left-0 after:h-px after:w-16 after:bg-white/40">
            Platform
          </h2>
          <ul className="space-y-2">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="relative mb-6 font-display text-sm font-medium uppercase tracking-[0.16em] text-white after:absolute after:-bottom-3 after:left-0 after:h-px after:w-16 after:bg-white/40">
            Legal
          </h2>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/legal/privacy-policy#children"
                className="flex min-h-[44px] items-center text-sm text-white/70 transition hover:text-white"
              >
                Child data protection
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="relative mb-6 font-display text-sm font-medium uppercase tracking-[0.16em] text-white after:absolute after:-bottom-3 after:left-0 after:h-px after:w-16 after:bg-white/40">
            Talk to us
          </h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center gap-3 transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" aria-hidden="true" />
                <span>
                  WhatsApp
                  <span className="block text-xs text-white/50">{whatsappDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-[44px] items-center gap-3 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{site.email}</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{site.location}</span>
            </li>
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-white/45">
            Abigail Family supports coordination. It does not provide legal advice and does not
            replace a court order or a lawyer.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-center text-xs text-white/50 sm:text-left">
            &copy; {new Date().getFullYear()} Abigail Family. Built in Nairobi for families across
            Kenya.
          </p>
          <p className="text-center text-xs text-white/50 sm:text-right">
            Registered data controller under the Kenya Data Protection Act 2019.
          </p>
        </div>
      </div>
    </footer>
  )
}
