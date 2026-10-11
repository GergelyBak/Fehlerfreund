import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { LEVELS, NATIVE_LANGUAGES, type NativeLanguage, type RegisterInput } from '../auth/types'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, Input, PasswordInput, Select } from '../components/ui'
import { useI18n } from '../i18n/context'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

type FieldErrors = Partial<Record<keyof RegisterInput, string>>

export function RegisterPage() {
  const { user, register } = useAuth()
  const { t, lang, setLang } = useI18n()
  const navigate = useNavigate()
  const [form, setForm] = useState<Omit<RegisterInput, 'nativeLanguage'>>({
    email: '',
    password: '',
    displayName: '',
    level: 'A2',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [emailTaken, setEmailTaken] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Clear a field's error as soon as the user starts fixing it.
    if (fieldErrors[key]) setFieldErrors((errs) => ({ ...errs, [key]: undefined }))
  }

  function validate() {
    const errors: FieldErrors = {}
    if (!form.displayName.trim()) errors.displayName = t.register.nameMissing
    if (!EMAIL_RE.test(form.email.trim())) errors.email = t.form.invalidEmail
    if (form.password.length < MIN_PASSWORD) errors.password = t.form.passwordTooShort(MIN_PASSWORD)
    setFieldErrors(errors)
    return Object.values(errors).every((e) => !e)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailTaken(false)
    if (!validate()) return
    setSubmitting(true)
    try {
      // The language picked here (the page's own language) becomes the account's.
      await register({ ...form, nativeLanguage: lang, email: form.email.trim(), displayName: form.displayName.trim() })
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setEmailTaken(true)
        setFieldErrors({ email: t.register.emailTaken })
      } else {
        setError(errorMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const passwordOk = form.password.length >= MIN_PASSWORD

  return (
    <AuthLayout title={t.register.title} subtitle={t.register.subtitle}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        {emailTaken && (
          <Alert>
            {t.register.emailTakenAlert}{' '}
            <Link to="/login" className="font-medium underline">
              {t.register.login}
            </Link>
            .
          </Alert>
        )}

        <Field label={t.register.name} htmlFor="displayName" error={fieldErrors.displayName}>
          <Input
            id="displayName"
            autoComplete="given-name"
            autoFocus
            placeholder={t.register.namePlaceholder}
            maxLength={50}
            value={form.displayName}
            invalid={!!fieldErrors.displayName}
            onChange={(e) => set('displayName', e.target.value)}
          />
        </Field>

        <Field label={t.form.email} htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t.form.emailPlaceholder}
            value={form.email}
            invalid={!!fieldErrors.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>

        <Field
          label={t.form.password}
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
            value={form.password}
            invalid={!!fieldErrors.password}
            onChange={(e) => set('password', e.target.value)}
          />
        </Field>

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-slate-700">{t.register.levelQuestion}</legend>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((level) => {
              const selected = form.level === level
              const info = t.register.levels[level]
              return (
                <label
                  key={level}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 transition has-focus-visible:ring-2 has-focus-visible:ring-indigo-200 ${
                    selected ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={selected}
                    onChange={() => set('level', level)}
                    className="sr-only"
                  />
                  <span className="flex items-baseline gap-2">
                    <span className={`font-semibold ${selected ? 'text-indigo-700' : ''}`}>{level}</span>
                    <span className="text-sm font-medium">{info.label}</span>
                  </span>
                  <span className="block text-xs text-slate-500">{info.text}</span>
                </label>
              )
            })}
          </div>
          <p className="text-sm text-slate-500">{t.register.levelLater}</p>
        </fieldset>

        <Field label={t.register.language} htmlFor="nativeLanguage" hint={t.register.languageHint}>
          <Select id="nativeLanguage" value={lang} onChange={(e) => void setLang(e.target.value as NativeLanguage)}>
            {NATIVE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </Field>

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? t.register.submitting : t.register.submit}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        {t.register.haveAccount}{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          {t.register.login}
        </Link>
      </p>
    </AuthLayout>
  )
}
