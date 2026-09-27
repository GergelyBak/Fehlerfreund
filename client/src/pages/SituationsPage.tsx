import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { useAuth } from '../auth/useAuth'
import { RecentConversations } from '../chat/RecentConversations'
import { useSituations } from '../chat/useSituations'
import type { Conversation, ConversationSummary } from '../chat/types'

export function SituationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { situations, error: situationsError } = useSituations()
  const [recent, setRecent] = useState<ConversationSummary[]>([])
  const [starting, setStarting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<{ conversations: ConversationSummary[] }>('/conversations')
      .then((r) => setRecent(r.conversations))
      .catch(() => {})
  }, [])

  async function start(situationId: string) {
    setStarting(situationId)
    setError(null)
    try {
      const { conversation } = await api<{ conversation: Conversation }>('/conversations', {
        method: 'POST',
        body: JSON.stringify({ situationId }),
      })
      navigate(`/chat/${conversation.id}`)
    } catch (err) {
      setError(errorMessage(err, 'Nem sikerült elindítani a beszélgetést.'))
      setStarting(null)
    }
  }

  const byId = new Map(situations?.map((s) => [s.id, s]))

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Hallo, {user?.displayName}!</h1>
          <p className="text-slate-600">
            Válassz egy helyzetet. A beszélgetőtársad a te szintedhez (<strong>{user?.level}</strong>) igazítja a nyelvezetét,
            az üzeneteidet pedig közben javítjuk.
          </p>
        </div>
        {(error || situationsError) && <p className="text-sm text-red-600">{error ?? situationsError}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {situations === null
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/60" />
              ))
            : situations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => start(s.id)}
                  disabled={starting !== null}
                  className="flex gap-4 rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-indigo-400 disabled:opacity-60"
                >
                  <span className="text-3xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="space-y-1">
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-slate-600">{s.description}</span>
                    {starting === s.id && <span className="block text-sm text-indigo-600">Indítás…</span>}
                  </span>
                </button>
              ))}
        </div>
      </section>

      <RecentConversations
        conversations={recent}
        situations={byId}
        onDeleted={(id) => setRecent((r) => r.filter((c) => c.id !== id))}
      />
    </div>
  )
}
