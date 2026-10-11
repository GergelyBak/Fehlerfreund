import { useI18n } from '../i18n/context'
import { RATE_NORMAL, RATE_SLOW, speak, supported, useSpeakingKey } from './speech'

// 🔊 normal speed and 🐢 slow, for any German text. Renders nothing when the
// browser can't speak.
export function SpeakButtons({ text, compact }: { text: string; compact?: boolean }) {
  const speakingKey = useSpeakingKey()
  const { t } = useI18n()
  if (!supported) return null

  const buttons = [
    { key: `${text}|normal`, rate: RATE_NORMAL, icon: '🔊', label: t.speech.readAloud },
    { key: `${text}|slow`, rate: RATE_SLOW, icon: '🐢', label: t.speech.slowly },
  ]

  return (
    <span className="inline-flex items-center gap-1">
      {buttons.map((b) => {
        const playing = speakingKey === b.key
        return (
          <button
            key={b.key}
            type="button"
            onClick={(e) => {
              // Phrases sit inside a clickable row; don't insert the phrase too.
              e.stopPropagation()
              speak(text, { key: b.key, rate: b.rate })
            }}
            title={playing ? t.speech.stop : t.speech.inGerman(b.label)}
            aria-label={playing ? t.speech.stop : t.speech.inGermanAria(b.label)}
            className={`min-h-9 rounded-md px-2 text-xs font-medium transition sm:min-h-0 sm:px-1.5 sm:py-0.5 ${
              playing ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
            }`}
          >
            {playing ? '⏹' : b.icon}
            {!compact && <span className="ml-1">{playing ? t.speech.stop : b.label}</span>}
          </button>
        )
      })}
    </span>
  )
}
