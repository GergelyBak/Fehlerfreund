import type { Phrase, Situation } from './types'

export function SituationPanel({
  situation,
  completedTasks,
  onToggleTask,
  onPhrase,
}: {
  situation: Situation
  completedTasks: string[]
  onToggleTask: (taskId: string, done: boolean) => void
  onPhrase: (phrase: Phrase) => void
}) {
  const doneCount = situation.tasks.filter((t) => completedTasks.includes(t.id)).length
  const allDone = doneCount === situation.tasks.length

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Feladatok</h2>
          <span className="text-xs text-slate-500">
            {doneCount} / {situation.tasks.length}
          </span>
        </div>
        {allDone && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            🎉 Minden feladat kész! Szép munka.
          </p>
        )}
        <ul className="space-y-1.5">
          {situation.tasks.map((task) => {
            const done = completedTasks.includes(task.id)
            return (
              <li key={task.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="mt-0.5 size-4 accent-indigo-600"
                  />
                  <span className={done ? 'text-slate-400 line-through' : 'text-slate-700'}>{task.hu}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Hasznos kifejezések</h2>
        <p className="text-xs text-slate-500">Kattints rá, és beíródik az üzenetedbe.</p>
        <ul className="space-y-1">
          {situation.phrases.map((p) => (
            <li key={p.de}>
              <button
                type="button"
                onClick={() => onPhrase(p)}
                className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none"
              >
                <span className="block text-sm font-medium text-slate-800">{p.de}</span>
                <span className="block text-xs text-slate-500">{p.hu}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
