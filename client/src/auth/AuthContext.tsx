import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError, SERVER_UNREACHABLE } from '../api/client'
import type { RegisterInput, User } from './types'
import { AuthContext } from './useAuth'

const WAKE_TIMEOUT_MS = 90_000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [waking, setWaking] = useState(false)

  useEffect(() => {
    // The free hosting tier puts the API to sleep after 15 idle minutes, and
    // waking it takes up to a minute. Keep retrying the session check while
    // the server is unreachable instead of failing on the first try.
    let cancelled = false
    const startedAt = Date.now()
    const check = () => {
      api<{ user: User }>('/auth/me')
        .then(({ user }) => !cancelled && setUser(user))
        .then(() => !cancelled && finish())
        .catch((err) => {
          if (cancelled) return
          const unreachable = err instanceof TypeError || (err instanceof ApiError && err.message === SERVER_UNREACHABLE)
          if (unreachable && Date.now() - startedAt < WAKE_TIMEOUT_MS) {
            setWaking(true)
            setTimeout(check, 4000)
            return
          }
          if (!(err instanceof ApiError && err.status === 401)) console.error(err)
          finish()
        })
    }
    const finish = () => {
      setWaking(false)
      setLoading(false)
    }
    check()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(user)
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const { user } = await api<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    setUser(user)
  }, [])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  // A successful reset also signs the user in.
  const resetPassword = useCallback(async (token: string, password: string) => {
    const { user } = await api<{ user: User }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
    setUser(user)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, waking, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
