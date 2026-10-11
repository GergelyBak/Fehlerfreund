import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'
import { I18nContext, MESSAGES, initialGuestLang, saveGuestLang, setActiveLang, type Lang } from './context'

// Signed in, the account's language decides (it also sets the language of
// correction explanations); before that, the device's last choice.
export function I18nProvider({ children }: { children: ReactNode }) {
  const { user, updateMe } = useAuth()
  const [guestLang, setGuestLang] = useState<Lang>(initialGuestLang)
  const lang: Lang = user?.nativeLanguage ?? guestLang

  // After signing out, keep showing the language the user last had.
  if (user && user.nativeLanguage !== guestLang) setGuestLang(user.nativeLanguage)
  setActiveLang(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    saveGuestLang(lang)
  }, [lang])

  const setLang = useCallback(
    async (next: Lang) => {
      setGuestLang(next)
      if (user && user.nativeLanguage !== next) await updateMe({ nativeLanguage: next })
    },
    [user, updateMe],
  )

  const value = useMemo(() => ({ lang, t: MESSAGES[lang], setLang }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
