'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Send } from 'lucide-react'
import { CaptchaFallback } from '@/components/site/Recaptcha'
import { useApiForm } from '@/components/dashboard/useApiForm'
import { relativeTime } from '@/lib/dates'
import type { Message, ParentRole } from '@/lib/store'

export default function MessagesView({
  messages,
  parentRole,
  yourName,
  partnerName,
}: {
  messages: Message[]
  parentRole: ParentRole
  yourName: string
  partnerName: string
}) {
  const router = useRouter()
  const formApi = useApiForm<{ message: Message }>('/api/messages/send', 'send_message')
  const [thread, setThread] = useState<Message[]>(messages)
  const [body, setBody] = useState('')
  const [sentCount, setSentCount] = useState(0)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setThread(messages)
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [thread.length])

  const send = async (event?: React.FormEvent) => {
    event?.preventDefault()
    const value = body.trim()
    if (!value || formApi.loading) return

    const result = await formApi.submit({ body: value })
    if (result?.ok && result.message) {
      setThread((prev) => [...prev, result.message as Message])
      setBody('')
      setSentCount((count) => count + 1)
      router.refresh()
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              {yourName.split(' ')[0]} and {partnerName.split(' ')[0]}
            </p>
            <p className="text-[11px] text-muted">Private thread, just the two of you</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            <Lock className="h-3 w-3 text-leaf" aria-hidden="true" />
            Encrypted
          </span>
        </div>

        <div
          className="max-h-[52vh] min-h-[280px] space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
          aria-live="polite"
          aria-label="Message thread"
        >
          {thread.length ? (
            thread.map((message) => {
              const mine = message.sender === parentRole
              return (
                <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] ${mine ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        mine
                          ? 'rounded-tr-sm bg-primary text-white'
                          : 'rounded-tl-sm bg-surface text-slatedeep'
                      }`}
                    >
                      {message.body}
                    </div>
                    <p className="mt-1 px-1 text-[10px] text-muted">
                      {mine ? 'You' : partnerName.split(' ')[0]} · {relativeTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-medium text-ink">No messages yet</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">
                Start with something practical: a pick-up time, a question about homework, or a
                thank you. The thread stays between the two of you.
              </p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="border-t border-line p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <label htmlFor="message-body" className="sr-only">
              Write a message
            </label>
            <textarea
              id="message-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              maxLength={2000}
              placeholder="Write a message to your co-parent"
              className="field min-h-[44px] flex-1 resize-none py-2.5"
            />
            <motion.button
              type="submit"
              disabled={formApi.loading || !body.trim()}
              whileTap={{ scale: 0.92 }}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-primary text-white transition disabled:opacity-50"
            >
              <motion.span
                key={sentCount}
                initial={false}
                animate={sentCount > 0 ? { scale: [1, 1.25, 0.95, 1] } : { scale: 1 }}
                transition={{ duration: 0.36 }}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </motion.span>
            </motion.button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
            <span>Enter sends, Shift and Enter adds a line</span>
            <span>{body.length}/2000</span>
          </div>

          {formApi.error ? (
            <p role="alert" className="mt-2 rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-2.5 text-xs text-[#b02a37]">
              {formApi.error}
            </p>
          ) : null}

          {formApi.requiresV2 ? (
            <CaptchaFallback onRetry={() => formApi.retry()} retrying={formApi.loading} />
          ) : null}
        </form>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-muted">
        Messages are stored in Vercel KV for your family space. Keep them about your child: written
        words last longer than spoken ones.
      </p>
    </div>
  )
}
