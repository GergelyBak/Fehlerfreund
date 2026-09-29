import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { PASS_SCORE, type TopicSummary } from '../grammar/types'

export function GrammarPage() {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<{ topics: TopicSummary[] }>('/grammar/topics')
      .then((r) => setTopics(r.topics))
      .catch((err) => setError(errorMessage(err, 'Nem sikerült betölteni a témaköröket.')))
  }, [])

  const passed = topics?.filter((t) => (t.progress?.bestScore ?? 0) >= PASS_SCORE).length ?? 0

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">📘 Nyelvtan – A2</h1>
        <p className="text-slate-600">
          Tankönyvi sorrendben: olvasd el a tananyagot, aztán oldd meg a tesztet. A rossz válaszaidból kártyák lesznek az
          ismétlőpakliban.
        </p>
        {topics && (
          <p className="text-sm text-slate-500">
            {passed} / {topics.length} témakör teljesítve (legalább {Math.round(PASS_SCORE * 100)}%)
          </p>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <ol className="grid gap-3 sm:grid-cols-2">
        {(topics ?? []).map((t) => {
          const best = t.progress?.bestScore ?? 0
          const done = best >= PASS_SCORE
          return (
            <li key={t.id}>
              <Link
                to={`/grammar/${t.id}`}
                className="flex h-full gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-indigo-400"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    done ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {done ? '✓' : t.order}
                </span>
                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="block font-semibold">{t.title}</span>
                  <span className="block text-sm text-slate-600">{t.summary}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{t.exerciseCount} feladat</span>
                    {t.progress && (
                      <>
                        <span aria-hidden>·</span>
                        <span>Legjobb: {Math.round(best * 100)}%</span>
                      </>
                    )}
                  </span>
                  {t.progress && (
                    <span className="block h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className={`block h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                        style={{ width: `${Math.round(best * 100)}%` }}
                      />
                    </span>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
        {topics === null &&
          !error &&
          Array.from({ length: 4 }, (_, i) => <li key={i} className="h-32 animate-pulse rounded-xl bg-slate-200/60" />)}
      </ol>
    </div>
  )
}
