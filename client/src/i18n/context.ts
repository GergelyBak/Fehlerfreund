import { createContext, useContext } from 'react'
import { en } from './en'
import { hu, type Messages } from './hu'

export type Lang = 'hu' | 'en'
export const MESSAGES: Record<Lang, Messages> = { hu, en }

export interface I18nState {
  lang: Lang
  t: Messages
  setLang: (lang: Lang) => Promise<void>
}

export const I18nContext = createContext<I18nState | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

// The same language for code outside components (error messages, date
// helpers). The provider keeps it in sync on every render.
let active: Lang = 'hu'
export const setActiveLang = (lang: Lang) => {
  active = lang
}
export const activeMessages = () => MESSAGES[active]

// Before sign-in: the last choice on this device, else the browser language.
const STORAGE_KEY = 'ff-lang'
export function initialGuestLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'hu' || saved === 'en') return saved
  } catch {
    // Storage can be blocked; fall back to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('hu') ? 'hu' : 'en'
}
export function saveGuestLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Not critical: the choice just won't be remembered.
  }
}
