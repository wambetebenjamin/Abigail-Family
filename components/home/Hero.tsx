'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { heroSizes, photos } from '@/lib/images'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src={photos.heroFamily.src}
          alt={photos.heroFamily.alt}
          fill
          priority
          sizes={heroSizes}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/65 to-charcoal/85" />
      </div>

      <div className="container-page relative flex min-h-[560px] flex-col justify-center py-16 sm:min-h-[600px] sm:py-20 lg:min-h-[660px] lg:py-24">
        <motion.div
          className="max-w-3xl"
          initial={reduce ? false : 'hidden'}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            For separated parents in Kenya
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={0.1}
            className="mt-6 text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Co-parenting made calmer
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg"
          >
            Less conflict, fewer missed pick-ups, no more arguments about money. Abigail Family gives
            you one shared space to coordinate the practical parts of parenting, so your child stays
            at the centre of every decision.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.3}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Link href="/register" className="btn btn-primary w-full sm:w-auto">
              Create a Family Account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/features" className="btn btn-light-outline w-full sm:w-auto">
              See how it works
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={0.4}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/65"
          >
            <span>Free to start</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
            <span>No court forms required</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
            <span>Built for Kenyan families</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
