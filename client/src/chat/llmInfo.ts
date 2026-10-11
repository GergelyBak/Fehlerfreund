import { useEffect, useState } from 'react'
import { api } from '../api/client'

export interface LlmInfo {
  mode: 'ollama' | 'live'
  model: string
  // False when the machine running the model (Ollama) is switched off.
  available: boolean
}

// Shared by every component on the page and refreshed after a short while,
// because the model's machine can go on or off at any time.
const MAX_AGE_MS = 20_000
let cache: { at: number; info: Promise<LlmInfo> } | null = null

export function useLlmInfo() {
  const [info, setInfo] = useState<LlmInfo | null>(null)
  useEffect(() => {
    if (!cache || Date.now() - cache.at > MAX_AGE_MS) cache = { at: Date.now(), info: api<LlmInfo>('/llm/status') }
    let cancelled = false
    cache.info
      .then((i) => !cancelled && setInfo(i))
      .catch(() => {
        cache = null
      })
    return () => {
      cancelled = true
    }
  }, [])
  return info
}
