import { useEffect, useState } from 'react'
import { api } from '../api/client'

export interface LlmInfo {
  mode: 'mock' | 'ollama' | 'live'
  model: string
}

// The mode can only change with a server restart, so one fetch per page load is enough.
let cache: Promise<LlmInfo> | null = null

export function useLlmInfo() {
  const [info, setInfo] = useState<LlmInfo | null>(null)
  useEffect(() => {
    cache ??= api<{ llm: LlmInfo }>('/health').then((r) => r.llm)
    cache.then(setInfo).catch(() => {
      cache = null
    })
  }, [])
  return info
}
