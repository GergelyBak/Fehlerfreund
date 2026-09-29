import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { api } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { onCardsChanged } from '../review/cardEvents'
import type { CardStats } from '../review/types'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`

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

export function Layout() {
  const { user, logout } = useAuth()
  const due = useDueCount()

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="font-bold text-indigo-600">Fehlerfreund</span>
            <nav className="flex gap-1">
              <NavLink to="/" end className={navClass}>
                Beszélgetés
              </NavLink>
              <NavLink to="/review" className={navClass}>
                Ismétlés
                {!!due && (
                  <span className="min-w-5 rounded-full bg-indigo-600 px-1.5 text-center text-xs leading-5 text-white">
                    {due > 99 ? '99+' : due}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">{user?.email}</span>
            <button onClick={logout} className="text-slate-600 hover:text-slate-900">
              Kilépés
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
