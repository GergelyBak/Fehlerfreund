import { supported, useGermanVoice } from './speech'

// Toggle for reading every new partner reply aloud, plus which voice is used.
export function AutoReadToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  const voice = useGermanVoice()
  if (!supported) return null

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
      <label className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-slate-600">
        <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="accent-indigo-600" />
        🔊 Automatikus felolvasás
      </label>
      {voice ? (
        <span title="A böngésző által adott német hang">· {voice.name.replace(/^Microsoft /, '')}</span>
      ) : (
        <span
          className="text-amber-700"
          title="Windows: Beállítások → Idő és nyelv → Beszéd → Hangok hozzáadása → Deutsch. Edge-ben és Chrome-ban természetesebb német hangok is vannak."
        >
          · Nincs német hang telepítve
        </span>
      )}
    </div>
  )
}
