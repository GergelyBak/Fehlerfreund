import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'
import { WakingNotice } from './WakingNotice'

export function RequireAuth() {
  const { user, loading, waking } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center text-slate-500">
        {waking ? <WakingNotice /> : 'Betöltés…'}
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
