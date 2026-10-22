'use client'

import { MessageCircle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#f8f9fa',
          fontFamily: 'Overpass, Arial, sans-serif',
          color: '#808080',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '560px', textAlign: 'center' }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="16" cy="24" r="11" stroke="#f86f2d" strokeWidth="2.2" />
            <circle cx="32" cy="24" r="11" stroke="#78d5ef" strokeWidth="2.2" />
            <circle cx="24" cy="24" r="5.2" fill="#f86f2d" />
          </svg>
          <p style={{ margin: '20px 0 0', fontSize: '44px', color: '#f86f2d' }}>500</p>
          <h1 style={{ fontFamily: 'Dosis, Arial, sans-serif', fontSize: '26px', color: '#000' }}>
            Something went wrong on our side
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.8 }}>
            Your family data is safe. Please try again, or message us on WhatsApp and a person will
            help you straight away.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '10px 20px',
                background: '#f86f2d',
                color: '#fff',
                border: '1px solid #f86f2d',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} /> Try again
            </button>
            <a
              href="https://wa.me/254112272061"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '10px 20px',
                border: '1px solid #f86f2d',
                color: '#f86f2d',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={16} /> WhatsApp +254 112 272 061
            </a>
          </div>
          <p style={{ fontSize: '12px', marginTop: '16px' }}>
            Reference: {error.digest || 'unavailable'}
          </p>
        </main>
      </body>
    </html>
  )
}
