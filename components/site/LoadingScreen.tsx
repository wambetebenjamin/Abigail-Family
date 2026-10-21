'use client'

import { useEffect, useState } from 'react'
import { LogoMark } from '@/components/site/Logo'

const STORAGE_KEY = 'abigail-family-loader-seen'

/**
 * Branded preloader: two parent circles converge around the child circle.
 * Honours prefers-reduced-motion with a plain percentage, exposes role="status",
 * and offers a skip control if it is ever still on screen after three seconds.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(reduced)

    let seen = true
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      seen = false
    }
    if (seen) return

    setVisible(true)

    const started = Date.now()
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started
      setProgress(Math.min(100, Math.round((elapsed / 1300) * 100)))
    }, 60)

    const finish = window.setTimeout(() => {
      setProgress(100)
      setVisible(false)
      try {
        window.sessionStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        /* storage can be blocked, the loader simply shows again */
      }
    }, 1500)

    const skipTimer = window.setTimeout(() => setCanSkip(true), 3000)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(finish)
      window.clearTimeout(skipTimer)
    }
  }, [])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      /* noop */
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading Abigail Family, ${progress} percent`}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-white px-6"
    >
      {reduceMotion ? (
        <p className="font-display text-4xl text-ink">{progress}%</p>
      ) : (
        <svg viewBox="0 0 120 80" className="h-24 w-36" aria-hidden="true">
          <circle
            cx="42"
            cy="40"
            r="26"
            fill="none"
            stroke="#f86f2d"
            strokeWidth="2.5"
            style={{
              transform: `translateX(${(1 - progress / 100) * 14}px)`,
              transition: 'transform 0.4s ease-out',
            }}
          />
          <circle
            cx="78"
            cy="40"
            r="26"
            fill="none"
            stroke="#78d5ef"
            strokeWidth="2.5"
            style={{
              transform: `translateX(-${(1 - progress / 100) * 14}px)`,
              transition: 'transform 0.4s ease-out',
            }}
          />
          <circle cx="60" cy="40" r="11" fill="#f86f2d" opacity={0.25 + progress / 200} />
          <circle cx="60" cy="40" r="11" fill="none" stroke="#f86f2d" strokeWidth="2" />
        </svg>
      )}

      <div className="text-center">
        <p className="font-display text-xl font-medium uppercase tracking-[0.3em] text-ink">
          Abigail
        </p>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.5em] text-primary">
          Family
        </p>
      </div>

      {!reduceMotion ? (
        <div className="h-[3px] w-40 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <p className="text-xs text-muted">Raising children together, apart.</p>

      {canSkip ? (
        <button
          type="button"
          onClick={dismiss}
          className="btn btn-outline min-h-[44px] px-5 text-xs"
        >
          Skip intro
        </button>
      ) : (
        <span className="sr-only">
          <LogoMark className="h-8 w-8" /> Loading
        </span>
      )}
    </div>
  )
}
