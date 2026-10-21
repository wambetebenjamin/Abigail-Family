import DocumentsView from '@/components/dashboard/DocumentsView'
import PageHeader from '@/components/dashboard/PageHeader'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers, listDocuments } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [documents, members] = await Promise.all([
    listDocuments(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const yourName = parent.parentRole === 'Parent A' ? members.parentAName : members.parentBName
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Document vault"
        title="The paperwork, found in a hurry"
        description="Custody agreement, school reports, medical records and birth certificate, stored once for both parents."
      />
      <DocumentsView
        documents={documents}
        parentRole={parent.parentRole}
        yourName={yourName}
        partnerName={partnerName}
      />
    </div>
  )
}
