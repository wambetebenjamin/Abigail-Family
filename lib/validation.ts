import { z } from 'zod'

const captcha = {
  recaptchaToken: z.string().max(4096).optional(),
  captchaFallbackToken: z.string().max(4096).optional(),
}

const trimmed = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required`)
    .max(max, `${label} is too long`)

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')

const time = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a time like 16:30')

export const parentRoles = ['Parent A', 'Parent B'] as const
export const responsibilityOptions = ['Parent A', 'Parent B', 'Both parents'] as const

export const expenseCategories = [
  'School fees',
  'Medical',
  'Clothing',
  'Activities',
  'Transport',
  'Other',
] as const

export const documentCategories = [
  'Custody agreement',
  'School report',
  'Medical record',
  'Birth certificate',
  'Other',
] as const

export const journalCategories = [
  'First word',
  'First step',
  'School achievement',
  'Health note',
  'Everyday moment',
] as const

export const registerSchema = z.object({
  name: trimmed(2, 80, 'Your name'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .max(72, 'That password is too long'),
  parentRole: z.enum(parentRoles),
  inviteEmail: z
    .union([z.string().trim().toLowerCase().email('Enter a valid email address'), z.literal('')])
    .optional(),
  ...captcha,
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

export const eventSchema = z.object({
  title: trimmed(2, 120, 'Event title'),
  date: isoDate,
  time,
  location: trimmed(2, 160, 'Location'),
  notes: z.string().trim().max(600).optional().default(''),
  responsible: z.enum(responsibilityOptions),
  ...captcha,
})

export const expenseSchema = z.object({
  category: z.enum(expenseCategories),
  amount: z.coerce
    .number()
    .positive('Enter an amount above zero')
    .max(5_000_000, 'That amount looks too large'),
  splitPercent: z.coerce.number().min(0).max(100).default(50),
  paidBy: z.enum(parentRoles),
  notes: z.string().trim().max(600).optional().default(''),
  receiptUrl: z.string().trim().url().optional().or(z.literal('')),
  ...captcha,
})

export const handoverSchema = z.object({
  date: isoDate,
  time,
  location: trimmed(2, 160, 'Location'),
  receivedBy: z.enum(parentRoles),
  conditionNotes: z.string().trim().max(800).optional().default(''),
  photoUrl: z.string().trim().url().optional().or(z.literal('')),
  ...captcha,
})

export const messageSchema = z.object({
  body: trimmed(1, 2000, 'Message'),
  sender: z.enum(parentRoles).optional(),
  ...captcha,
})

export const documentSchema = z.object({
  name: trimmed(2, 160, 'Document name'),
  category: z.enum(documentCategories),
  url: z.string().trim().url('Upload a file first'),
  size: z.coerce.number().nonnegative().optional(),
  ...captcha,
})

export const journalSchema = z.object({
  title: trimmed(2, 140, 'Title'),
  date: isoDate,
  category: z.enum(journalCategories),
  body: trimmed(2, 4000, 'Entry'),
  ...captcha,
})

export const enquirySchema = z.object({
  name: trimmed(2, 80, 'Your name'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: z.string().trim().max(30).optional().default(''),
  topic: z.string().trim().max(80).optional().default('General enquiry'),
  message: trimmed(10, 1500, 'Message'),
  ...captcha,
})

export type RegisterInput = z.infer<typeof registerSchema>
export type EventInput = z.infer<typeof eventSchema>
export type ExpenseInput = z.infer<typeof expenseSchema>
export type HandoverInput = z.infer<typeof handoverSchema>
export type JournalInput = z.infer<typeof journalSchema>

export function fieldErrors(error: z.ZodError) {
  const flat = error.flatten()
  return flat.fieldErrors as Record<string, string[] | undefined>
}
