import { useState } from 'react'
import { errorMessage } from '../api/errors'
import { useAuth } from '../auth/useAuth'
import type { ReminderSettings as Settings } from '../auth/types'
import { Card } from './charts'

const HOURS = Array.from({ length: 24 }, (_, h) => h)
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

export function ReminderSettings() {
  const { user, updateMe } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!user) return null
  const { enabled, hour } = user.reminders

  async function save(patch: Partial<Settings>) {
    setSaving(true)
    setError(null)
    try {
      // The browser's time zone goes along, so "18:00" means the learner's 18:00.
      await updateMe({ reminders: { ...patch, timeZone: browserTimeZone() } })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      title="Napi emlékeztető"
      subtitle="E-mailt kapsz, ha kártyák várnak ismétlésre, vagy ha még nem gyakoroltál aznap, és megszakadna a sorozatod."
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex min-h-9 cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => save({ enabled: !enabled })}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
              enabled ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                enabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
          <span className="text-sm font-medium">{enabled ? 'Bekapcsolva' : 'Kikapcsolva'}</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          Időpont
          <select
            value={hour}
            disabled={saving || !enabled}
            onChange={(e) => save({ hour: Number(e.target.value) })}
            className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-slate-900 disabled:opacity-50"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </label>
      </div>
      {enabled && (
        <p className="text-xs text-slate-500">
          Legfeljebb napi egy levél, a(z) {user.email} címre. Minden levél alján egy kattintással leiratkozhatsz.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </Card>
  )
}
