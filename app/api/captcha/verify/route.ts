import { verifyRecaptcha } from '@/lib/recaptcha'
import { fail, ok, readJson } from '@/lib/api'

/**
 * Preflight used by the password login form so a low reCAPTCHA v3 score can
 * render the visible fallback before we attempt the credentials sign-in.
 */
export async function POST(request: Request) {
  const body = await readJson(request)
  const token = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined
  const action = typeof body.action === 'string' ? body.action : 'login'

  const result = await verifyRecaptcha(token, action)
  if (!result.ok) {
    return fail(
      result.reason === 'low-score'
        ? 'We could not confirm this was you automatically.'
        : 'We could not verify this request.',
      result.requiresV2 ? 403 : 400,
      { requiresV2: result.requiresV2, score: result.score },
    )
  }
  return ok({ score: result.score, configured: result.configured })
}
