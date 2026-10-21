'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { whatsappHref } from '@/lib/site'

export default function WhatsAppButton() {
  const pathname = usePathname()
  const [pulse, setPulse] = useState(true)
  const onDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    const timer = window.setTimeout(() => setPulse(false), 5000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        onDashboard ? 'bottom-20 lg:bottom-6 bottom-safe-dash' : 'bottom-6 bottom-safe'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full ${pulse ? 'wa-pulse' : ''}`}
      />
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded bg-charcoal px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        Chat with us on WhatsApp
      </span>
    </a>
  )
}
