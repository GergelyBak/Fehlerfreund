import { useState } from 'react'
import { api } from '../api/client'
import { errorMessage } from '../api/errors'
import type { ChatMessage } from './types'

export function AssistantMessage({
  message,
  conversationId,
  onTranslated,
}: {
  message: ChatMessage
  conversationId: string
  onTranslated: (messageId: string, text: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translation = message.translation?.text
  // Only saved messages can be translated (streaming ones still have a temporary id).
  const canTranslate = !message.streaming && !message.id.startsWith('tmp-')

  async function toggle() {
    if (visible) {
      setVisible(false)
      return
    }
    setVisible(true)
    if (translation) return
    setLoading(true)
    setError(null)
    try {
      const res = await api<{ translation: string }>(
        `/conversations/${conversationId}/messages/${message.id}/translate`,
        { method: 'POST' },
      )
      onTranslated(message.id, res.translation)
    } catch (err) {
      setError(errorMessage(err, 'Nem sikerült lefordítani.'))
      setVisible(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex max-w-[80%] flex-col items-start gap-1">
      <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2 whitespace-pre-wrap">
        {message.content}
        {message.streaming && <span className="ml-0.5 inline-block animate-pulse">▍</span>}
      </div>
      {visible && translation && (
        <p className="rounded-xl bg-sky-50 px-3 py-1.5 text-sm text-sky-900 italic ring-1 ring-sky-100">{translation}</p>
      )}
      {canTranslate && (
        <button
          type="button"
          onClick={() => void toggle()}
          disabled={loading}
          className="px-1 text-xs font-medium text-slate-500 hover:text-indigo-600 disabled:opacity-60"
        >
          {loading ? 'Fordítás…' : visible ? 'Fordítás elrejtése' : '🌐 Fordítás'}
        </button>
      )}
      {error && <p className="px-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
