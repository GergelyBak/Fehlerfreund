import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useI18n, type Lang } from '../i18n/context'
import type { Situation } from './types'

// Situations are static on the server, so one fetch per language and page load is enough.
const cache = new Map<Lang, Promise<Situation[]>>()

export function useSituations() {
  const { lang } = useI18n()
  const [loaded, setLoaded] = useState<{ lang: Lang; situations: Situation[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let request = cache.get(lang)
    if (!request) {
      request = api<{ situations: Situation[] }>(`/conversations/situations?lang=${lang}`).then((r) => r.situations)
      cache.set(lang, request)
    }
    let cancelled = false
    request
      .then((situations) => !cancelled && setLoaded({ lang, situations }))
      .catch((err: Error) => {
        cache.delete(lang)
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  // Keep showing the previous language's list until the new one arrives.
  return { situations: loaded?.situations ?? null, error }
}
