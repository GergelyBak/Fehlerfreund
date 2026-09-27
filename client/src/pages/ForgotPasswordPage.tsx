import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, Field, Input } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordPage() {
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
      setFieldError('Adj meg egy érvényes e-mail-címet.')
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
      <AuthLayout title="Nézd meg a leveleidet" subtitle="Ha van fiók ezzel a címmel, küldtünk rá egy linket.">
        <div className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <p className="text-slate-700">
            Ha a <strong>{sentTo}</strong> címmel van regisztrált fiók, pár percen belül megérkezik a levél. A benne lévő
            link <strong>1 óráig</strong> érvényes.
          </p>
          <p className="text-sm text-slate-500">
            Nem jött meg? Nézd meg a spam mappát is, vagy{' '}
            <button type="button" onClick={() => setSentTo(null)} className="font-medium text-indigo-600 hover:underline">
              próbáld újra
            </button>
            .
          </p>
        </div>
        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            ← Vissza a bejelentkezéshez
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Elfelejtetted a jelszavad?"
      subtitle="Semmi gond. Add meg az e-mail-címed, és küldünk egy linket, amellyel új jelszót állíthatsz be."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field label="E-mail-cím" htmlFor="email" error={fieldError ?? undefined}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="te@pelda.hu"
            value={email}
            invalid={!!fieldError}
            onChange={(e) => {
              setEmail(e.target.value)
              setFieldError(null)
            }}
          />
        </Field>
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Küldés…' : 'Link küldése'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Eszedbe jutott?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Jelentkezz be
        </Link>
      </p>
    </AuthLayout>
  )
}
