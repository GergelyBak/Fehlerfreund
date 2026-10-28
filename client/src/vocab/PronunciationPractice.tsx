import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { bestMatch, type WordMatch } from '../speech/compareWords'
import { useSpeechRecognition } from '../speech/recognition'
import { SpeakButtons } from '../speech/SpeakButtons'

interface Attempt {
  heard: string
  words: WordMatch[]
  score: number
}

const GREAT = 0.9
const GOOD = 0.7

// Say the topic's example sentences one by one and see, word by word, what
// the browser's speech recognizer understood.
export function PronunciationPractice({ sentences }: { sentences: string[] }) {
  const { t } = useI18n()
  const { supported, listening, interim, error, start, stop } = useSpeechRecognition('de-DE')
  const [index, setIndex] = useState(0)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  // Best score per sentence, for the summary.
  const [scores, setScores] = useState<number[]>([])

  if (!supported) {
    return <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">{t.pronunciation.unsupported}</p>
  }

  const done = index >= sentences.length
  if (done) {
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-4xl">🎤</p>
        <h2 className="text-xl font-semibold">{t.pronunciation.doneTitle}</h2>
        <p className="text-slate-600">{t.pronunciation.doneText(scores.length, avg)}</p>
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setScores([])
            setAttempt(null)
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          {t.pronunciation.restart}
        </button>
      </div>
    )
  }

  const sentence = sentences[index]!

  function listen() {
    if (listening) {
      stop()
      return
    }
    setAttempt(null)
    start((alternatives) => {
      const best = bestMatch(sentence, alternatives)
      setAttempt(best)
      if (alternatives.length) {
        setScores((s) => {
          const next = [...s]
          next[index] = Math.max(next[index] ?? 0, best.score)
          return next
        })
      }
    })
  }

  function next() {
    setAttempt(null)
    setIndex((i) => i + 1)
  }

  const pct = attempt ? Math.round(attempt.score * 100) : 0
  const verdict = !attempt || !attempt.heard ? null : attempt.score >= GREAT ? t.pronunciation.great : attempt.score >= GOOD ? t.pronunciation.good : t.pronunciation.tryAgainHint

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{t.pronunciation.intro}</p>
      <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{t.pronunciation.progress(index + 1, sentences.length)}</span>
          <SpeakButtons text={sentence} />
        </div>

        {/* After an attempt the sentence itself shows which words were heard. */}
        <p className="text-xl leading-relaxed font-medium">
          {attempt?.heard
            ? attempt.words.map((w, i) => (
                <span key={i} className={w.ok ? 'text-emerald-700' : 'rounded bg-red-100 px-0.5 text-red-700'}>
                  {w.word}{' '}
                </span>
              ))
            : sentence}
        </p>

        <button
          type="button"
          onClick={listen}
          aria-pressed={listening}
          className={`w-full rounded-xl px-4 py-3 text-lg font-semibold transition ${
            listening ? 'animate-pulse bg-red-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {listening ? t.pronunciation.listening : t.pronunciation.speak}
        </button>

        {listening && interim && <p className="text-center text-slate-500 italic">„{interim}”</p>}
        {error && <p className="text-sm text-red-600">{t.pronunciation.errors[error]}</p>}

        {attempt && !listening && (
          <div className="space-y-3">
            {attempt.heard ? (
              <>
                <p className="text-sm text-slate-600">
                  {t.pronunciation.heard} <span className="text-slate-900 italic">„{attempt.heard}”</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      attempt.score >= GREAT ? 'bg-emerald-100 text-emerald-800' : attempt.score >= GOOD ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {t.pronunciation.score(pct)}
                  </span>
                  {verdict && <span className="text-sm text-slate-700">{verdict}</span>}
                </div>
              </>
            ) : (
              !error && <p className="text-sm text-slate-600">{t.pronunciation.nothingHeard}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={listen}
                className="rounded-lg px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
              >
                {t.pronunciation.again}
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                {index + 1 < sentences.length ? t.pronunciation.next : t.pronunciation.finish}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
