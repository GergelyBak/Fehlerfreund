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

// Icon only on phones (five items don't fit next to the logout button), icon +
// text from the sm breakpoint up. The text stays available to screen readers.
function NavLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <>
      <span aria-hidden className="sm:hidden">
        {icon}
      </span>
      <span className="sr-only sm:not-sr-only">{text}</span>
    </>
  )
}

export function Layout() {
  const { user, logout } = useAuth()
  const due = useDueCount()

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden font-bold text-indigo-600 sm:inline">Fehlerfreund</span>
            <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 whitespace-nowrap">
              <NavLink to="/" end className={navClass} title="Beszélgetés">
                <NavLabel icon="💬" text="Beszélgetés" />
              </NavLink>
              <NavLink to="/review" className={navClass} title="Ismétlés">
                <NavLabel icon="🗂️" text="Ismétlés" />
                {!!due && (
                  <span className="min-w-5 rounded-full bg-indigo-600 px-1.5 text-center text-xs leading-5 text-white">
                    {due > 99 ? '99+' : due}
                  </span>
                )}
              </NavLink>
              <NavLink to="/grammar" className={navClass} title="Nyelvtan">
                <NavLabel icon="📘" text="Nyelvtan" />
              </NavLink>
              <NavLink to="/stats" className={navClass} title="Statisztika">
                <NavLabel icon="📊" text="Statisztika" />
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
