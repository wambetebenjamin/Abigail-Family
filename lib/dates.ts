export const NAIROBI_TZ = 'Africa/Nairobi'

export function todayISO(reference: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: NAIROBI_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(reference)
}

export function addDaysISO(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
  const date = new Date(`${iso}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-KE', {
    timeZone: 'UTC',
    weekday: style === 'long' ? 'long' : undefined,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date)
}

export function formatTime(value: string): string {
  const [hour, minute] = value.split(':').map(Number)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value
  const suffix = hour >= 12 ? 'pm' : 'am'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:${String(minute).padStart(2, '0')} ${suffix}`
}

export function formatKes(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function relativeTime(isoTimestamp: string): string {
  const then = new Date(isoTimestamp).getTime()
  const minutes = Math.round((Date.now() - then) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(new Date(then).toISOString().slice(0, 10))
}

export type MonthCell = {
  iso: string | null
  day: number | null
  isToday: boolean
  isCurrentMonth: boolean
}

export function buildMonthGrid(year: number, month: number, today = todayISO()): MonthCell[] {
  const first = new Date(Date.UTC(year, month, 1))
  const startWeekday = first.getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: MonthCell[] = []

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ iso: null, day: null, isToday: false, isCurrentMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ iso, day, isToday: iso === today, isCurrentMonth: true })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: null, isToday: false, isCurrentMonth: false })
  }
  return cells
}

export function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-KE', { month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(year, month, 1)),
  )
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(Date.UTC(year, month + delta, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
export const weekdayLabelsLong = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const
