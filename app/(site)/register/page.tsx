import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import RegisterForm from '@/components/auth/RegisterForm'
import { getParentSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Create a Family Account',
  description:
    'Create your Abigail Family account, choose whether you are Parent A or Parent B, and invite your co-parent.',
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; role?: string }>
}) {
  const parent = await getParentSession()
  if (parent) redirect('/dashboard')

  const params = await searchParams

  return (
    <AuthShell
      side="register"
      title="Create your family space"
      subtitle="A few details, then one calm invitation to your co-parent. The free plan is enough to start coordinating this week."
    >
      {params.plan === 'family' ? (
        <p className="mb-4 rounded border border-primary/30 bg-primary-soft px-3 py-2 text-xs text-slatedeep">
          You are starting with the Family Plan. You can stay on the free plan at any time.
        </p>
      ) : null}
      <RegisterForm initialRole={params.role} />
    </AuthShell>
  )
}
