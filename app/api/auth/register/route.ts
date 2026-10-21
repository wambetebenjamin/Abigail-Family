import { createUser } from '@/lib/store'
import { verifyPassword } from '@/lib/password'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { registerSchema } from '@/lib/validation'
import { invalid, ok, readJson, fail } from '@/lib/api'
import { sendInviteEmail, sendRegistrationWelcome } from '@/lib/email'

export async function POST(request: Request) {
  const body = await readJson(request)

  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'register',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const result = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    parentRole: parsed.data.parentRole,
    inviteEmail: parsed.data.inviteEmail || undefined,
  })

  if ('error' in result) return fail(result.error, 409)

  // Guard against a silent hashing fault before the account is used.
  if (!verifyPassword(parsed.data.password, result.user.passwordHash)) {
    return fail('We could not secure that password. Please try again.', 500)
  }

  await Promise.all([
    sendRegistrationWelcome({ to: result.user.email, name: result.user.name }),
    parsed.data.inviteEmail
      ? sendInviteEmail({
          to: parsed.data.inviteEmail,
          fromName: parsed.data.name,
          familyName: result.family.name,
        })
      : Promise.resolve({ delivered: false }),
  ])

  return ok(
    {
      user: { id: result.user.id, name: result.user.name, email: result.user.email },
      familyId: result.user.familyId,
      inviteSent: Boolean(parsed.data.inviteEmail),
    },
    201,
  )
}
