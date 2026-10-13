import { Component, type ErrorInfo, type ReactNode } from 'react'
import { activeMessages } from '../i18n/context'

// A rendering error anywhere below would otherwise unmount the whole app and
// leave a blank white screen. This shows what happened and a way back instead.
// Give it key={pathname}: navigating elsewhere remounts it and gives the page another chance.
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const t = activeMessages().crash
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-4xl">😵</p>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-slate-600">{t.text}</p>
        <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs break-words text-slate-500">{this.state.error.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          {t.reload}
        </button>
      </div>
    )
  }
}
