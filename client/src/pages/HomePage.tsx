import { useAuth } from '../auth/useAuth'

// Placeholder until step 2: situation picker + chat.
export function HomePage() {
  const { user } = useAuth()
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Hallo, {user?.displayName}!</h1>
      <p className="text-slate-600">
        Szinted: <strong>{user?.level}</strong>. Hamarosan itt választhatsz szituációt a beszélgetéshez.
      </p>
    </div>
  )
}
