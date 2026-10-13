import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { isIos, isStandalone, useInstallPrompt } from './installPrompt'

const DISMISSED_KEY = 'ff-install-dismissed'

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

// "Install the app" offer: a real install button where the browser supports
// it (Android, desktop Chrome/Edge), the Share-menu steps on iPhone.
export function InstallBanner() {
  const { t } = useI18n()
  const { canInstall, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(wasDismissed)

  if (dismissed || isStandalone()) return null
  const ios = isIos()
  if (!canInstall && !ios) return null

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Not remembering the choice is fine.
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3 ring-1 ring-indigo-100">
      <img src="/icon-192.png" alt="" className="size-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-1 text-sm">
        <p className="font-semibold text-slate-900">{t.install.title}</p>
        <p className="text-slate-600">{ios && !canInstall ? t.install.iosSteps : t.install.text}</p>
        {canInstall && (
          <button
            type="button"
            onClick={() => void install()}
            className="mt-1 rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
          >
            {t.install.button}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.install.dismiss}
        className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
      >
        ✕
      </button>
    </div>
  )
}
