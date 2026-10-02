import { useLlmInfo, type LlmInfo } from './llmInfo'

const STYLES: Record<LlmInfo['mode'], { label: (model: string) => string; title: string; className: string }> = {
  mock: {
    label: () => '🧪 Mock mód',
    title: 'Előre megírt válaszok: a beszélgetőtárs nem reagál arra, amit írsz. Valódi beszélgetéshez: LLM_MODE=ollama.',
    className: 'bg-amber-100 text-amber-900',
  },
  ollama: {
    label: (model) => `💻 Helyi modell · ${model}`,
    title: 'A gépeden futó modell válaszol (Ollama), ingyenesen.',
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
  const style = STYLES[info.mode]
  return (
    <span title={style.title} className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.className}`}>
      {style.label(info.model)}
    </span>
  )
}
