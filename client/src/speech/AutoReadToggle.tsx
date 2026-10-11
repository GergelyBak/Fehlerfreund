import { useI18n } from '../i18n/context'
import { supported, useGermanVoice } from './speech'

// Toggle for reading every new partner reply aloud, plus which voice is used.
export function AutoReadToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  const voice = useGermanVoice()
  const { t } = useI18n()
  if (!supported) return null

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
      <label className="inline-flex cursor-pointer items-center gap-1.5 py-1.5 font-medium text-slate-600 sm:py-0">
        <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-indigo-600" />
        {t.speech.autoRead}
      </label>
      {voice ? (
        <span className="hidden sm:inline" title={t.speech.voiceTitle}>· {voice.name.replace(/^Microsoft /, '')}</span>
      ) : (
        <span
          className="text-amber-700"
          title={t.speech.noVoiceTitle}
        >
          {t.speech.noVoice}
        </span>
      )}
    </div>
  )
}
