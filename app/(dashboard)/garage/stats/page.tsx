'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconArrowUp, IconArrowDown, IconCalendar, IconCurrencyEuro, IconUsers, IconChartBar } from '@tabler/icons-react'
import Link from 'next/link'

export default function StatsPage() {
  const [stats,   setStats]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState<'7j'|'30j'|'3m'|'12m'>('30j')

  useEffect(() => {
    fetch('/api/garage/stats')
      .then(r => r.json())
      .then(d => setStats(d?.error ? null : d))
      .finally(() => setLoading(false))
  }, [])

  const noData = !loading && (!stats || (stats.thisMonth === 0 && stats.today === 0))

  const maxRev = stats ? Math.max(...(stats.monthlyData ?? []).map((m: any) => m.revenue), 1) : 1
  const maxSvc = stats ? Math.max(...(stats.serviceBreakdown ?? []).map((s: any) => s.count), 1) : 1
  const totalSvc = stats ? (stats.serviceBreakdown ?? []).reduce((s: number, x: any) => s + x.count, 0) : 0

  const COLORS = ['#1D9E75','#085041','#5DCAA5','#9FE1CB','#EF9F27','#D1D5DB']

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Statistiques" subtitle="Vue d'ensemble de votre activité"/>

      <main className="flex-1 p-5 space-y-4">
        <div className="flex items-center gap-1 p-0.5 rounded-lg w-fit"
          style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
          {(['7j','30j','3m','12m'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{ background:period===p?'#1D9E75':'transparent', color:period===p?'#fff':'var(--color-text-secondary)' }}>
              {p}
            </button>
          ))}
        </div>

        {noData ? (
          <div className="rounded-[10px]" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
            <EmptyState
              icon="📊"
              title="Pas encore de statistiques"
              description="Vos statistiques s'alimenteront au fur et à mesure de vos rendez-vous réalisés."
              action={
                <Link href="/garage/agenda"
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                  style={{ background:'#1D9E75' }}>
                  Ajouter un RDV
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {loading ? Array.from({length:4}).map((_,i) => <SkeletonCard key={i}/>) : [
                { label:"CA ce mois",        val:`${stats?.revenueMonth ?? 0} €`, delta: stats?.revenueDelta != null ? `${stats.revenueDelta>0?'+':''}${stats.revenueDelta}%` : null, up: (stats?.revenueDelta ?? 0) >= 0, icon:IconCurrencyEuro },
                { label:"RDV ce mois",       val: stats?.thisMonth ?? 0, delta:'vs mois dernier', up:true, icon:IconCalendar },
                { label:"En attente",        val: stats?.pending   ?? 0, delta:'à confirmer', up:false, icon:IconUsers },
                { label:"Taux d'annulation", val:`${stats?.thisMonth > 0 ? Math.round((stats?.cancelled ?? 0)/(stats?.thisMonth+stats?.cancelled)*100) : 0}%`, delta:'ce mois', up:false, icon:IconChartBar },
              ].map(k => {
                const Icon = k.icon
                return (
                  <div key={k.label} className="rounded-[10px] p-4"
                    style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[11px]" style={{ color:'var(--color-text-secondary)' }}>
                      <Icon size={13}/> {k.label}
                    </div>
                    <p className="text-2xl font-semibold" style={{ color:'var(--color-text-primary)' }}>{k.val}</p>
                    {k.delta && (
                      <div className="flex items-center gap-1 mt-1 text-[11px]"
                        style={{ color: k.up ? '#1D9E75' : 'var(--color-text-tertiary)' }}>
                        {k.up ? <IconArrowUp size={10}/> : <IconArrowDown size={10}/>}
                        {k.delta}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Évolution mensuelle */}
              <div className="rounded-[10px] p-5" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-[13px] font-semibold mb-4" style={{ color:'var(--color-text-primary)' }}>CA mensuel</p>
                {loading ? <div className="h-24 animate-pulse rounded" style={{ background:'var(--color-background-tertiary)' }}/> : (
                  <div className="flex items-end gap-2 h-24">
                    {(stats?.monthlyData ?? []).map((m: any, i: number) => {
                      const isLast = i === (stats.monthlyData.length - 1)
                      const h = (m.revenue / maxRev) * 100
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[9px]" style={{ color:'var(--color-text-secondary)' }}>
                            {m.revenue > 0 ? `${m.revenue}€` : '—'}
                          </span>
                          <div className="w-full rounded-t" style={{ height:`${Math.max(h,2)}%`, background: isLast ? '#1D9E75' : '#E1F5EE' }}/>
                          <span className="text-[9px]" style={{ color:'var(--color-text-tertiary)' }}>{m.month}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="rounded-[10px] p-5" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-[13px] font-semibold mb-4" style={{ color:'var(--color-text-primary)' }}>Répartition services</p>
                {loading ? <div className="h-24 animate-pulse rounded" style={{ background:'var(--color-background-tertiary)'}}/>
                : totalSvc === 0 ? <p className="text-[12px]" style={{ color:'var(--color-text-tertiary)' }}>Aucune donnée</p>
                : (
                  <div className="space-y-2.5">
                    {(stats?.serviceBreakdown ?? []).slice(0, 5).map((s: any, i: number) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] || '#D1D5DB' }}/>
                            <span className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{s.name}</span>
                          </div>
                          <span className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>
                            {s.count} ({Math.round(s.count/totalSvc*100)}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background:'var(--color-background-secondary)' }}>
                          <div className="h-full rounded-full" style={{ width:`${s.count/maxSvc*100}%`, background: COLORS[i] || '#D1D5DB' }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
