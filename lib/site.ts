export const site = {
  name: 'Abigail Family',
  tagline: 'Raising children together, apart.',
  description:
    'Abigail Family is a co-parenting and family coordination platform for separated parents in Kenya. Shared calendars, expenses, handover logs, secure messaging, a document vault and a private journal, all with the child at the centre.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://abigailfamily.co.ke',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061',
  whatsappMessage:
    "Hi Abigail Family, I'd like to learn more about the platform",
  email: 'hello@abigailfamily.co.ke',
  location: 'Nairobi, Kenya',
} as const

// Exact link from the build brief, including the encoded apostrophe.
export const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=Hi%20Abigail%20Family%2C%20I%27d%20like%20to%20learn%20more%20about%20the%20platform`

export const whatsappDisplay = '+254 112 272 061'

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
] as const

export const legalLinks = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms of Use' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
] as const

export const dashboardTabs = [
  { href: '/dashboard/calendar', label: 'Calendar', icon: 'calendar' },
  { href: '/dashboard/expenses', label: 'Expenses', icon: 'wallet' },
  { href: '/dashboard/handovers', label: 'Handovers', icon: 'handshake' },
  { href: '/dashboard/messages', label: 'Messages', icon: 'message' },
  { href: '/dashboard/documents', label: 'Documents', icon: 'folder' },
  { href: '/dashboard/journal', label: 'Journal', icon: 'book' },
] as const

export const voiceTourScript =
  "Welcome to Abigail Family. We know co-parenting after separation is not easy, but you do not have to figure it out in chaos. Abigail Family gives separated parents one shared space to coordinate schedules, split expenses, log handovers, and message each other securely, all with the child's wellbeing at the centre. Scroll down to see how it works and create your family account today."
