'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react'
import { CaptchaBadge, CaptchaFallback, useRecaptcha } from '@/components/site/Recaptcha'

export default function LoginForm({
  callbackUrl = '/dashboard',
  googleEnabled = false,
}: {
  callbackUrl?: string
  googleEnabled?: boolean
}) {
  const router = useRouter()
  const { execute } = useRecaptcha()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresV2, setRequiresV2] = useState(false)

  const submit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const recaptchaToken = await execute('login')

      const preflight = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recaptchaToken, action: 'login' }),
      })
      const preflightData = (await preflight.json()) as {
        ok: boolean
        error?: string
        requiresV2?: boolean
      }

      if (!preflight.ok) {
        setRequiresV2(Boolean(preflightData.requiresV2))
        setError(preflightData.error || 'We could not verify this request. Please try again.')
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('That email and password do not match. Take your time and try again.')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('Something went wrong on our side. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('demo@abigailfamily.co.ke')
    setPassword('calmfamily')
    setError(null)
  }

  return (
    <div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="field-label">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field pr-12"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded text-muted transition hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <p role="alert" className="flex items-start gap-2 rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-3 text-xs text-[#b02a37]">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        {requiresV2 ? <CaptchaFallback onRetry={() => submit()} retrying={loading} /> : null}

        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-70">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {loading ? 'Signing you in' : 'Log in'}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs uppercase tracking-[0.16em] text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="btn btn-outline w-full"
          >
            Continue with Google
          </button>
        </>
      ) : null}

      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 w-full text-center text-xs text-muted underline underline-offset-4 transition hover:text-primary"
      >
        Use the demo account to look around
      </button>

      <p className="mt-5 text-center text-sm text-muted">
        New here?{' '}
        <Link href="/register" className="font-semibold text-primary underline underline-offset-2">
          Create a family account
        </Link>
      </p>

      <div className="mt-5">
        <CaptchaBadge />
      </div>
    </div>
  )
}
