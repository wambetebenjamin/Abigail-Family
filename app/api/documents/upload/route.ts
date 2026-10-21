import { put } from '@vercel/blob'
import { getParentSession } from '@/lib/session'
import { addDocument } from '@/lib/store'
import { verifyRecaptcha, captchaFailureResponse } from '@/lib/recaptcha'
import { documentSchema } from '@/lib/validation'
import { fail, invalid, ok } from '@/lib/api'

export const runtime = 'nodejs'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'upload'

/**
 * Uploads a document to Vercel Blob. Also used for expense receipts and
 * handover photos: those pass intent=receipt or intent=handover-photo and are
 * returned as a URL without creating a document vault record.
 */
export async function POST(request: Request) {
  const parent = await getParentSession()
  if (!parent) return fail('Please sign in again to upload a file.', 401)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return fail('We could not read that upload. Please try again.', 400)
  }

  const captcha = await verifyRecaptcha(
    typeof form.get('recaptchaToken') === 'string'
      ? (form.get('recaptchaToken') as string)
      : undefined,
    'upload_document',
  )
  if (!captcha.ok) return captchaFailureResponse(captcha)

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return fail('Choose a file to upload.', 422, { fieldErrors: { file: ['Choose a file'] } })
  }
  if (file.size > MAX_BYTES) {
    return fail('That file is larger than 10 MB.', 422, {
      fieldErrors: { file: ['Keep files under 10 MB'] },
    })
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return fail('That file type is not supported. Use a PDF, Word document or image.', 422, {
      fieldErrors: { file: ['Use a PDF, Word document or image'] },
    })
  }

  const intent = String(form.get('intent') || 'document')
  if (!['document', 'receipt', 'handover-photo'].includes(intent)) {
    return fail('Unknown upload type.', 400)
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return fail(
      'File storage is not configured on this deployment yet. Add BLOB_READ_WRITE_TOKEN and try again, or save this entry without a file.',
      503,
      { storageConfigured: false },
    )
  }

  try {
    const blob = await put(
      `families/${parent.familyId}/${intent}/${Date.now()}-${safeName(file.name)}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type || 'application/octet-stream',
      },
    )

    if (intent !== 'document') {
      return ok({ url: blob.url, size: file.size, stored: false }, 201)
    }

    const parsed = documentSchema.safeParse({
      name: form.get('name') || file.name,
      category: form.get('category') || 'Other',
      url: blob.url,
      size: file.size,
      recaptchaToken: form.get('recaptchaToken'),
    })
    if (!parsed.success) return invalid(parsed.error)

    const documents = await addDocument(parent.familyId, {
      name: parsed.data.name,
      category: parsed.data.category,
      url: parsed.data.url,
      size: parsed.data.size,
      uploadedBy: parent.parentRole,
    })

    return ok({ url: blob.url, document: documents[0], stored: true }, 201)
  } catch (error) {
    console.error('[blob] upload failed', error)
    return fail('We could not store that file. Please try again in a moment.', 502)
  }
}
