'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, Handshake, MapPin, Plus, X } from 'lucide-react'
import { CaptchaFallback, useRecaptcha } from '@/components/site/Recaptcha'
import { useApiForm } from '@/components/dashboard/useApiForm'
import { uploadFile } from '@/lib/client-api'
import { formatDate, formatTime } from '@/lib/dates'
import type { Handover, ParentRole } from '@/lib/store'
import { parentRoles } from '@/lib/validation'

export default function HandoversView({
  handovers,
  today,
  parentRole,
  yourName,
  partnerName,
}: {
  handovers: Handover[]
  today: string
  parentRole: ParentRole
  yourName: string
  partnerName: string
}) {
  const router = useRouter()
  const { execute } = useRecaptcha()
  const formApi = useApiForm<{ handover: Handover }>('/api/handovers/add', 'add_handover')
  const fileInput = useRef<HTMLInputElement | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('18:00')
  const [location, setLocation] = useState('')
  const [receivedBy, setReceivedBy] = useState<ParentRole>(
    parentRole === 'Parent A' ? 'Parent B' : 'Parent A',
  )
  const [conditionNotes, setConditionNotes] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [uploadNote, setUploadNote] = useState<string | null>(null)

  const nameFor = (role: ParentRole) => (role === parentRole ? `${yourName} (you)` : partnerName)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setUploadNote(null)

    let photoUrl = ''
    if (photo) {
      const recaptchaToken = await execute('upload_document')
      const uploaded = await uploadFile(photo, 'handover-photo', {
        recaptchaToken: recaptchaToken || '',
      })
      if (uploaded.ok && uploaded.url) {
        photoUrl = uploaded.url
      } else {
        setUploadNote(
          `${uploaded.error || 'The photo could not be uploaded.'} You can still save the handover note without it.`,
        )
      }
    }

    const result = await formApi.submit({
      date,
      time,
      location,
      receivedBy,
      conditionNotes,
      photoUrl,
    })

    if (result?.ok) {
      setLocation('')
      setConditionNotes('')
      setPhoto(null)
      if (fileInput.current) fileInput.current.value = ''
      setFormOpen(false)
      router.refresh()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="card p-4 sm:p-5 xl:col-span-2" aria-labelledby="handover-log-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="handover-log-heading" className="text-lg text-ink">
              Handover history
            </h2>
            <p className="text-xs text-muted">Newest first. A calm record, not a scoreboard.</p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((value) => !value)}
            className="btn btn-primary px-4 text-[11px]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Log handover
          </button>
        </div>

        {handovers.length ? (
          <ol className="mt-5 border-l border-line pl-4 sm:pl-5">
            {handovers.map((handover) => (
              <li key={handover.id} className="relative pb-6 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[22px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-primary sm:-left-[26px]"
                />
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-sm font-semibold text-ink">
                    {formatDate(handover.date, 'long')}
                  </p>
                  <p className="text-xs text-muted">{formatTime(handover.time)}</p>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {handover.location}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slatedeep">
                  <Handshake className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                  Received by {nameFor(handover.receivedBy)}
                </p>
                {handover.conditionNotes ? (
                  <p className="mt-2 rounded bg-surface p-2.5 text-xs leading-relaxed text-slatedeep">
                    {handover.conditionNotes}
                  </p>
                ) : null}
                {handover.photoUrl && handover.photoUrl !== '#' ? (
                  <a
                    href={handover.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary"
                  >
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    View handover photo
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 rounded border border-dashed border-line p-5 text-sm text-muted">
            No handovers logged yet. The first entry takes about a minute and can be worth a lot of
            peace of mind later.
          </div>
        )}
      </section>

      <section>
        {formOpen ? (
          <form onSubmit={submit} className="card p-4 sm:p-5" aria-label="Log a handover">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg text-ink">Log a handover</h2>
                <p className="text-xs text-muted">Facts only. It reads better in a year.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close the handover form"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slatedeep"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="handover-date" className="field-label">
                    Date
                  </label>
                  <input
                    id="handover-date"
                    type="date"
                    className="field"
                    value={date}
                    max={today}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="handover-time" className="field-label">
                    Time
                  </label>
                  <input
                    id="handover-time"
                    type="time"
                    className="field"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="handover-location" className="field-label">
                  Location
                </label>
                <input
                  id="handover-location"
                  className="field"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="School gate, Karen centre"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="handover-received" className="field-label">
                  Who received your child?
                </label>
                <select
                  id="handover-received"
                  className="field"
                  value={receivedBy}
                  onChange={(event) => setReceivedBy(event.target.value as ParentRole)}
                >
                  {parentRoles.map((role) => (
                    <option key={role} value={role}>
                      {role} ({nameFor(role)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="handover-notes" className="field-label">
                  Condition notes
                </label>
                <textarea
                  id="handover-notes"
                  className="field min-h-[96px]"
                  value={conditionNotes}
                  onChange={(event) => setConditionNotes(event.target.value)}
                  placeholder="How was your child? Mood, health, homework, anything packed."
                  maxLength={800}
                />
              </div>

              <div>
                <span className="field-label">Photo (optional)</span>
                <label
                  htmlFor="handover-photo"
                  className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border border-dashed border-line bg-surface px-3 text-sm text-muted transition hover:border-primary"
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  {photo ? photo.name : 'Attach a photo'}
                </label>
                <input
                  id="handover-photo"
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                />
              </div>

              {uploadNote ? (
                <p role="status" className="rounded border border-tertiary/40 bg-tertiary/10 p-3 text-xs text-slatedeep">
                  {uploadNote}
                </p>
              ) : null}

              {formApi.error ? (
                <p role="alert" className="rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-3 text-xs text-[#b02a37]">
                  {formApi.error}
                </p>
              ) : null}

              {formApi.requiresV2 ? (
                <CaptchaFallback onRetry={() => formApi.retry()} retrying={formApi.loading} />
              ) : null}

              <button
                type="submit"
                disabled={formApi.loading}
                className="btn btn-primary w-full disabled:opacity-70"
              >
                {formApi.loading ? 'Saving' : 'Save handover'}
              </button>
            </div>
          </form>
        ) : (
          <div className="card p-5">
            <CheckCircle2 className="h-6 w-6 text-leaf" aria-hidden="true" />
            <h2 className="mt-3 text-lg text-ink">Why keep a record?</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Handover notes give both parents the same facts: who was there, how your child seemed,
              and what travelled between homes. If a matter ever reaches the Children Court, a dated
              record is calmer and more credible than memory.
            </p>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="btn btn-outline mt-4 w-full"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log today&apos;s handover
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Abigail Family is not a law firm. A log supports your account of events but does not
              replace legal advice.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
