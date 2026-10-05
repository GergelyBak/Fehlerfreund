import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { errorMessage } from '../api/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, Input, PasswordInput } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/'
  if (user) return <Navigate to={from} replace />

  function validate() {
    const errors: typeof fieldErrors = {}
    if (!EMAIL_RE.test(email.trim())) errors.email = 'Adj meg egy érvényes e-mail-címet.'
    if (!password) errors.password = 'Add meg a jelszavad.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Üdv újra!" subtitle="Jelentkezz be, és folytasd a gyakorlást ott, ahol abbahagytad.">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field label="E-mail-cím" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="te@pelda.hu"
            value={email}
            invalid={!!fieldErrors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Jelszó" htmlFor="password" error={fieldErrors.password}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            invalid={!!fieldErrors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="inline-block py-2 text-sm font-medium text-indigo-600 hover:underline">
            Elfelejtetted a jelszavad?
          </Link>
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Bejelentkezés…' : 'Bejelentkezés'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Még nincs fiókod?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          Regisztrálj ingyen
        </Link>
      </p>
    </AuthLayout>
  )
}
