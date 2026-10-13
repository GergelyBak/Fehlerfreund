import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { ActivityChart, Card, CardStageBar, ErrorTypeBars, GrammarMeters, StatTile } from '../stats/charts'
import { activeMessages, useI18n } from '../i18n/context'
import { ReminderSettings } from '../stats/ReminderSettings'
import type { Stats } from '../stats/types'

const pct = (x: number) => `${Math.round(x * 100)}%`

export function StatsPage() {
  const { t, lang } = useI18n()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    api<Stats>(`/stats?tz=${encodeURIComponent(tz)}&lang=${lang}`)
      .then(setStats)
      .catch((err) => setError(errorMessage(err, activeMessages().stats.loadFailed)))
  }, [lang])

  if (error) return <p className="text-red-600">{error}</p>
  if (!stats) return <p className="text-slate-500">{t.common.loading}</p>

  const { errorFree } = stats
  const weakest = stats.errorTypes[0]
  const noActivityYet = stats.totalMessages === 0 && stats.cards.total === 0 && stats.grammar.attempted === 0

  const errorFreeDelta =
    errorFree.last7 !== null && errorFree.previous7 !== null
      ? (() => {
          const diff = Math.round((errorFree.last7 - errorFree.previous7) * 100)
          return {
            text: t.stats.delta(diff > 0 ? '+' : diff < 0 ? '−' : '±', Math.abs(diff)),
            good: diff === 0 ? null : diff > 0,
          }
        })()
      : undefined

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t.stats.title}</h1>
        <p className="text-slate-600">{t.stats.intro}</p>
      </div>

      {noActivityYet ? (
        <div className="space-y-3 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-4xl">🌱</p>
          <p className="font-semibold">{t.stats.emptyTitle}</p>
          <p className="text-slate-600">{t.stats.emptyText}</p>
          <Link to="/" className="inline-block rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
            {t.common.startChat}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label={t.stats.streak}
              value={t.stats.streakValue(stats.streak)}
              note={stats.streak > 0 ? t.stats.streakOn : t.stats.streakOff}
            />
            <StatTile
              label={t.stats.errorFree}
              value={errorFree.last7 === null ? '–' : pct(errorFree.last7)}
              delta={errorFreeDelta}
              note={errorFree.last7 === null ? t.stats.errorFreeNone : undefined}
            />
            <StatTile
              label={t.stats.cards}
              value={String(stats.cards.total)}
              note={t.stats.cardsNote(stats.cards.mature, stats.cards.due)}
            />
            <StatTile
              label={t.stats.grammar}
              value={`${stats.grammar.passed} / ${stats.grammar.topics.length}`}
              note={t.stats.grammarNote}
            />
          </div>

          {weakest && (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-indigo-50 p-5 ring-1 ring-indigo-100">
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-700">{t.stats.weakest}</p>
                <p className="text-xl font-bold text-slate-900">
                  {t.errorTypes[weakest.errorType].label}{' '}
                  <span className="text-base font-medium text-slate-500">({weakest.errorType})</span>
                </p>
                <p className="text-sm text-slate-600">
                  {t.stats.mistakes(weakest.mistakes)} · {t.errorTypes[weakest.errorType].hint}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/review?type=${encodeURIComponent(weakest.errorType)}${weakest.due ? '' : '&ahead=1'}`}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                >
                  {weakest.due ? t.stats.practise(weakest.due) : t.stats.practiseAhead(weakest.cards)}
                </Link>
                {weakest.topics.slice(0, 2).map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/grammar/${topic.id}`}
                    className="rounded-lg bg-white px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
                  >
                    📘 {topic.title.split(':')[0]}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Card title={t.stats.errorsTitle} subtitle={t.stats.errorsSubtitle}>
              {stats.errorTypes.length ? (
                <ErrorTypeBars items={stats.errorTypes} />
              ) : (
                <p className="text-sm text-slate-500">{t.stats.noErrors}</p>
              )}
            </Card>

            <Card title={t.stats.activityTitle} subtitle={t.stats.activitySubtitle}>
              <ActivityChart days={stats.activity} />
            </Card>

            <Card title={t.stats.cardStagesTitle} subtitle={t.stats.cardStagesSubtitle}>
              {stats.cards.total ? (
                <CardStageBar cards={stats.cards} />
              ) : (
                <p className="text-sm text-slate-500">{t.stats.noCards}</p>
              )}
            </Card>

            <Card title={t.stats.grammar} subtitle={t.stats.grammarSubtitle(stats.grammar.attempted, stats.grammar.passed)}>
              <GrammarMeters topics={stats.grammar.topics} />
            </Card>

            <Card title={t.stats.vocab} subtitle={t.stats.vocabSubtitle(stats.vocab.attempted, stats.vocab.passed)}>
              <GrammarMeters topics={stats.vocab.topics} basePath="/vocab" />
            </Card>
          </div>
        </>
      )}

      <ReminderSettings />
    </div>
  )
}
