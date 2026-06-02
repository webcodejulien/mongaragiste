'use client'

import { useEffect, useRef, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { SkeletonCard } from '@/components/ui/Skeleton'
import {
  IconCalendar,
  IconCurrencyEuro,
  IconStar,
  IconUsers,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface MonthlyPoint {
  month: string
  appointments: number
  revenue: number
}

interface TopService {
  name: string
  count: number
  revenue: number
}

interface StatusBreakdown {
  status: string
  count: number
}

interface Stats {
  appointmentsThisMonth: number
  appointmentsLastMonth: number
  revenueThisMonth: number
  revenueLastMonth: number
  avgRating: number
  reviewCount: number
  uniqueClientsThisMonth: number
  conversionRate: number
  monthlyData: MonthlyPoint[]
  topServices: TopService[]
  statusBreakdown: StatusBreakdown[]
}

// ── Helpers ────────────────────────────────────────────────────────────────
function delta(current: number, previous: number): { pct: number | null; up: boolean } {
  if (previous === 0) return { pct: null, up: true }
  const pct = Math.round(((current - previous) / previous) * 100)
  return { pct, up: pct >= 0 }
}

function fmtEuro(v: number) {
  return v.toLocaleString('fr-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €'
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',  bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',    bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',    bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',     bg: '#F0FDF7', color: '#1D9E75' },
  CANCELLED:   { label: 'Annulé',      bg: '#FCEBEB', color: '#A32D2D' },
}

// ── Bar Chart (SVG, no lib) ────────────────────────────────────────────────
function BarChart({ data }: { data: MonthlyPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: MonthlyPoint } | null>(null)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const HEIGHT      = 120
  const LABEL_H     = 20
  const BAR_GAP     = 6
  const totalBars   = data.length
  const barW        = Math.max(4, (width - BAR_GAP * (totalBars + 1)) / totalBars)
  const maxVal      = Math.max(...data.map(d => d.appointments), 1)
  const chartH      = HEIGHT - LABEL_H

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <svg width="100%" height={HEIGHT} style={{ overflow: 'visible' }}>
        {data.map((d, i) => {
          const barH  = Math.max(2, (d.appointments / maxVal) * chartH)
          const x     = BAR_GAP + i * (barW + BAR_GAP)
          const y     = chartH - barH
          const isLast = i === data.length - 1
          return (
            <g key={i}
              onMouseEnter={e => {
                const rect = (e.currentTarget as SVGGElement).getBoundingClientRect()
                const parent = containerRef.current?.getBoundingClientRect()
                setTooltip({
                  x: rect.left - (parent?.left ?? 0) + barW / 2,
                  y: y,
                  d,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'default' }}>
              <rect
                x={x} y={y} width={barW} height={barH}
                rx={3}
                style={{
                  fill: isLast ? '#1D9E75' : '#1D9E75',
                  opacity: isLast ? 1 : 0.35,
                  transition: 'opacity 0.15s',
                }}
              />
              <text
                x={x + barW / 2} y={HEIGHT - 4}
                textAnchor="middle"
                fontSize={9}
                fill="var(--color-text-tertiary)">
                {d.month}
              </text>
            </g>
          )
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none px-2.5 py-1.5 rounded-lg text-[11px] shadow-md"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: 'translate(-50%, -100%)',
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}>
          <p className="font-semibold">{tooltip.d.month}</p>
          <p>{tooltip.d.appointments} RDV</p>
          {tooltip.d.revenue > 0 && <p>{fmtEuro(tooltip.d.revenue)}</p>}
        </div>
      )}
    </div>
  )
}

// ── Skeleton placeholders ──────────────────────────────────────────────────
function SkeletonBlock({ h = 80 }: { h?: number }) {
  return (
    <div
      className="animate-pulse rounded-lg w-full"
      style={{ height: h, background: 'var(--color-background-secondary)' }}
    />
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function StatsPage() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/garage/stats')
      .then(r => r.json())
      .then(d => setStats(d?.error ? null : d))
      .finally(() => setLoading(false))
  }, [])

  const rdvDelta      = stats ? delta(stats.appointmentsThisMonth, stats.appointmentsLastMonth) : null
  const revDelta      = stats ? delta(stats.revenueThisMonth,      stats.revenueLastMonth)      : null
  const maxSvcCount   = stats ? Math.max(...stats.topServices.map(s => s.count), 1) : 1
  const totalStatuses = stats ? stats.statusBreakdown.reduce((s, x) => s + x.count, 0) : 0

  const kpis = stats ? [
    {
      label: 'RDV ce mois',
      val:   stats.appointmentsThisMonth,
      delta: rdvDelta,
      icon:  IconCalendar,
    },
    {
      label: 'CA ce mois',
      val:   fmtEuro(stats.revenueThisMonth),
      delta: revDelta,
      icon:  IconCurrencyEuro,
    },
    {
      label: 'Note moyenne',
      val:   stats.avgRating > 0 ? stats.avgRating.toFixed(1) + ' / 5' : '—',
      sub:   stats.reviewCount > 0 ? `${stats.reviewCount} avis` : 'Aucun avis',
      icon:  IconStar,
    },
    {
      label: 'Clients uniques',
      val:   stats.uniqueClientsThisMonth,
      sub:   'ce mois',
      icon:  IconUsers,
    },
  ] : []

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Statistiques" subtitle="Vue d'ensemble de votre activité" />

      <main className="flex-1 p-5 space-y-4">

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : kpis.map(k => {
                const Icon = k.icon
                const d = (k as any).delta as ReturnType<typeof delta> | undefined
                return (
                  <div
                    key={k.label}
                    className="rounded-[10px]"
                    style={{
                      background: 'var(--color-background-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      padding: '16px 20px',
                    }}>
                    <div
                      className="flex items-center gap-1.5 mb-2"
                      style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Icon size={12} />
                      {k.label}
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                      {k.val}
                    </p>
                    {d && d.pct !== null ? (
                      <div
                        className="flex items-center gap-1 mt-1.5"
                        style={{ fontSize: 12, color: d.up ? '#1D9E75' : '#A32D2D' }}>
                        {d.up ? <IconArrowUp size={11} /> : <IconArrowDown size={11} />}
                        {d.up ? '+' : ''}{d.pct}% vs mois dernier
                      </div>
                    ) : d && d.pct === null ? (
                      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 6 }}>
                        Pas de données le mois dernier
                      </p>
                    ) : (k as any).sub ? (
                      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 6 }}>
                        {(k as any).sub}
                      </p>
                    ) : null}
                  </div>
                )
              })
          }
        </div>

        {/* ── Chart + Conversion ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Bar chart — 12 months */}
          <div
            className="md:col-span-2 rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              RDV — 12 derniers mois
            </p>
            <p className="text-[11px] mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Rendez-vous non annulés par mois
            </p>
            {loading
              ? <SkeletonBlock h={120} />
              : !stats || stats.monthlyData.every(m => m.appointments === 0)
                ? <p className="text-[12px] py-8 text-center" style={{ color: 'var(--color-text-tertiary)' }}>Aucune donnée disponible</p>
                : <BarChart data={stats.monthlyData} />
            }
          </div>

          {/* Conversion rate */}
          <div
            className="rounded-[10px] p-5 flex flex-col justify-center items-center text-center"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {loading ? (
              <SkeletonBlock h={80} />
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                  Taux de conversion
                </p>
                {/* Circular gauge (SVG) */}
                <svg width={100} height={100} viewBox="0 0 100 100">
                  <circle cx={50} cy={50} r={40} fill="none" strokeWidth={10} stroke="var(--color-background-secondary)" />
                  <circle
                    cx={50} cy={50} r={40}
                    fill="none" strokeWidth={10}
                    stroke="#1D9E75"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats?.conversionRate ?? 0) / 100)}`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                  <text x={50} y={54} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--color-text-primary)">
                    {stats?.conversionRate ?? 0}%
                  </text>
                </svg>
                <p className="text-[12px] mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                  Des RDV de ce mois<br />ont été confirmés ou réalisés
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Top Services + Status breakdown ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Top services */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Top services
            </p>
            <p className="text-[11px] mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              12 derniers mois, RDV non annulés
            </p>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} h={32} />)}
              </div>
            ) : !stats || stats.topServices.length === 0 ? (
              <p className="text-[12px] py-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                Aucun service enregistré
              </p>
            ) : (
              <div className="space-y-1">
                {/* Header */}
                <div
                  className="grid text-[10px] font-medium uppercase tracking-wide px-2 py-1.5 rounded"
                  style={{
                    gridTemplateColumns: '1fr 48px 72px',
                    color: 'var(--color-text-tertiary)',
                    background: 'var(--color-background-secondary)',
                  }}>
                  <span>Service</span>
                  <span className="text-right">RDV</span>
                  <span className="text-right">CA</span>
                </div>

                {stats.topServices.map((s, i) => (
                  <div key={s.name}>
                    <div
                      className="grid items-center px-2 py-2 text-[12px]"
                      style={{ gridTemplateColumns: '1fr 48px 72px' }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: ['#1D9E75','#085041','#5DCAA5','#9FE1CB','#EF9F27'][i] ?? '#D1D5DB' }}
                        />
                        <span className="truncate" style={{ color: 'var(--color-text-primary)' }}>{s.name}</span>
                      </div>
                      <span className="text-right font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.count}</span>
                      <span className="text-right" style={{ color: 'var(--color-text-secondary)' }}>{fmtEuro(s.revenue)}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mx-2 h-1 rounded-full mb-1" style={{ background: 'var(--color-background-secondary)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.count / maxSvcCount) * 100}%`,
                          background: ['#1D9E75','#085041','#5DCAA5','#9FE1CB','#EF9F27'][i] ?? '#D1D5DB',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status breakdown */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Statuts ce mois
            </p>
            <p className="text-[11px] mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Répartition des rendez-vous par statut
            </p>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} h={36} />)}
              </div>
            ) : !stats || stats.statusBreakdown.length === 0 ? (
              <p className="text-[12px] py-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                Aucun rendez-vous ce mois
              </p>
            ) : (
              <div className="space-y-2">
                {stats.statusBreakdown
                  .sort((a, b) => b.count - a.count)
                  .map(s => {
                    const meta = STATUS_META[s.status] ?? { label: s.status, bg: '#F3F4F6', color: '#374151' }
                    const pct  = totalStatuses > 0 ? Math.round((s.count / totalStatuses) * 100) : 0
                    return (
                      <div
                        key={s.status}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                        style={{ background: meta.bg }}>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[11px] font-semibold"
                            style={{ color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-[13px] font-bold"
                            style={{ color: meta.color }}>
                            {s.count}
                          </span>
                          <span
                            className="text-[11px] w-9 text-right"
                            style={{ color: meta.color, opacity: 0.7 }}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    )
                  })}

                {/* Total */}
                <div
                  className="flex items-center justify-between px-3 py-2 mt-1 rounded-lg"
                  style={{ background: 'var(--color-background-secondary)' }}>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total</span>
                  <span className="text-[13px] font-bold" style={{ color: 'var(--color-text-primary)' }}>{totalStatuses}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
