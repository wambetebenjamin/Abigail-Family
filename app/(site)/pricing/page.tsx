import type { Metadata } from 'next'
import Link from 'next/link'
import { CreditCard, HelpCircle, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react'
import CtaBand from '@/components/site/CtaBand'
import PlanCards from '@/components/pricing/PlanCards'
import SectionHeading from '@/components/site/SectionHeading'
import { whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Start free with a shared calendar and secure messaging, or take the full Family Plan for KSh 799 a month with expenses, handovers, documents and the journal.',
}

const notes = [
  {
    icon: Smartphone,
    title: 'Pay with M-Pesa',
    body: 'The Family Plan is billed in Kenya shillings and can be paid by M-Pesa or card. Annual billing includes two months free.',
  },
  {
    icon: ShieldCheck,
    title: 'No card to start',
    body: 'The free plan needs no payment details at all. Use it for as long as it serves your family.',
  },
  {
    icon: CreditCard,
    title: 'One plan, one family',
    body: 'Your co-parent joins at no extra cost. A family is two parents and their children, not per seat billing.',
  },
  {
    icon: HelpCircle,
    title: 'Money is tight?',
    body: 'If the fee is the thing standing between your child and a calmer week, message us on WhatsApp. We keep a small number of supported places.',
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="bg-surface py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            as="h1"
            label="Pricing"
            title="Simple pricing, no surprises"
            intro="Start free with the calendar and messaging. Add the full coordination toolkit when it makes sense for your family."
          />
          <div className="mt-8">
            <PlanCards />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            label="Good to know"
            title="The small print, in plain language"
            intro="No lock-in, no hidden extras, no selling of family data. Ever."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {notes.map((note) => {
              const Icon = note.icon
              return (
                <div key={note.title} className="card p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-sky-soft text-sky">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-lg text-ink">{note.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{note.body}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-md border border-line bg-surface p-5 sm:flex-row">
            <p className="text-sm text-slatedeep">
              Not sure which plan fits? Ask us. We would rather you start on the free plan than pay
              for something you do not need.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full shrink-0 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask a question
            </a>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Prices are in Kenya shillings and include VAT. Read the{' '}
            <Link href="/legal/terms" className="text-primary underline underline-offset-2">
              terms of use
            </Link>{' '}
            for billing and cancellation details.
          </p>
        </div>
      </section>

      <CtaBand
        title="Start free today"
        body="The shared calendar and secure messaging are free forever. Add the rest when you are ready."
      />
    </>
  )
}
