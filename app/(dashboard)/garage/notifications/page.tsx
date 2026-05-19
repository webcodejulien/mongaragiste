'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import {
  IconCalendarPlus, IconCalendarX, IconCalendarCheck,
  IconStar, IconClock, IconCheck, IconTrash,
} from '@tabler/icons-react'

const ALL_NOTIFS = [
  { id: '1',  type: 'new_rdv',    title: 'Nouveau RDV',     message: 'Luc Fontaine, demain 10h, Freins',                     time: 'Il y a 5 min',   read: false },
  { id: '2',  type: 'pending',    title: 'En attente',      message: 'Alice Bernard n\'a pas encore confirmé son RDV du 20/05', time: 'Il y a 22 min', read: false },
  { id: '3',  type: 'new_rdv',    title: 'Nouveau RDV',     message: 'Sara Ngom, jeudi 14h, Révision complète',              time: 'Il y a 1h',      read: false },
  { id: '4',  type: 'cancelled',  title: 'Annulation',      message: 'Pierre Collin a annulé son RDV de jeudi 22/05',        time: 'Il y a 2h',      read: false },
  { id: '5',  type: 'review',     title: 'Nouvel avis ★★★★★', message: '"Excellent travail, très pro !" — Sophie P.',        time: 'Il y a 3h',      read: false },
  { id: '6',  type: 'confirmed',  title: 'RDV confirmé',    message: 'Marc Dupont, aujourd\'hui 08h, Vidange',               time: 'Hier, 17h42',    read: true  },
  { id: '7',  type: 'confirmed',  title: 'RDV confirmé',    message: 'Jean Moreau, vendredi 15h, Révision',                  time: 'Hier, 14h10',    read: true  },
  { id: '8',  type: 'new_rdv',    title: 'Nouveau RDV',     message: 'Isabelle Martin, lundi prochain 09h30, Pneus',         time: 'Il y a 2 jours', read: true  },
  { id: '9',  type: 'review',     title: 'Nouvel avis ★★★★', message: '"Bon garage, délai un peu long." — Karl S.',          time: 'Il y a 3 jours', read: true  },
  { id: '10', type: 'cancelled',  title: 'Annulation',      message: 'Thomas Leroy a annulé son RDV du 15/05',               time: 'Il y a 5 jours', read: true  },
]

const TYPE_CONFIG: Record<string, { icon: typeof IconCalendarPlus; iconStyle: string; bg: string }> = {
  new_rdv:   { icon: IconCalendarPlus,  iconStyle: 'background:#E1F5EE;color:#1D9E75',  bg: '#E1F5EE' },
  pending:   { icon: IconClock,         iconStyle: 'background:#FAEEDA;color:#854F0B',  bg: '#FAEEDA' },
  cancelled: { icon: IconCalendarX,     iconStyle: 'background:#FCEBEB;color:#A32D2D',  bg: '#FCEBEB' },
  confirmed: { icon: IconCalendarCheck, iconStyle: 'background:var(--color-background-secondary);color:var(--color-text-secondary)', bg: 'transparent' },
  review:    { icon: IconStar,          iconStyle: 'background:#E6F1FB;color:#185FA5',  bg: '#E6F1FB' },
}

function cssObj(s: string): React.CSSProperties {
  return s.split(';').reduce((acc: Record<string, string>, p) => {
    const [k, v] = p.split(':')
    if (k && v) acc[k.trim()] = v.trim()
    return acc
  }, {}) as React.CSSProperties
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(ALL_NOTIFS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs
  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(p => p.map(n => ({ ...n, read: true })))
  }
  function markRead(id: string) {
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  }
  function remove(id: string) {
    setNotifs(p => p.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'} />
      <main className="flex-1 p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
                style={{
                  background: filter === f ? '#1D9E75' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--color-text-secondary)',
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

        <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {displayed.length === 0 ? (
            <div className="py-16 text-center text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              Aucune notification{filter === 'unread' ? ' non lue' : ''}.
            </div>
          ) : displayed.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type]
            const Icon = cfg.icon
            return (
              <div key={n.id}
                className="flex items-start gap-3 px-4 py-3.5 transition-colors group"
                style={{
                  borderBottom: i < displayed.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                  background: !n.read ? `${cfg.bg}33` : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => markRead(n.id)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={cssObj(cfg.iconStyle)}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#E24B4A' }} />}
                  </div>
                  <p className="text-[12px] mt-0.5 leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{n.message}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{n.time}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); remove(n.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all"
                  style={{ color: 'var(--color-text-tertiary)' }}>
                  <IconTrash size={13} />
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
