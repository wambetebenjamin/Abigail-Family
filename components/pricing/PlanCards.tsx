'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { pricingPlans } from '@/lib/content'

export default function PlanCards() {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex items-center rounded-full border border-line bg-white p-1"
        >
          <button
            type="button"
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={`min-h-[44px] rounded-full px-4 text-xs font-semibold uppercase tracking-[0.08em] transition ${
              annual ? 'text-slatedeep' : 'bg-primary text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={`min-h-[44px] rounded-full px-4 text-xs font-semibold uppercase tracking-[0.08em] transition ${
              annual ? 'bg-primary text-white' : 'text-slatedeep'
            }`}
          >
            Annual
          </button>
        </div>
        <p className="text-xs text-muted">
          Annual billing gives you two months free. Prices include VAT.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {pricingPlans.map((plan) => {
          const isFamily = plan.highlighted
          const price = isFamily && annual ? 'KSh 7,990' : plan.price
          const cadence = isFamily && annual ? 'per year' : plan.cadence
          return (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-lg border p-6 sm:p-7 ${
                isFamily
                  ? 'border-primary bg-white shadow-[0_28px_60px_-48px_rgba(248,111,45,0.9)]'
                  : 'border-line bg-white'
              }`}
            >
              {isFamily ? (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Most chosen
                </span>
              ) : null}

              <h2 className="text-xl text-ink sm:text-2xl">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-3xl text-ink sm:text-4xl">{price}</span>
                <span className="text-xs text-muted">{cadence}</span>
              </div>
              {isFamily && annual ? (
                <p className="mt-1 text-xs font-semibold text-leaf">
                  That works out at KSh 666 a month.
                </p>
              ) : null}

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slatedeep">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`${plan.href}${annual && isFamily ? (plan.href.includes('?') ? '&' : '?') + 'billing=annual' : ''}`}
                className={`btn mt-6 w-full ${isFamily ? 'btn-primary' : 'btn-outline'}`}
              >
                {plan.cta}
              </Link>
              <p className="mt-2 text-center text-[11px] text-muted">
                No card needed to start. Cancel any time.
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
