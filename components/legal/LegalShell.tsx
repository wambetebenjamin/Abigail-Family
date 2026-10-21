import Link from 'next/link'
import { Scale } from 'lucide-react'
import { legalLinks, site, whatsappHref } from '@/lib/site'

const updated = '21 October 2026'

export default function LegalShell({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface py-10 sm:py-12 lg:py-16">
      <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="section-label">Legal</p>
          <h1 className="mt-1 text-2xl text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-xs text-muted">Last updated {updated}</p>
          <nav aria-label="Legal documents" className="mt-5">
            <ul className="space-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center rounded border border-transparent px-2 text-sm text-slatedeep transition hover:border-line hover:bg-white hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-5 rounded border border-line bg-white p-4">
            <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Questions about this document? Write to{' '}
              <a href={`mailto:dpo@${site.url.replace('https://', '')}`} className="text-primary">
                our data protection contact
              </a>{' '}
              or message us on{' '}
              <a href={whatsappHref} className="text-primary">
                WhatsApp
              </a>
              .
            </p>
          </div>
        </aside>

        <article className="rounded-lg border border-line bg-white p-5 sm:p-8">
          <p className="text-sm leading-relaxed text-slatedeep">{intro}</p>
          <div className="prose-legal mt-4">{children}</div>
        </article>
      </div>
    </section>
  )
}
