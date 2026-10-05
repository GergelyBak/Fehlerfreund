import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useMatch } from 'react-router'
import { api } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { onCardsChanged } from '../review/cardEvents'
import type { CardStats } from '../review/types'

const NAV_ITEMS = [
  { to: '/', icon: '💬', label: 'Beszélgetés', short: 'Chat', end: true },
  { to: '/review', icon: '🗂️', label: 'Ismétlés', short: 'Ismétlés', badge: true },
  { to: '/grammar', icon: '📘', label: 'Nyelvtan', short: 'Nyelvtan' },
  { to: '/stats', icon: '📊', label: 'Statisztika', short: 'Statisztika' },
] as const

function useDueCount() {
  const [due, setDue] = useState<number | null>(null)
  const location = useLocation()

  useEffect(() => {
    const refresh = () =>
      api<CardStats>('/cards/stats')
        .then((s) => setDue(s.due))
        .catch(() => {})
    void refresh()
    return onCardsChanged(refresh)
  }, [location.pathname])

  return due
}

function DueBadge({ due, className = '' }: { due: number | null; className?: string }) {
  if (!due) return null
  return (
    <span className={`min-w-5 rounded-full bg-indigo-600 px-1.5 text-center text-xs leading-5 text-white ${className}`}>
      {due > 99 ? '99+' : due}
    </span>
  )
}

export function Layout() {
  const { user, logout } = useAuth()
  const due = useDueCount()
  // Inside a conversation the chat gets the whole screen on phones; it has
  // its own back button.
  const inChat = useMatch('/chat/:id') !== null

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-6">
            <span className="font-bold text-indigo-600">Fehlerfreund</span>
            {/* Desktop navigation; phones use the bottom tab bar. */}
            <nav className="hidden gap-1 sm:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                  {'badge' in item && <DueBadge due={due} />}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="mr-2 hidden text-slate-500 md:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Kilépés
            </button>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto max-w-5xl px-4 py-4 sm:py-8 ${
          // Room for the bottom tab bar (and the iPhone home indicator) on phones.
          inChat ? '' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-8'
        }`}
      >
        <Outlet />
      </main>

      {!inChat && (
        <nav
          className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
          aria-label="Fő navigáció"
        >
          <div className="grid h-16 grid-cols-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                    isActive ? 'text-indigo-700' : 'text-slate-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden
                      className={`grid h-7 w-12 place-items-center rounded-full text-lg ${isActive ? 'bg-indigo-50' : ''}`}
                    >
                      {item.icon}
                    </span>
                    {item.short}
                    {'badge' in item && <DueBadge due={due} className="absolute top-1 left-1/2 ml-2" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
