'use client'

import { useState } from 'react'
import { IconBell, IconSearch, IconChevronDown } from '@tabler/icons-react'

const mockNotifs = [
  { id: '1', title: 'Nouveau RDV', message: 'Luc Fontaine, demain 10h, Freins', time: 'Il y a 5 min', read: false, color: 'green' },
  { id: '2', title: 'En attente', message: 'Alice Bernard n\'a pas encore confirmé', time: 'Il y a 22 min', read: false, color: 'amber' },
  { id: '3', title: 'Nouveau RDV', message: 'Sara Ngom, jeudi 14h, Révision', time: 'Il y a 1h', read: false, color: 'green' },
  { id: '4', title: 'Annulation', message: 'Pierre Collin a annulé son RDV de jeudi', time: 'Il y a 2h', read: false, color: 'red' },
  { id: '5', title: 'Nouvel avis ★★★★★', message: '"Excellent travail, très pro !"', time: 'Il y a 3h', read: false, color: 'blue' },
  { id: '6', title: 'RDV confirmé', message: 'Marc Dupont, aujourd\'hui 08h', time: 'Hier, 17h42', read: true, color: 'neutral' },
]

const iconColors: Record<string, string> = {
  green:   'background:#E1F5EE;color:#1D9E75',
  amber:   'background:#FAEEDA;color:#854F0B',
  red:     'background:#FCEBEB;color:#A32D2D',
  blue:    'background:#E6F1FB;color:#185FA5',
  neutral: 'background:#F5F5F2;color:#6B6E72',
}

interface TopBarProps {
  title: string
  subtitle?: string
  garageName?: string
}

export function TopBar({ title, subtitle, garageName = 'Garage Dubois' }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = mockNotifs.filter((n) => !n.read).length

  return (
    <header className="h-[52px] flex items-center justify-between px-5 sticky top-0 z-10"
      style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>

      <div>
        <p className="text-[15px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{title}</p>
        {subtitle && <p className="text-[12px] mt-px" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <button className="w-[34px] h-[34px] flex items-center justify-center rounded transition-colors"
          style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
          <IconSearch size={17} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-[34px] h-[34px] flex items-center justify-center rounded transition-colors relative"
            style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}
          >
            <IconBell size={17} />
            {unread > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-red-500" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 rounded-lg shadow-lg z-50 overflow-hidden"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)' }}>
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>Notifications</span>
                {unread > 0 && (
                  <span className="text-[11px] font-medium px-2 py-px rounded-full"
                    style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    {unread} nouvelles
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {mockNotifs.map((n) => (
                  <div key={n.id}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors cursor-pointer"
                    style={{
                      borderBottom: '0.5px solid var(--color-border-tertiary)',
                      background: !n.read ? 'var(--color-primary-light)' : 'transparent',
                    }}>
                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ ...(iconColors[n.color].split(';').reduce((acc, s) => { const [k,v]=s.split(':'); if(k&&v) acc[k.trim()]=v.trim(); return acc }, {} as Record<string,string>)) }}>
                      <span className="text-[12px]">
                        {n.color==='green'?'📅':n.color==='amber'?'⏰':n.color==='red'?'❌':n.color==='blue'?'⭐':'✓'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                        <strong>{n.title}</strong> — {n.message}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2" style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                <button className="text-[12px] font-medium" style={{ color: 'var(--color-primary)' }}>
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2.5" style={{ borderLeft: '0.5px solid var(--color-border-tertiary)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            {garageName.charAt(0)}
          </div>
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{garageName}</span>
          <IconChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
        </div>
      </div>
    </header>
  )
}
