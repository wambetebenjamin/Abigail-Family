import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import LoginForm from '@/components/auth/LoginForm'
import { getParentSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your Abigail Family co-parenting space.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const parent = await getParentSession()
  if (parent) redirect('/dashboard')

  const params = await searchParams

  return (
    <AuthShell
      side="login"
      title="Welcome back. We are glad you are here."
      subtitle="Sign in to see this week's schedule, the shared costs and anything waiting for your reply."
    >
      <LoginForm
        callbackUrl={params.callbackUrl?.startsWith('/dashboard') ? params.callbackUrl : '/dashboard'}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
      />
    </AuthShell>
  )
}
