import { useI18n } from '../i18n/context'
import { useSpeechRecognition } from './recognition'

// 🎤 next to a text box: speak, and the recognized German is added to it.
// Renders nothing in browsers without speech recognition.
export function DictateButton({ onText, disabled }: { onText: (text: string) => void; disabled?: boolean }) {
  const { t } = useI18n()
  const { supported, listening, error, start, stop } = useSpeechRecognition('de-DE')
  if (!supported) return null

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => (listening ? stop() : start((alternatives) => alternatives[0] && onText(alternatives[0])))}
      aria-pressed={listening}
      aria-label={listening ? t.pronunciation.dictateStop : t.pronunciation.dictate}
      title={error ? t.pronunciation.errors[error] : listening ? t.pronunciation.dictateStop : t.pronunciation.dictate}
      className={`grid w-12 shrink-0 place-items-center rounded-xl text-xl transition disabled:opacity-50 ${
        listening ? 'animate-pulse bg-red-600 text-white' : error ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {listening ? '⏺' : '🎤'}
    </button>
  )
}
