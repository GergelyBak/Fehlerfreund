import { useI18n } from '../i18n/context'
import { useLlmInfo } from './llmInfo'

export function ModeBadge() {
  const info = useLlmInfo()
  const { t } = useI18n()

  if (!info) return null
  if (!info.available) {
    return (
      <span title={t.mode.offlineTitle} className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
        {t.mode.offline}
      </span>
    )
  }
  return info.mode === 'ollama' ? (
    <span title={t.mode.ollamaTitle} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      💻 {info.model} · Ollama
    </span>
  ) : (
    <span title={t.mode.liveTitle} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
      ☁️ Claude · {info.model}
    </span>
  )
}
