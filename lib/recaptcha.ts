const VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'
export const CAPTCHA_SCORE_THRESHOLD = 0.5

export type CaptchaResult = {
  ok: boolean
  score: number
  configured: boolean
  requiresV2: boolean
  reason?: string
}

const blocked = (reason: string, requiresV2 = false): CaptchaResult => ({
  ok: false,
  score: 0,
  configured: true,
  requiresV2,
  reason,
})

/**
 * Server side reCAPTCHA v3 verification. The secret never leaves the server.
 * When RECAPTCHA_SECRET_KEY is not configured (local preview), verification is
 * skipped and the response reports configured:false so the UI can say so.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction?: string,
): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    return { ok: true, score: 1, configured: false, requiresV2: false }
  }
  if (!token) return blocked('missing-token', true)

  try {
    const body = new URLSearchParams({ secret, response: token })
    const response = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    })
    if (!response.ok) return blocked('verification-unavailable')
    const data = (await response.json()) as {
      success: boolean
      score?: number
      action?: string
      'error-codes'?: string[]
    }
    const score = typeof data.score === 'number' ? data.score : data.success ? 1 : 0

    if (!data.success) return blocked('failed-verification', true)
    if (expectedAction && data.action && data.action !== expectedAction) {
      return blocked('action-mismatch', true)
    }
    if (score < CAPTCHA_SCORE_THRESHOLD) {
      return { ok: false, score, configured: true, requiresV2: true, reason: 'low-score' }
    }
    return { ok: true, score, configured: true, requiresV2: false }
  } catch (error) {
    console.error('[recaptcha] verification request failed', error)
    return blocked('verification-unavailable')
  }
}

export function captchaFailureResponse(result: CaptchaResult) {
  return Response.json(
    {
      ok: false,
      error:
        result.reason === 'low-score'
          ? 'We could not confirm this was you. Please complete the visible check and try again.'
          : 'We could not verify this request. Please try again or reach us on WhatsApp.',
      requiresV2: result.requiresV2,
      score: result.score,
    },
    { status: result.requiresV2 ? 403 : 400 },
  )
}
