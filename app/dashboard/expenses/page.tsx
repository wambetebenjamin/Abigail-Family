import ExpensesView from '@/components/dashboard/ExpensesView'
import PageHeader from '@/components/dashboard/PageHeader'
import { getParentSession } from '@/lib/session'
import { ensureDemoData, getFamilyMembers, listExpenses } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [expenses, members] = await Promise.all([
    listExpenses(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const yourName = parent.parentRole === 'Parent A' ? members.parentAName : members.parentBName
  const partnerName = parent.parentRole === 'Parent A' ? members.parentBName : members.parentAName

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Expense tracker"
        title="Money, written down before it becomes an argument"
        description="Record shared child costs in Kenya shillings, agree the split, and keep every receipt together."
      />
      <ExpensesView
        expenses={expenses}
        parentRole={parent.parentRole}
        yourName={yourName}
        partnerName={partnerName}
      />
    </div>
  )
}
