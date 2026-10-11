import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'
import { WakingNotice } from './WakingNotice'
import { useI18n } from '../i18n/context'

export function RequireAuth() {
  const { user, loading, waking } = useAuth()
  const location = useLocation()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center text-slate-500">
        {waking ? <WakingNotice /> : t.common.loading}
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
