import { getParentSession } from '@/lib/session'
import { addExpense } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { expenseSchema } from '@/lib/validation'
import { fail, invalid, ok, readJson } from '@/lib/api'

export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to add an expense.', 401)

  const body = await readJson(request)
  const captcha = await verifyRecaptcha(
    typeof body.recaptchaToken === 'string' ? body.recaptchaToken : undefined,
    'add_expense',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const parsed = expenseSchema.safeParse(body)
  if (!parsed.success) return invalid(parsed.error)

  const expenses = await addExpense(parent.familyId, {
    category: parsed.data.category,
    amount: parsed.data.amount,
    splitPercent: parsed.data.splitPercent,
    paidBy: parsed.data.paidBy,
    notes: parsed.data.notes || '',
    receiptUrl: parsed.data.receiptUrl || undefined,
  })

  return ok({ expense: expenses[0] }, 201)
}
