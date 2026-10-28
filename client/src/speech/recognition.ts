// German speech-to-text with the browser's built-in recognizer (Chrome, Edge,
// Android, Safari). Free and with no server involved; the browser may send
// the audio to its own speech service. Firefox has no recognizer.

import { useCallback, useEffect, useRef, useState } from 'react'
import { stopSpeaking } from './speech'

// The parts of the (not yet standard-typed) Web Speech API that we use.
interface RecognitionAlternative {
  transcript: string
}
interface RecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: RecognitionAlternative
}
interface RecognitionEvent {
  resultIndex: number
  results: { length: number; [index: number]: RecognitionResult }
}
interface Recognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

const Ctor: RecognitionCtor | undefined =
  typeof window === 'undefined'
    ? undefined
    : ((window as unknown as { SpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition)

export const recognitionSupported = Ctor !== undefined

/** Why listening failed, as a key of the speech error texts. */
export type RecognitionError = 'denied' | 'noSpeech' | 'noMic' | 'network' | 'other'

const ERROR_KEYS: Record<string, RecognitionError> = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
  'no-speech': 'noSpeech',
  'audio-capture': 'noMic',
  network: 'network',
}

/**
 * One utterance at a time: start() listens until the speaker pauses, shows
 * the words as they come (`interim`) and hands every guess of the final
 * result to `onFinal`, best first.
 */
export function useSpeechRecognition(lang = 'de-DE') {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<RecognitionError | null>(null)
  const current = useRef<Recognition | null>(null)

  // Leaving the page stops the microphone.
  useEffect(() => () => current.current?.abort(), [])

  const start = useCallback(
    (onFinal: (alternatives: string[]) => void) => {
      if (!Ctor) return
      current.current?.abort()
      // Don't let the recognizer hear the app reading aloud.
      stopSpeaking()
      const r = new Ctor()
      r.lang = lang
      r.interimResults = true
      r.maxAlternatives = 3
      r.continuous = false
      let delivered = false
      r.onresult = (e) => {
        const result = e.results[e.results.length - 1]!
        if (result.isFinal) {
          delivered = true
          const alternatives = Array.from({ length: result.length }, (_, i) => result[i]!.transcript.trim()).filter(Boolean)
          setInterim('')
          onFinal(alternatives)
        } else {
          setInterim(result[0]?.transcript ?? '')
        }
      }
      r.onerror = (e) => {
        // Stopping on purpose raises "aborted": not an error for the learner.
        if (e.error !== 'aborted') setError(ERROR_KEYS[e.error] ?? 'other')
      }
      r.onend = () => {
        setListening(false)
        setInterim('')
        if (current.current === r) current.current = null
        if (!delivered) onFinal([])
      }
      current.current = r
      setError(null)
      setInterim('')
      setListening(true)
      r.start()
    },
    [lang],
  )

  const stop = useCallback(() => current.current?.stop(), [])

  return { supported: recognitionSupported, listening, interim, error, start, stop }
}
