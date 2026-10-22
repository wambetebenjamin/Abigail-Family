'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const offset =
    direction === 'left' ? { x: -36, y: 0 } : direction === 'right' ? { x: 36, y: 0 } : { x: 0, y: 22 }
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerGroup({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
