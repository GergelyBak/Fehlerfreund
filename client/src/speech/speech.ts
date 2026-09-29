// German text-to-speech with the browser's built-in Web Speech API: free,
// no server involved. Voice quality depends on the browser and OS; Edge's
// "Online (Natural)" voices and Chrome's "Google Deutsch" sound best.

import { useEffect, useState, useSyncExternalStore } from 'react'

export const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

// Best first: a natural-sounding German (Germany) voice, then any de-DE,
// then any German at all (e.g. Austrian).
function rank(v: SpeechSynthesisVoice) {
  const natural = /natural|online|google/i.test(v.name)
  if (v.lang === 'de-DE' && natural) return 0
  if (v.lang === 'de-DE') return 1
  if (v.lang.startsWith('de') && natural) return 2
  if (v.lang.startsWith('de')) return 3
  return 99
}

export function pickGermanVoice(voices: SpeechSynthesisVoice[]) {
  const best = [...voices].sort((a, b) => rank(a) - rank(b))[0]
  return best && rank(best) < 99 ? best : null
}

// Voices load asynchronously in most browsers.
export function useGermanVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(() =>
    supported ? pickGermanVoice(speechSynthesis.getVoices()) : null,
  )
  useEffect(() => {
    if (!supported) return
    const update = () => setVoice(pickGermanVoice(speechSynthesis.getVoices()))
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])
  return voice
}

// Which text is being read right now, shared by every speak button so only
// one of them shows "playing".
let speakingKey: string | null = null
const listeners = new Set<() => void>()
function setSpeaking(key: string | null) {
  speakingKey = key
  listeners.forEach((l) => l())
}

export function useSpeakingKey() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => speakingKey,
  )
}

export const RATE_NORMAL = 0.95
export const RATE_SLOW = 0.7

export function speak(text: string, opts: { key?: string; rate?: number } = {}) {
  if (!supported) return
  // Stop whatever is playing; a second click on the same button just stops.
  const key = opts.key ?? text
  const wasPlaying = speakingKey === key
  speechSynthesis.cancel()
  setSpeaking(null)
  if (wasPlaying) return

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickGermanVoice(speechSynthesis.getVoices())
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'de-DE'
  utterance.rate = opts.rate ?? RATE_NORMAL
  utterance.onend = utterance.onerror = () => {
    if (speakingKey === key) setSpeaking(null)
  }
  setSpeaking(key)
  speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (!supported) return
  speechSynthesis.cancel()
  setSpeaking(null)
}

// Per-viewer preference; falls back to off when storage is unavailable.
const AUTO_READ_KEY = 'fehlerfreund:autoRead'

export function loadAutoRead() {
  try {
    return localStorage.getItem(AUTO_READ_KEY) === '1'
  } catch {
    return false
  }
}

export function saveAutoRead(on: boolean) {
  try {
    localStorage.setItem(AUTO_READ_KEY, on ? '1' : '0')
  } catch {
    // Private mode etc.: the toggle still works for this page view.
  }
}
