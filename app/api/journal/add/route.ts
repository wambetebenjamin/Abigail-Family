import { getParentSession } from '@/lib/session'
import { addJournalEntry } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { journalSchema } from '@/lib/validation'
import { fail, invalid, ok, readJson } from '@/lib/api'

export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to save a journal entry.', 401)

  const body = await readJson(request)
  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'add_journal',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = journalSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const entries = await addJournalEntry(parent.familyId, {
    author: parent.parentRole,
    authorName: parent.name,
    title: parsed.data.title,
    date: parsed.data.date,
    category: parsed.data.category,
    body: parsed.data.body,
  })

  return ok({ entry: entries[0] }, 201)
}
