import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { Lesson } from '../grammar/Lesson'
import { Quiz } from '../grammar/Quiz'
import type { Progress, Topic } from '../grammar/types'

type Tab = 'lesson' | 'quiz'

export function GrammarTopicPage() {
  const { id } = useParams<{ id: string }>()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('lesson')

  useEffect(() => {
    api<{ topic: Topic; progress: Progress | null }>(`/grammar/topics/${id}`)
      .then((r) => {
        setTopic(r.topic)
        setProgress(r.progress)
      })
      .catch((err) => setError(errorMessage(err, 'Nem sikerült betölteni a témakört.')))
  }, [id])

  function openTab(next: Tab) {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{error}</p>
        <Link to="/grammar" className="text-indigo-600 hover:underline">
          ← Vissza a témakörökhöz
        </Link>
      </div>
    )
  }
  if (!topic) return <p className="text-slate-500">Betöltés…</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Link to="/grammar" className="text-sm text-slate-600 hover:text-slate-900">
          ← Témakörök
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {topic.level} · {topic.order}. lecke
          </span>
          {progress && (
            <span className="text-xs text-slate-500">
              Legjobb eredmény: {Math.round(progress.bestScore * 100)}% · {progress.attempts} próbálkozás
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        <p className="text-slate-600">{topic.summary}</p>
      </div>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {(
          [
            ['lesson', '📖 Tananyag'],
            ['quiz', `✏️ Teszt (${topic.exercises.length} feladat)`],
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

      {tab === 'lesson' ? (
        <>
          <Lesson sections={topic.lesson} />
          <button
            onClick={() => openTab('quiz')}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Tovább a teszthez →
          </button>
        </>
      ) : (
        <Quiz topicId={topic.id} exercises={topic.exercises} onChecked={setProgress} />
      )}
    </div>
  )
}
