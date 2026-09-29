import type { ErrorType } from '../chat/types'

export type UiGrade = 1 | 3 | 4 | 5

export interface Card {
  id: string
  errorType: ErrorType
  original: string
  corrected: string
  explanation: string
  prompt: string
  answer: string
  occurrences: number
  situationId: string | null
  dueAt: string
  interval: number
  repetitions: number
  reviewCount: number
  previews: Record<UiGrade, number>
}

export interface CardStats {
  total: number
  due: number
  nextDueAt: string | null
}
