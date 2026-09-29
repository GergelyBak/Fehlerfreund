import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { notifyCardsChanged } from '../review/cardEvents'
import { formatDue, formatInterval, sameSentence } from '../review/format'
import { Highlight } from '../review/Highlight'
import type { Card, CardStats, UiGrade } from '../review/types'

const GRADES: { grade: UiGrade; label: string; key: string; className: string }[] = [
  { grade: 1, label: 'Nem tudtam', key: '1', className: 'bg-red-50 text-red-700 ring-red-200 hover:bg-red-100' },
  { grade: 3, label: 'Nehéz', key: '2', className: 'bg-amber-50 text-amber-800 ring-amber-200 hover:bg-amber-100' },
  { grade: 4, label: 'Jó', key: '3', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100' },
  { grade: 5, label: 'Könnyű', key: '4', className: 'bg-sky-50 text-sky-700 ring-sky-200 hover:bg-sky-100' },
]

export function ReviewPage() {
  const [queue, setQueue] = useState<Card[] | null>(null)
  const [stats, setStats] = useState<CardStats | null>(null)
  const [reviewed, setReviewed] = useState(0)
  const [sessionSize, setSessionSize] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Bumped by the "load more" button to fetch a fresh batch.
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([api<{ cards: Card[] }>('/cards/due?limit=20'), api<CardStats>('/cards/stats')])
      .then(([{ cards }, s]) => {
        if (cancelled) return
        setQueue(cards)
        setStats(s)
        setSessionSize(cards.length)
        setReviewed(0)
        setError(null)
      })
      .catch((err) => !cancelled && setError(errorMessage(err, 'Nem sikerült betölteni a kártyákat.')))
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const card = queue?.[0]

  const nextCard = useCallback(() => {
    setRevealed(false)
    setTyped('')
    setConfirmDelete(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const grade = useCallback(
    async (g: UiGrade) => {
      if (!card || busy) return
      setBusy(true)
      setError(null)
      try {
        const { card: updated } = await api<{ card: Card }>(`/cards/${card.id}/review`, {
          method: 'POST',
          body: JSON.stringify({ grade: g }),
        })
        // Forgotten cards come back at the end of this session, like Anki's relearning step.
        setQueue((q) => (q ? [...q.slice(1), ...(g === 1 ? [updated] : [])] : q))
        setReviewed((n) => n + 1)
        notifyCardsChanged()
        nextCard()
      } catch (err) {
        setError(errorMessage(err, 'Nem sikerült menteni az értékelést.'))
      } finally {
        setBusy(false)
      }
    },
    [card, busy, nextCard],
  )

  async function deleteCard() {
    if (!card) return
    setBusy(true)
    try {
      await api(`/cards/${card.id}`, { method: 'DELETE' })
      setQueue((q) => (q ? q.filter((c) => c.id !== card.id) : q))
      setSessionSize((n) => n - 1)
      notifyCardsChanged()
      nextCard()
    } catch (err) {
      setError(errorMessage(err, 'Nem sikerült törölni a kártyát.'))
    } finally {
      setBusy(false)
    }
  }

  // Keyboard: Enter reveals, 1–4 grade.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!card || busy) return
      if (!revealed) return
      const match = GRADES.find((g) => g.key === e.key)
      if (match) {
        e.preventDefault()
        void grade(match.grade)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, busy, revealed, grade])

  if (error && !queue) {
    return <p className="text-red-600">{error}</p>
  }
  if (!queue || !stats) return <p className="text-slate-500">Betöltés…</p>

  // Nothing due at all
  if (sessionSize === 0 && !card) {
    return (
      <EmptyState>
        {stats.total === 0 ? (
          <>
            <p className="text-4xl">🗂️</p>
            <h1 className="text-xl font-semibold">Még nincs kártyád</h1>
            <p className="text-slate-600">
              Beszélgess egyet: a hibáidból automatikusan kártyák lesznek, és itt ismételheted őket.
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl">🎉</p>
            <h1 className="text-xl font-semibold">Mára nincs több ismétlendő kártya</h1>
            <p className="text-slate-600">
              {stats.total} kártyád van összesen.
              {stats.nextDueAt && <> A következő esedékes: {formatDue(stats.nextDueAt)}.</>}
            </p>
          </>
        )}
        <Link to="/" className="inline-block rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
          Beszélgetés indítása
        </Link>
      </EmptyState>
    )
  }

  // Session finished
  if (!card) {
    return (
      <EmptyState>
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-semibold">Kész! {reviewed} ismétlés ebben a körben</h1>
        <p className="text-slate-600">Szép munka. A kártyák akkor jönnek vissza, amikor épp kezdenéd elfelejteni őket.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setReloadToken((n) => n + 1)}
            className="rounded-lg px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
          >
            Van még? Újratöltés
          </button>
          <Link to="/" className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
            Beszélgetés
          </Link>
        </div>
      </EmptyState>
    )
  }

  const typedCorrect = typed.trim() !== '' && sameSentence(typed, card.answer)
  const progress = Math.min(reviewed, sessionSize)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Ismétlés</span>
          <span>
            {progress} / {sessionSize}
            {queue.length > sessionSize - progress && ' · +újra'}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${sessionSize ? (progress / sessionSize) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-900">{card.errorType}</span>
          {card.occurrences > 1 && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
              {card.occurrences}× elkövetted ezt a hibát
            </span>
          )}
          {card.reviewCount === 0 && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">Új</span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Javítsd ki a hibát a mondatban:</p>
          <p className="text-xl leading-relaxed font-medium">
            {revealed ? (
              <Highlight sentence={card.prompt} fragment={card.original} className="bg-red-100 text-red-800" />
            ) : (
              card.prompt
            )}
          </p>
        </div>

        {!revealed ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setRevealed(true)
            }}
            className="space-y-3"
          >
            <textarea
              ref={inputRef}
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  setRevealed(true)
                }
              }}
              rows={2}
              placeholder="Írd be a helyes mondatot (nem kötelező), vagy csak gondold végig…"
              className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              Megoldás megmutatása <span className="text-indigo-200">(Enter)</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {typed.trim() && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${typedCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}
              >
                {typedCorrect ? '✓ Pontosan így!' : <>A te válaszod: {typed}</>}
              </p>
            )}
            <div className="space-y-1 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <p className="text-sm font-medium text-emerald-800">Helyesen:</p>
              <p className="text-lg">
                <Highlight sentence={card.answer} fragment={card.corrected} className="bg-emerald-200 text-emerald-900" />
              </p>
            </div>
            <p className="text-slate-700">
              <span className="text-red-600 line-through">{card.original}</span> →{' '}
              <span className="font-medium text-emerald-700">{card.corrected}</span>: {card.explanation}
            </p>

            <div className="space-y-2">
              <p className="text-sm text-slate-500">Mennyire ment?</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GRADES.map((g) => (
                  <button
                    key={g.grade}
                    onClick={() => void grade(g.grade)}
                    disabled={busy}
                    className={`rounded-lg px-3 py-2.5 text-center ring-1 transition disabled:opacity-50 ${g.className}`}
                  >
                    <span className="block font-medium">{g.label}</span>
                    <span className="block text-xs opacity-75">
                      {formatInterval(card.previews[g.grade])} · <kbd>{g.key}</kbd>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="text-center text-sm">
        {confirmDelete ? (
          <span className="space-x-3">
            <span className="text-slate-600">Biztosan törlöd ezt a kártyát?</span>
            <button onClick={() => void deleteCard()} disabled={busy} className="font-medium text-red-600 hover:underline">
              Törlés
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-slate-500 hover:underline">
              Mégse
            </button>
          </span>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="text-slate-400 hover:text-slate-600 hover:underline">
            Hibás a javítás? Kártya törlése
          </button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      {children}
    </div>
  )
}
