'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard, SkeletonRow } from '@/components/ui/Skeleton'
import Link from 'next/link'
import {
  IconCalendar, IconCalendarWeek, IconClockPause, IconStar,
  IconCheck, IconX, IconBolt, IconCalendarPlus, IconUserPlus,
  IconSettings, IconBell, IconCopy, IconExternalLink,
  IconPhone, IconPlayerPlay, IconAlertTriangle,
  IconChevronRight,
} from '@tabler/icons-react'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',   bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',     bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',     bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',      bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
  CANCELLED:   { label: 'Annulé',       bg: '#FCEBEB', color: '#A32D2D' },
}

function fmtTime() {
  const now = new Date()
  return now.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
}

export default function GarageDashboard() {
  const [appts,     setAppts]     = useState<any[]>([])
  const [tomorrowAppts, setTomorrowAppts] = useState<any[]>([])
  const [stats,     setStats]     = useState<any>(null)
  const [notifs,    setNotifs]    = useState<any[]>([])
  const [garage,    setGarage]    = useState<any>(null)
  const [loading,   setLoading]   = useState(true)
  const [copied,    setCopied]    = useState(false)
  const [currentTime, setCurrentTime] = useState(fmtTime())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(fmtTime()), 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const today    = new Date()
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
    const todayStr    = today.toISOString().split('T')[0]
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    Promise.all([
      fetch(`/api/garage/appointments?date=${todayStr}`).then(r => r.json()),
      fetch(`/api/garage/appointments?date=${tomorrowStr}`).then(r => r.json()),
      fetch('/api/garage/stats').then(r => r.json()),
      fetch('/api/garage/notifications').then(r => r.json()),
      fetch('/api/garage/me').then(r => r.json()),
    ]).then(([a, tmrw, s, n, g]) => {
      setAppts(Array.isArray(a) ? a : [])
      setTomorrowAppts(Array.isArray(tmrw) ? tmrw : [])
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
    setTomorrowAppts(p => p.map(a => a.id === id ? { ...a, status } : a))
  }

  const now = new Date()
  const DAY = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const MON = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
  const subtitle    = `${DAY[now.getDay()]} ${now.getDate()} ${MON[now.getMonth()]} ${now.getFullYear()}`
  const garageName  = garage?.name ?? 'votre garage'
  const unread      = notifs.filter(n => !n.isRead).length
  const pendingCount = appts.filter(a => a.status === 'PENDING').length

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

        {/* Header avec heure et liens */}
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

        {/* Bannière actions requises */}
        {!loading && pendingCount > 0 && (
          <div className="rounded-[10px] px-4 py-3 flex items-center gap-3"
            style={{ background: '#FAEEDA', border: '0.5px solid #EF9F27' }}>
            <IconAlertTriangle size={16} style={{ color: '#BA7517', flexShrink: 0 }} />
            <p className="flex-1 text-[13px] font-semibold" style={{ color: '#633806' }}>
              {pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente de confirmation
            </p>
            <a
              href="#rdv-jour"
              className="flex items-center gap-1 text-[12px] font-medium flex-shrink-0"
              style={{ color: '#BA7517' }}>
              Confirmer maintenant <IconChevronRight size={13}/>
            </a>
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

        {/* Barre navigation rapide */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: '/garage/agenda',       label: 'Agenda',      icon: IconCalendar },
            { href: '/garage/agenda',       label: 'Ajouter RDV', icon: IconCalendarPlus },
            { href: '/garage/clients',      label: 'Clients',     icon: IconUserPlus },
            { href: '/garage/settings',     label: 'Paramètres',  icon: IconSettings },
          ].map(a => {
            const Icon = a.icon
            return (
              <Link key={a.label} href={a.href}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[10px] text-[12px] font-medium transition-colors"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
                <Icon size={15} style={{ color: '#1D9E75' }}/>
                {a.label}
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
          {/* Colonne principale */}
          <div className="space-y-4">

            {/* Programme du jour */}
            <div id="rdv-jour" className="rounded-[10px] overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    📅 Programme du jour
                  </p>
                  <p className="text-[11px] mt-0.5 font-medium" style={{ color: '#1D9E75' }}>
                    Il est {currentTime}
                  </p>
                </div>
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
                    const clientName = `${a.client?.firstName ?? ''} ${a.client?.lastName ?? ''}`.trim()
                    const phone = a.client?.phone
                    return (
                      <div key={a.id} className="px-4 py-3 transition-colors"
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <div className="flex items-center gap-3">
                          {/* Heure */}
                          <p className="text-[14px] font-bold w-12 flex-shrink-0" style={{ color: 'var(--color-text-primary)' }}>
                            {a.startTime}
                          </p>
                          {/* Info client + service */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                {clientName}
                              </p>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: s.bg, color: s.color }}>{s.label}</span>
                            </div>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                              {a.service?.name}{a.vehicleModel ? ` · ${a.vehicleModel}` : ''}
                              {a.vehiclePlate ? ` · ${a.vehiclePlate}` : ''}
                            </p>
                          </div>
                          {/* Téléphone cliquable */}
                          {phone && (
                            <a href={`tel:${phone}`}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium flex-shrink-0 transition-colors"
                              style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}
                              title={`Appeler ${clientName}`}>
                              <IconPhone size={12} style={{ color: '#1D9E75' }}/> {phone}
                            </a>
                          )}
                        </div>
                        {/* Boutons d'action selon statut */}
                        {['PENDING','CONFIRMED','IN_PROGRESS'].includes(a.status) && (
                          <div className="flex gap-2 mt-2.5 ml-15">
                            {a.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateStatus(a.id, 'CONFIRMED')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                                  style={{ background: '#1D9E75', color: '#fff' }}>
                                  <IconCheck size={13}/> Confirmer
                                </button>
                                <button
                                  onClick={() => updateStatus(a.id, 'CANCELLED')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                                  style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                                  <IconX size={13}/> Refuser
                                </button>
                              </>
                            )}
                            {a.status === 'CONFIRMED' && (
                              <button
                                onClick={() => updateStatus(a.id, 'IN_PROGRESS')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                                style={{ background: '#E6F1FB', color: '#185FA5' }}>
                                <IconPlayerPlay size={13}/> Démarrer
                              </button>
                            )}
                            {a.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => updateStatus(a.id, 'DONE')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                                style={{ background: '#E1F5EE', color: '#085041' }}>
                                <IconCheck size={13}/> Terminé
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* À venir dans 24h */}
            {!loading && tomorrowAppts.length > 0 && (
              <div className="rounded-[10px] overflow-hidden"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    À venir — demain ({tomorrowAppts.length} RDV)
                  </p>
                  <Link href="/garage/agenda" className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>
                    Voir l'agenda →
                  </Link>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border-tertiary)' }}>
                  {tomorrowAppts.slice(0, 4).map(a => {
                    const s = STATUS[a.status] ?? STATUS.PENDING
                    const clientName = `${a.client?.firstName ?? ''} ${a.client?.lastName ?? ''}`.trim()
                    return (
                      <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-background-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <p className="text-[12px] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                          {a.startTime}
                        </p>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {clientName}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                            {a.service?.name}{a.vehicleModel ? ` · ${a.vehicleModel}` : ''}
                          </p>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        {a.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(a.id, 'CONFIRMED')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex-shrink-0"
                            style={{ background: '#1D9E75', color: '#fff' }}>
                            <IconCheck size={11}/> Confirmer
                          </button>
                        )}
                      </div>
                    )
                  })}
                  {tomorrowAppts.length > 4 && (
                    <div className="px-4 py-2 text-center">
                      <Link href="/garage/agenda" className="text-[11px]" style={{ color: '#1D9E75' }}>
                        +{tomorrowAppts.length - 4} autres RDV demain →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                  { href: '/garage/agenda',       label: 'Ajouter un RDV',  icon: IconCalendarPlus },
                  { href: '/garage/clients',       label: 'Nouveau client',  icon: IconUserPlus },
                  { href: '/garage/notifications', label: 'Notifications',   icon: IconBell },
                  { href: '/garage/settings',      label: 'Paramètres',      icon: IconSettings },
                ].map(a => {
                  const Icon = a.icon
                  return (
                    <Link key={a.href + a.label} href={a.href}
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
