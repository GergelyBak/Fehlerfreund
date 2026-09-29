import { SpeakButtons } from '../speech/SpeakButtons'
import type { LessonSection } from './types'

export function Lesson({ sections }: { sections: LessonSection[] }) {
  return (
    <div className="space-y-5">
      {sections.map((s, i) => (
        <section key={s.heading} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">
            <span className="mr-2 text-indigo-500">{i + 1}.</span>
            {s.heading}
          </h2>
          {s.text && <p className="leading-relaxed text-slate-700">{s.text}</p>}

          {s.table && (
            <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {s.table.headers.map((h, j) => (
                      <th key={j} className="px-3 py-2 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {s.table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className={`px-3 py-2 ${c === 0 ? 'font-medium text-slate-700' : 'text-slate-800'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {s.examples && (
            <ul className="space-y-2">
              {s.examples.map((ex) => (
                <li key={ex.de} className="flex items-start justify-between gap-3 rounded-lg bg-indigo-50/60 px-3 py-2">
                  <span>
                    <span className="block font-medium text-slate-900">{ex.de}</span>
                    <span className="block text-sm text-slate-600">{ex.hu}</span>
                  </span>
                  <SpeakButtons text={ex.de} compact />
                </li>
              ))}
            </ul>
          )}

          {s.tip && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">💡 {s.tip}</p>
          )}
        </section>
      ))}
    </div>
  )
}
