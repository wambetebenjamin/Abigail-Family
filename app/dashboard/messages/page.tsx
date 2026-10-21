import MessagesView from '@/components/dashboard/MessagesView'
import PageHeader from '@/components/dashboard/PageHeader'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers, listMessages } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [messages, members] = await Promise.all([
    listMessages(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const yourName = parent.parentRole === 'Parent A' ? members.parentAName : members.parentBName
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Secure messaging"
        title="One thread, kept about your child"
        description="No group chats, no forwarded screenshots, no audience. Just the two people raising this child."
      />
      <MessagesView
        messages={messages}
        parentRole={parent.parentRole}
        yourName={yourName}
        partnerName={partnerName}
      />
    </div>
  )
}
