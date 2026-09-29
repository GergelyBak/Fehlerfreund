import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import { api, ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { postSse } from '../api/sse'
import { CorrectionPanel } from '../chat/CorrectionPanel'
import { useSituations } from '../chat/useSituations'
import { notifyCardsChanged } from '../review/cardEvents'
import type { ChatMessage, Conversation, StoredCorrection } from '../chat/types'

const MAX_LENGTH = 500

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const { situations } = useSituations()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    api<{ conversation: Conversation }>(`/conversations/${id}`)
      .then((r) => setConversation(r.conversation))
      .catch((err) => setLoadError(errorMessage(err, 'Nem sikerült betölteni a beszélgetést.')))
    // Abort an in-flight reply when leaving the page.
    return () => abortRef.current?.abort()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [conversation?.messages])

  const updateMessage = (messageId: string, patch: (m: ChatMessage) => ChatMessage) =>
    setConversation((c) => c && { ...c, messages: c.messages.map((m) => (m.id === messageId ? patch(m) : m)) })

  async function send(e?: FormEvent) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || sending || !conversation) return

    // Temporary ids until the server tells us the real ones.
    let userId = `tmp-user-${Date.now()}`
    let assistantId = `tmp-assistant-${Date.now()}`
    setConversation((c) =>
      c && {
        ...c,
        messages: [
          ...c.messages,
          { id: userId, role: 'user', content: text, correction: null, pending: true },
          { id: assistantId, role: 'assistant', content: '', correction: null, streaming: true },
        ],
      },
    )
    setInput('')
    setSending(true)
    setSendError(null)

    const controller = new AbortController()
    abortRef.current = controller
    let failed = false
    try {
      await postSse(
        `/conversations/${conversation.id}/messages`,
        { text },
        (event, data) => {
          switch (event) {
            case 'user_message': {
              const realId = (data as { id: string }).id
              updateMessage(userId, (m) => ({ ...m, id: realId }))
              userId = realId
              break
            }
            case 'delta':
              updateMessage(assistantId, (m) => ({ ...m, content: m.content + (data as { text: string }).text }))
              break
            case 'correction': {
              const { correction, cardsAdded } = data as { correction: StoredCorrection; cardsAdded?: number }
              updateMessage(userId, (m) => ({ ...m, correction, cardsAdded, pending: false }))
              if (cardsAdded) notifyCardsChanged()
              break
            }
            case 'done': {
              const realId = (data as { assistantMessageId: string }).assistantMessageId
              updateMessage(assistantId, (m) => ({ ...m, id: realId, streaming: false }))
              assistantId = realId
              break
            }
            case 'error':
              failed = true
              setSendError(errorMessage(new ApiError(500, (data as { error: string }).error)))
              break
          }
        },
        controller.signal,
      )
    } catch (err) {
      if (controller.signal.aborted) return
      failed = true
      setSendError(errorMessage(err, 'A kapcsolat megszakadt.'))
      // The message never reached the server: give the text back for retrying.
      if (err instanceof ApiError) {
        setInput(text)
        setConversation((c) => c && { ...c, messages: c.messages.filter((m) => m.id !== userId) })
      }
    } finally {
      // Drop an empty reply bubble and clear leftover loading flags.
      setConversation(
        (c) =>
          c && {
            ...c,
            messages: c.messages
              .filter((m) => !(m.id === assistantId && failed && !m.content))
              .map((m) => (m.id === userId || m.id === assistantId ? { ...m, pending: false, streaming: false } : m)),
          },
      )
      setSending(false)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{loadError}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          ← Vissza a helyzetekhez
        </Link>
      </div>
    )
  }
  if (!conversation) return <p className="text-slate-500">Betöltés…</p>

  const situation = situations?.find((s) => s.id === conversation.situationId)

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            {situation?.emoji}
          </span>
          <div>
            <h1 className="font-semibold">{situation?.title ?? 'Beszélgetés'}</h1>
            <p className="text-sm text-slate-500">Szint: {conversation.level}</p>
          </div>
        </div>
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← Helyzetek
        </Link>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        {conversation.messages.map((m) =>
          m.role === 'assistant' ? (
            <div key={m.id} className="flex">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2 whitespace-pre-wrap">
                {m.content}
                {m.streaming && <span className="ml-0.5 inline-block animate-pulse">▍</span>}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex flex-col items-end gap-1.5">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2 whitespace-pre-wrap text-white">
                {m.content}
              </div>
              <div className="flex max-w-[80%] justify-end">
                <CorrectionPanel correction={m.correction} pending={m.pending} cardsAdded={m.cardsAdded} />
              </div>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="space-y-1">
        {sendError && <p className="text-sm text-red-600">{sendError}</p>}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            maxLength={MAX_LENGTH}
            rows={2}
            placeholder="Írj németül… (Enter: küldés, Shift+Enter: új sor)"
            className="flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Küldés
          </button>
        </div>
      </form>
    </div>
  )
}
