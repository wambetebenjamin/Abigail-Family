import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieConsent from '@/components/site/CookieConsent'
import LoadingScreen from '@/components/site/LoadingScreen'
import SmoothScroll from '@/components/site/SmoothScroll'
import VoiceTour from '@/components/site/VoiceTour'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Abigail Family | Co-parenting made calmer',
    template: '%s | Abigail Family',
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'co-parenting Kenya',
    'shared custody calendar',
    'child expenses split',
    'handover log',
    'separated parents Nairobi',
  ],
  openGraph: {
    title: 'Abigail Family | Co-parenting made calmer',
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abigail Family | Co-parenting made calmer',
    description: site.tagline,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css?family=Dosis:200,300,400,500,700%7COverpass:300,400,400i,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-muted antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <LoadingScreen />
        {children}
        <WhatsAppButton />
        <VoiceTour />
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
