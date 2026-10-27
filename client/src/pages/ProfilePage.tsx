import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import { LEVELS, NATIVE_LANGUAGES, type Level, type NativeLanguage } from '../auth/types'
import { useAuth } from '../auth/useAuth'
import { Alert, Button, Field, Input, PasswordInput, Select } from '../components/ui'
import { useI18n } from '../i18n/context'
import { Card } from '../stats/charts'
import { ReminderSettings } from '../stats/ReminderSettings'

const MIN_PASSWORD = 8

export function ProfilePage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t.profile.title}</h1>
        <p className="text-slate-600">{t.profile.intro}</p>
      </div>
      <DetailsCard />
      <ReminderSettings />
      <PasswordCard />
      <SessionsCard />
      <DataCard />
      <DeleteCard />
    </div>
  )
}

// Saved / error line under a form.
function Status({ ok, error }: { ok?: string | null; error?: string | null }) {
  if (error) return <Alert>{error}</Alert>
  if (ok) return <p className="text-sm font-medium text-emerald-700">{ok}</p>
  return null
}

function DetailsCard() {
  const { user, updateMe } = useAuth()
  const { t, lang, setLang } = useI18n()
  const [name, setName] = useState(user?.displayName ?? '')
  const [level, setLevel] = useState<Level>(user?.level ?? 'A2')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!user) return null
  const changed = name.trim() !== user.displayName || level !== user.level

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setOk(null)
    setError(null)
    try {
      await updateMe({ displayName: name.trim(), level })
      setOk(t.profile.saved)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title={t.profile.detailsTitle} subtitle={t.profile.detailsSubtitle}>
      <form onSubmit={save} className="space-y-4">
        <Field label={t.form.email} htmlFor="profile-email">
          <Input id="profile-email" value={user.email} disabled />
        </Field>
        <Field label={t.profile.name} htmlFor="profile-name">
          <Input
            id="profile-name"
            value={name}
            maxLength={50}
            invalid={!name.trim()}
            onChange={(e) => {
              setName(e.target.value)
              setOk(null)
            }}
          />
        </Field>
        <Field label={t.profile.level} htmlFor="profile-level">
          <Select
            id="profile-level"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as Level)
              setOk(null)
            }}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} – {t.register.levels[l].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.profile.language} htmlFor="profile-language" hint={t.profile.languageHint}>
          {/* Applied immediately, like the HU/EN switch in the header. */}
          <Select id="profile-language" value={lang} onChange={(e) => void setLang(e.target.value as NativeLanguage)}>
            {NATIVE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={saving} disabled={!changed || !name.trim()}>
            {saving ? t.profile.saving : t.profile.save}
          </Button>
          <Status ok={ok} error={error} />
        </div>
      </form>
    </Card>
  )
}

function PasswordCard() {
  const { changePassword } = useAuth()
  const { t } = useI18n()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldError, setFieldError] = useState<{ next?: string; confirm?: string }>({})
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setOk(null)
    setError(null)
    const errors: typeof fieldError = {}
    if (next.length < MIN_PASSWORD) errors.next = t.form.passwordTooShort(MIN_PASSWORD)
    if (confirm !== next) errors.confirm = t.reset.mismatch
    setFieldError(errors)
    if (Object.keys(errors).length || !current) return
    setBusy(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      setOk(t.profile.passwordChanged)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title={t.profile.passwordTitle} subtitle={t.profile.passwordSubtitle}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label={t.profile.currentPassword} htmlFor="pw-current">
          <PasswordInput id="pw-current" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label={t.profile.newPassword} htmlFor="pw-new" error={fieldError.next} hint={t.form.minChars(MIN_PASSWORD)}>
          <PasswordInput
            id="pw-new"
            autoComplete="new-password"
            value={next}
            invalid={!!fieldError.next}
            onChange={(e) => setNext(e.target.value)}
          />
        </Field>
        <Field label={t.profile.confirmPassword} htmlFor="pw-confirm" error={fieldError.confirm}>
          <PasswordInput
            id="pw-confirm"
            autoComplete="new-password"
            value={confirm}
            invalid={!!fieldError.confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={busy} disabled={!current || !next || !confirm}>
            {t.profile.changePassword}
          </Button>
          <Status ok={ok} error={error} />
        </div>
      </form>
    </Card>
  )
}

function SessionsCard() {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function logoutAll() {
    setBusy(true)
    setOk(null)
    setError(null)
    try {
      await api('/auth/logout-all', { method: 'POST' })
      setOk(t.profile.loggedOutAll)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title={t.profile.sessionsTitle}>
      <p className="text-sm text-slate-600">{t.profile.sessionsText}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void logoutAll()}
          disabled={busy}
          className="rounded-lg px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50 disabled:opacity-60"
        >
          {t.profile.logoutAll}
        </button>
        <Status ok={ok} error={error} />
      </div>
    </Card>
  )
}

function DataCard() {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function download() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/me/export', { credentials: 'include' })
      if (!res.ok) throw new Error(String(res.status))
      const name = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') ?? '')?.[1] ?? 'fehlerfreund-export.json'
      const url = URL.createObjectURL(await res.blob())
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(t.profile.exportFailed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title={t.profile.dataTitle}>
      <p className="text-sm text-slate-600">{t.profile.dataText}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void download()}
          disabled={busy}
          className="rounded-lg px-4 py-2.5 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50 disabled:opacity-60"
        >
          {busy ? t.profile.exporting : `⬇️ ${t.profile.export}`}
        </button>
        <Status error={error} />
      </div>
    </Card>
  )
}

function DeleteCard() {
  const { deleteAccount } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirmDelete(e: FormEvent) {
    e.preventDefault()
    if (!password) return
    setBusy(true)
    setError(null)
    try {
      await deleteAccount(password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-200">
      <h2 className="font-semibold text-red-700">{t.profile.deleteTitle}</h2>
      <p className="text-sm text-slate-600">{t.profile.deleteText}</p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg px-4 py-2.5 font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-50"
        >
          {t.profile.deleteStart}
        </button>
      ) : (
        <form onSubmit={confirmDelete} className="space-y-3">
          <Field label={t.profile.deleteConfirmLabel} htmlFor="delete-password">
            <PasswordInput
              id="delete-password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {error && <Alert>{error}</Alert>}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy || !password}
              className="rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? t.profile.deleting : t.profile.deleteConfirm}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setPassword('')
                setError(null)
              }}
              className="rounded-lg px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
