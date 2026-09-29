export interface Progress {
  bestScore: number
  lastScore: number
  attempts: number
}

export interface TopicSummary {
  id: string
  level: string
  order: number
  title: string
  summary: string
  exerciseCount: number
  progress: Progress | null
}

export interface LessonSection {
  heading: string
  text?: string
  table?: { headers: string[]; rows: string[][] }
  examples?: { de: string; hu: string }[]
  tip?: string
}

export type Exercise =
  | { id: string; type: 'choice'; prompt: string; hint?: string; options: string[] }
  | { id: string; type: 'gap'; prompt: string; hint?: string }

export interface Topic {
  id: string
  level: string
  order: number
  title: string
  summary: string
  lesson: LessonSection[]
  exercises: Exercise[]
}

export interface ExerciseResult {
  id: string
  correct: boolean
  given: string
  solution: string
  explanation: string
}

export interface CheckResponse {
  results: ExerciseResult[]
  score: number
  total: number
  cardsAdded: number
  progress: Progress | null
}

export const GAP = '___'
export const PASS_SCORE = 0.8
