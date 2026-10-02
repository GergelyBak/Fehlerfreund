// Shown while the free-tier API wakes up from sleep.
export function WakingNotice() {
  return (
    <div className="max-w-sm space-y-2">
      <span className="mx-auto block size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" aria-hidden />
      <p className="font-medium text-slate-700">A szerver ébred…</p>
      <p className="text-sm text-slate-500">
        A demó ingyenes tárhelyen fut, ahol a szerver használaton kívül elalszik. Az ébredés kb. fél–egy perc, utána
        minden gyors lesz.
      </p>
    </div>
  )
}
