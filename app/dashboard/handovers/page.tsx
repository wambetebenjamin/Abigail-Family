import HandoversView from '@/components/dashboard/HandoversView'
import PageHeader from '@/components/dashboard/PageHeader'
import { todayISO } from '@/lib/dates'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers, listHandovers } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function HandoversPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [handovers, members] = await Promise.all([
    listHandovers(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const yourName = parent.parentRole === 'Parent A' ? members.parentAName : members.parentBName
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Handover logs"
        title="A quiet record of every handover"
        description="Date, time, place and how your child was. Neutral notes that protect everybody, especially your child."
      />
      <HandoversView
        handovers={handovers}
        today={todayISO()}
        parentRole={parent.parentRole}
        yourName={yourName}
        partnerName={partnerName}
      />
    </div>
  )
}
