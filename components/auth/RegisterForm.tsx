'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AlertCircle, Check, Eye, EyeOff, UserPlus } from 'lucide-react'
import { CaptchaBadge, CaptchaFallback, useRecaptcha } from '@/components/site/Recaptcha'
import { parentRoles } from '@/lib/validation'

type FieldErrors = Record<string, string[] | undefined>

const inputClass = (error?: string) =>
  `field ${error ? 'border-[#dc3545] focus:border-[#dc3545] focus:shadow-[0_0_0_3px_rgba(220,53,69,0.15)]' : ''}`

export default function RegisterForm({ initialRole = 'Parent A' }: { initialRole?: string }) {
  const router = useRouter()
  const { execute } = useRecaptcha()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    parentRole: initialRole === 'Parent B' ? 'Parent B' : 'Parent A',
    inviteEmail: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [requiresV2, setRequiresV2] = useState(false)

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const submit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    try {
      const recaptchaToken = await execute('register')
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      })
      const data = (await response.json()) as {
        ok: boolean
        error?: string
        fieldErrors?: FieldErrors
        requiresV2?: boolean
      }

      if (!response.ok || !data.ok) {
        setFieldErrors(data.fieldErrors || {})
        setRequiresV2(Boolean(data.requiresV2))
        setError(data.error || 'We could not create your account. Please try again.')
        return
      }

      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push('/login?registered=1')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong on our side. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="register-name" className="field-label">
          Your full name
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          className={inputClass(fieldErrors.name?.[0])}
          placeholder="Amina Wanjiru"
        />
        {fieldErrors.name?.[0] ? (
          <p className="mt-1 text-xs text-[#b02a37]">{fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="register-email" className="field-label">
          Email address
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          className={inputClass(fieldErrors.email?.[0])}
          placeholder="you@example.com"
        />
        {fieldErrors.email?.[0] ? (
          <p className="mt-1 text-xs text-[#b02a37]">{fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="register-password" className="field-label">
          Password
        </label>
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            className={`${inputClass(fieldErrors.password?.[0])} pr-12`}
            placeholder="At least 8 characters"
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
        {fieldErrors.password?.[0] ? (
          <p className="mt-1 text-xs text-[#b02a37]">{fieldErrors.password[0]}</p>
        ) : (
          <p className="mt-1 text-xs text-muted">Use 8 characters or more. A short phrase is fine.</p>
        )}
      </div>

      <fieldset>
        <legend className="field-label">Which parent are you?</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {parentRoles.map((role) => {
            const active = form.parentRole === role
            return (
              <label
                key={role}
                className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded border px-3 py-2.5 text-sm transition ${
                  active
                    ? 'border-primary bg-primary-soft text-ink'
                    : 'border-line bg-white text-slatedeep hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="parentRole"
                  value={role}
                  checked={active}
                  onChange={() => update('parentRole', role)}
                  className="h-4 w-4 accent-[#f86f2d]"
                />
                <span className="font-medium">{role}</span>
                {active ? <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" /> : null}
              </label>
            )
          })}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          This is only a label so the two of you can tell your entries apart. It carries no legal
          meaning and gives neither parent more rights.
        </p>
      </fieldset>

      <div>
        <label htmlFor="register-invite" className="field-label">
          Invite your co-parent (optional)
        </label>
        <input
          id="register-invite"
          name="inviteEmail"
          type="email"
          value={form.inviteEmail}
          onChange={(event) => update('inviteEmail', event.target.value)}
          className={inputClass(fieldErrors.inviteEmail?.[0])}
          placeholder="their@email.com"
        />
        {fieldErrors.inviteEmail?.[0] ? (
          <p className="mt-1 text-xs text-[#b02a37]">{fieldErrors.inviteEmail[0]}</p>
        ) : (
          <p className="mt-1 text-xs text-muted">
            We will send one calm invitation email. You can also invite them later from the
            dashboard.
          </p>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-3 text-xs text-[#b02a37]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {requiresV2 ? <CaptchaFallback onRetry={() => submit()} retrying={loading} /> : null}

      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-70">
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {loading ? 'Creating your family space' : 'Create a Family Account'}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted">
        By creating an account you agree to our{' '}
        <Link href="/legal/terms" className="text-primary underline underline-offset-2">
          terms
        </Link>{' '}
        and{' '}
        <Link href="/legal/privacy-policy" className="text-primary underline underline-offset-2">
          privacy policy
        </Link>
        . You can delete your family data at any time.
      </p>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary underline underline-offset-2">
          Log in
        </Link>
      </p>

      <CaptchaBadge />
    </form>
  )
}
