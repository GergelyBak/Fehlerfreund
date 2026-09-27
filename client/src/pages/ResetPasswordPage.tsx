import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, PasswordInput } from '../components/ui'

const MIN_PASSWORD = 8
const TOKEN_RE = /^[a-f0-9]{64}$/

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [linkInvalid, setLinkInvalid] = useState(!TOKEN_RE.test(token))
  const [submitting, setSubmitting] = useState(false)

  if (linkInvalid) {
    return (
      <AuthLayout title="Ez a link már nem érvényes" subtitle="A visszaállító link 1 óráig érvényes, és csak egyszer használható.">
        <Link
          to="/forgot-password"
          className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          Új link kérése
        </Link>
        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            ← Vissza a bejelentkezéshez
          </Link>
        </p>
      </AuthLayout>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const errors: typeof fieldErrors = {}
    if (password.length < MIN_PASSWORD) errors.password = `A jelszó legalább ${MIN_PASSWORD} karakter legyen.`
    if (confirm !== password) errors.confirm = 'A két jelszó nem egyezik.'
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setSubmitting(true)
    try {
      await resetPassword(token, password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setLinkInvalid(true)
      else setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const passwordOk = password.length >= MIN_PASSWORD

  return (
    <AuthLayout title="Új jelszó beállítása" subtitle="Válassz egy új jelszót. Utána automatikusan bejelentkezel.">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field
          label="Új jelszó"
          htmlFor="password"
          error={fieldErrors.password}
          hint={
            <span className={passwordOk ? 'text-emerald-600' : undefined}>
              {passwordOk ? '✓' : '•'} Legalább {MIN_PASSWORD} karakter
            </span>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            invalid={!!fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value)
              setFieldErrors((f) => ({ ...f, password: undefined }))
            }}
          />
        </Field>
        <Field label="Új jelszó még egyszer" htmlFor="confirm" error={fieldErrors.confirm}>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={confirm}
            invalid={!!fieldErrors.confirm}
            onChange={(e) => {
              setConfirm(e.target.value)
              setFieldErrors((f) => ({ ...f, confirm: undefined }))
            }}
          />
        </Field>
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Mentés…' : 'Jelszó mentése és belépés'}
        </Button>
      </form>
    </AuthLayout>
  )
}
