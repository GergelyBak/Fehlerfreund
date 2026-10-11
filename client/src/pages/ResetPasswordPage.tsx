import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, PasswordInput } from '../components/ui'
import { useI18n } from '../i18n/context'

const MIN_PASSWORD = 8
const TOKEN_RE = /^[a-f0-9]{64}$/

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const { t } = useI18n()
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
      <AuthLayout title={t.reset.invalidTitle} subtitle={t.reset.invalidSubtitle}>
        <Link
          to="/forgot-password"
          className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          {t.reset.newLink}
        </Link>
        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            {t.forgot.backToLogin}
          </Link>
        </p>
      </AuthLayout>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const errors: typeof fieldErrors = {}
    if (password.length < MIN_PASSWORD) errors.password = t.form.passwordTooShort(MIN_PASSWORD)
    if (confirm !== password) errors.confirm = t.reset.mismatch
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
    <AuthLayout title={t.reset.title} subtitle={t.reset.subtitle}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field
          label={t.reset.newPassword}
          htmlFor="password"
          error={fieldErrors.password}
          hint={
            <span className={passwordOk ? 'text-emerald-600' : undefined}>
              {passwordOk ? '✓' : '•'} {t.form.minChars(MIN_PASSWORD)}
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
        <Field label={t.reset.confirm} htmlFor="confirm" error={fieldErrors.confirm}>
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
          {submitting ? t.reset.submitting : t.reset.submit}
        </Button>
      </form>
    </AuthLayout>
  )
}
