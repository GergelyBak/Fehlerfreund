import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { ActivityChart, Card, CardStageBar, ErrorTypeBars, GrammarMeters, StatTile } from '../stats/charts'
import { ERROR_LABELS } from '../stats/errorLabels'
import type { Stats } from '../stats/types'

const pct = (x: number) => `${Math.round(x * 100)}%`

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    api<Stats>(`/stats?tz=${encodeURIComponent(tz)}`)
      .then(setStats)
      .catch((err) => setError(errorMessage(err, 'Nem sikerült betölteni a statisztikát.')))
  }, [])

  if (error) return <p className="text-red-600">{error}</p>
  if (!stats) return <p className="text-slate-500">Betöltés…</p>

  const { errorFree } = stats
  const weakest = stats.errorTypes[0]
  const noActivityYet = stats.totalMessages === 0 && stats.cards.total === 0 && stats.grammar.attempted === 0

  const errorFreeDelta =
    errorFree.last7 !== null && errorFree.previous7 !== null
      ? (() => {
          const diff = Math.round((errorFree.last7 - errorFree.previous7) * 100)
          return {
            text: `${diff > 0 ? '+' : diff < 0 ? '−' : '±'}${Math.abs(diff)} százalékpont az előző 7 naphoz képest`,
            good: diff === 0 ? null : diff > 0,
          }
        })()
      : undefined

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">📊 Statisztika</h1>
        <p className="text-slate-600">Hol tartasz, és mire érdemes most figyelned.</p>
      </div>

      {noActivityYet ? (
        <div className="space-y-3 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-4xl">🌱</p>
          <p className="font-semibold">Még nincs mit mutatni</p>
          <p className="text-slate-600">Beszélgess egyet, vagy oldj meg egy nyelvtani tesztet, és itt látod majd a haladásodat.</p>
          <Link to="/" className="inline-block rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
            Beszélgetés indítása
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Napi sorozat"
              value={`${stats.streak} nap`}
              note={stats.streak > 0 ? '🔥 Ne szakítsd meg!' : 'Gyakorolj ma, és elindul.'}
            />
            <StatTile
              label="Hibátlan üzenetek (7 nap)"
              value={errorFree.last7 === null ? '–' : pct(errorFree.last7)}
              delta={errorFreeDelta}
              note={errorFree.last7 === null ? 'Ezen a héten még nem volt ellenőrzött üzenet.' : undefined}
            />
            <StatTile
              label="Kártyák"
              value={String(stats.cards.total)}
              note={`${stats.cards.mature} megy · ${stats.cards.due} esedékes`}
            />
            <StatTile
              label="Nyelvtan"
              value={`${stats.grammar.passed} / ${stats.grammar.topics.length}`}
              note="teljesített témakör (80%+)"
            />
          </div>

          {weakest && (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-indigo-50 p-5 ring-1 ring-indigo-100">
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-700">Leggyengébb területed most</p>
                <p className="text-xl font-bold text-slate-900">
                  {ERROR_LABELS[weakest.errorType].hu}{' '}
                  <span className="text-base font-medium text-slate-500">({weakest.errorType})</span>
                </p>
                <p className="text-sm text-slate-600">
                  {weakest.mistakes} hiba · {ERROR_LABELS[weakest.errorType].hint}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/review?type=${encodeURIComponent(weakest.errorType)}${weakest.due ? '' : '&ahead=1'}`}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                >
                  {weakest.due ? `Gyakorlás (${weakest.due} esedékes kártya)` : `Gyakorlás előre (${weakest.cards} kártya)`}
                </Link>
                {weakest.topics.slice(0, 2).map((t) => (
                  <Link
                    key={t.id}
                    to={`/grammar/${t.id}`}
                    className="rounded-lg bg-white px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
                  >
                    📘 {t.title.split(':')[0]}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Hibák típus szerint" subtitle="A hibáidból készült kártyák alapján. Kattints egy sorra a célzott gyakorláshoz.">
              {stats.errorTypes.length ? (
                <ErrorTypeBars items={stats.errorTypes} />
              ) : (
                <p className="text-sm text-slate-500">Még nincs hibakártyád. Ez jó hír!</p>
              )}
            </Card>

            <Card title="Aktivitás" subtitle="Elküldött üzenetek és kártyaismétlések, az elmúlt 14 nap">
              <ActivityChart days={stats.activity} />
            </Card>

            <Card title="Kártyák állapota" subtitle="Egy kártya akkor „megy”, ha legalább 21 napos időközzel jön vissza.">
              {stats.cards.total ? (
                <CardStageBar cards={stats.cards} />
              ) : (
                <p className="text-sm text-slate-500">Még nincs kártyád.</p>
              )}
            </Card>

            <Card title="Nyelvtan" subtitle={`${stats.grammar.attempted} témakört próbáltál ki, ${stats.grammar.passed} teljesítve.`}>
              <GrammarMeters topics={stats.grammar.topics} />
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
