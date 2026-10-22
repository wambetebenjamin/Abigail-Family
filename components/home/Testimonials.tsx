'use client'

import Image from 'next/image'
import { Quote } from 'lucide-react'
import Reveal from '@/components/site/Reveal'
import { portraitSizes, photos } from '@/lib/images'
import { testimonials } from '@/lib/content'

export default function Testimonials() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
      {testimonials.map((testimonial, index) => {
        const photo = photos[testimonial.photo]
        return (
          <Reveal
            key={testimonial.name}
            delay={index * 0.08}
            direction={testimonial.direction}
            className="h-full"
          >
            <figure className="card flex h-full flex-col p-5 sm:p-6">
              <Quote className="h-7 w-7 text-primary/35" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slatedeep sm:text-base">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={portraitSizes}
                    className="object-cover"
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{testimonial.name}</span>
                  <span className="block text-xs text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        )
      })}
    </div>
  )
}
