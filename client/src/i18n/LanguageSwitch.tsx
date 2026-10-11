import { useState } from 'react'
import { useI18n } from './context'

// HU ⇄ EN. Signed in, this also changes the language of correction
// explanations, translations and emails.
export function LanguageSwitch({ light }: { light?: boolean }) {
  const { lang, t, setLang } = useI18n()
  const [busy, setBusy] = useState(false)

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          await setLang(lang === 'hu' ? 'en' : 'hu')
        } finally {
          setBusy(false)
        }
      }}
      title={t.language.switchTo}
      aria-label={t.language.switchTo}
      className={`min-h-9 rounded-lg px-2.5 text-sm font-semibold ring-1 transition disabled:opacity-60 ${
        light ? 'text-white ring-white/30 hover:bg-white/10' : 'text-slate-600 ring-slate-200 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {t.language.short}
    </button>
  )
}
