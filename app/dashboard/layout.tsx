import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your shared family space.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const parent = await getParentSession()
  if (!parent) redirect('/login?callbackUrl=/dashboard')

  await ensureDemoData()
  const members = await getFamilyMembers(parent.familyId)

  return (
    <DashboardShell parent={parent} members={members}>
      {children}
    </DashboardShell>
  )
}
