export type Level = 'A1' | 'A2' | 'B1' | 'B2'
export type NativeLanguage = 'hu' | 'en' | 'tr'

export interface User {
  id: string
  email: string
  displayName: string
  nativeLanguage: NativeLanguage
  level: Level
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
  nativeLanguage: NativeLanguage
  level: Level
}

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2']
export const NATIVE_LANGUAGES: { value: NativeLanguage; label: string }[] = [
  { value: 'hu', label: 'Magyar' },
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
]
