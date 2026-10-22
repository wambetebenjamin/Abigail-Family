'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import FeatureIcon from '@/components/site/FeatureIcon'
import { features } from '@/lib/content'

export default function FeatureGrid({ showLinks = false }: { showLinks?: boolean }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {features.map((feature) => (
        <motion.article
          key={feature.slug}
          variants={{
            hidden: { opacity: 0, y: 26 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
          }}
          className="card card-hover flex flex-col p-5 sm:p-6"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-soft text-primary">
            <FeatureIcon name={feature.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg text-ink sm:text-xl">{feature.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{feature.short}</p>
          {showLinks ? (
            <Link
              href={`/features#${feature.slug}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
            >
              Explore this feature
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </motion.article>
      ))}
    </motion.div>
  )
}
