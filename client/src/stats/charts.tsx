import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ERROR_LABELS } from './errorLabels'
import { CHART, type ActivityDay, type ErrorTypeStat, type Stats } from './types'

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// --- Stat tile: label, value, optional delta vs a named period ---
export function StatTile({
  label,
  value,
  delta,
  note,
}: {
  label: string
  value: string
  delta?: { text: string; good: boolean | null }
  note?: string
}) {
  return (
    <div className="space-y-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      {delta && (
        <p
          className={`text-sm font-medium ${
            delta.good === null ? 'text-slate-500' : delta.good ? 'text-[#006300]' : 'text-[#c03030]'
          }`}
        >
          {delta.text}
        </p>
      )}
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  )
}

// --- Errors by type: horizontal bars, the weakest area emphasised ---
export function ErrorTypeBars({ items }: { items: ErrorTypeStat[] }) {
  const max = Math.max(...items.map((i) => i.mistakes), 1)
  return (
    <ul className="space-y-2.5">
      {items.map((item, idx) => {
        const label = ERROR_LABELS[item.errorType]
        const width = (item.mistakes / max) * 100
        const href = `/review?type=${encodeURIComponent(item.errorType)}${item.due ? '' : '&ahead=1'}`
        return (
          <li key={item.errorType}>
            <Link
              to={href}
              className="group grid grid-cols-[8.5rem_1fr] items-center gap-3 rounded-lg px-1 py-1 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none sm:grid-cols-[11rem_1fr]"
              title={`${label.hu} (${item.errorType}): ${item.mistakes} hiba, ${item.cards} kártya, ${item.due} esedékes. Kattints a gyakorláshoz.`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-800">{label.hu}</span>
                <span className="block truncate text-xs text-slate-500">{item.errorType}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="relative h-4 flex-1">
                  <span
                    className="absolute inset-y-0 left-0 rounded-r-sm transition-[filter] group-hover:brightness-110"
                    style={{
                      width: `${Math.max(width, 2)}%`,
                      // Emphasis: the weakest area in the accent, the rest gray.
                      background: idx === 0 ? CHART.accent : CHART.muted,
                    }}
                  />
                </span>
                <span className="w-8 text-right text-sm font-semibold text-slate-800 tabular-nums">{item.mistakes}</span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// --- Activity: stacked columns (messages + reviews) per day, with tooltip ---
const DAY_FMT = new Intl.DateTimeFormat('hu-HU', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const WEEKDAY_FMT = new Intl.DateTimeFormat('hu-HU', { weekday: 'short', timeZone: 'UTC' })
const dateOf = (key: string) => new Date(`${key}T12:00:00Z`)

export function ActivityChart({ days }: { days: ActivityDay[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const totals = days.map((d) => d.messages + d.reviews)
  const max = Math.max(...totals, 1)
  // A clean top tick: round the max up to a "nice" number.
  const step = max <= 5 ? 1 : max <= 20 ? 5 : max <= 50 ? 10 : 25
  const top = Math.ceil(max / step) * step
  const PLOT = 140

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <LegendSwatch color={CHART.accent} label="Üzenetek" />
        <LegendSwatch color={CHART.second} label="Ismétlések" />
      </div>

      <div className="relative flex gap-2">
        {/* y-axis: just the top tick and the baseline */}
        <div className="flex w-6 shrink-0 flex-col justify-between text-right text-xs text-slate-400 tabular-nums" style={{ height: PLOT }}>
          <span>{top}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 border-t" style={{ borderColor: CHART.gridline }} />
          <div className="flex items-end justify-between gap-0.5 border-b" style={{ height: PLOT, borderColor: '#c3c2b7' }}>
            {days.map((d, i) => {
              const mh = (d.messages / top) * PLOT
              const rh = (d.reviews / top) * PLOT
              const label = `${DAY_FMT.format(dateOf(d.date))}: ${d.messages} üzenet, ${d.reviews} ismétlés`
              return (
                <button
                  key={d.date}
                  type="button"
                  aria-label={label}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  // The hit target is the whole day slot, not just the painted column.
                  className="relative flex h-full flex-1 flex-col items-center justify-end outline-none focus-visible:bg-slate-50"
                >
                  <span className="flex w-full max-w-6 flex-col justify-end gap-0.5" style={{ opacity: hover === null || hover === i ? 1 : 0.55 }}>
                    {d.reviews > 0 && (
                      <span className="block rounded-t-sm" style={{ height: Math.max(rh, 2), background: CHART.second }} />
                    )}
                    {d.messages > 0 && (
                      <span
                        className={`block ${d.reviews > 0 ? '' : 'rounded-t-sm'}`}
                        style={{ height: Math.max(mh, 2), background: CHART.accent }}
                      />
                    )}
                  </span>
                  {hover === i && (
                    <span
                      className={`pointer-events-none absolute bottom-full z-10 mb-2 w-max rounded-lg bg-slate-900 px-2.5 py-1.5 text-left text-xs text-white shadow-lg ${
                        // Open towards the middle so the tooltip never leaves the card.
                        i < days.length / 2 ? 'left-0' : 'right-0'
                      }`}
                    >
                      <span className="block font-semibold">{totals[i]} tevékenység</span>
                      <span className="block text-slate-300">{DAY_FMT.format(dateOf(d.date))}</span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3" style={{ background: CHART.accent }} />
                        <b>{d.messages}</b> üzenet
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3" style={{ background: CHART.second }} />
                        <b>{d.reviews}</b> ismétlés
                      </span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{DAY_FMT.format(dateOf(days[0]!.date))}</span>
            <span>ma</span>
          </div>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-700">Táblázatként</summary>
        <table className="mt-2 w-full text-left">
          <thead className="text-slate-500">
            <tr>
              <th className="py-1 font-medium">Nap</th>
              <th className="py-1 text-right font-medium">Üzenetek</th>
              <th className="py-1 text-right font-medium">Ismétlések</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {days.map((d) => (
              <tr key={d.date} className="border-t border-slate-100">
                <td className="py-1">
                  {DAY_FMT.format(dateOf(d.date))} <span className="text-slate-400">{WEEKDAY_FMT.format(dateOf(d.date))}</span>
                </td>
                <td className="py-1 text-right">{d.messages}</td>
                <td className="py-1 text-right">{d.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}

// --- Card stages: one part-to-whole bar, ordered new → learning → mature ---
export function CardStageBar({ cards }: { cards: Stats['cards'] }) {
  const parts = [
    { key: 'new', label: 'Új', value: cards.new, color: CHART.stageNew },
    { key: 'learning', label: 'Tanulás alatt', value: cards.learning, color: CHART.stageLearning },
    { key: 'mature', label: 'Megy (21+ nap)', value: cards.mature, color: CHART.stageMature },
  ]
  return (
    <div className="space-y-3">
      <div className="flex h-4 gap-0.5">
        {parts
          .filter((p) => p.value > 0)
          .map((p, i, shown) => (
            <span
              key={p.key}
              title={`${p.label}: ${p.value}`}
              className={`block ${i === shown.length - 1 ? 'rounded-r-sm' : ''}`}
              style={{ flexGrow: p.value, background: p.color }}
            />
          ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
        {parts.map((p) => (
          <li key={p.key} className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm" style={{ background: p.color }} />
            {p.label}: <b className="text-slate-900">{p.value}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --- Grammar: one meter per topic, in course order ---
export function GrammarMeters({ topics }: { topics: Stats['grammar']['topics'] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {topics.map((t) => {
        const pct = t.bestScore === null ? null : Math.round(t.bestScore * 100)
        return (
          <li key={t.id}>
            <Link to={`/grammar/${t.id}`} className="block space-y-1 rounded-lg px-1 py-1 hover:bg-slate-50">
              <span className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">
                  {t.order}. {t.title}
                </span>
                <span className="shrink-0 font-medium text-slate-900 tabular-nums">
                  {pct === null ? <span className="font-normal text-slate-400">–</span> : `${pct >= 80 ? '✓ ' : ''}${pct}%`}
                </span>
              </span>
              <span className="block h-1.5 overflow-hidden rounded-full" style={{ background: CHART.track }}>
                {pct !== null && (
                  <span className="block h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: CHART.accent }} />
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
