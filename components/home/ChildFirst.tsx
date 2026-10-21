import Image from 'next/image'
import Link from 'next/link'
import { HeartHandshake } from 'lucide-react'
import SectionHeading from '@/components/site/SectionHeading'
import Reveal from '@/components/site/Reveal'
import { cardSizes, photos } from '@/lib/images'
import { values } from '@/lib/content'

export default function ChildFirst() {
  return (
    <section className="bg-surface py-14 sm:py-16 lg:py-20">
      <div className="container-page grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal direction="left" className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-line">
            <Image
              src={photos.generations.src}
              alt={photos.generations.alt}
              fill
              sizes={cardSizes}
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-md border border-primary/15 bg-white p-4">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-slatedeep">
              Our design rule is simple: if a feature could help one parent hurt the other, it does
              not ship.
            </p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            label="Child first"
            title="Everything we build starts with the child's wellbeing"
            intro="Separation is an adult decision. The childhood that follows is a shared responsibility. Abigail Family exists to make that responsibility easier to carry, calmly and with dignity for both parents."
          />
          <ul className="mt-6 space-y-4">
            {values.map((value) => (
              <li key={value.title} className="border-l-2 border-primary/25 pl-4">
                <p className="text-sm font-semibold text-ink">{value.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{value.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-outline mt-7 w-full sm:w-auto">
            Read our approach
          </Link>
        </div>
      </div>
    </section>
  )
}
