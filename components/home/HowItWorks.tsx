'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { steps } from '@/lib/content'

export default function HowItWorks() {
  const scope = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const line = scope.current?.querySelector('.step-connector')
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: scope.current, start: 'top 72%' },
          },
        )
      }
      gsap.from('.step-card', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope.current, start: 'top 75%' },
      })
    }, scope)

    return () => context.revert()
  }, [])

  return (
    <div ref={scope} className="relative mt-10">
      <div
        aria-hidden="true"
        className="step-connector absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-primary/20 via-primary to-primary/20 lg:block"
      />
      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {steps.map((step) => (
          <li key={step.number} className="step-card relative">
            <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full border border-primary/20 bg-white">
              <span className="font-display text-2xl text-primary">{step.number}</span>
            </div>
            <h3 className="mt-5 text-lg text-ink sm:text-xl">{step.title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
