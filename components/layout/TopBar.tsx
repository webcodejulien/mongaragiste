'use client'

import { useState, useEffect } from 'react'
import { IconBell, IconSearch, IconChevronDown } from '@tabler/icons-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const NOTIF_ICONS: Record<string, string> = {
  NEW_APPOINTMENT:        '📅',
  APPOINTMENT_CONFIRMED:  '✅',
  APPOINTMENT_CANCELLED:  '❌',
  NEW_REVIEW:             '⭐',
  REMINDER_24H:           '⏰',
}

interface TopBarProps {
  title: string
  subtitle?: string
  garageName?: string
}

export function TopBar({ title, subtitle, garageName: garageProp }: TopBarProps) {
  const [notifOpen,  setNotifOpen]  = useState(false)
  const [notifs,     setNotifs]     = useState<any[]>([])
  const [loaded,     setLoaded]     = useState(false)
  const [garageName,   setGarageName]   = useState(garageProp ?? '')
  const [garageLogoUrl, setGarageLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/garage/notifications')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setNotifs(d) })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (garageProp) { setGarageName(garageProp); return }
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(d => {
        if (d?.name) setGarageName(d.name)
        if (d?.logoUrl) setGarageLogoUrl(d.logoUrl)
      })
      .catch(() => {})
  }, [garageProp])

  const unread = notifs.filter(n => !n.isRead).length

  function fmtTime(d: string) {
    const dt  = new Date(d)
    const now = new Date()
    const diff = Math.floor((now.getTime() - dt.getTime()) / 1000)
    if (diff < 60)   return 'À l\'instant'
    if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`
    if (diff < 86400)return `Il y a ${Math.floor(diff/3600)}h`
    return dt.toLocaleDateString('fr-BE')
  }

  async function markAllRead() {
    await fetch('/api/garage/notifications', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) })
    setNotifs(p => p.map(n => ({ ...n, isRead: true })))
  }

  return (
    <header className="h-[52px] flex items-center justify-between px-5 sticky top-0 z-10"
      style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>

      <div>
        <p className="text-[15px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{title}</p>
        {subtitle && <p className="text-[12px] mt-px" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-[34px] h-[34px] flex items-center justify-center rounded transition-colors relative"
            style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
            <IconBell size={17} />
            {unread > 0 && (
              <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full"
                style={{ background: '#E24B4A' }} />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)' }}>
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Notifications
                </span>
                {unread > 0 && (
                  <span className="text-[11px] font-medium px-2 py-px rounded-full"
                    style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    {unread} nouvelle{unread > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {!loaded ? (
                  <div className="px-4 py-6 text-center text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    Chargement…
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    Aucune notification
                  </div>
                ) : notifs.slice(0, 8).map(n => (
                  <div key={n.id}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors"
                    style={{
                      borderBottom: '0.5px solid var(--color-border-tertiary)',
                      background: !n.isRead ? 'var(--color-primary-light)' : 'transparent',
                    }}>
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {NOTIF_ICONS[n.type] ?? '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                        {n.title}
                      </p>
                      <p className="text-[11px] mt-0.5 leading-snug truncate" style={{ color: 'var(--color-text-secondary)' }}>
                        {n.message}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {fmtTime(n.createdAt)}
                      </p>
                    </div>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: '#E24B4A' }} />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-2"
                style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                {unread > 0 ? (
                  <button onClick={markAllRead}
                    className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>
                    Tout marquer lu
                  </button>
                ) : <span/>}
                <a href="/garage/notifications" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  Voir tout →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2.5"
          style={{ borderLeft: '0.5px solid var(--color-border-tertiary)' }}>
          {garageLogoUrl
            ? <img src={garageLogoUrl} alt={garageName} className="w-7 h-7 rounded-full object-cover flex-shrink-0"/>
            : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                {garageName.charAt(0)}
              </div>
          }
          <span className="text-[13px] font-medium hidden sm:block" style={{ color: 'var(--color-text-primary)' }}>
            {garageName}
          </span>
          <IconChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
        </div>
      </div>
    </header>
  )
}
