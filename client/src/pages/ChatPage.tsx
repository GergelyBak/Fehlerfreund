import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import { api, ApiError } from '../api/client'
import { errorMessage } from '../api/errors'
import { postSse } from '../api/sse'
import { AssistantMessage } from '../chat/AssistantMessage'
import { CorrectionPanel } from '../chat/CorrectionPanel'
import { ModeBadge } from '../chat/ModeBadge'
import { SituationPanel } from '../chat/SituationPanel'
import { useSituations } from '../chat/useSituations'
import { notifyCardsChanged } from '../review/cardEvents'
import { AutoReadToggle } from '../speech/AutoReadToggle'
import { RATE_NORMAL, loadAutoRead, saveAutoRead, speak, stopSpeaking } from '../speech/speech'
import type { ChatMessage, Conversation, Phrase, StoredCorrection } from '../chat/types'

const MAX_LENGTH = 500

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const { situations } = useSituations()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [autoRead, setAutoRead] = useState(loadAutoRead)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    api<{ conversation: Conversation }>(`/conversations/${id}`)
      .then((r) => setConversation(r.conversation))
      .catch((err) => setLoadError(errorMessage(err, 'Nem sikerült betölteni a beszélgetést.')))
    // Abort an in-flight reply and stop reading aloud when leaving the page.
    return () => {
      abortRef.current?.abort()
      stopSpeaking()
    }
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
    let replyText = ''
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
            case 'delta': {
              const chunk = (data as { text: string }).text
              replyText += chunk
              updateMessage(assistantId, (m) => ({ ...m, content: m.content + chunk }))
              break
            }
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
              // Same key as the message's own 🔊 button, so that button shows it playing.
              if (autoRead && replyText.trim()) speak(replyText, { key: `${replyText}|normal`, rate: RATE_NORMAL })
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

  async function toggleTask(taskId: string, done: boolean) {
    if (!conversation) return
    const previous = conversation.completedTasks
    // Optimistic: tick immediately, roll back if the server says no.
    setConversation((c) =>
      c && {
        ...c,
        completedTasks: done ? [...c.completedTasks, taskId] : c.completedTasks.filter((t) => t !== taskId),
      },
    )
    try {
      const res = await api<{ completedTasks: string[] }>(`/conversations/${conversation.id}/tasks`, {
        method: 'PATCH',
        body: JSON.stringify({ taskId, done }),
      })
      setConversation((c) => c && { ...c, completedTasks: res.completedTasks })
    } catch (err) {
      setConversation((c) => c && { ...c, completedTasks: previous })
      setSendError(errorMessage(err))
    }
  }

  function insertPhrase(phrase: Phrase) {
    setInput((current) => (current.trim() ? `${current.trimEnd()} ${phrase.de}` : phrase.de))
    setPanelOpen(false)
    inputRef.current?.focus()
  }

  const setTranslation = (messageId: string, text: string) =>
    updateMessage(messageId, (m) => ({ ...m, translation: { language: '', text } }))

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      {/* Viewport minus the 3.5rem header and main's vertical padding. */}
      <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-3 sm:h-[calc(100dvh-8rem)] sm:gap-4">
        <div className="flex items-start gap-1 sm:items-center sm:justify-between sm:gap-4">
          {/* Phones: a compact back arrow instead of the text link. */}
          <Link
            to="/"
            aria-label="Vissza a helyzetekhez"
            className="-ml-2 grid size-10 shrink-0 place-items-center rounded-lg text-xl text-slate-600 hover:bg-slate-100 sm:hidden"
          >
            ←
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden text-2xl sm:inline" aria-hidden>
              {situation?.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-semibold">
                <span className="sm:hidden" aria-hidden>
                  {situation?.emoji}{' '}
                </span>
                {situation?.title ?? 'Beszélgetés'}
              </h1>
              <p className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                Szint: {conversation.level}
                <ModeBadge />
              </p>
              <AutoReadToggle
                on={autoRead}
                onChange={(on) => {
                  setAutoRead(on)
                  saveAutoRead(on)
                  if (!on) stopSpeaking()
                }}
              />
            </div>
          </div>
          <Link to="/" className="hidden rounded-lg px-2 py-2 text-sm text-slate-600 hover:text-slate-900 sm:inline-block">
            ← Helyzetek
          </Link>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          {conversation.messages.map((m) =>
            m.role === 'assistant' ? (
              <AssistantMessage key={m.id} message={m} conversationId={conversation.id} onTranslated={setTranslation} />
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

        <form onSubmit={send} className="space-y-2">
          {situation && (
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setPanelOpen((o) => !o)}
                className="py-2 text-sm font-medium text-indigo-700"
                aria-expanded={panelOpen}
              >
                📋 Feladatok és kifejezések ({conversation.completedTasks.length}/{situation.tasks.length}) {panelOpen ? '▲' : '▼'}
              </button>
              {panelOpen && (
                <div className="mt-2 max-h-72 overflow-y-auto rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <SituationPanel
                    situation={situation}
                    completedTasks={conversation.completedTasks}
                    onToggleTask={toggleTask}
                    onPhrase={insertPhrase}
                  />
                </div>
              )}
            </div>
          )}
          {sendError && <p className="text-sm text-red-600">{sendError}</p>}
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              maxLength={MAX_LENGTH}
              rows={2}
              placeholder="Írj németül…"
              title="Enter: küldés, Shift+Enter: új sor"
              // Phone keyboards show a "send" key instead of a plain return.
              enterKeyHint="send"
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

      {situation && (
        <aside className="hidden h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl bg-white p-4 ring-1 ring-slate-200 lg:block">
          <SituationPanel
            situation={situation}
            completedTasks={conversation.completedTasks}
            onToggleTask={toggleTask}
            onPhrase={insertPhrase}
          />
        </aside>
      )}
    </div>
  )
}
