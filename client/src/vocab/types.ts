import type { Progress } from '../grammar/types'

export interface ThemeSummary {
  id: string
  level: string
  order: number
  title: string
  wordCount: number
  progress: Progress | null
}

export interface Word {
  id: string
  type: 'n' | 'v' | 'a' | 'x'
  de: string
  forms: string
  translation: string
  example: string
}

export interface Theme {
  id: string
  level: string
  order: number
  title: string
  words: Word[]
}

export type Verdict = 'correct' | 'article' | 'wrong' | 'empty'

export interface WordResult {
  id: string
  verdict: Verdict
  given: string
  solution: string
}

export interface VocabCheckResponse {
  results: WordResult[]
  score: number
  total: number
  cardsAdded: number
  progress: Progress | null
}
