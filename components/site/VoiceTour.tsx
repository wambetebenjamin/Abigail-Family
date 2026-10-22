'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Volume2, VolumeX } from 'lucide-react'
import { voiceTourScript } from '@/lib/site'

const STORAGE_KEY = 'abigail-family-voice-tour-played'

export default function VoiceTour() {
  const [speaking, setSpeaking] = useState(false)
  const [played, setPlayed] = useState(false)
  const [supported, setSupported] = useState(true)
  const [pulse, setPulse] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const pathname = usePathname()
  const onDashboard = Boolean(pathname?.startsWith('/dashboard'))

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    try {
      setPlayed(window.sessionStorage.getItem(STORAGE_KEY) === 'true')
    } catch {
      setPlayed(false)
    }
    const timer = window.setTimeout(() => setPulse(false), 6000)
    return () => {
      window.clearTimeout(timer)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(voiceTourScript)
    utterance.rate = 0.95
    utterance.pitch = 1.1
    utterance.lang = 'en-KE'
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setPlayed(true)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      /* noop */
    }
  }, [])

  useEffect(() => {
    if (played || !supported) return
    let started = false

    const trigger = () => {
      if (started) return
      started = true
      speak()
      remove()
    }
    const onScroll = () => {
      if (window.scrollY > 80) trigger()
    }
    const onClick = () => trigger()
    const remove = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      window.removeEventListener('touchstart', onClick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick)
    window.addEventListener('touchstart', onClick, { passive: true })
    return remove
  }, [played, speak, supported])

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    speak()
  }

  const label = speaking
    ? 'Site voice tour, click to mute'
    : played
      ? 'Replay tour'
      : 'Site voice tour, click to play'

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={speaking}
      title={speaking ? 'Mute the voice tour' : played ? 'Replay tour' : 'Hear what this site is about'}
      className={`group fixed left-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-white text-primary shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        onDashboard
          ? 'bottom-20 lg:bottom-6 bottom-safe-dash'
          : 'bottom-6 bottom-safe'
      } ${speaking ? 'speaking-ring' : ''} ${pulse && !speaking ? 'voice-pulse' : ''}`}
    >
      {speaking ? (
        <VolumeX className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Volume2 className="h-6 w-6" aria-hidden="true" />
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded bg-charcoal px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        {speaking ? 'Mute the voice tour' : played ? 'Replay tour' : 'Hear what this site is about'}
      </span>
    </button>
  )
}
