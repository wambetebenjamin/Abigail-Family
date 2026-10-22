'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bold, Italic, List, Lock, PenLine } from 'lucide-react'
import { CaptchaFallback } from '@/components/site/Recaptcha'
import { useApiForm } from '@/components/dashboard/useApiForm'
import { formatDate } from '@/lib/dates'
import type { JournalEntry } from '@/lib/store'
import { journalCategories } from '@/lib/validation'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

/** Deliberately small formatter: escape first, then allow bold, italic and lists. */
function renderJournalBody(body: string): string {
  const escaped = escapeHtml(body)
  const withBlocks = escaped
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n')
      const isList = lines.every((line) => line.trim().startsWith('- '))
      const inline = (text: string) =>
        text
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>')

      if (isList) {
        const items = lines
          .map((line) => `<li>${inline(line.trim().slice(2))}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${inline(lines.join('<br />'))}</p>`
    })
    .join('')
  return withBlocks
}

export default function JournalView({
  entries,
  today,
  yourName,
}: {
  entries: JournalEntry[]
  today: string
  yourName: string
}) {
  const router = useRouter()
  const formApi = useApiForm<{ entry: JournalEntry }>('/api/journal/add', 'add_journal')
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today)
  const [category, setCategory] = useState<string>(journalCategories[0])
  const [body, setBody] = useState('')

  const applyFormat = (marker: string, isList = false) => {
    const element = textRef.current
    if (!element) return
    const start = element.selectionStart
    const end = element.selectionEnd
    const selected = body.slice(start, end) || 'your words here'

    let next = body
    if (isList) {
      const prefixed = selected
        .split('\n')
        .map((line) => `- ${line}`)
        .join('\n')
      next = `${body.slice(0, start)}${prefixed}${body.slice(end)}`
    } else {
      next = `${body.slice(0, start)}${marker}${selected}${marker}${body.slice(end)}`
    }
    setBody(next)
    window.requestAnimationFrame(() => {
      element.focus()
      const offset = isList ? 2 : marker.length
      element.setSelectionRange(start + offset, start + offset + selected.length)
    })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await formApi.submit({ title, date, category, body })
    if (result?.ok) {
      setTitle('')
      setBody('')
      setCategory(journalCategories[0])
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="card p-4 sm:p-5 lg:col-span-2" aria-labelledby="journal-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="journal-heading" className="text-lg text-ink">
              Your private journal
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Lock className="h-3 w-3 text-leaf" aria-hidden="true" />
              Only you can see these entries, not even your co-parent.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="btn btn-primary px-4 text-[11px]"
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
            New entry
          </button>
        </div>

        {entries.length ? (
          <ul className="mt-5 space-y-4">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
                    {entry.category}
                  </span>
                  <p className="text-[11px] text-muted">{formatDate(entry.date, 'long')}</p>
                </div>
                <h3 className="mt-2 text-base text-ink sm:text-lg">{entry.title}</h3>
                <div
                  className="prose-legal mt-1 text-sm leading-relaxed text-slatedeep [&_p]:mb-2 [&_p]:text-sm [&_p]:text-slatedeep [&_li]:text-sm [&_strong]:font-semibold [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: renderJournalBody(entry.body) }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded border border-dashed border-line p-5 text-sm text-muted">
            Nothing written yet. The first word, the first step, the day they made you laugh. Start
            small, {yourName.split(' ')[0]}.
          </div>
        )}
      </section>

      <section>
        {open ? (
          <form onSubmit={submit} className="card p-4 sm:p-5" aria-label="New journal entry">
            <h2 className="text-lg text-ink">New entry</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label htmlFor="journal-title" className="field-label">
                  Title
                </label>
                <input
                  id="journal-title"
                  className="field"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="First lost tooth"
                  required
                  minLength={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="journal-date" className="field-label">
                    Date
                  </label>
                  <input
                    id="journal-date"
                    type="date"
                    className="field"
                    value={date}
                    max={today}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="journal-category" className="field-label">
                    Category
                  </label>
                  <select
                    id="journal-category"
                    className="field"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {journalCategories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="journal-body" className="field-label">
                    Entry
                  </label>
                  <div className="mb-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => applyFormat('**')}
                      aria-label="Bold"
                      className="flex h-9 w-9 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
                    >
                      <Bold className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('_')}
                      aria-label="Italic"
                      className="flex h-9 w-9 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
                    >
                      <Italic className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('', true)}
                      aria-label="Bulleted list"
                      className="flex h-9 w-9 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
                    >
                      <List className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <textarea
                  id="journal-body"
                  ref={textRef}
                  className="field min-h-[160px]"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="What happened today? How did it feel?"
                  required
                  minLength={2}
                  maxLength={4000}
                />
                <p className="mt-1 text-[11px] text-muted">
                  Select text, then use the buttons for bold, italic or a list.
                </p>
              </div>

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
                {formApi.loading ? 'Saving entry' : 'Save entry'}
              </button>
              <p className="text-[11px] leading-relaxed text-muted">
                Private entries stay on your account. You can ask us to export or delete them at any
                time.
              </p>
            </div>
          </form>
        ) : (
          <div className="card p-5">
            <Lock className="h-6 w-6 text-leaf" aria-hidden="true" />
            <h2 className="mt-3 text-lg text-ink">A journal with one reader</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Some memories are yours alone. Write the milestones, the funny sentences and the hard
              days without an audience. Entries are never shown to your co-parent.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-outline mt-4 w-full"
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Write the first entry
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
