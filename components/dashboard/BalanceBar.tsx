'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { formatKes } from '@/lib/dates'

export default function BalanceBar({
  paidByYou,
  paidByPartner,
  balance,
  yourName,
  partnerName,
}: {
  paidByYou: number
  paidByPartner: number
  balance: number
  yourName: string
  partnerName: string
}) {
  const reduce = useReducedMotion()
  const total = paidByYou + paidByPartner
  const yourShare = total > 0 ? (paidByYou / total) * 100 : 50
  const settled = Math.abs(balance) < 1

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="section-label">Shared balance</p>
          <p className="mt-1 font-display text-2xl text-ink sm:text-3xl">
            {settled
              ? 'All square'
              : balance > 0
                ? `${partnerName} owes you ${formatKes(Math.abs(balance))}`
                : `You owe ${partnerName} ${formatKes(Math.abs(balance))}`}
          </p>
        </div>
        <p className="text-xs text-muted">
          {formatKes(paidByYou)} by {yourName.split(' ')[0]} · {formatKes(paidByPartner)} by{' '}
          {partnerName.split(' ')[0]}
        </p>
      </div>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-sky/30"
        role="img"
        aria-label={`${Math.round(yourShare)} percent of shared costs paid by you, ${Math.round(100 - yourShare)} percent by your co-parent`}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${Math.round(yourShare)}%` }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <span>You {Math.round(yourShare)}%</span>
        <span>{partnerName.split(' ')[0]} {Math.round(100 - yourShare)}%</span>
      </div>
    </div>
  )
}
