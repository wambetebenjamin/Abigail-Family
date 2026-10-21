import { randomUUID } from 'crypto'
import { addDaysISO, todayISO } from '@/lib/dates'
import { hashPassword } from '@/lib/password'

export type ParentRole = 'Parent A' | 'Parent B'

export type UserRecord = {
  id: string
  name: string
  email: string
  passwordHash: string
  parentRole: ParentRole
  familyId: string
  createdAt: string
}

export type FamilyRecord = {
  id: string
  name: string
  parents: { parentA?: string; parentB?: string }
  inviteEmail?: string
  createdAt: string
}

export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  notes: string
  responsible: string
  createdAt: string
}

export type Expense = {
  id: string
  category: string
  amount: number
  splitPercent: number
  paidBy: ParentRole
  notes: string
  receiptUrl?: string
  createdAt: string
}

export type Handover = {
  id: string
  date: string
  time: string
  location: string
  receivedBy: ParentRole
  conditionNotes: string
  photoUrl?: string
  createdAt: string
}

export type Message = {
  id: string
  sender: ParentRole
  body: string
  createdAt: string
  readBy: ParentRole[]
}

export type DocumentRecord = {
  id: string
  name: string
  category: string
  url: string
  size?: number
  uploadedBy: ParentRole
  createdAt: string
}

export type JournalEntry = {
  id: string
  author: ParentRole
  authorName: string
  title: string
  date: string
  category: string
  body: string
  createdAt: string
}

export const DEMO_CREDENTIALS = {
  email: 'demo@abigailfamily.co.ke',
  password: 'calmfamily',
}

export const DEMO_FAMILY_ID = 'family-abigail-demo'

type MemoryStore = {
  data: Map<string, unknown>
  seeded: boolean
}

const globalStore = globalThis as unknown as { __abigailMemory?: MemoryStore }
const memory: MemoryStore =
  globalStore.__abigailMemory ?? (globalStore.__abigailMemory = { data: new Map(), seeded: false })

function kvEnabled() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function readDoc<T>(key: string): Promise<T | null> {
  if (kvEnabled()) {
    try {
      const { kv } = await import('@vercel/kv')
      const value = await kv.get<T>(key)
      if (value !== null && value !== undefined) return value
    } catch (error) {
      console.warn('[store] KV read failed, using memory fallback', error)
    }
  }
  return (memory.data.get(key) as T | undefined) ?? null
}

async function writeDoc<T>(key: string, value: T): Promise<void> {
  memory.data.set(key, value)
  if (kvEnabled()) {
    try {
      const { kv } = await import('@vercel/kv')
      await kv.set(key, value)
    } catch (error) {
      console.warn('[store] KV write failed, keeping memory copy', error)
    }
  }
}

async function readList<T>(key: string): Promise<T[]> {
  return (await readDoc<T[]>(key)) ?? []
}

async function pushToList<T>(key: string, item: T): Promise<T[]> {
  const list = await readList<T>(key)
  const next = [item, ...list]
  await writeDoc(key, next)
  return next
}

const familyKey = (familyId: string, collection: string) =>
  `af:family:${familyId}:${collection}`

const userKey = (email: string) => `af:user:${email.toLowerCase()}`

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureDemoData()
  return readDoc<UserRecord>(userKey(email))
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  await ensureDemoData()
  const index = (await readDoc<Record<string, string>>('af:user-index')) ?? {}
  const email = index[id]
  if (!email) return null
  return readDoc<UserRecord>(userKey(email))
}

export async function createUser(input: {
  name: string
  email: string
  password: string
  parentRole: ParentRole
  inviteEmail?: string
}): Promise<{ user: UserRecord; family: FamilyRecord } | { error: string }> {
  await ensureDemoData()
  const email = input.email.toLowerCase()
  const existing = await readDoc<UserRecord>(userKey(email))
  if (existing) return { error: 'An account with that email already exists.' }

  const familyId = `family-${randomUUID()}`
  const now = new Date().toISOString()
  const family: FamilyRecord = {
    id: familyId,
    name: `${input.name.split(' ')[0]} family`,
    parents: input.parentRole === 'Parent A' ? { parentA: email } : { parentB: email },
    inviteEmail: input.inviteEmail || undefined,
    createdAt: now,
  }
  const user: UserRecord = {
    id: `user-${randomUUID()}`,
    name: input.name,
    email,
    passwordHash: hashPassword(input.password),
    parentRole: input.parentRole,
    familyId,
    createdAt: now,
  }

  await writeDoc(userKey(email), user)
  const index = (await readDoc<Record<string, string>>('af:user-index')) ?? {}
  index[user.id] = email
  await writeDoc('af:user-index', index)
  await writeDoc(`af:family:${familyId}`, family)

  return { user, family }
}

export async function getFamily(familyId: string): Promise<FamilyRecord | null> {
  return readDoc<FamilyRecord>(`af:family:${familyId}`)
}

export async function listEvents(familyId: string): Promise<CalendarEvent[]> {
  const events = await readList<CalendarEvent>(familyKey(familyId, 'events'))
  return [...events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
}

export async function addEvent(familyId: string, event: Omit<CalendarEvent, 'id' | 'createdAt'>) {
  return pushToList<CalendarEvent>(familyKey(familyId, 'events'), {
    ...event,
    id: `event-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  })
}

export async function listExpenses(familyId: string): Promise<Expense[]> {
  const expenses = await readList<Expense>(familyKey(familyId, 'expenses'))
  return [...expenses].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function addExpense(familyId: string, expense: Omit<Expense, 'id' | 'createdAt'>) {
  return pushToList<Expense>(familyKey(familyId, 'expenses'), {
    ...expense,
    id: `expense-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  })
}

export async function listHandovers(familyId: string): Promise<Handover[]> {
  const handovers = await readList<Handover>(familyKey(familyId, 'handovers'))
  return [...handovers].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
}

export async function addHandover(familyId: string, handover: Omit<Handover, 'id' | 'createdAt'>) {
  return pushToList<Handover>(familyKey(familyId, 'handovers'), {
    ...handover,
    id: `handover-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  })
}

export async function listMessages(familyId: string): Promise<Message[]> {
  const messages = await readList<Message>(familyKey(familyId, 'messages'))
  return [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addMessage(
  familyId: string,
  message: Omit<Message, 'id' | 'createdAt' | 'readBy'>,
) {
  return pushToList<Message>(familyKey(familyId, 'messages'), {
    ...message,
    id: `message-${randomUUID()}`,
    createdAt: new Date().toISOString(),
    readBy: [message.sender],
  })
}

export async function listDocuments(familyId: string): Promise<DocumentRecord[]> {
  return readList<DocumentRecord>(familyKey(familyId, 'documents'))
}

export async function addDocument(
  familyId: string,
  document: Omit<DocumentRecord, 'id' | 'createdAt'>,
) {
  return pushToList<DocumentRecord>(familyKey(familyId, 'documents'), {
    ...document,
    id: `document-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  })
}

export async function listJournal(familyId: string, author: ParentRole): Promise<JournalEntry[]> {
  const entries = await readList<JournalEntry>(familyKey(familyId, 'journal'))
  return entries
    .filter((entry) => entry.author === author)
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
}

export async function addJournalEntry(
  familyId: string,
  entry: Omit<JournalEntry, 'id' | 'createdAt'>,
) {
  return pushToList<JournalEntry>(familyKey(familyId, 'journal'), {
    ...entry,
    id: `journal-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  })
}

/**
 * Demo family. The seeded records let a reviewer sign in with the demo account
 * and see every dashboard surface with believable data. Real accounts start
 * empty and fill up from the dashboard forms.
 */
export async function ensureDemoData(): Promise<void> {
  if (memory.seeded) return

  const existing = await readDoc<UserRecord>(userKey(DEMO_CREDENTIALS.email))
  if (existing) {
    memory.seeded = true
    return
  }

  const now = new Date().toISOString()
  const passwordHash = hashPassword(DEMO_CREDENTIALS.password)

  const amina: UserRecord = {
    id: 'user-demo-amina',
    name: 'Amina Wanjiru',
    email: DEMO_CREDENTIALS.email,
    passwordHash,
    parentRole: 'Parent A',
    familyId: DEMO_FAMILY_ID,
    createdAt: now,
  }
  const brian: UserRecord = {
    id: 'user-demo-brian',
    name: 'Brian Otieno',
    email: 'brian@abigailfamily.co.ke',
    passwordHash,
    parentRole: 'Parent B',
    familyId: DEMO_FAMILY_ID,
    createdAt: now,
  }

  await writeDoc(userKey(amina.email), amina)
  await writeDoc(userKey(brian.email), brian)
  await writeDoc('af:user-index', { [amina.id]: amina.email, [brian.id]: brian.email })
  await writeDoc<FamilyRecord>(`af:family:${DEMO_FAMILY_ID}`, {
    id: DEMO_FAMILY_ID,
    name: 'Wanjiru and Otieno family',
    parents: { parentA: amina.email, parentB: brian.email },
    createdAt: now,
  })

  const today = todayISO()

  await writeDoc<CalendarEvent[]>(familyKey(DEMO_FAMILY_ID, 'events'), [
    {
      id: 'event-1',
      title: 'School drop-off at Mwangaza Academy',
      date: today,
      time: '07:30',
      location: 'Mwangaza Academy, Gate A',
      notes: 'Amani has the blue reading folder in her bag.',
      responsible: 'Parent A',
      createdAt: now,
    },
    {
      id: 'event-2',
      title: 'Pick-up and evening at Dad',
      date: today,
      time: '16:00',
      location: 'Mwangaza Academy, Gate A',
      notes: 'Handover happens at the gate. Bags travel with Amani.',
      responsible: 'Parent B',
      createdAt: now,
    },
    {
      id: 'event-3',
      title: 'Bedtime call with Mum',
      date: today,
      time: '19:30',
      location: 'Phone call',
      notes: 'Fifteen minutes, always before the bedtime story.',
      responsible: 'Both parents',
      createdAt: now,
    },
    {
      id: 'event-4',
      title: 'Dental check-up',
      date: addDaysISO(today, 2),
      time: '10:00',
      location: 'Riverside Dental, Ngong Road',
      notes: 'Bring the NHIF card and the previous treatment note.',
      responsible: 'Parent B',
      createdAt: now,
    },
    {
      id: 'event-5',
      title: 'Swimming lesson',
      date: addDaysISO(today, 4),
      time: '09:00',
      location: 'Kasarani Aquatic Centre',
      notes: 'Goggles and towel stay in the swimming bag.',
      responsible: 'Parent A',
      createdAt: now,
    },
    {
      id: 'event-6',
      title: 'Parent and teacher meeting',
      date: addDaysISO(today, 6),
      time: '15:30',
      location: 'Mwangaza Academy, Room 4',
      notes: 'We are attending together. Fifteen minutes each with the teacher.',
      responsible: 'Both parents',
      createdAt: now,
    },
  ])

  await writeDoc<Expense[]>(familyKey(DEMO_FAMILY_ID, 'expenses'), [
    {
      id: 'expense-1',
      category: 'School fees',
      amount: 24500,
      splitPercent: 50,
      paidBy: 'Parent A',
      notes: 'Term two fees, paid through the school paybill.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'expense-2',
      category: 'Medical',
      amount: 3200,
      splitPercent: 50,
      paidBy: 'Parent B',
      notes: 'Pharmacy and nebuliser refill.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    },
    {
      id: 'expense-3',
      category: 'Clothing',
      amount: 4600,
      splitPercent: 50,
      paidBy: 'Parent A',
      notes: 'School shoes and two cardigans.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      id: 'expense-4',
      category: 'Activities',
      amount: 2500,
      splitPercent: 50,
      paidBy: 'Parent B',
      notes: 'Swimming term subscription.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    },
  ])

  await writeDoc<Handover[]>(familyKey(DEMO_FAMILY_ID, 'handovers'), [
    {
      id: 'handover-1',
      date: addDaysISO(today, -3),
      time: '18:00',
      location: 'Mwangaza Academy, Gate A',
      receivedBy: 'Parent B',
      conditionNotes: 'Amani was in good spirits, slight cough. Inhaler sent along.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: 'handover-2',
      date: addDaysISO(today, -7),
      time: '08:15',
      location: 'Karen Shopping Centre',
      receivedBy: 'Parent A',
      conditionNotes: 'Homework complete. Reading folder returned.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    },
  ])

  await writeDoc<Message[]>(familyKey(DEMO_FAMILY_ID, 'messages'), [
    {
      id: 'message-1',
      sender: 'Parent B',
      body: 'Hi Amina, I can do the school pick-up on Thursday if that still works for you.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      readBy: ['Parent B'],
    },
    {
      id: 'message-2',
      sender: 'Parent A',
      body: 'Thank you, that helps. She has swimming at nine on Saturday, I will take that one.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      readBy: ['Parent A', 'Parent B'],
    },
    {
      id: 'message-3',
      sender: 'Parent B',
      body: 'Noted. I will update the calendar so we both have it.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      readBy: ['Parent B'],
    },
  ])

  await writeDoc<DocumentRecord[]>(familyKey(DEMO_FAMILY_ID, 'documents'), [
    {
      id: 'document-1',
      name: 'Custody and parenting agreement',
      category: 'Custody agreement',
      url: '#',
      uploadedBy: 'Parent A',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    },
    {
      id: 'document-2',
      name: 'Term two school report',
      category: 'School report',
      url: '#',
      uploadedBy: 'Parent B',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    },
    {
      id: 'document-3',
      name: 'Immunisation card',
      category: 'Medical record',
      url: '#',
      uploadedBy: 'Parent A',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 400).toISOString(),
    },
  ])

  await writeDoc<JournalEntry[]>(familyKey(DEMO_FAMILY_ID, 'journal'), [
    {
      id: 'journal-1',
      author: 'Parent A',
      authorName: 'Amina Wanjiru',
      title: 'She read a whole page by herself',
      date: addDaysISO(today, -2),
      category: 'School achievement',
      body: 'Amani read the first page of her reading book without help tonight. She was so proud she read it twice. I am noting it here because these are the days I want to remember.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    },
    {
      id: 'journal-2',
      author: 'Parent A',
      authorName: 'Amina Wanjiru',
      title: 'First lost tooth',
      date: addDaysISO(today, -12),
      category: 'Everyday moment',
      body: 'The tooth finally came out at breakfast. She asked whether the tooth fairy visits two houses. We agreed she does, as long as both houses know.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    },
  ])

  // Only mark the seed complete once every collection has been written, so a
  // transient error retries on the next request instead of leaving an empty family.
  memory.seeded = true
}

export type FamilyMembers = {
  parentAName: string
  parentBName: string
  parentAEmail?: string
  parentBEmail?: string
  familyName: string
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMembers> {
  const family = await getFamily(familyId)
  const a = family?.parents.parentA ? await readDoc<UserRecord>(userKey(family.parents.parentA)) : null
  const b = family?.parents.parentB ? await readDoc<UserRecord>(userKey(family.parents.parentB)) : null
  return {
    parentAName: a?.name || 'Parent A',
    parentBName: b?.name || 'Parent B',
    parentAEmail: family?.parents.parentA,
    parentBEmail: family?.parents.parentB,
    familyName: family?.name || 'Your family',
  }
}
