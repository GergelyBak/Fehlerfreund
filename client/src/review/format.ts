import { activeMessages } from '../i18n/context'

export function formatInterval(days: number) {
  const t = activeMessages().time
  if (days < 1) return t.today
  if (days < 30) return t.days(days)
  if (days < 365) return t.months(Math.round(days / 30))
  return t.years((days / 365).toFixed(1).replace('.', t.decimal))
}

export function formatDue(iso: string) {
  const { time: t, locale } = activeMessages()
  const due = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  if (due.toDateString() === now.toDateString()) return t.todayAt(time)
  if (due.toDateString() === tomorrow.toDateString()) return t.tomorrowAt(time)
  return due.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
}

// Loose comparison for the optional typed answer: case, punctuation and
// spacing don't matter, the words do.
export function sameSentence(a: string, b: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,!?;:"„“”']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  return norm(a) === norm(b)
}
