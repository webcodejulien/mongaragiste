'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard, SkeletonRow } from '@/components/ui/Skeleton'
import Link from 'next/link'
import { IconCalendar, IconCalendarWeek, IconClockPause, IconStar, IconArrowUp, IconCheck, IconX, IconBolt, IconCalendarPlus, IconUserPlus, IconSettings, IconBell, IconShare, IconCopy, IconExternalLink } from '@tabler/icons-react'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',   bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',     bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',     bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',      bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
  CANCELLED:   { label: 'Annulé',       bg: '#FCEBEB', color: '#A32D2D' },
}

function fmtDate(d: string) {
  const dt = new Date(d)
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${dt.getDate()} ${months[dt.getMonth()]}`
}

export default function GarageDashboard() {
  const [appts,   setAppts]   = useState<any[]>([])
  const [stats,   setStats]   = useState<any>(null)
  const [notifs,  setNotifs]  = useState<any[]>([])
  const [garage,  setGarage]  = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    Promise.all([
      fetch(`/api/garage/appointments?date=${today}`).then(r => r.json()),
      fetch('/api/garage/stats').then(r => r.json()),
      fetch('/api/garage/notifications').then(r => r.json()),
      fetch('/api/garage/me').then(r => r.json()),
    ]).then(([a, s, n, g]) => {
      setAppts(Array.isArray(a) ? a : [])
      setStats(s?.error ? null : s)
      setNotifs(Array.isArray(n) ? n : [])
      setGarage(g?.error ? null : g)
    }).finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/garage/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setAppts(p => p.map(a => a.id === id ? { ...a, status } : a))
  }

  const now = new Date()
  const DAY = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const MON = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
  const subtitle = `${DAY[now.getDay()]} ${now.getDate()} ${MON[now.getMonth()]} ${now.getFullYear()}`
  const garageName = garage?.name ?? 'votre garage'
  const unread = notifs.filter(n => !n.isRead).length

  const DAYS_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam']
  const weekBars = DAYS_SHORT.map((d, i) => {
    const monday = new Date(); monday.setDate(monday.getDate() - monday.getDay() + 1)
    const day = new Date(monday); day.setDate(monday.getDate() + i)
    const iso = day.toISOString().split('T')[0]
    return { label: d, count: appts.filter(a => a.date?.startsWith(iso)).length }
  })
  const maxBar = Math.max(...weekBars.map(b => b.count), 1)

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Dashboard" subtitle={subtitle} garageName={garage?.name} />

      <main className="flex-1 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Bonjour, {garageName} 👋
            </h2>
            {!loading && stats && (
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                {stats.today} RDV aujourd'hui · {stats.pending} en attente de confirmation
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {garage?.slug && (
              <>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/garage/${garage.slug}`
                    navigator.clipboard.writeText(url).then(() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    })
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
                  style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)', color: copied ? '#1D9E75' : 'var(--color-text-secondary)' }}>
                  {copied ? <IconCheck size={13}/> : <IconCopy size={13}/>}
                  {copied ? 'Copié !' : 'Copier mon lien'}
                </button>
                <Link href={`/garage/${garage.slug}`} target="_blank"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
                  style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)', color: 'var(--color-text-secondary)' }}>
                  <IconExternalLink size={13}/> Ma page
                </Link>
              </>
            )}
            <Link href="/garage/agenda"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
              style={{ background: '#1D9E75' }}>
              Voir l'agenda
            </Link>
          </div>
        </div>

        {/* Bannière onboarding si garage incomplet */}
        {!loading && garage && (!garage.services?.length || !garage.schedules?.length) && (
          <div className="rounded-[10px] p-4 flex items-center gap-4"
            style={{ background: '#FAEEDA', border: '0.5px solid #EF9F27' }}>
            <span className="text-2xl flex-shrink-0">⚙️</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold" style={{ color: '#633806' }}>
                Finalisez la configuration de votre garage
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#854F0B' }}>
                {!garage.services?.length && !garage.schedules?.length
                  ? 'Ajoutez vos services et vos horaires pour recevoir des réservations.'
                  : !garage.services?.length
                    ? 'Ajoutez au moins un service pour que les clients puissent réserver.'
                    : 'Configurez vos horaires d\'ouverture pour que les créneaux soient disponibles.'}
              </p>
            </div>
            <Link href="/garage/settings"
              className="px-3 py-2 rounded-lg text-[12px] font-medium text-white flex-shrink-0"
              style={{ background: '#EF9F27' }}>
              Configurer
            </Link>
          </div>
        )}

        {/* Métriques */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : [
            { label: "RDV aujourd'hui",  icon: IconCalendar,     val: stats?.today        ?? 0, sub: 'ce jour',               warn: false },
            { label: 'Cette semaine',     icon: IconCalendarWeek, val: appts.length,            sub: 'total semaine',          warn: false },
            { label: 'En attente',        icon: IconClockPause,   val: stats?.pending      ?? 0, sub: 'à confirmer',            warn: (stats?.pending ?? 0) > 0 },
            { label: 'CA ce mois',        icon: IconStar,         val: `${stats?.revenueMonth ?? 0} €`, sub: stats?.revenueDelta != null ? `${stats.revenueDelta > 0 ? '+' : ''}${stats.revenueDelta}% vs mois dernier` : 'premier mois', warn: false },
          ].map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="rounded-[10px] p-4"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-1.5 mb-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  <Icon size={13} /> {m.label}
                </div>
                <p className="text-2xl font-semibold" style={{ color: m.warn ? '#BA7517' : 'var(--color-text-primary)' }}>
                  {m.val}
                </p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{m.sub}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
          {/* RDV aujourd'hui */}
          <div className="space-y-4">
            <div className="rounded-[10px] overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Rendez-vous du jour
                </p>
                <Link href="/garage/appointments" className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>
                  Tous les RDV →
                </Link>
              </div>

              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : appts.length === 0 ? (
                <EmptyState
                  icon="📅"
                  title="Aucun RDV aujourd'hui"
                  description="Votre agenda est libre. Ajoutez un rendez-vous ou attendez les nouvelles réservations."
                  action={
                    <Link href="/garage/agenda"
                      className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                      style={{ background: '#1D9E75' }}>
                      Ouvrir l'agenda
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--color-border-tertiary)' }}>
                  {appts.map(a => {
                    const s = STATUS[a.status] ?? STATUS.PENDING
                    return (
                      <div key={a.id} className="flex items-center gap-3 px-4 py-3 transition-colors" style={{ '--hover-bg': 'var(--color-background-secondary)' } as React.CSSProperties}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <p className="text-[13px] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--color-text-primary)' }}>
                          {a.startTime}
                        </p>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {a.client?.firstName} {a.client?.lastName}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                            {a.service?.name}{a.vehicleModel ? ` · ${a.vehicleModel}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          {a.status === 'PENDING' && (
                            <button onClick={() => updateStatus(a.id, 'CONFIRMED')}
                              className="p-1.5 rounded transition-colors" style={{ background: '#E1F5EE', color: '#085041' }}
                              title="Confirmer">
                              <IconCheck size={12} />
                            </button>
                          )}
                          {['PENDING','CONFIRMED'].includes(a.status) && (
                            <button onClick={() => updateStatus(a.id, 'CANCELLED')}
                              className="p-1.5 rounded transition-colors" style={{ background: '#FCEBEB', color: '#A32D2D' }}
                              title="Annuler">
                              <IconX size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Bar chart semaine */}
            <div className="rounded-[10px] p-4"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[13px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                RDV cette semaine
              </p>
              {loading ? (
                <div className="flex items-end gap-2 h-20">
                  {Array.from({length:6}).map((_,i) => (
                    <div key={i} className="flex-1 rounded-t animate-pulse" style={{ height:`${Math.random()*80+20}%`, background:'var(--color-background-tertiary)' }}/>
                  ))}
                </div>
              ) : (
                <div className="flex items-end gap-2 h-20">
                  {weekBars.map((b, i) => {
                    const isToday = i === (new Date().getDay() - 1 + 7) % 7
                    return (
                      <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{b.count}</span>
                        <div className="w-full rounded-t" style={{ height: `${(b.count / maxBar) * 100}%`, minHeight: b.count > 0 ? '4px' : '2px', background: isToday ? '#1D9E75' : '#E1F5EE' }} />
                        <span className="text-[10px]" style={{ color: isToday ? '#1D9E75' : 'var(--color-text-tertiary)' }}>{b.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            {/* Notifications */}
            <div className="rounded-[10px] overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  <IconBell size={15} style={{ color: '#1D9E75' }}/> Notifications
                </div>
                {unread > 0 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    {unread} nouvelle{unread > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="p-3 space-y-2">
                  {Array.from({length:3}).map((_,i) => <SkeletonRow key={i}/>)}
                </div>
              ) : notifs.length === 0 ? (
                <EmptyState icon="🔔" title="Aucune notification" description="Vous êtes à jour !" />
              ) : (
                <div className="divide-y max-h-60 overflow-y-auto" style={{ borderColor: 'var(--color-border-tertiary)' }}>
                  {notifs.slice(0, 6).map(n => (
                    <div key={n.id} className="flex items-start gap-2.5 px-3.5 py-2.5"
                      style={{ background: !n.isRead ? '#E1F5EE33' : 'transparent' }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{n.title}</p>
                        <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{n.message}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                          {new Date(n.createdAt).toLocaleDateString('fr-BE')}
                        </p>
                      </div>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: '#E24B4A' }}/>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="rounded-[10px] overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-primary)' }}>
                <IconBolt size={15} style={{ color: '#1D9E75' }}/> Actions rapides
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--color-border-tertiary)' }}>
                {[
                  { href: '/garage/agenda',      label: 'Ajouter un RDV',   icon: IconCalendarPlus },
                  { href: '/garage/clients',     label: 'Nouveau client',   icon: IconUserPlus },
                  { href: '/garage/notifications',label: 'Notifications',   icon: IconBell },
                  { href: '/garage/settings',    label: 'Paramètres',       icon: IconSettings },
                ].map(a => {
                  const Icon = a.icon
                  return (
                    <Link key={a.href} href={a.href}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 text-center transition-colors"
                      style={{ background: 'var(--color-background-primary)', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                      <Icon size={18} style={{ color: '#1D9E75' }}/>
                      {a.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
