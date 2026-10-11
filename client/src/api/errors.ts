import { activeMessages } from '../i18n/context'
import { ApiError, SERVER_UNREACHABLE } from './client'

// The API answers in English; the UI shows the learner's language.
export function errorMessage(err: unknown, fallback?: string) {
  const t = activeMessages()
  const otherwise = fallback ?? t.common.genericError
  if (err instanceof ApiError) return t.apiErrors[err.message] ?? otherwise
  // fetch throws TypeError when the server can't be reached at all.
  if (err instanceof TypeError) return t.apiErrors[SERVER_UNREACHABLE]!
  return otherwise
}
