import { useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import type { ConversationSummary, Situation } from './types'

export function RecentConversations({
  conversations,
  situations,
  onDeleted,
}: {
  conversations: ConversationSummary[]
  situations: Map<string, Situation>
  onDeleted: (id: string) => void
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function remove(id: string) {
    setDeletingId(id)
    setError(null)
    try {
      await api(`/conversations/${id}`, { method: 'DELETE' })
      onDeleted(id)
    } catch (err) {
      setError(errorMessage(err, 'Nem sikerült törölni a beszélgetést.'))
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  if (conversations.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Korábbi beszélgetések</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        {conversations.map((c) => {
          const s = situations.get(c.situationId)
          const confirming = confirmingId === c.id
          const deleting = deletingId === c.id

          if (confirming) {
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 bg-red-50 px-4 py-3">
                <span className="text-sm text-red-800">
                  Biztosan törlöd a(z) <strong>{s?.title ?? 'beszélgetés'}</strong> beszélgetést? Ez nem vonható vissza.
                </span>
                <span className="flex gap-2">
                  <button
                    onClick={() => setConfirmingId(null)}
                    disabled={deleting}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    Mégse
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={deleting}
                    autoFocus
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {deleting ? 'Törlés…' : 'Törlés'}
                  </button>
                </span>
              </li>
            )
          }

          return (
            <li key={c.id} className="group flex items-center hover:bg-slate-50">
              <Link to={`/chat/${c.id}`} className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4">
                <span className="text-xl" aria-hidden>
                  {s?.emoji ?? '💬'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {s?.title ?? c.situationId} · {c.level}
                  </span>
                  <span className="block truncate text-sm text-slate-500">{c.lastMessage}</span>
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(c.updatedAt).toLocaleDateString('hu-HU')}
                </span>
              </Link>
              <button
                onClick={() => setConfirmingId(c.id)}
                className="mx-2 grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:outline-none"
                aria-label={`${s?.title ?? 'Beszélgetés'} törlése`}
                title="Törlés"
              >
                <TrashIcon />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  )
}
