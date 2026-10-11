import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, Input } from '../components/ui'
import { useI18n } from '../i18n/context'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setFieldError(t.form.invalidEmail)
      return
    }
    setFieldError(null)
    setSubmitting(true)
    try {
      await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: value }) })
      setSentTo(value)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (sentTo) {
    return (
      <AuthLayout title={t.forgot.sentTitle} subtitle={t.forgot.sentSubtitle}>
        <div className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <p className="text-slate-700">
            {t.forgot.sentBefore}
            <strong>{sentTo}</strong>
            {t.forgot.sentAfter}
            <strong>{t.forgot.validFor}</strong>
            {t.forgot.sentEnd}
          </p>
          <p className="text-sm text-slate-500">
            {t.forgot.notArrived}
            <button type="button" onClick={() => setSentTo(null)} className="font-medium text-indigo-600 hover:underline">
              {t.forgot.tryAgain}
            </button>
            .
          </p>
        </div>
        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            {t.forgot.backToLogin}
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t.forgot.title} subtitle={t.forgot.subtitle}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field label={t.form.email} htmlFor="email" error={fieldError ?? undefined}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder={t.form.emailPlaceholder}
            value={email}
            invalid={!!fieldError}
            onChange={(e) => {
              setEmail(e.target.value)
              setFieldError(null)
            }}
          />
        </Field>
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? t.forgot.submitting : t.forgot.submit}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        {t.forgot.remembered}{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          {t.forgot.login}
        </Link>
      </p>
    </AuthLayout>
  )
}
