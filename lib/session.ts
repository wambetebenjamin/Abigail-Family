import { auth } from '@/auth'
import type { ParentRole } from '@/lib/store'

export type ParentSession = {
  id: string
  name: string
  email: string
  familyId: string
  parentRole: ParentRole
  partnerRole: ParentRole
}

export async function getParentSession(): Promise<ParentSession | null> {
  const session = await auth()
  const user = session?.user
  if (!user?.familyId || !user.parentRole) return null
  return {
    id: user.id,
    name: user.name || 'Parent',
    email: user.email || '',
    familyId: user.familyId,
    parentRole: user.parentRole,
    partnerRole: user.parentRole === 'Parent A' ? 'Parent B' : 'Parent A',
  }
}
