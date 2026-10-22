import CalendarView from '@/components/dashboard/CalendarView'
import PageHeader from '@/components/dashboard/PageHeader'
import { todayISO } from '@/lib/dates'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers, listEvents } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [events, members] = await Promise.all([
    listEvents(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const yourName = parent.parentRole === 'Parent A' ? members.parentAName : members.parentBName
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Shared calendar"
        title="The week, agreed in one place"
        description="School pick-ups, clinic visits, holidays and activities. Add an event and your co-parent sees it immediately."
      />
      <CalendarView
        events={events}
        today={todayISO()}
        yourName={yourName}
        partnerName={partnerName}
        parentRole={parent.parentRole}
      />
    </div>
  )
}
