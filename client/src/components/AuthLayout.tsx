import type { ReactNode } from 'react'
import { useAuth } from '../auth/useAuth'

const FEATURES = [
  { icon: '💬', title: 'Valós helyzetek', text: 'Bürgeramt, orvos, lakásnézés: gyakorolj ott, ahol tényleg szükséged lesz rá.' },
  { icon: '✏️', title: 'Azonnali javítás', text: 'Minden üzeneted alatt ott a javítás, magyar magyarázattal.' },
  { icon: '🔁', title: 'A hibáidból tanulsz', text: 'A hibáid kártyákká válnak, és ismétléssel rögzülnek.' },
]

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { waking } = useAuth()
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl leading-tight font-bold">
              Beszélgess németül.
              <br />
              Tanulj a saját hibáidból.
            </h2>
            <p className="max-w-md text-indigo-100">
              A Fehlerfreund beszélgetőtárs, aki nem csak válaszol, hanem meg is mutatja, hol hibáztál, és miért.
            </p>
          </div>

          <ExampleCorrection />

          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-lg" aria-hidden>
                  {f.icon}
                </span>
                <span>
                  <span className="block font-semibold">{f.title}</span>
                  <span className="block text-sm text-indigo-100">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-indigo-200">A1–B2 szint · magyar és angol magyarázatok</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="lg:hidden">
              <Logo />
            </div>
            <h1 className="pt-4 text-3xl font-bold tracking-tight lg:pt-0">{title}</h1>
            <p className="text-slate-600">{subtitle}</p>
          </div>
          {waking && (
            <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900 ring-1 ring-amber-200">
              ⏳ A demó szerver épp ébred (ingyenes tárhely). Kb. fél–egy perc, addig a bejelentkezés várakozhat.
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}

function Logo({ light }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-lg font-bold ${light ? 'text-white' : 'text-indigo-600'}`}>
      <span
        className={`grid size-8 place-items-center rounded-lg text-sm ${light ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'}`}
        aria-hidden
      >
        Ff
      </span>
      Fehlerfreund
    </span>
  )
}

// A static preview of what a correction looks like in the chat.
function ExampleCorrection() {
  return (
    <div className="max-w-md space-y-2 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-white px-4 py-2 text-slate-900">
        Ich fahre mit der Bus zur Arbeit.
      </div>
      <div className="ml-auto w-fit max-w-[90%] space-y-1 rounded-xl bg-amber-50 px-3 py-2 text-sm text-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-red-600 line-through">mit der Bus</span>
          <span aria-hidden>→</span>
          <span className="font-medium text-emerald-700">mit dem Bus</span>
          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900">Kasus</span>
        </div>
        <p className="text-slate-600">A „mit” után mindig Dativ áll.</p>
      </div>
    </div>
  )
}
