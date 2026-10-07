import { createContext, useContext } from 'react'
import type { RegisterInput, User, UserUpdate } from './types'

export interface AuthState {
  user: User | null
  loading: boolean
  // True while retrying because the (sleeping) server doesn't answer yet.
  waking: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  updateMe: (patch: UserUpdate) => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
