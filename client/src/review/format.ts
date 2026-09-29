export function formatInterval(days: number) {
  if (days < 1) return 'ma'
  if (days < 30) return `${days} nap`
  if (days < 365) return `${Math.round(days / 30)} hónap`
  return `${(days / 365).toFixed(1).replace('.', ',')} év`
}

export function formatDue(iso: string) {
  const due = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const time = due.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
  if (due.toDateString() === now.toDateString()) return `ma ${time}`
  if (due.toDateString() === tomorrow.toDateString()) return `holnap ${time}`
  return due.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })
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
