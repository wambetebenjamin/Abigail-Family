import JournalView from '@/components/dashboard/JournalView'
import PageHeader from '@/components/dashboard/PageHeader'
import { todayISO } from '@/lib/dates'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, listJournal } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function JournalPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const entries = await listJournal(parent.familyId, parent.parentRole)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Progress journal"
        title="The childhood you are both raising"
        description="Milestones, school moments and health notes, kept privately for you. Because the small things are the childhood."
      />
      <JournalView entries={entries} today={todayISO()} yourName={parent.name} />
    </div>
  )
}
