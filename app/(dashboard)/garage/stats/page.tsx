'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconArrowUp, IconArrowDown, IconCalendar, IconCurrencyEuro, IconUsers, IconStar, IconChartBar } from '@tabler/icons-react'

const MONTHLY = [
  { m: 'Nov', v: 3100 }, { m: 'Déc', v: 2900 }, { m: 'Jan', v: 3200 },
  { m: 'Fév', v: 2800 }, { m: 'Mar', v: 3500 }, { m: 'Avr', v: 3100 },
  { m: 'Mai', v: 3840 },
]
const SERVICES = [
  { name: 'Vidange',    count: 42, revenue: 1260, color: '#1D9E75' },
  { name: 'Freins',     count: 28, revenue: 2240, color: '#085041' },
  { name: 'Révision',   count: 18, revenue: 2700, color: '#5DCAA5' },
  { name: 'Pneus',      count: 24, revenue: 1920, color: '#9FE1CB' },
  { name: 'Diagnostic', count: 15, revenue:  750, color: '#EF9F27' },
  { name: 'Autres',     count: 12, revenue:  960, color: '#D1D5DB' },
]
const TOP_CLIENTS = [
  { name: 'Jean Moreau',    visits: 12, revenue: 840 },
  { name: 'Marc Dupont',    visits: 8,  revenue: 560 },
  { name: 'Marie Fontaine', visits: 5,  revenue: 420 },
  { name: 'Sophie Petit',   visits: 6,  revenue: 380 },
  { name: 'Pierre Bernard', visits: 2,  revenue: 280 },
]

const PERIODS = ['7 jours', '30 jours', '3 mois', '12 mois'] as const
const maxRev = Math.max(...MONTHLY.map(m => m.v))
const totalServices = SERVICES.reduce((s, x) => s + x.count, 0)
const totalRevServices = SERVICES.reduce((s, x) => s + x.revenue, 0)

export default function StatsPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('30 jours')

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Statistiques" subtitle="Vue d'ensemble de votre activité" />
      <main className="flex-1 p-5 space-y-4">

        {/* Période */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg w-fit" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{ background: period === p ? '#1D9E75' : 'transparent', color: period === p ? '#fff' : 'var(--color-text-secondary)' }}>
              {p}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Chiffre d\'affaires', val: '3 840 €', delta: '+12%', up: true,  icon: IconCurrencyEuro },
            { label: 'RDV réalisés',         val: '139',     delta: '+8%',  up: true,  icon: IconCalendar    },
            { label: 'Panier moyen',          val: '27,6 €',  delta: '=',    up: null,  icon: IconChartBar    },
            { label: 'Taux d\'annulation',   val: '4%',      delta: '-2%',  up: false, icon: IconUsers       },
          ].map(k => {
            const Icon = k.icon
            return (
              <div key={k.label} className="rounded-[10px] p-4" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-1.5 mb-2 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  <Icon size={13} /> {k.label}
                </div>
                <p className="text-2xl font-medium leading-none" style={{ color: 'var(--color-text-primary)' }}>{k.val}</p>
                <div className="flex items-center gap-1 mt-1.5 text-[11px]"
                  style={{ color: k.up === true ? '#1D9E75' : k.up === false ? '#E24B4A' : 'var(--color-text-secondary)' }}>
                  {k.up === true && <IconArrowUp size={11} />}
                  {k.up === false && <IconArrowDown size={11} />}
                  {k.delta}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* CA mensuel */}
          <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>Chiffre d'affaires mensuel</p>
              <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>en €</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {MONTHLY.map((m, i) => {
                const isLast = i === MONTHLY.length - 1
                const h = (m.v / maxRev) * 100
                return (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {m.v >= 1000 ? `${(m.v/1000).toFixed(1)}k` : m.v}
                    </span>
                    <div className="w-full rounded-t transition-all"
                      style={{ height: `${h}%`, background: isLast ? '#1D9E75' : '#E1F5EE' }} />
                    <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{m.m}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Répartition services */}
          <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <p className="text-[13px] font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Répartition des services</p>
            <div className="space-y-2.5">
              {SERVICES.map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                    </div>
                    <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {s.count} <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>({Math.round(s.count/totalServices*100)}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-background-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.count/totalServices*100}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Top clients */}
          <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="px-4 py-3 text-[13px] font-medium" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-primary)' }}>
              Meilleurs clients
            </div>
            {TOP_CLIENTS.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderBottom: i < TOP_CLIENTS.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>{i+1}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{c.visits} visites</p>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.revenue} €</span>
              </div>
            ))}
          </div>

          {/* CA par service */}
          <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="px-4 py-3 text-[13px] font-medium" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-primary)' }}>
              CA par service
            </div>
            <div className="p-4 space-y-3">
              {SERVICES.sort((a,b) => b.revenue - a.revenue).map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                    <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.revenue} €</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-background-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.revenue/totalRevServices*100}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
