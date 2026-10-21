import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeartHandshake, MessageCircle, Scale, ShieldCheck } from 'lucide-react'
import CtaBand from '@/components/site/CtaBand'
import EnquiryForm from '@/components/site/EnquiryForm'
import Reveal from '@/components/site/Reveal'
import SectionHeading from '@/components/site/SectionHeading'
import { cardSizes, portraitSizes, photos } from '@/lib/images'
import { values } from '@/lib/content'
import { site, whatsappDisplay, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Abigail Family exists, how we protect children and families, and the small Nairobi team building a calmer way for separated parents to coordinate.',
}

const team = [
  {
    name: 'Emmanuel Kiptoo',
    role: 'Co-founder, product',
    photo: 'teamEmmanuel' as const,
    bio: 'A father of two in Nairobi who spent three years coordinating school runs through screenshots and group chats. Emmanuel leads product design.',
  },
  {
    name: 'Grace Achieng',
    role: 'Head of family support',
    photo: 'teamGrace' as const,
    bio: 'A trained counsellor who has worked with families navigating separation in Kisumu and Nairobi. Grace writes our guidance and answers the hard messages.',
  },
  {
    name: 'Samuel Kariuki',
    role: 'Co-founder, engineering',
    photo: 'teamSamuel' as const,
    bio: 'Builds the platform and the privacy controls behind it. Samuel is the reason child data never leaves the family space it belongs to.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface py-12 sm:py-14 lg:py-16">
        <div className="container-page grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              as="h1"
              align="left"
              label="About us"
              title="Built for the ordinary week, not the courtroom"
              intro="Abigail Family started with a simple observation: most co-parenting tools are built for conflict, with features that feel like evidence gathering. We wanted the opposite, a quiet space where two parents can simply get the week right for their child."
            />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We are a small team in Nairobi, working with separated and never-married parents across
              Kenya. Our measure of success is not time spent in the app. It is a Sunday evening where
              nobody has to argue about who is collecting the children on Monday.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn btn-primary w-full sm:w-auto">
                Create a Family Account
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Talk to a human
              </a>
            </div>
          </div>
          <Reveal direction="right">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-line">
              <Image
                src={photos.generations.src}
                alt={photos.generations.alt}
                fill
                sizes={cardSizes}
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            label="Our mission"
            title="Raising children together, apart"
            intro="Separation ends a relationship, not a childhood. Our mission is to make the practical side of shared parenting calm enough that the child never has to carry it."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                icon: HeartHandshake,
                title: 'Child first, always',
                body: 'Every feature is tested against one question: does this help the child, or does it help one parent win?',
              },
              {
                icon: Scale,
                title: 'Factual, never legal',
                body: 'We give you clear records and clear language. We do not give legal advice, and we say so plainly.',
              },
              {
                icon: ShieldCheck,
                title: 'Private by default',
                body: 'Journals are private, documents are access controlled, and family data is never sold or used for advertising.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="card p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-lg text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            label="What we will not build"
            title="Four promises we keep in the product"
            intro="These are not marketing lines. They are constraints we hold each other to when we design."
          />
          <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <li key={value.title} className="rounded-md border border-line bg-white p-5">
                <p className="text-sm font-semibold text-ink">{value.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeading
            label="The team"
            title="Small team, close to the families we serve"
            intro="Based in Nairobi and Eldoret, with a support line in Swahili and English."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => {
              const photo = photos[member.photo]
              return (
                <Reveal key={member.name} delay={index * 0.08}>
                  <article className="card h-full overflow-hidden">
                    <div className="relative aspect-[4/5] w-full bg-surface">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={portraitSizes}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg text-ink">{member.name}</h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                        {member.role}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{member.bio}</p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-surface py-12 sm:py-14 lg:py-16">
        <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              align="left"
              label="Talk to us"
              title="Ask us anything, including the awkward questions"
              intro="Whether you are deciding if this is right for your family, or you need help with a data request, we read every message ourselves."
            />
            <ul className="mt-5 space-y-2 text-sm text-slatedeep">
              <li>
                <span className="font-semibold text-ink">WhatsApp:</span>{' '}
                <a href={whatsappHref} className="text-primary underline underline-offset-2">
                  {whatsappDisplay}
                </a>
              </li>
              <li>
                <span className="font-semibold text-ink">Email:</span>{' '}
                <a href={`mailto:${site.email}`} className="text-primary underline underline-offset-2">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="font-semibold text-ink">Data protection:</span>{' '}
                <a
                  href="mailto:dpo@abigailfamily.co.ke"
                  className="text-primary underline underline-offset-2"
                >
                  dpo@abigailfamily.co.ke
                </a>
              </li>
              <li>
                <span className="font-semibold text-ink">Office:</span> {site.location}. Visits by
                appointment.
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              We cannot give legal advice or mediate a dispute. If you are in danger, contact the
              Kenya Police Service or the national child helpline 116 immediately.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
