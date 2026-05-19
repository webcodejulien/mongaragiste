'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'

const monthlyRevenue = [
  { month: 'Juil', value: 2800 },
  { month: 'Août', value: 2100 },
  { month: 'Sep', value: 3200 },
  { month: 'Oct', value: 3600 },
  { month: 'Nov', value: 3100 },
  { month: 'Déc', value: 2900 },
  { month: 'Jan', value: 3840 },
]

const serviceBreakdown = [
  { name: 'Vidange', count: 42, revenue: 1260, color: '#1D9E75' },
  { name: 'Freins', count: 28, revenue: 2240, color: '#085041' },
  { name: 'Révision', count: 18, revenue: 2700, color: '#5DCAA5' },
  { name: 'Pneus', count: 24, revenue: 1920, color: '#9FE1CB' },
  { name: 'Diagnostic', count: 15, revenue: 750, color: '#E1F5EE' },
  { name: 'Autres', count: 12, revenue: 960, color: '#F59E0B' },
]

const topClients = [
  { name: 'Jean Moreau', visits: 12, revenue: 840, lastVisit: '15 jan 2024' },
  { name: 'Martin Dupont', visits: 8, revenue: 560, lastVisit: '15 jan 2024' },
  { name: 'Marie Fontaine', visits: 5, revenue: 420, lastVisit: '12 jan 2024' },
  { name: 'Sophie Lambert', visits: 3, revenue: 320, lastVisit: '15 jan 2024' },
  { name: 'Pierre Bernard', visits: 2, revenue: 280, lastVisit: '14 jan 2024' },
]

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value))

function BarChart() {
  return (
    <div className="flex items-end gap-3 h-40 mt-4">
      {monthlyRevenue.map((m, i) => {
        const height = (m.value / maxRevenue) * 100
        const isLast = i === monthlyRevenue.length - 1
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs font-medium text-gray-700">{m.value >= 1000 ? `${(m.value / 1000).toFixed(1)}k` : m.value}</span>
            <div
              className={`w-full rounded-t transition-all ${isLast ? 'bg-primary-400' : 'bg-primary-100'}`}
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500">{m.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function DonutChart() {
  const total = serviceBreakdown.reduce((s, x) => s + x.count, 0)
  let cumulative = 0

  const segments = serviceBreakdown.map((s) => {
    const pct = s.count / total
    const start = cumulative
    cumulative += pct
    return { ...s, start, pct }
  })

  const radius = 60
  const cx = 80
  const cy = 80
  const r = radius

  function polarToXY(pct: number, r: number) {
    const angle = pct * 2 * Math.PI - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  function describeArc(start: number, end: number) {
    const s = polarToXY(start, r)
    const e = polarToXY(end, r)
    const largeArc = end - start > 0.5 ? 1 : 0
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`
  }

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" className="flex-shrink-0">
        {segments.map((s) => (
          <path
            key={s.name}
            d={describeArc(s.start, s.start + s.pct)}
            fill={s.color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
        <circle cx={cx} cy={cy} r="30" fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-xs font-bold" style={{ fontSize: '14px', fontWeight: '700', fill: '#1A1A2E' }}>{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280' }}>RDV</text>
      </svg>
      <div className="flex-1 space-y-2">
        {serviceBreakdown.map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-sm text-gray-700">{s.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{s.count}</span>
              <span className="text-xs text-gray-500 ml-1">({Math.round((s.count / total) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [period, setPeriod] = useState<'7j' | '30j' | '3m' | '12m'>('30j')

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Statistiques" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Vue d'ensemble de votre activité</p>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded p-0.5">
            {(['7j', '30j', '3m', '12m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded transition-colors ${period === p ? 'bg-primary-400 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-gray-500 font-medium">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">3 840 €</p>
            <p className="text-xs text-primary-600 mt-1">+12% vs mois dernier</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 font-medium">RDV réalisés</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">139</p>
            <p className="text-xs text-primary-600 mt-1">+8% vs mois dernier</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 font-medium">Panier moyen</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">27 €</p>
            <p className="text-xs text-gray-400 mt-1">Stable</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 font-medium">Taux d'annulation</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">4%</p>
            <p className="text-xs text-primary-600 mt-1">-2% vs mois dernier</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue chart */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Chiffre d'affaires mensuel</h3>
              <span className="text-xs text-gray-500">en €</span>
            </div>
            <BarChart />
          </Card>

          {/* Services breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Répartition des services</h3>
              <span className="text-xs text-gray-500">Ce mois</span>
            </div>
            <DonutChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top clients */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Meilleurs clients</h3>
            <div className="space-y-3">
              {topClients.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">Dernier passage : {c.lastVisit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{c.revenue} €</p>
                    <p className="text-xs text-gray-500">{c.visits} visites</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue by service */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">CA par service</h3>
            <div className="space-y-3">
              {serviceBreakdown.sort((a, b) => b.revenue - a.revenue).map((s) => {
                const total = serviceBreakdown.reduce((acc, x) => acc + x.revenue, 0)
                const pct = Math.round((s.revenue / total) * 100)
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{s.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{s.revenue} €</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: s.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
