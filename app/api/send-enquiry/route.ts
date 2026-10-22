import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { enquirySchema } from '@/lib/validation'
import { invalid, ok, readJson } from '@/lib/api'
import { sendEnquiryEmail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await readJson(request)

  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'send_enquiry',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = enquirySchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const delivery = await sendEnquiryEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    topic: parsed.data.topic,
    message: parsed.data.message,
  })

  return ok({ queued: true, emailDelivered: delivery.delivered }, 201)
}
