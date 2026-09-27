import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { NATIVE_LANGUAGES, type Level, type NativeLanguage, type RegisterInput } from '../auth/types'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, Input, PasswordInput, Select } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

const LEVEL_OPTIONS: { value: Level; label: string; text: string }[] = [
  { value: 'A1', label: 'Kezdő', text: 'Pár szó, bemutatkozás' },
  { value: 'A2', label: 'Alapfok', text: 'Egyszerű mindennapi helyzetek' },
  { value: 'B1', label: 'Középfok', text: 'Elboldogulok, de még hibázom' },
  { value: 'B2', label: 'Felső-közép', text: 'Folyékony, árnyalt beszéd' },
]

type FieldErrors = Partial<Record<keyof RegisterInput, string>>

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [emailTaken, setEmailTaken] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const set = <K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Clear a field's error as soon as the user starts fixing it.
    if (fieldErrors[key]) setFieldErrors((errs) => ({ ...errs, [key]: undefined }))
  }

  function validate() {
    const errors: FieldErrors = {}
    if (!form.displayName.trim()) errors.displayName = 'Hogyan szólíthatunk?'
    if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Adj meg egy érvényes e-mail-címet.'
    if (form.password.length < MIN_PASSWORD) errors.password = `A jelszó legalább ${MIN_PASSWORD} karakter legyen.`
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
      await register({ ...form, email: form.email.trim(), displayName: form.displayName.trim() })
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setEmailTaken(true)
        setFieldErrors({ email: 'Ezzel az e-mail-címmel már regisztráltak.' })
      } else {
        setError(errorMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const passwordOk = form.password.length >= MIN_PASSWORD

  return (
    <AuthLayout title="Hozd létre a fiókod" subtitle="Egy perc az egész, és már beszélgethetsz is.">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        {emailTaken && (
          <Alert>
            Ezzel az e-mail-címmel már van fiók.{' '}
            <Link to="/login" className="font-medium underline">
              Jelentkezz be
            </Link>
            .
          </Alert>
        )}

        <Field label="Név" htmlFor="displayName" error={fieldErrors.displayName}>
          <Input
            id="displayName"
            autoComplete="given-name"
            autoFocus
            placeholder="Pl. Anna"
            maxLength={50}
            value={form.displayName}
            invalid={!!fieldErrors.displayName}
            onChange={(e) => set('displayName', e.target.value)}
          />
        </Field>

        <Field label="E-mail-cím" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="te@pelda.hu"
            value={form.email}
            invalid={!!fieldErrors.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>

        <Field
          label="Jelszó"
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
            value={form.password}
            invalid={!!fieldErrors.password}
            onChange={(e) => set('password', e.target.value)}
          />
        </Field>

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-slate-700">Milyen szinten beszélsz németül?</legend>
          <div className="grid grid-cols-2 gap-2">
            {LEVEL_OPTIONS.map((l) => {
              const selected = form.level === l.value
              return (
                <label
                  key={l.value}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 transition has-focus-visible:ring-2 has-focus-visible:ring-indigo-200 ${
                    selected ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={l.value}
                    checked={selected}
                    onChange={() => set('level', l.value)}
                    className="sr-only"
                  />
                  <span className="flex items-baseline gap-2">
                    <span className={`font-semibold ${selected ? 'text-indigo-700' : ''}`}>{l.value}</span>
                    <span className="text-sm font-medium">{l.label}</span>
                  </span>
                  <span className="block text-xs text-slate-500">{l.text}</span>
                </label>
              )
            })}
          </div>
          <p className="text-sm text-slate-500">Később bármikor módosíthatod.</p>
        </fieldset>

        <Field label="Anyanyelv" htmlFor="nativeLanguage" hint="Ezen a nyelven kapod a javítások magyarázatát.">
          <Select
            id="nativeLanguage"
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

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Fiók létrehozása…' : 'Fiók létrehozása'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Van már fiókod?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Jelentkezz be
        </Link>
      </p>
    </AuthLayout>
  )
}
