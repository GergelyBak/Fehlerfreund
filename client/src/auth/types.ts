export type Level = 'A1' | 'A2' | 'B1' | 'B2'
export type NativeLanguage = 'hu' | 'en'

export interface User {
  id: string
  email: string
  displayName: string
  nativeLanguage: NativeLanguage
  level: Level
  reminders: ReminderSettings
}

export interface ReminderSettings {
  enabled: boolean
  hour: number // local hour, 0–23
  timeZone: string
}

export type UserUpdate = Partial<Pick<User, 'displayName' | 'nativeLanguage' | 'level'>> & {
  reminders?: Partial<ReminderSettings>
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
]
