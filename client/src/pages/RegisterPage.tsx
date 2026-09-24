import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { LEVELS, NATIVE_LANGUAGES, type Level, type NativeLanguage, type RegisterInput } from '../auth/types'
import { AuthCard, Button, Field, Input, Select } from '../components/ui'

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterInput>({
    email: '',
    password: '',
    displayName: '',
    nativeLanguage: 'hu',
    level: 'A2',
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const set = <K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.details ?? {})
      } else {
        setError('Something went wrong')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Regisztráció">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Név" error={fieldErrors.displayName?.[0]}>
          <Input required value={form.displayName} onChange={(e) => set('displayName', e.target.value)} />
        </Field>
        <Field label="Email" error={fieldErrors.email?.[0]}>
          <Input
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>
        <Field label="Jelszó (min. 8 karakter)" error={fieldErrors.password?.[0]}>
          <Input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Szinted">
            <Select value={form.level} onChange={(e) => set('level', e.target.value as Level)}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Anyanyelv">
            <Select
              value={form.nativeLanguage}
              onChange={(e) => set('nativeLanguage', e.target.value as NativeLanguage)}
            >
              {NATIVE_LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Fiók létrehozása…' : 'Fiók létrehozása'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Van már fiókod?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Bejelentkezés
        </Link>
      </p>
    </AuthCard>
  )
}
