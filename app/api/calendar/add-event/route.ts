import { getParentSession } from '@/lib/session'
import { addEvent } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { eventSchema } from '@/lib/validation'
import { fail, invalid, ok, readJson } from '@/lib/api'

export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to add an event.', 401)

  const body = await readJson(request)
  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'add_event',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const events = await addEvent(parent.familyId, {
    title: parsed.data.title,
    date: parsed.data.date,
    time: parsed.data.time,
    location: parsed.data.location,
    notes: parsed.data.notes || '',
    responsible: parsed.data.responsible,
  })

  return ok({ event: events[0] }, 201)
}
