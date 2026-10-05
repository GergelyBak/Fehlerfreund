import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { notifyCardsChanged } from '../review/cardEvents'
import { GAP, PASS_SCORE, type CheckResponse, type Exercise, type ExerciseResult, type Progress } from './types'

const SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü']

export function Quiz({
  topicId,
  exercises,
  onChecked,
}: {
  topicId: string
  exercises: Exercise[]
  onChecked: (progress: Progress | null) => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<CheckResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // The gap the ä/ö/ü/ß buttons type into.
  const [activeGap, setActiveGap] = useState<string | null>(null)
  const inputs = useRef(new Map<string, HTMLInputElement>())
  const topRef = useRef<HTMLDivElement>(null)

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }))
  const empty = exercises.filter((e) => !answers[e.id]?.trim()).length
  const resultById = new Map(result?.results.map((r) => [r.id, r]))

  function insertChar(char: string) {
    if (!activeGap) return
    const el = inputs.current.get(activeGap)
    const value = answers[activeGap] ?? ''
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    setAnswer(activeGap, value.slice(0, start) + char + value.slice(end))
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start + 1, start + 1)
    })
  }

  async function check() {
    setChecking(true)
    setError(null)
    try {
      const res = await api<CheckResponse>(`/grammar/topics/${topicId}/check`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      })
      setResult(res)
      onChecked(res.progress)
      if (res.cardsAdded) notifyCardsChanged()
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setError(errorMessage(err, 'Nem sikerült kiértékelni a tesztet.'))
    } finally {
      setChecking(false)
    }
  }

  function retry() {
    setAnswers({})
    setResult(null)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-4">
      {result && <Summary result={result} onRetry={retry} />}

      <ol className="space-y-3">
        {exercises.map((e, i) => (
          <li key={e.id} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <div className="flex gap-3">
              <span className="text-sm font-semibold text-slate-400">{i + 1}.</span>
              <div className="min-w-0 flex-1 space-y-3">
                {e.type === 'gap' ? (
                  <>
                    <GapSentence
                      exercise={e}
                      value={answers[e.id] ?? ''}
                      result={resultById.get(e.id)}
                      onChange={(v) => setAnswer(e.id, v)}
                      onFocus={() => setActiveGap(e.id)}
                      inputRef={(el) => (el ? inputs.current.set(e.id, el) : inputs.current.delete(e.id))}
                    />
                    {activeGap === e.id && !result && (
                      // Phones: the letters sit right under the gap being typed in,
                      // where the on-screen keyboard can't cover them.
                      <div className="sm:hidden">
                        <CharButtons onInsert={insertChar} />
                      </div>
                    )}
                  </>
                ) : (
                  <ChoiceQuestion
                    exercise={e}
                    value={answers[e.id]}
                    result={resultById.get(e.id)}
                    onChange={(v) => setAnswer(e.id, v)}
                  />
                )}
                {resultById.get(e.id) && <Feedback result={resultById.get(e.id)!} />}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {!result && (
        <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:bottom-4 sm:p-4">
          <div className="hidden items-center gap-1 sm:flex">
            <span className="mr-1 text-xs text-slate-500">Különleges betűk:</span>
            <CharButtons onInsert={insertChar} disabled={!activeGap} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3 sm:flex-none">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {empty > 0 && <span className="text-sm text-slate-500">{empty} üres</span>}
            <button
              type="button"
              onClick={() => void check()}
              disabled={checking}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {checking ? 'Ellenőrzés…' : 'Ellenőrzés'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ä ö ü ß buttons for keyboards without them (e.g. Hungarian ones).
function CharButtons({ onInsert, disabled }: { onInsert: (c: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SPECIAL_CHARS.map((c) => (
        <button
          key={c}
          type="button"
          // Keep focus (and the phone keyboard) in the input while tapping.
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => onInsert(c)}
          disabled={disabled}
          className="size-10 rounded-lg bg-slate-100 text-lg font-medium text-slate-800 hover:bg-indigo-100 disabled:opacity-40 sm:size-8 sm:text-base"
        >
          {c}
        </button>
      ))}
    </div>
  )
}

function GapSentence({
  exercise,
  value,
  result,
  onChange,
  onFocus,
  inputRef,
}: {
  exercise: Extract<Exercise, { type: 'gap' }>
  value: string
  result?: ExerciseResult
  onChange: (v: string) => void
  onFocus: () => void
  inputRef: (el: HTMLInputElement | null) => void
}) {
  const [before, after] = exercise.prompt.split(GAP)
  const state = result ? (result.correct ? 'border-emerald-500 bg-emerald-50' : 'border-red-400 bg-red-50') : 'border-slate-300'
  return (
    <p className="text-lg leading-loose">
      {before}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        disabled={!!result}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label={`Kitöltendő${exercise.hint ? `: ${exercise.hint}` : ''}`}
        size={Math.max(8, value.length + 1)}
        className={`mx-1 rounded-md border-b-2 px-2 py-0.5 text-center font-medium outline-none focus:border-indigo-500 focus:bg-indigo-50 ${state}`}
      />
      {after}
      {exercise.hint && <span className="ml-2 text-sm text-slate-500">({exercise.hint})</span>}
    </p>
  )
}

function ChoiceQuestion({
  exercise,
  value,
  result,
  onChange,
}: {
  exercise: Extract<Exercise, { type: 'choice' }>
  value?: string
  result?: ExerciseResult
  onChange: (v: string) => void
}) {
  const [before, after] = exercise.prompt.split(GAP)
  return (
    <div className="space-y-3">
      <p className="text-lg">
        {before}
        <span className="mx-1 inline-block min-w-12 border-b-2 border-slate-300 text-center font-medium text-indigo-700">
          {value ?? ' '}
        </span>
        {after}
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {exercise.options.map((o) => {
          const selected = value === o
          let cls = selected ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-800 ring-slate-300 hover:ring-indigo-400'
          if (result) {
            if (o === result.solution) cls = 'bg-emerald-100 text-emerald-800 ring-emerald-400'
            else if (selected) cls = 'bg-red-100 text-red-800 ring-red-300 line-through'
            else cls = 'bg-white text-slate-400 ring-slate-200'
          }
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!!result}
              onClick={() => onChange(o)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 transition ${cls}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Feedback({ result }: { result: ExerciseResult }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${result.correct ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}
    >
      <p className="font-medium">
        {result.correct ? '✓ Helyes!' : result.given ? `✗ Helyesen: ${result.solution}` : `– Nem válaszoltál. Helyesen: ${result.solution}`}
      </p>
      <p className="opacity-90">{result.explanation}</p>
    </div>
  )
}

function Summary({ result, onRetry }: { result: CheckResponse; onRetry: () => void }) {
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
          {passed ? '🎉 Szép munka, ez a témakör megy!' : `Még gyakorold: ${Math.round(PASS_SCORE * 100)}%-tól számít teljesítettnek.`}
          {result.progress && result.progress.attempts > 1 && <> Legjobb eredményed: {Math.round(result.progress.bestScore * 100)}%.</>}
        </p>
        {result.cardsAdded > 0 && (
          <Link to="/review" className="inline-block text-sm font-medium text-indigo-700 hover:underline">
            🗂️ +{result.cardsAdded} kártya került az ismétlőpakliba a hibáidból
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
      >
        Újra
      </button>
    </div>
  )
}
