import { useSyncExternalStore } from 'react'

// Chrome/Edge/Android fire `beforeinstallprompt` once, often before React has
// mounted, so it's captured at startup and kept here.
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

export function initPwa() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as InstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    notify()
  })
  // Only in production: in development a service worker would serve stale files.
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.error('Service worker registration failed:', err))
    })
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true

// iPhone/iPad Safari: no install dialog, only "Add to Home Screen" in the share menu.
export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export function useInstallPrompt() {
  const event = useSyncExternalStore(subscribe, () => deferred)
  async function install() {
    if (!event) return false
    await event.prompt()
    const { outcome } = await event.userChoice
    deferred = null
    notify()
    return outcome === 'accepted'
  }
  return { canInstall: event !== null, install }
}
