'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import {
  IconCalendarPlus, IconCalendarX, IconCalendarCheck,
  IconStar, IconClock, IconCheck, IconBell,
} from '@tabler/icons-react'
import { EmptyState } from '@/components/ui/EmptyState'

const TYPE_CONFIG: Record<string, { icon: typeof IconCalendarPlus; bg: string; color: string }> = {
  NEW_APPOINTMENT:       { icon: IconCalendarPlus,  bg: '#E1F5EE', color: '#1D9E75' },
  APPOINTMENT_CONFIRMED: { icon: IconCalendarCheck, bg: '#E1F5EE', color: '#085041' },
  APPOINTMENT_CANCELLED: { icon: IconCalendarX,     bg: '#FCEBEB', color: '#A32D2D' },
  NEW_REVIEW:            { icon: IconStar,           bg: '#E6F1FB', color: '#185FA5' },
  REMINDER_24H:          { icon: IconClock,          bg: '#FAEEDA', color: '#854F0B' },
}

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetch('/api/garage/notifications')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setNotifs(d) })
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifs.filter(n => !n.isRead).length
  const displayed   = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs

  async function markAllRead() {
    await fetch('/api/garage/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    setNotifs(p => p.map(n => ({ ...n, isRead: true })))
  }

  function fmtTime(d: string) {
    const dt   = new Date(d)
    const now  = new Date()
    const diff = Math.floor((now.getTime() - dt.getTime()) / 1000)
    if (diff < 60)    return 'À l\'instant'
    if (diff < 3600)  return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
    return dt.toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}
      />
      <main className="flex-1 p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 p-0.5 rounded-lg"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
                style={{
                  background: filter === f ? '#1D9E75' : 'transparent',
                  color:      filter === f ? '#fff'    : 'var(--color-text-secondary)',
                }}>
                {f === 'all' ? 'Toutes' : `Non lues (${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-[12px] font-medium"
              style={{ color: '#1D9E75' }}>
              <IconCheck size={13} /> Tout marquer lu
            </button>
          )}
        </div>

        <div className="rounded-[10px] overflow-hidden"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {loading ? (
            <div className="space-y-px">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5"
                  style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  <div className="w-8 h-8 rounded-full animate-pulse flex-shrink-0"
                    style={{ background: 'var(--color-background-secondary)' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded animate-pulse"
                      style={{ background: 'var(--color-background-secondary)' }} />
                    <div className="h-2.5 w-56 rounded animate-pulse"
                      style={{ background: 'var(--color-background-secondary)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState
              icon="🔔"
              title={filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
              description="Les nouvelles réservations, annulations et avis apparaîtront ici."
            />
          ) : displayed.map((n, i) => {
            const cfg  = TYPE_CONFIG[n.type] ?? { icon: IconBell, bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }
            const Icon = cfg.icon
            return (
              <div key={n.id}
                className="flex items-start gap-3 px-4 py-3.5 transition-colors"
                style={{
                  borderBottom: i < displayed.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                  background:   !n.isRead ? `${cfg.bg}44` : 'transparent',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#E24B4A' }} />
                    )}
                  </div>
                  <p className="text-[12px] mt-0.5 leading-snug"
                    style={{ color: 'var(--color-text-secondary)' }}>
                    {n.message}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    {fmtTime(n.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
