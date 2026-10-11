import { useI18n } from '../i18n/context'

// Shown while the free-tier API wakes up from sleep.
export function WakingNotice() {
  const { t } = useI18n()
  return (
    <div className="max-w-sm space-y-2">
      <span className="mx-auto block size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" aria-hidden />
      <p className="font-medium text-slate-700">{t.waking.title}</p>
      <p className="text-sm text-slate-500">{t.waking.text}</p>
    </div>
  )
}
