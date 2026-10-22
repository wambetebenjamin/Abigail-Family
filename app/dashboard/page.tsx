import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Handshake,
  MessageSquare,
  Plus,
  Wallet,
} from 'lucide-react'
import BalanceBar from '@/components/dashboard/BalanceBar'
import PageHeader from '@/components/dashboard/PageHeader'
import { computeBalances } from '@/lib/balances'
import { addDaysISO, formatDate, formatKes, formatTime, todayISO } from '@/lib/dates'
import { getParentSession } from '@/lib/session'
import {
  ensureDemoData,
  getFamilyMembers,
  listEvents,
  listExpenses,
  listMessages,
  type ParentRole,
} from '@/lib/store'

export const dynamic = 'force-dynamic'

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
  )
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const parent = await getParentSession()
  if (!parent) return null

  await ensureDemoData()
  const [events, expenses, messages, members] = await Promise.all([
    listEvents(parent.familyId),
    listExpenses(parent.familyId),
    listMessages(parent.familyId),
    getFamilyMembers(parent.familyId),
  ])

  const partnerRole: ParentRole = parent.parentRole === 'Parent A' ? 'Parent B' : 'Parent A'
  const partnerName = partnerRole === 'Parent A' ? members.parentAName : members.parentBName
  const today = todayISO()
  const weekAhead = addDaysISO(today, 7)

  const todayEvents = events.filter((event) => event.date === today)
  const upcomingHandovers = events
    .filter(
      (event) =>
        event.date > today && event.date <= weekAhead && event.responsible !== 'Both parents',
    )
    .slice(0, 3)
  const pendingExpenses = expenses.filter((expense) => expense.paidBy === partnerRole).slice(0, 3)
  const unread = messages.filter(
    (message) => message.sender !== parent.parentRole && !message.readBy.includes(parent.parentRole),
  )
  const balances = computeBalances(expenses, parent.parentRole)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={formatDate(today, 'long')}
        title={`${greeting()}, ${parent.name.split(' ')[0]}`}
        description="Here is the week at a glance. Small, calm steps from here."
        action={{ href: '/dashboard/calendar', label: 'Add an event' }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="card p-5" aria-labelledby="today-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <h2 id="today-heading" className="text-sm font-semibold uppercase tracking-[0.1em]">
                Today&apos;s schedule
              </h2>
            </div>
            <Link
              href="/dashboard/calendar"
              className="flex min-h-[44px] items-center gap-1 text-xs font-semibold text-primary"
            >
              Open calendar <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          {todayEvents.length ? (
            <ul className="mt-4 space-y-3">
              {todayEvents.map((event) => (
                <li key={event.id} className="flex gap-3 border-l-2 border-primary/30 pl-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary">{formatTime(event.time)}</p>
                    <p className="truncate text-sm font-medium text-ink">{event.title}</p>
                    <p className="truncate text-xs text-muted">
                      {event.location} · {event.responsible}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded border border-dashed border-line p-4 text-sm text-muted">
              Nothing on the calendar today. A quiet day is allowed.
              <Link
                href="/dashboard/calendar"
                className="mt-2 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Add something for this week
              </Link>
            </div>
          )}
        </section>

        <section className="card p-5" aria-labelledby="handover-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Handshake className="h-4 w-4" aria-hidden="true" />
              <h2 id="handover-heading" className="text-sm font-semibold uppercase tracking-[0.1em]">
                Upcoming handovers
              </h2>
            </div>
            <Link
              href="/dashboard/handovers"
              className="flex min-h-[44px] items-center gap-1 text-xs font-semibold text-primary"
            >
              Log a handover <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          {upcomingHandovers.length ? (
            <ul className="mt-4 space-y-3">
              {upcomingHandovers.map((event) => (
                <li key={event.id} className="rounded bg-surface p-3">
                  <p className="text-xs font-semibold text-slatedeep">{formatDate(event.date)}</p>
                  <p className="text-sm font-medium text-ink">{event.title}</p>
                  <p className="text-xs text-muted">
                    {formatTime(event.time)} · {event.responsible}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded border border-dashed border-line p-4 text-sm text-muted">
              No handovers in the next seven days. When one is planned, add it to the shared calendar
              so you both have it.
            </p>
          )}
        </section>

        <section className="card p-5" aria-labelledby="expense-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="h-4 w-4" aria-hidden="true" />
              <h2 id="expense-heading" className="text-sm font-semibold uppercase tracking-[0.1em]">
                Pending expense requests
              </h2>
            </div>
            <Link
              href="/dashboard/expenses"
              className="flex min-h-[44px] items-center gap-1 text-xs font-semibold text-primary"
            >
              Expenses <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-3 font-display text-2xl text-ink">{formatKes(balances.pendingShare)}</p>
          <p className="text-xs text-muted">your share of costs already paid by {partnerName}</p>

          {pendingExpenses.length ? (
            <ul className="mt-3 divide-y divide-line">
              {pendingExpenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="truncate text-slatedeep">{expense.category}</span>
                  <span className="shrink-0 text-xs text-muted">{formatKes(expense.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Nothing owed right now. That is a good place to be.</p>
          )}
        </section>

        <section className="card p-5" aria-labelledby="messages-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <h2 id="messages-heading" className="text-sm font-semibold uppercase tracking-[0.1em]">
                Unread messages
              </h2>
            </div>
            <Link
              href="/dashboard/messages"
              className="flex min-h-[44px] items-center gap-1 text-xs font-semibold text-primary"
            >
              Open thread <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-3 font-display text-2xl text-ink">
            {unread.length} {unread.length === 1 ? 'message' : 'messages'}
          </p>
          {unread.length ? (
            <div className="mt-2 space-y-2">
              {unread.slice(-2).map((message) => (
                <p key={message.id} className="rounded bg-surface p-2.5 text-xs leading-relaxed text-slatedeep">
                  {message.body.length > 110 ? `${message.body.slice(0, 110)}...` : message.body}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              You are up to date. No pressure to reply to anything.
            </p>
          )}
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceBar
            paidByYou={balances.paidByYou}
            paidByPartner={balances.paidByPartner}
            balance={balances.balance}
            yourName={parent.name}
            partnerName={partnerName}
          />
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-primary">
            Quick actions
          </h2>
          <ul className="mt-3 space-y-1">
            {[
              { href: '/dashboard/calendar', label: 'Add a calendar event' },
              { href: '/dashboard/expenses', label: 'Record a shared cost' },
              { href: '/dashboard/handovers', label: 'Log a handover' },
              { href: '/dashboard/journal', label: 'Write a private note' },
            ].map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="flex min-h-[44px] items-center justify-between gap-2 border-b border-line text-sm text-slatedeep transition hover:text-primary"
                >
                  {action.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
