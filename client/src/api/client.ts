export class ApiError extends Error {
  status: number
  details?: Record<string, string[]>

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const SERVER_UNREACHABLE = 'Server unreachable'

// Our API always answers errors with JSON { error }. A 5xx without it comes
// from the dev proxy (or a gateway) when the backend isn't running.
export async function toApiError(res: Response) {
  const body = await res.json().catch(() => null)
  if (!body?.error && res.status >= 500) return new ApiError(res.status, SERVER_UNREACHABLE)
  return new ApiError(res.status, body?.error ?? 'Request failed', body?.details)
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  if (res.status === 204) return undefined as T
  if (!res.ok) throw await toApiError(res)
  return (await res.json()) as T
}
