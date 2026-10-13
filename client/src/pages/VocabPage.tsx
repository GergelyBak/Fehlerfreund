import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { useAuth } from '../auth/useAuth'
import { PASS_SCORE } from '../grammar/types'
import { activeMessages, useI18n } from '../i18n/context'
import type { ThemeSummary } from '../vocab/types'

export function VocabPage() {
  const { t, lang } = useI18n()
  const { user } = useAuth()
  const [loaded, setLoaded] = useState<{ lang: string; themes: ThemeSummary[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  // The level tab lives in the URL, so "back" from a topic returns to the same tab.
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    let cancelled = false
    api<{ themes: ThemeSummary[] }>(`/vocab/themes?lang=${lang}`)
      .then((r) => !cancelled && setLoaded({ lang, themes: r.themes }))
      .catch((err) => !cancelled && setError(errorMessage(err, activeMessages().vocab.loadFailed)))
    return () => {
      cancelled = true
    }
  }, [lang])

  const themes = loaded?.themes ?? null
  const levels = [...new Set((themes ?? []).map((th) => th.level))]
  // The learner's own level if it has words yet, otherwise the highest level below it.
  const preferred = levels.filter((l) => l <= (user?.level ?? 'A1')).at(-1) ?? levels[0]
  const level = params.get('level') ?? preferred ?? 'A1'
  const shown = (themes ?? []).filter((th) => th.level === level)
  const passed = shown.filter((th) => (th.progress?.bestScore ?? 0) >= PASS_SCORE).length

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t.vocab.title}</h1>
        <p className="text-slate-600">{t.vocab.intro}</p>
        {themes && (
          <p className="text-sm text-slate-500">{t.vocab.passed(level, passed, shown.length, Math.round(PASS_SCORE * 100))}</p>
        )}
      </div>

      {levels.length > 1 && (
        <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label={t.grammar.levelTabs}>
          {levels.map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={l === level}
              onClick={() => setParams({ level: l }, { replace: true })}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                l === level ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}
      {themes && !levels.includes('B1') && <p className="text-sm text-slate-500">{t.vocab.comingSoon}</p>}

      {error && <p className="text-red-600">{error}</p>}

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((theme) => {
          const best = theme.progress?.bestScore ?? 0
          const done = best >= PASS_SCORE
          return (
            <li key={theme.id}>
              <Link
                to={`/vocab/${theme.id}`}
                className="flex h-full gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-indigo-400"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    done ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {done ? '✓' : theme.order}
                </span>
                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="block font-semibold">{theme.title}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{t.vocab.words(theme.wordCount)}</span>
                    {theme.progress && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{t.grammar.best(Math.round(best * 100))}</span>
                      </>
                    )}
                  </span>
                  {theme.progress && (
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
        {themes === null &&
          !error &&
          Array.from({ length: 6 }, (_, i) => <li key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/60" />)}
      </ol>
    </div>
  )
}
