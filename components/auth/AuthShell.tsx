import Image from 'next/image'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import Logo from '@/components/site/Logo'
import { photos } from '@/lib/images'

export default function AuthShell({
  title,
  subtitle,
  children,
  side = 'login',
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  side?: 'login' | 'register'
}) {
  return (
    <section className="bg-surface py-10 sm:py-14">
      <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        <div className="order-2 overflow-hidden rounded-lg border border-line lg:order-1">
          <div className="relative h-56 w-full sm:h-72 lg:h-full lg:min-h-[560px]">
            <Image
              src={side === 'login' ? photos.motherChild.src : photos.familySunlight.src}
              alt={side === 'login' ? photos.motherChild.alt : photos.familySunlight.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                {side === 'login'
                  ? 'You are not starting over. You are finding a calmer way to keep raising your child together.'
                  : 'One shared space for the schedules, the costs and the small milestones. Both of you. One child at the centre.'}
              </p>
              <Link
                href={side === 'login' ? '/register' : '/login'}
                className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-white underline underline-offset-4"
              >
                {side === 'login' ? 'New to Abigail Family? Create an account' : 'Already have an account? Log in'}
              </Link>
            </div>
          </div>
        </div>

        <div className="order-1 flex items-center lg:order-2">
          <div className="w-full rounded-lg border border-line bg-white p-5 shadow-[0_24px_60px_-48px_rgba(37,37,37,0.5)] sm:p-7">
            <div className="lg:hidden">
              <Logo />
            </div>
            <h1 className="mt-4 text-2xl text-ink sm:text-3xl lg:mt-0">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
