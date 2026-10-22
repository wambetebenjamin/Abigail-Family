'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin, Plus, X } from 'lucide-react'
import { CaptchaFallback } from '@/components/site/Recaptcha'
import { useApiForm } from '@/components/dashboard/useApiForm'
import {
  buildMonthGrid,
  formatDate,
  formatTime,
  monthLabel,
  shiftMonth,
  weekdayLabels,
  weekdayLabelsLong,
} from '@/lib/dates'
import type { CalendarEvent } from '@/lib/store'
import { responsibilityOptions } from '@/lib/validation'

const emptyForm = {
  title: '',
  date: '',
  time: '16:00',
  location: '',
  notes: '',
  responsible: 'Parent A',
}

export default function CalendarView({
  events,
  today,
  yourName,
  partnerName,
  parentRole,
}: {
  events: CalendarEvent[]
  today: string
  yourName: string
  partnerName: string
  parentRole: 'Parent A' | 'Parent B'
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [year, setYear] = useState(() => Number(today.slice(0, 4)))
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1)
  const [selected, setSelected] = useState(today)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<typeof emptyForm>({
    ...emptyForm,
    date: today,
    responsible: parentRole,
  })
  const formApi = useApiForm<{ event: CalendarEvent }>('/api/calendar/add-event', 'add_event')

  const grid = useMemo(() => buildMonthGrid(year, month, today), [year, month, today])
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [events])

  const selectedEvents = byDate.get(selected) ?? []

  const nameFor = (value: string) => {
    if (value === 'Parent A') return parentRole === 'Parent A' ? `${yourName} (you)` : partnerName
    if (value === 'Parent B') return parentRole === 'Parent B' ? `${yourName} (you)` : partnerName
    return 'Both parents'
  }

  const openForm = (date?: string) => {
    setForm((prev) => ({ ...prev, date: date || selected, responsible: parentRole }))
    setFormOpen(true)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await formApi.submit(form)
    if (result?.ok) {
      setForm({ ...emptyForm, date: form.date, responsible: parentRole })
      setFormOpen(false)
      if (form.date.slice(0, 7) !== selected.slice(0, 7)) {
        setYear(Number(form.date.slice(0, 4)))
        setMonth(Number(form.date.slice(5, 7)) - 1)
      }
      setSelected(form.date)
      router.refresh()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <section className="card p-4 sm:p-5 xl:col-span-2" aria-label="Shared calendar">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg text-ink sm:text-xl">{monthLabel(year, month)}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const next = shiftMonth(year, month, -1)
                setYear(next.year)
                setMonth(next.month)
              }}
              aria-label="Previous month"
              className="flex h-11 w-11 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                const next = shiftMonth(year, month, 1)
                setYear(next.year)
                setMonth(next.month)
              }}
              aria-label="Next month"
              className="flex h-11 w-11 items-center justify-center rounded border border-line text-slatedeep transition hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => openForm(selected)}
              className="btn btn-primary ml-1 px-3 text-[11px]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Event
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted sm:hidden">Swipe the grid sideways to see the full week.</p>

        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-7 gap-1">
              {weekdayLabels.map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted"
                >
                  <span className="sm:hidden">{day}</span>
                  <span className="hidden sm:inline">{weekdayLabelsLong[index].slice(0, 3)}</span>
                </div>
              ))}
              {grid.map((cell, index) => {
                if (!cell.iso) {
                  return <div key={`empty-${index}`} className="min-h-[58px] rounded bg-surface/50" />
                }
                const dayEvents = byDate.get(cell.iso) ?? []
                const isSelected = cell.iso === selected
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => setSelected(cell.iso as string)}
                    aria-pressed={isSelected}
                    aria-label={`${formatDate(cell.iso, 'long')}${dayEvents.length ? `, ${dayEvents.length} events` : ', no events'}`}
                    className={`min-h-[58px] rounded border p-1.5 text-left transition sm:min-h-[72px] ${
                      isSelected
                        ? 'border-primary bg-primary-soft'
                        : 'border-line bg-white hover:border-primary/40'
                    } ${cell.isToday && !isSelected ? 'ring-1 ring-primary/40' : ''}`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        cell.isToday ? 'text-primary' : 'text-slatedeep'
                      }`}
                    >
                      {cell.day}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      ))}
                      {dayEvents.length > 3 ? (
                        <span className="text-[9px] text-muted">+{dayEvents.length - 3}</span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" /> Shared event
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm ring-1 ring-primary/40" aria-hidden="true" /> Today
          </span>
        </div>
      </section>

      <section className="space-y-4" aria-live="polite">
        <div className="card p-4 sm:p-5">
          <p className="section-label">{formatDate(selected, 'long')}</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg text-ink">
            {selected === today ? 'Today' : `${selectedEvents.length} events`}
          </h2>

          {selectedEvents.length ? (
            <motion.ul
              key={selected}
              initial={reduce ? false : 'hidden'}
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              className="mt-3 space-y-2"
            >
              {selectedEvents.map((event) => (
                <motion.li
                  key={event.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.96, y: 8 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28 } },
                  }}
                  className="rounded border border-line bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{event.title}</p>
                    <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {nameFor(event.responsible)}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {formatTime(event.time)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {event.location}
                  </p>
                  {event.notes ? (
                    <p className="mt-2 border-t border-line pt-2 text-xs leading-relaxed text-slatedeep">
                      {event.notes}
                    </p>
                  ) : null}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mt-3 rounded border border-dashed border-line p-4 text-sm text-muted">
              Nothing planned for this day.
              <button
                type="button"
                onClick={() => openForm(selected)}
                className="mt-2 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                Add the first event
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => openForm(selected)}
            className="btn btn-outline mt-4 w-full"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add event on this day
          </button>
        </div>

        {formOpen ? (
          <form onSubmit={submit} className="card p-4 sm:p-5" aria-label="Add a calendar event">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg text-ink">Add an event</h2>
                <p className="text-xs text-muted">Both parents will see this straight away.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close the add event form"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slatedeep"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="event-title" className="field-label">
                  Title
                </label>
                <input
                  id="event-title"
                  className="field"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="School pick-up"
                  required
                  minLength={2}
                />
                {formApi.fieldErrors.title?.[0] ? (
                  <p className="mt-1 text-xs text-[#b02a37]">{formApi.fieldErrors.title[0]}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="event-date" className="field-label">
                    Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    className="field"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="event-time" className="field-label">
                    Time
                  </label>
                  <input
                    id="event-time"
                    type="time"
                    className="field"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-location" className="field-label">
                  Location
                </label>
                <input
                  id="event-location"
                  className="field"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="School gate, clinic, home"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="event-responsible" className="field-label">
                  Who is responsible?
                </label>
                <select
                  id="event-responsible"
                  className="field"
                  value={form.responsible}
                  onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                >
                  {responsibilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'Both parents'
                        ? 'Both parents'
                        : `${option} (${option === 'Parent A' ? 'A' : 'B'}: ${
                            option === parentRole ? yourName : partnerName
                          })`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="event-notes" className="field-label">
                  Notes (optional)
                </label>
                <textarea
                  id="event-notes"
                  className="field min-h-[88px]"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anything the other parent should know"
                  maxLength={600}
                />
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
                {formApi.loading ? 'Saving' : 'Save event'}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  )
}
