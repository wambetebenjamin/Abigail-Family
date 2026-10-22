import { getParentSession } from '@/lib/session'
import { addHandover } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { handoverSchema } from '@/lib/validation'
import { fail, invalid, ok, readJson } from '@/lib/api'

export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to log a handover.', 401)

  const body = await readJson(request)
  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'add_handover',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = handoverSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const handovers = await addHandover(parent.familyId, {
    date: parsed.data.date,
    time: parsed.data.time,
    location: parsed.data.location,
    receivedBy: parsed.data.receivedBy,
    conditionNotes: parsed.data.conditionNotes || '',
    photoUrl: parsed.data.photoUrl || undefined,
  })

  return ok({ handover: handovers[0] }, 201)
}
