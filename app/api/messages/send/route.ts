import { getParentSession } from '@/lib/session'
import { addMessage } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { messageSchema } from '@/lib/validation'
import { fail, invalid, ok, readJson } from '@/lib/api'

export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to send a message.', 401)

  const body = await readJson(request)
  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'send_message',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const messages = await addMessage(parent.familyId, {
    sender: parent.parentRole,
    body: parsed.data.body,
  })

  return ok({ message: messages[0] }, 201)
}
