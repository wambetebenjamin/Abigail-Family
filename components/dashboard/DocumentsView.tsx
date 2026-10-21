'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, FileText, FolderLock, Upload, X } from 'lucide-react'
import { CaptchaFallback, useRecaptcha } from '@/components/site/Recaptcha'
import { uploadFile } from '@/lib/client-api'
import { formatDate } from '@/lib/dates'
import type { DocumentRecord, ParentRole } from '@/lib/store'
import { documentCategories } from '@/lib/validation'

const sizeLabel = (bytes?: number) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsView({
  documents,
  parentRole,
  yourName,
  partnerName,
}: {
  documents: DocumentRecord[]
  parentRole: ParentRole
  yourName: string
  partnerName: string
}) {
  const router = useRouter()
  const { execute } = useRecaptcha()
  const fileInput = useRef<HTMLInputElement | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<string>(documentCategories[0])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [requiresV2, setRequiresV2] = useState(false)

  const nameFor = (role: ParentRole) => (role === parentRole ? `${yourName} (you)` : partnerName)

  const upload = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setRequiresV2(false)

    if (!file) {
      setError('Choose a file first.')
      return
    }

    setLoading(true)
    try {
      const recaptchaToken = await execute('upload_document')
      const result = await uploadFile(file, 'document', {
        name: name || file.name,
        category,
        recaptchaToken: recaptchaToken || '',
      })

      if (!result.ok) {
        setError(result.error || 'The upload did not finish. Please try again.')
        setRequiresV2(Boolean(result.requiresV2))
        return
      }

      setNotice(`${name || file.name} is now in the vault for both parents.`)
      setName('')
      setFile(null)
      if (fileInput.current) fileInput.current.value = ''
      setFormOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="card p-4 sm:p-5 xl:col-span-2" aria-labelledby="documents-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="documents-heading" className="text-lg text-ink">
              Document vault
            </h2>
            <p className="text-xs text-muted">
              Custody agreements, school reports, medical records and identity documents.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((value) => !value)}
            className="btn btn-primary px-4 text-[11px]"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload
          </button>
        </div>

        {notice ? (
          <p role="status" className="mt-3 rounded border border-leaf/30 bg-leaf/5 p-3 text-xs text-slatedeep">
            {notice}
          </p>
        ) : null}

        {documents.length ? (
          <ul className="mt-4 divide-y divide-line">
            {documents.map((document) => (
              <li key={document.id} className="flex items-start gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-sky-soft text-sky">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{document.name}</p>
                  <p className="text-[11px] text-muted">
                    {document.category} · {nameFor(document.uploadedBy)} ·{' '}
                    {formatDate(document.createdAt.slice(0, 10))}
                    {document.size ? ` · ${sizeLabel(document.size)}` : ''}
                  </p>
                </div>
                {document.url && document.url !== '#' ? (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${document.name}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="shrink-0 self-center rounded-full bg-surface px-2 py-1 text-[10px] font-semibold text-muted">
                    Sample record
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded border border-dashed border-line p-5 text-sm text-muted">
            The vault is empty. Start with the document you always need to find in a hurry, such as
            the custody agreement or the immunisation card.
          </div>
        )}
      </section>

      <section>
        {formOpen ? (
          <form onSubmit={upload} className="card p-4 sm:p-5" aria-label="Upload a document">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg text-ink">Upload a document</h2>
                <p className="text-xs text-muted">PDF, Word or image, up to 10 MB.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close the upload form"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slatedeep"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="document-name" className="field-label">
                  Document name
                </label>
                <input
                  id="document-name"
                  className="field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Term two school report"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="document-category" className="field-label">
                  Category
                </label>
                <select
                  id="document-category"
                  className="field"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {documentCategories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="field-label">File</span>
                <label
                  htmlFor="document-file"
                  className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border border-dashed border-line bg-surface px-3 text-sm text-muted transition hover:border-primary"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  {file ? file.name : 'Choose a file'}
                </label>
                <input
                  id="document-file"
                  ref={fileInput}
                  type="file"
                  accept="application/pdf,image/*,.doc,.docx"
                  className="sr-only"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>

              {error ? (
                <p role="alert" className="rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-3 text-xs text-[#b02a37]">
                  {error}
                </p>
              ) : null}

              {requiresV2 ? <CaptchaFallback onRetry={() => upload} retrying={loading} /> : null}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-70"
              >
                {loading ? 'Uploading' : 'Add to the vault'}
              </button>
            </div>
          </form>
        ) : (
          <div className="card p-5">
            <FolderLock className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-lg text-ink">Private by design</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Files are stored in Vercel Blob under unguessable links that only the two parents in
              this family space are given. No public profile, no search engine, no third-party
              advertising.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Anyone with a link can open a file, so share links carefully and keep sensitive
              originals in a safe place at home.
            </p>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="btn btn-outline mt-4 w-full"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload the first document
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
