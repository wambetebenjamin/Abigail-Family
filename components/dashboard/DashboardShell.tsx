'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  FolderLock,
  Handshake,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Settings,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react'
import Logo from '@/components/site/Logo'
import type { FamilyMembers } from '@/lib/store'
import type { ParentSession } from '@/lib/session'
import { whatsappHref } from '@/lib/site'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/expenses', label: 'Expenses', icon: Wallet },
  { href: '/dashboard/messages', label: 'Messages', icon: MessagesSquare },
] as const

const secondaryItems = [
  { href: '/dashboard/handovers', label: 'Handovers', icon: Handshake },
  { href: '/dashboard/documents', label: 'Documents', icon: FolderLock },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen },
] as const

const allItems = [...navItems, ...secondaryItems]

// The bottom bar keeps to five tabs on mobile. Handovers, documents and the
// journal live behind "More" so nothing is crowded out.
const mobileTabs = [...navItems, { href: '__more', label: 'More', icon: MoreHorizontal }] as const

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function DashboardShell({
  parent,
  members,
  children,
}: {
  parent: ParentSession
  members: FamilyMembers
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [moreOpen, setMoreOpen] = useState(false)
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName
  const partnerJoined = partnerName !== 'Parent A' && partnerName !== 'Parent B'

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden border-r border-line bg-white lg:flex lg:min-h-screen lg:w-64 lg:flex-col">
        <div className="border-b border-line px-5 py-5">
          <Link href="/" className="flex min-h-[44px] items-center" aria-label="Abigail Family home">
            <Logo />
          </Link>
          <p className="mt-3 truncate text-xs text-muted">{members.familyName}</p>
        </div>

        <motion.nav
          key={pathname}
          aria-label="Dashboard"
          initial={reduce ? false : { x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex-1 px-3 py-4"
        >
          <ul className="space-y-1">
            {allItems.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[44px] items-center gap-3 rounded px-3 text-sm font-medium transition ${
                      active
                        ? 'bg-primary-soft text-primary'
                        : 'text-slatedeep hover:bg-surface hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 border-t border-line pt-4">
            <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-muted">Your family</p>
            <div className="mt-2 rounded border border-line p-3">
              <p className="text-sm font-semibold text-ink">{parent.name}</p>
              <p className="text-xs text-muted">
                {parent.parentRole}
                {partnerJoined ? ` · with ${partnerName}` : ''}
              </p>
              {!partnerJoined ? (
                <Link
                  href="/register?role=Parent B"
                  className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary"
                >
                  <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Invite your co-parent
                </Link>
              ) : null}
            </div>
          </div>
        </motion.nav>

        <div className="border-t border-line p-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-3 rounded px-3 text-sm text-slatedeep transition hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp support
          </a>
          <Link
            href="/pricing"
            className="flex min-h-[44px] items-center gap-3 rounded px-3 text-sm text-slatedeep transition hover:text-primary"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Plan and billing
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex min-h-[44px] w-full items-center gap-3 rounded px-3 text-left text-sm text-slatedeep transition hover:text-primary"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6 lg:hidden">
          <Link href="/dashboard" className="flex min-h-[44px] items-center" aria-label="Dashboard home">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded text-slatedeep"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              aria-label="Log out"
              className="flex h-11 w-11 items-center justify-center rounded text-slatedeep"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      <nav
        aria-label="Dashboard tabs"
        className="pb-safe fixed inset-x-0 bottom-0 z-40 h-16 border-t border-line bg-white lg:hidden"
      >
        <ul className="flex h-full items-stretch">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon
            const active = tab.href === '__more' ? moreOpen : isActive(pathname, tab.href)
            if (tab.href === '__more') {
              return (
                <li key={tab.label} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setMoreOpen(true)}
                    aria-expanded={moreOpen}
                    className={`flex h-full min-h-[44px] w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                      active ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {tab.label}
                  </button>
                </li>
              )
            }
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-full min-h-[44px] w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                    active ? 'text-primary' : 'text-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {tab.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-charcoal/50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="more-title"
            className="pb-safe relative w-full rounded-t-2xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="more-title" className="font-display text-lg uppercase tracking-[0.08em] text-ink">
                More
              </h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slatedeep"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-4 space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex min-h-[48px] items-center gap-3 rounded px-2 text-sm font-medium text-slatedeep"
                    >
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] items-center gap-3 rounded px-2 text-sm font-medium text-slatedeep"
                >
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  WhatsApp support
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex min-h-[48px] w-full items-center gap-3 rounded px-2 text-left text-sm font-medium text-slatedeep"
                >
                  <LogOut className="h-4 w-4 text-primary" aria-hidden="true" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
