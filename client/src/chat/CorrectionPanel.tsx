import { Link } from 'react-router'
import type { StoredCorrection } from './types'

export function CorrectionPanel({
  correction,
  pending,
  cardsAdded,
}: {
  correction: StoredCorrection | null
  pending?: boolean
  cardsAdded?: number
}) {
  if (pending && !correction) {
    return <p className="text-xs text-slate-400">Ellenőrzés…</p>
  }
  if (!correction) return null

  if (correction.status === 'failed') {
    return <p className="text-xs text-slate-400">Ezt az üzenetet most nem sikerült ellenőrizni.</p>
  }

  if (!correction.hasErrors) {
    return <p className="text-xs font-medium text-emerald-600">✓ Hibátlan</p>
  }

  return (
    <div className="w-full space-y-2 rounded-xl bg-amber-50 p-3 text-sm ring-1 ring-amber-200">
      <p className="text-slate-700">
        <span className="font-medium">Helyesen: </span>
        {correction.correctedMessage}
      </p>
      <ul className="space-y-2">
        {correction.corrections.map((c, i) => (
          <li key={i} className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-red-600 line-through">{c.original}</span>
              <span aria-hidden>→</span>
              <span className="font-medium text-emerald-700">{c.corrected}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  c.severity === 'major' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {c.errorType}
              </span>
            </div>
            <p className="text-slate-600">{c.explanation}</p>
          </li>
        ))}
      </ul>
      {!!cardsAdded && (
        <Link to="/review" className="inline-block py-2 text-xs font-medium text-indigo-700 hover:underline sm:py-0">
          🗂️ +{cardsAdded} kártya került az ismétlőpakliba
        </Link>
      )}
    </div>
  )
}
