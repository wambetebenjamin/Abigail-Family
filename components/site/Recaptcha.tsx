'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, MessageCircle, RefreshCw } from 'lucide-react'
import { whatsappHref } from '@/lib/site'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render?: (element: HTMLElement, options: Record<string, unknown>) => number
      reset?: (widgetId?: number) => void
    }
  }
}

const SCRIPT_ID = 'recaptcha-v3-script'

export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!siteKey) return
    if (window.grecaptcha?.execute) {
      setReady(true)
      return
    }
    const existing = document.getElementById(SCRIPT_ID)
    if (existing) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [siteKey])

  const execute = useCallback(
    async (action: string): Promise<string | undefined> => {
      if (!siteKey || !window.grecaptcha?.execute) return undefined
      try {
        await new Promise<void>((resolve) => window.grecaptcha?.ready(() => resolve()))
        return await window.grecaptcha.execute(siteKey, { action })
      } catch (error) {
        console.warn('[recaptcha] execute failed', error)
        return undefined
      }
    },
    [siteKey],
  )

  return { execute, configured: Boolean(siteKey), ready }
}

export function CaptchaBadge() {
  return (
    <p className="text-[11px] leading-relaxed text-muted">
      Protected by reCAPTCHA. Google{' '}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-primary"
      >
        Privacy Policy
      </a>{' '}
      and{' '}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-primary"
      >
        Terms
      </a>{' '}
      apply. We use it to keep the platform free of automated abuse.
    </p>
  )
}

/**
 * Visible fallback shown when the server reports a reCAPTCHA v3 score below 0.5.
 * It renders a visible checkbox widget when a v2 key is available, and always
 * offers a retry path plus a human route through WhatsApp.
 */
export function CaptchaFallback({
  onRetry,
  retrying = false,
  message = 'We could not confirm this was you automatically. Please complete the visible check and try again.',
}: {
  onRetry: () => void
  retrying?: boolean
  message?: string
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const [widgetReady, setWidgetReady] = useState(false)

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false

    const tryRender = () => {
      if (cancelled) return
      const container = document.getElementById('af-captcha-fallback')
      if (!container || !window.grecaptcha?.render) return
      try {
        window.grecaptcha.render(container, { sitekey: siteKey, theme: 'light' })
        setWidgetReady(true)
      } catch {
        setWidgetReady(false)
      }
    }

    const timer = window.setTimeout(tryRender, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [siteKey])

  return (
    <div
      role="alert"
      className="mt-4 rounded-md border border-primary/30 bg-primary-soft/60 p-4"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">One quick human check</p>
          <p className="mt-1 text-xs leading-relaxed text-slatedeep">{message}</p>

          <div id="af-captcha-fallback" className="mt-3 min-h-[1px]" />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="btn btn-primary min-h-[44px] px-4 text-xs disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
              {retrying ? 'Checking' : 'Try again'}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline min-h-[44px] px-4 text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Ask us for help
            </a>
          </div>
          {!widgetReady && siteKey ? (
            <p className="mt-2 text-[11px] text-muted">
              If the visible checkbox does not appear, choose &quot;Try again&quot; once, then reach
              us on WhatsApp and we will verify you personally.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
