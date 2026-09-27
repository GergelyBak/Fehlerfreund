import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Situation } from './types'

// Situations are static on the server, so one fetch per page load is enough.
let cache: Promise<Situation[]> | null = null

export function useSituations() {
  const [situations, setSituations] = useState<Situation[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cache ??= api<{ situations: Situation[] }>('/conversations/situations').then((r) => r.situations)
    cache.then(setSituations).catch((err: Error) => {
      cache = null
      setError(err.message)
    })
  }, [])

  return { situations, error }
}
