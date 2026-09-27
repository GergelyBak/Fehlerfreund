import type { Level } from '../auth/types'

export interface Situation {
  id: string
  emoji: string
  title: string
  description: string
}

export type ErrorType =
  | 'Kasus'
  | 'Artikel'
  | 'Wortstellung'
  | 'Verbkonjugation'
  | 'Tempus'
  | 'Präposition'
  | 'Adjektivdeklination'
  | 'Rechtschreibung'
  | 'Wortwahl'
  | 'Sonstiges'

export interface CorrectionItem {
  original: string
  corrected: string
  errorType: ErrorType
  severity: 'minor' | 'major'
  explanation: string
}

export type StoredCorrection =
  | {
      status: 'ok'
      hasErrors: boolean
      correctedMessage: string
      corrections: CorrectionItem[]
      promptVersion: string
      model: string
    }
  | { status: 'failed'; reason: string; promptVersion: string; model: string }

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  correction: StoredCorrection | null
  // Client-only flags while a reply is in flight.
  pending?: boolean
  streaming?: boolean
}

export interface Conversation {
  id: string
  situationId: string
  level: Level
  messages: ChatMessage[]
}

export interface ConversationSummary {
  id: string
  situationId: string
  level: Level
  updatedAt: string
  messageCount: number
  lastMessage: string
}
