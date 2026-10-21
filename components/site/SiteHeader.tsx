'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/site/Logo'
import { navLinks } from '@/lib/site'

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white transition-shadow duration-300 ${
        scrolled ? 'border-line shadow-[0_8px_30px_-24px_rgba(37,37,37,0.45)]' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-4 lg:h-[76px]">
        <Link
          href="/"
          className="flex min-h-[44px] items-center rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Abigail Family home"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`flex min-h-[44px] items-center rounded px-3 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-slatedeep hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="hidden min-h-[44px] items-center rounded px-3 text-sm font-medium text-slatedeep transition-colors hover:text-primary lg:flex"
          >
            Log in
          </Link>
          <Link href="/register" className="btn btn-primary px-4 text-xs">
            Create account
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-slatedeep transition hover:border-primary hover:text-primary md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-line bg-white transition-[max-height] duration-300 md:hidden ${
          open ? 'max-h-[520px]' : 'max-h-0 border-t-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex min-h-[44px] items-center rounded px-2 text-base font-medium ${
                isActive(link.href) ? 'text-primary' : 'text-slatedeep'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
            <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline w-full">
              Log in
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Create a Family Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
