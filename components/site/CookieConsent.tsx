'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'abigail-family-cookie-consent'

type Preferences = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

const defaultChoices = { functional: true, analytics: false, marketing: false }

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [managing, setManaging] = useState(false)
  const [choices, setChoices] = useState(defaultChoices)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Preferences
        setChoices({
          functional: Boolean(parsed.functional),
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        })
        return
      }
    } catch {
      /* storage may be blocked, show the banner again */
    }
    const timer = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!managing) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setManaging(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [managing])

  const persist = (next: typeof defaultChoices) => {
    const payload: Preferences = {
      necessary: true,
      ...next,
      updatedAt: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* noop */
    }
    setChoices(next)
    setOpen(false)
    setManaging(false)
  }

  if (!open) return null

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie choices"
        className="pb-safe fixed inset-x-0 bottom-0 z-[9990] border-t border-line bg-white shadow-[0_-12px_40px_-24px_rgba(37,37,37,0.35)]"
      >
        <div className="container-page flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-display text-base uppercase tracking-[0.08em] text-ink">
              Your family&apos;s privacy matters
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              We use strictly necessary cookies to keep the site working. With your permission we
              also use functional and analytics cookies. We never use cookies to build advertising
              profiles of children, and we do not sell family data. Read our{' '}
              <a href="/legal/cookie-policy" className="text-primary underline underline-offset-2">
                cookie policy
              </a>{' '}
              and{' '}
              <a href="/legal/privacy-policy" className="text-primary underline underline-offset-2">
                privacy policy
              </a>
              , both written for the Kenya Data Protection Act 2019.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setManaging(true)}
              className="btn btn-outline w-full sm:w-auto"
            >
              Manage preferences
            </button>
            <button
              type="button"
              onClick={() => persist({ functional: true, analytics: true, marketing: true })}
              className="btn btn-primary w-full sm:w-auto"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      {managing ? (
        <div className="fixed inset-0 z-[9995] flex items-end justify-center bg-charcoal/50 px-0 sm:items-center sm:px-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="cookie-prefs-title"
                  className="font-display text-xl uppercase tracking-[0.08em] text-ink"
                >
                  Cookie preferences
                </h2>
                <p className="mt-1 text-sm text-muted">
                  You are in control. Necessary cookies stay on because the platform cannot run
                  without them.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManaging(false)}
                aria-label="Close cookie preferences"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-slatedeep transition hover:border-primary hover:text-primary"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <PreferenceRow
                title="Necessary"
                description="Sign-in, security, form protection and remembering your cookie choice. Always on."
                checked
                disabled
                onChange={() => undefined}
              />
              <PreferenceRow
                title="Functional"
                description="Remembers small preferences such as your last dashboard tab so you do not repeat yourself."
                checked={choices.functional}
                onChange={(value) => setChoices((prev) => ({ ...prev, functional: value }))}
              />
              <PreferenceRow
                title="Analytics"
                description="Aggregated, privacy friendly page counts that help us improve the platform. No child or family details are included."
                checked={choices.analytics}
                onChange={(value) => setChoices((prev) => ({ ...prev, analytics: value }))}
              />
              <PreferenceRow
                title="Marketing"
                description="Would let us measure outreach campaigns. Off by default and never used to profile children."
                checked={choices.marketing}
                onChange={(value) => setChoices((prev) => ({ ...prev, marketing: value }))}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => persist(choices)}
                className="btn btn-primary w-full sm:w-auto"
              >
                Save my choices
              </button>
              <button
                type="button"
                onClick={() => persist({ functional: true, analytics: true, marketing: true })}
                className="btn btn-outline w-full sm:w-auto"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-surface p-3.5">
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <label className="relative mt-0.5 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-end">
        <span className="sr-only">{title} cookies</span>
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
            checked ? 'bg-primary' : 'bg-[#ced4da]'
          } ${disabled ? 'opacity-70' : ''}`}
          aria-hidden="true"
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </span>
      </label>
    </div>
  )
}
