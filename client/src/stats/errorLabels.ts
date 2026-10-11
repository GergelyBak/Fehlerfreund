import type { ErrorType } from '../chat/types'

// The error categories. Their names in the learner's language live in the
// messages (t.errorTypes); the German term stays the "official" name the
// learner also meets in corrections and cards.
export const ERROR_TYPES: readonly ErrorType[] = [
  'Kasus',
  'Artikel',
  'Wortstellung',
  'Verbkonjugation',
  'Tempus',
  'Präposition',
  'Adjektivdeklination',
  'Rechtschreibung',
  'Wortwahl',
  'Sonstiges',
]

export const isErrorType = (value: string | null): value is ErrorType =>
  value !== null && (ERROR_TYPES as readonly string[]).includes(value)
