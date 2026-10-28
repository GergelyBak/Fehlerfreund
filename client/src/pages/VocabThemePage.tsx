import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { CharButtons } from '../components/CharButtons'
import { insertAtCursor } from '../components/insertAtCursor'
import { PASS_SCORE, type Progress } from '../grammar/types'
import { activeMessages, useI18n } from '../i18n/context'
import { notifyCardsChanged } from '../review/cardEvents'
import { SpeakButtons } from '../speech/SpeakButtons'
import type { Theme, VocabCheckResponse, Word, WordResult } from '../vocab/types'
import { PronunciationPractice } from '../vocab/PronunciationPractice'

type Tab = 'words' | 'test' | 'speak'

// What to read aloud: the first variant ("der Lehrer / die Lehrerin" → "der Lehrer").
const spoken = (word: Word) => word.de.split(' / ')[0]!

export function VocabThemePage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useI18n()
  const [theme, setTheme] = useState<Theme | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('words')

  useEffect(() => {
    let cancelled = false
    api<{ theme: Theme; progress: Progress | null }>(`/vocab/themes/${id}?lang=${lang}`)
      .then((r) => {
        if (cancelled) return
        setTheme(r.theme)
        setProgress(r.progress)
      })
      .catch((err) => !cancelled && setError(errorMessage(err, activeMessages().vocab.themeLoadFailed)))
    return () => {
      cancelled = true
    }
  }, [id, lang])

  function openTab(next: Tab) {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{error}</p>
        <Link to="/vocab" className="text-indigo-600 hover:underline">
          {t.vocab.backToThemes}
        </Link>
      </div>
    )
  }
  if (!theme) return <p className="text-slate-500">{t.common.loading}</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Link to={`/vocab?level=${theme.level}`} className="-ml-1 inline-block px-1 py-2 text-sm text-slate-600 hover:text-slate-900">
          {t.vocab.themes}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {t.vocab.themeBadge(theme.level, theme.order)}
          </span>
          {progress && (
            <span className="text-xs text-slate-500">{t.grammar.bestResult(Math.round(progress.bestScore * 100), progress.attempts)}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{theme.title}</h1>
      </div>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {(
          [
            ['words', t.vocab.wordsTab(theme.words.length)],
            ['test', t.vocab.testTab],
            ['speak', t.pronunciation.tab],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => openTab(key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'words' ? (
        <>
          <WordList words={theme.words} />
          <button
            onClick={() => openTab('test')}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
          >
            {t.vocab.toTest}
          </button>
        </>
      ) : tab === 'test' ? (
        // Remounting on every visit (or language switch) reshuffles the words.
        <VocabTest key={theme.id + lang} theme={theme} onChecked={setProgress} />
      ) : (
        <PronunciationPractice key={theme.id} sentences={theme.words.map((w) => w.example)} />
      )}
    </div>
  )
}

function WordList({ words }: { words: Word[] }) {
  const { t } = useI18n()
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {words.map((w) => (
        <li key={w.id} className="flex items-start justify-between gap-3 px-4 py-3">
          <span className="min-w-0 space-y-0.5">
            <span className="block">
              <span className="font-semibold text-slate-900">{w.de}</span>
              {w.forms && w.forms !== '–' && (
                <span className="ml-2 text-sm text-slate-500">
                  {w.type === 'n' ? `${t.vocab.plural} ${w.forms}` : w.forms}
                </span>
              )}
            </span>
            <span className="block text-sm text-slate-700">{w.translation}</span>
            <span className="block text-sm text-slate-500 italic">{w.example}</span>
          </span>
          <span className="shrink-0 pt-0.5">
            <SpeakButtons text={spoken(w)} compact />
          </span>
        </li>
      ))}
    </ul>
  )
}

function shuffled<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

function VocabTest({ theme, onChecked }: { theme: Theme; onChecked: (p: Progress | null) => void }) {
  const { t } = useI18n()
  const [order] = useState(() => shuffled(theme.words))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<VocabCheckResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const inputs = useRef(new Map<string, HTMLInputElement>())
  const topRef = useRef<HTMLDivElement>(null)

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }))
  const empty = theme.words.filter((w) => !answers[w.id]?.trim()).length
  const resultById = new Map(result?.results.map((r) => [r.id, r]))

  async function check() {
    setChecking(true)
    setError(null)
    try {
      const res = await api<VocabCheckResponse>(`/vocab/themes/${theme.id}/check`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      })
      setResult(res)
      onChecked(res.progress)
      if (res.cardsAdded) notifyCardsChanged()
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setError(errorMessage(err, t.quiz.checkFailed))
    } finally {
      setChecking(false)
    }
  }

  function retry() {
    setAnswers({})
    setResult(null)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const insertChar = (char: string) => {
    if (!active) return
    const id = active
    insertAtCursor(inputs.current.get(id), answers[id] ?? '', char, (v) => setAnswer(id, v))
  }

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-4">
      {result ? <Summary result={result} onRetry={retry} /> : <p className="text-sm text-slate-600">{t.vocab.testIntro}</p>}

      <ol className="space-y-2">
        {order.map((w, i) => {
          const r = resultById.get(w.id)
          const state = r
            ? r.verdict === 'correct'
              ? 'border-emerald-500 bg-emerald-50'
              : r.verdict === 'article'
                ? 'border-amber-400 bg-amber-50'
                : r.verdict === 'empty'
                  ? 'border-slate-300 bg-slate-50'
                  : 'border-red-400 bg-red-50'
            : 'border-slate-300 bg-white'
          return (
            <li key={w.id} className="space-y-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
              <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex gap-2 sm:w-2/5">
                  <span className="text-sm font-semibold text-slate-400">{i + 1}.</span>
                  <span className="font-medium text-slate-800">{w.translation}</span>
                </span>
                <input
                  ref={(el) => {
                    if (el) inputs.current.set(w.id, el)
                    else inputs.current.delete(w.id)
                  }}
                  value={answers[w.id] ?? ''}
                  onChange={(e) => setAnswer(w.id, e.target.value)}
                  onFocus={() => setActive(w.id)}
                  disabled={!!result}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label={t.vocab.answerAria(w.translation)}
                  className={`min-h-10 flex-1 rounded-lg border px-3 font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${state}`}
                />
              </label>
              {active === w.id && !result && (
                <div className="sm:hidden">
                  <CharButtons onInsert={insertChar} />
                </div>
              )}
              {r && <Feedback result={r} word={w} />}
            </li>
          )
        })}
      </ol>

      {!result && (
        <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:bottom-4 sm:p-4">
          <div className="hidden items-center gap-1 sm:flex">
            <span className="mr-1 text-xs text-slate-500">{t.quiz.specialChars}</span>
            <CharButtons onInsert={insertChar} disabled={!active} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3 sm:flex-none">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {empty > 0 && <span className="text-sm text-slate-500">{t.quiz.empty(empty)}</span>}
            <button
              type="button"
              onClick={() => void check()}
              disabled={checking}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {checking ? t.quiz.checking : t.quiz.check}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Feedback({ result, word }: { result: WordResult; word: Word }) {
  const { t } = useI18n()
  const text = {
    correct: t.quiz.correct,
    article: t.vocab.article(result.solution),
    wrong: t.quiz.wrong(result.solution),
    empty: t.quiz.unanswered(result.solution),
  }[result.verdict]
  const tone = {
    correct: 'text-emerald-800',
    article: 'text-amber-900',
    wrong: 'text-red-800',
    empty: 'text-slate-600',
  }[result.verdict]
  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <p className={tone}>
        <span className="font-medium">{text}</span>
        {result.verdict !== 'correct' && <span className="block text-slate-500 italic">{word.example}</span>}
      </p>
      <SpeakButtons text={spoken(word)} compact />
    </div>
  )
}

function Summary({ result, onRetry }: { result: VocabCheckResponse; onRetry: () => void }) {
  const { t } = useI18n()
  const pct = Math.round((result.score / result.total) * 100)
  const passed = result.score / result.total >= PASS_SCORE
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 ring-1 ${
        passed ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'
      }`}
    >
      <div className="space-y-1">
        <p className="text-2xl font-bold">
          {result.score} / {result.total} <span className="text-lg font-semibold text-slate-600">({pct}%)</span>
        </p>
        <p className="text-sm text-slate-700">
          {passed ? t.quiz.passed : t.quiz.notYet(Math.round(PASS_SCORE * 100))}
          {result.progress && result.progress.attempts > 1 && t.quiz.bestSoFar(Math.round(result.progress.bestScore * 100))}
        </p>
        {result.cardsAdded > 0 && (
          <Link to="/review" className="inline-block text-sm font-medium text-indigo-700 hover:underline">
            {t.quiz.cardsAdded(result.cardsAdded)}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
      >
        {t.quiz.retry}
      </button>
    </div>
  )
}
