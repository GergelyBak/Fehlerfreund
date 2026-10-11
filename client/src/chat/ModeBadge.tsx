import { useLlmInfo, type LlmInfo } from './llmInfo'

const STYLES: Record<LlmInfo['mode'], { label: (model: string) => string; title: string; className: string }> = {
  ollama: {
    label: (model) => `💻 ${model} · Ollama`,
    title: 'Saját gépen futó, ingyenes nyelvi modell (Ollama).',
    className: 'bg-emerald-100 text-emerald-800',
  },
  live: {
    label: (model) => `☁️ Claude · ${model}`,
    title: 'A Claude API válaszol (fizetős).',
    className: 'bg-indigo-100 text-indigo-800',
  },
}

export function ModeBadge() {
  const info = useLlmInfo()

  if (!info) return null
  if (!info.available) {
    return (
      <span
        title="A nyelvi modellt futtató gép most ki van kapcsolva."
        className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700"
      >
        😴 Offline
      </span>
    )
  }
  const style = STYLES[info.mode]
  return (
    <span title={style.title} className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.className}`}>
      {style.label(info.model)}
    </span>
  )
}
