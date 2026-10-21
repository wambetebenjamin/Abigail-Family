import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import ChildFirst from '@/components/home/ChildFirst'
import Faq from '@/components/home/Faq'
import FeatureGrid from '@/components/home/FeatureGrid'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import CtaBand from '@/components/site/CtaBand'
import SectionHeading from '@/components/site/SectionHeading'
import { whatsappHref } from '@/lib/site'

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="border-b border-line bg-surface">
        <div className="container-page grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { value: 'One', label: 'shared space for both parents' },
            { value: 'Six', label: 'coordination tools in one place' },
            { value: 'KDPA', label: '2019 aligned child data protection' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-baseline gap-3 px-2 py-5 sm:justify-center sm:px-6"
            >
              <span className="font-display text-2xl text-primary sm:text-3xl">{item.value}</span>
              <span className="text-xs leading-snug text-muted sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20" aria-labelledby="features-heading">
        <div className="container-page">
          <h2 id="features-heading" className="sr-only">
            Platform features
          </h2>
          <SectionHeading
            label="Built for the week ahead"
            title="Everything you need to coordinate, nothing you do not"
            intro="Six practical tools, one shared family space. Each one exists because a parent told us the current way was costing them sleep."
          />
          <FeatureGrid showLinks />
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            label="How it works"
            title="Three calm steps to a steadier week"
            intro="No paperwork marathon. No mediation appointment. Just a shared space you can set up before the school run."
          />
          <HowItWorks />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn btn-primary w-full sm:w-auto">
              Start with the free plan
            </Link>
            <Link href="/features" className="btn btn-outline w-full sm:w-auto">
              See every feature
            </Link>
          </div>
        </div>
      </section>

      <ChildFirst />

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            label="From parents"
            title="Families who found a calmer rhythm"
            intro="Three parents, three different situations. The thing they share is a child they both love."
          />
          <Testimonials />
          <p className="mt-6 text-center text-xs text-muted">
            Names have been shortened to protect family privacy.
          </p>
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            label="Questions parents ask"
            title="Clear answers, before you sign up"
            intro="Privacy, legal standing and everyday use, explained without legal jargon."
          />
          <Faq />
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-md border border-line bg-white p-5 sm:flex-row">
            <p className="text-sm text-slatedeep">
              Still unsure? Ask us anything, including the awkward questions.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full shrink-0 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
