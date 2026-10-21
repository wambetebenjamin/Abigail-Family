'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { CaptchaFallback } from '@/components/site/Recaptcha'
import { useApiForm } from '@/components/dashboard/useApiForm'

const topics = [
  'General enquiry',
  'Getting started',
  'Family Plan billing',
  'Data protection request',
  'Partnership or press',
]

export default function EnquiryForm() {
  const formApi = useApiForm<Record<string, unknown>>('/api/send-enquiry', 'send_enquiry')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: topics[0],
    message: '',
  })
  const [done, setDone] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await formApi.submit(form)
    if (result?.ok) {
      setDone(true)
      setForm({ name: '', email: '', phone: '', topic: topics[0], message: '' })
    }
  }

  if (done) {
    return (
      <div className="rounded-md border border-leaf/30 bg-leaf/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-leaf" aria-hidden="true" />
        <p className="mt-3 text-base font-semibold text-ink">Thank you, your message is with us</p>
        <p className="mt-1 text-sm text-muted">
          We reply within one working day. If it is urgent, WhatsApp is faster.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="btn btn-outline mt-4 w-full sm:w-auto"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Send us a message">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className="field-label">
            Your name
          </label>
          <input
            id="enquiry-name"
            className="field"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
            minLength={2}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="enquiry-email" className="field-label">
            Email
          </label>
          <input
            id="enquiry-email"
            type="email"
            className="field"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="enquiry-phone" className="field-label">
            Phone (optional)
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            className="field"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            autoComplete="tel"
            placeholder="07xx xxx xxx"
          />
        </div>
        <div>
          <label htmlFor="enquiry-topic" className="field-label">
            What is this about?
          </label>
          <select
            id="enquiry-topic"
            className="field"
            value={form.topic}
            onChange={(event) => setForm({ ...form, topic: event.target.value })}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-message" className="field-label">
          Message
        </label>
        <textarea
          id="enquiry-message"
          className="field min-h-[120px]"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
          minLength={10}
          maxLength={1500}
          placeholder="Tell us what you need. There is no wrong question."
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

      <button type="submit" disabled={formApi.loading} className="btn btn-primary w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" />
        {formApi.loading ? 'Sending' : 'Send message'}
      </button>
      <p className="text-[11px] leading-relaxed text-muted">
        We use your details only to reply. We do not add you to marketing lists without asking.
      </p>
    </form>
  )
}
