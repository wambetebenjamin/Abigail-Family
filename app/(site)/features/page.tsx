import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'
import FeatureMockup from '@/components/features/FeatureMockup'
import CtaBand from '@/components/site/CtaBand'
import FeatureIcon from '@/components/site/FeatureIcon'
import Reveal from '@/components/site/Reveal'
import SectionHeading from '@/components/site/SectionHeading'
import { cardSizes, photos } from '@/lib/images'
import { features } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Shared calendar, expense tracker, handover logs, secure messaging, document vault and a private progress journal. See how each Abigail Family tool works.',
}

const variantBySlug = {
  'shared-calendar': 'calendar',
  'expense-tracker': 'wallet',
  'handover-logs': 'handshake',
  'secure-messaging': 'messages',
  'document-vault': 'vault',
  'progress-journal': 'journal',
} as const

export default function FeaturesPage() {
  return (
    <>
      <section className="bg-surface py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            as="h1"
            align="left"
            label="Features"
            title="Every tool, one shared space"
            intro="Abigail Family is deliberately small. Six tools that cover the hard parts of co-parenting, built to be used on a phone in a school car park, not studied like software."
          />
          <nav aria-label="Feature sections" className="mt-6 flex flex-wrap gap-2">
            {features.map((feature) => (
              <a
                key={feature.slug}
                href={`#${feature.slug}`}
                className="flex min-h-[44px] items-center rounded-full border border-line bg-white px-4 text-xs font-semibold text-slatedeep transition hover:border-primary hover:text-primary"
              >
                {feature.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {features.map((feature, index) => {
        const photo = photos[feature.image]
        const reversed = index % 2 === 1
        return (
          <section
            key={feature.slug}
            id={feature.slug}
            className={`scroll-mt-24 py-12 sm:py-14 lg:py-16 ${index % 2 === 1 ? 'bg-white' : 'bg-surface'}`}
          >
            <div className="container-page grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <Reveal
                direction={reversed ? 'right' : 'left'}
                className={reversed ? 'lg:order-2' : 'lg:order-1'}
              >
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-line">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={cardSizes}
                      className="object-cover"
                    />
                  </div>
                  <FeatureMockup variant={variantBySlug[feature.slug as keyof typeof variantBySlug]} />
                </div>
              </Reveal>

              <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <FeatureIcon name={feature.icon} className="h-6 w-6" />
                </span>
                <h2 className="section-title mt-4 text-2xl sm:text-3xl">{feature.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {feature.description}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-slatedeep">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/register" className="btn btn-primary w-full sm:w-auto">
                    Start free
                  </Link>
                  <Link href="/pricing" className="btn btn-outline w-full sm:w-auto">
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl text-ink sm:text-2xl">Built around the child, not the dispute</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Every feature stores the minimum it needs. There are no public profiles, no
                  scoring, no features that let one parent monitor the other. Your private journal is
                  visible only to you, and child data is handled under the Kenya Data Protection Act
                  2019.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link href="/legal/privacy-policy" className="btn btn-outline w-full sm:w-auto">
                    Read the privacy policy
                  </Link>
                  <Link href="/about" className="btn btn-outline w-full sm:w-auto">
                    Why we built this
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="A steadier week starts with one shared calendar"
        body="Try the free plan with your co-parent, or keep your own record until they are ready to join."
      />
    </>
  )
}
