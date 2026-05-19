'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import Link from 'next/link'
import {
  IconCalendarWeek, IconClockPause, IconStar, IconArrowUp, IconArrowDown,
  IconCalendar, IconChartBar, IconBell, IconBolt, IconCalendarPlus,
  IconUserPlus, IconClockOff, IconSettings, IconCalendarCheck,
  IconCalendarX, IconClock,
} from '@tabler/icons-react'

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const BAR_VALS   = [7, 6, 8, 5, 9, 3]

const WEEK_GRID = [
  { hour: '08h', cells: [
    { label: 'Dupont — Vidange', color: 'teal' }, null,
    { label: 'Martin — Pneus', color: 'blue' }, null,
    { label: 'Leroy — Révision', color: 'teal' },
  ]},
  { hour: '09h', cells: [
    { label: 'Bernard — Freins', color: 'amber' },
    { label: 'Simon — Vidange', color: 'teal' }, null,
    { label: 'Renard — Diag.', color: 'blue' }, null,
  ]},
  { hour: '10h', cells: [
    null,
    { label: 'Moreau — Pneus', color: 'blue' },
    { label: 'Picard — Vidange', color: 'teal' }, null,
    { label: 'Fontaine — Freins', color: 'amber' },
  ]},
  { hour: '11h', cells: [
    { label: 'Petit — Révision', color: 'teal' }, null, null,
    { label: 'Colin — Vidange', color: 'teal' }, null,
  ]},
  { hour: '14h', cells: [
    { label: 'Schmitt — Clim', color: 'red' },
    { label: 'Nguyen — Pneus', color: 'teal' },
    { label: 'Roy — Freins', color: 'amber' }, null,
    { label: 'Dubois — Diag.', color: 'blue' },
  ]},
  { hour: '15h', cells: [
    null, null,
    { label: 'Thomas — Révision', color: 'teal' },
    { label: 'Lacroix — Pneus', color: 'blue' }, null,
  ]},
]

const APPT_COLORS: Record<string, string> = {
  teal:  'background:#E1F5EE;color:#085041',
  blue:  'background:#E6F1FB;color:#185FA5',
  amber: 'background:#FAEEDA;color:#633806',
  red:   'background:#FCEBEB;color:#A32D2D',
}

const DAY_APPTS = [
  { time: '08h00', name: 'Marc Dupont',  detail: 'Vidange · Renault Clio 2021 · 1-MXD-872',    status: 'Confirmé',  statusClass: 'ok',   bar: '#1D9E75' },
  { time: '09h00', name: 'Alice Bernard', detail: 'Freins avant · Peugeot 308 2019 · 1-AXB-456', status: 'En attente', statusClass: 'wait', bar: '#EF9F27' },
  { time: '11h00', name: 'Sophie Petit', detail: 'Révision complète · BMW Série 3 2020 · 2-SXP-101', status: 'Confirmé', statusClass: 'ok', bar: '#1D9E75' },
  { time: '14h00', name: 'Karl Schmitt', detail: 'Climatisation · Volkswagen Golf 2018 · 3-KXS-789', status: 'Urgent',    statusClass: 'urg', bar: '#E24B4A' },
  { time: '15h30', name: 'Jean Moreau',  detail: 'Vidange · Citroën C3 2022 · 1-JXM-334',       status: 'Terminé',   statusClass: 'done', bar: '#D1D5DB' },
]

const STATUS_STYLES: Record<string, string> = {
  ok:   'background:#E1F5EE;color:#085041',
  wait: 'background:#FAEEDA;color:#633806',
  urg:  'background:#FCEBEB;color:#A32D2D',
  done: 'background:var(--color-background-secondary);color:var(--color-text-secondary)',
}

const NOTIFS = [
  { icon: IconCalendarPlus, color: 'green',   text: <><strong>Nouveau RDV</strong> — Luc Fontaine, demain 10h, Freins</>, time: 'Il y a 5 min',  unread: true },
  { icon: IconClock,        color: 'amber',   text: <><strong>En attente</strong> — Alice Bernard n&apos;a pas encore confirmé</>, time: 'Il y a 22 min', unread: true },
  { icon: IconCalendarPlus, color: 'green',   text: <><strong>Nouveau RDV</strong> — Sara Ngom, jeudi 14h, Révision</>, time: 'Il y a 1h',     unread: true },
  { icon: IconCalendarX,    color: 'red',     text: <><strong>Annulation</strong> — Pierre Collin a annulé son RDV de jeudi</>, time: 'Il y a 2h',  unread: true },
  { icon: IconStar,         color: 'blue',    text: <><strong>Nouvel avis ★★★★★</strong> — &quot;Excellent travail, très pro !&quot;</>, time: 'Il y a 3h', unread: true },
  { icon: IconCalendarCheck,color: 'neutral', text: <>RDV confirmé — Marc Dupont, aujourd&apos;hui 08h</>, time: 'Hier, 17h42', unread: false },
]

const NOTIF_ICON_STYLE: Record<string, string> = {
  green:   'background:#E1F5EE;color:#1D9E75',
  amber:   'background:#FAEEDA;color:#854F0B',
  red:     'background:#FCEBEB;color:#A32D2D',
  blue:    'background:#E6F1FB;color:#185FA5',
  neutral: 'background:var(--color-background-secondary);color:var(--color-text-secondary)',
}

const REVIEWS = [
  { stars: 5,  text: '"Très professionnel, travail rapide et soigné. Je recommande !"', meta: 'Sophie P. · il y a 3h' },
  { stars: 5,  text: '"Accueil super, prix honnêtes, rien à redire."', meta: 'Marc D. · il y a 1 jour' },
  { stars: 4,  text: '"Bon garage, délai un peu long mais qualité au rendez-vous."', meta: 'Karl S. · il y a 2 jours' },
]

function styleObj(s: string): React.CSSProperties {
  return s.split(';').reduce((acc: Record<string, string>, part) => {
    const [k, v] = part.split(':')
    if (k && v) acc[k.trim()] = v.trim()
    return acc
  }, {}) as React.CSSProperties
}

export default function GarageDashboard() {
  const [view, setView] = useState<'week' | 'day'>('week')
  const max = Math.max(...BAR_VALS)

  const now = new Date()
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months   = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const subtitle = `${dayNames[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · 7 rendez-vous aujourd'hui`

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Dashboard" subtitle={subtitle} />

      <main className="flex-1 p-5 flex flex-col gap-3.5">

        {/* Métriques */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'RDV aujourd\'hui', icon: IconCalendar,     val: '7',    sub: '+2 vs hier',          up: true  },
            { label: 'Cette semaine',    icon: IconCalendarWeek, val: '31',   sub: '+4 vs sem. passée',   up: true  },
            { label: 'En attente',       icon: IconClockPause,   val: '3',    sub: 'à confirmer',         warn: true },
            { label: 'Note moyenne',     icon: IconStar,         val: '4.9',  sub: 'sur 127 avis',        star: true },
          ].map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="rounded-[10px] p-3.5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-1.5 mb-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  <Icon size={13} /> {m.label}
                </div>
                <div className="text-2xl font-medium leading-none" style={{ color: m.warn ? '#BA7517' : m.star ? '#1D9E75' : 'var(--color-text-primary)' }}>
                  {m.val}
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: m.up ? '#1D9E75' : m.warn ? '#854F0B' : 'var(--color-text-secondary)' }}>
                  {m.up && <IconArrowUp size={11} />}
                  {m.sub}
                </div>
              </div>
            )
          })}
        </div>

        {/* Deux colonnes */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 300px' }}>

          {/* Colonne gauche */}
          <div className="flex flex-col gap-3.5">

            {/* Agenda */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  <IconCalendar size={16} style={{ color: '#1D9E75' }} /> Agenda de la semaine
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {(['week', 'day'] as const).map((v) => (
                      <button key={v} onClick={() => setView(v)}
                        className="px-2.5 py-1 rounded text-[12px] transition-colors"
                        style={{
                          border: '0.5px solid var(--color-border-tertiary)',
                          background: view === v ? '#E1F5EE' : 'var(--color-background-primary)',
                          borderColor: view === v ? '#5DCAA5' : 'var(--color-border-tertiary)',
                          color: view === v ? '#085041' : 'var(--color-text-secondary)',
                          fontWeight: view === v ? '500' : '400',
                        }}>
                        {v === 'week' ? 'Semaine' : 'Jour'}
                      </button>
                    ))}
                  </div>
                  <Link href="/garage/agenda" className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>
                    19–23 mai ›
                  </Link>
                </div>
              </div>

              {view === 'week' ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px]">
                    <thead>
                      <tr>
                        <th className="w-11" style={{ background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }} />
                        {['Lun\n19', 'Mar\n20', 'Mer\n21', 'Jeu\n22', 'Ven\n23'].map((d, i) => {
                          const isToday = i === 0
                          return (
                            <th key={d} className="py-2 text-center text-[11px] font-medium"
                              style={{
                                background: 'var(--color-background-secondary)',
                                borderBottom: '0.5px solid var(--color-border-tertiary)',
                                color: isToday ? '#1D9E75' : 'var(--color-text-secondary)',
                              }}>
                              {d.split('\n')[0]}<br /><strong>{d.split('\n')[1]}</strong>
                              {isToday && <div className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5" style={{ background: '#1D9E75' }} />}
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {WEEK_GRID.map((row) => (
                        <tr key={row.hour}>
                          <td className="px-1.5 text-right text-[10px] align-top pt-1"
                            style={{ color: 'var(--color-text-secondary)', borderRight: '0.5px solid var(--color-border-tertiary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                            {row.hour}
                          </td>
                          {row.cells.map((cell, ci) => (
                            <td key={ci} className="p-0.5 align-top"
                              style={{ borderRight: ci < 4 ? '0.5px solid var(--color-border-tertiary)' : 'none', borderBottom: '0.5px solid var(--color-border-tertiary)', minHeight: '38px' }}>
                              {cell && (
                                <div className="rounded px-1.5 py-1 text-[10px] font-medium leading-tight cursor-pointer"
                                  style={styleObj(APPT_COLORS[cell.color])}>
                                  {cell.label}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <p className="px-4 py-2.5 text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Lundi 19 mai — 7 rendez-vous
                  </p>
                  {DAY_APPTS.map((a) => (
                    <div key={a.time} className="flex items-center gap-2.5 px-4 py-2 transition-colors"
                      style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                      <span className="text-[12px] font-medium w-9 flex-shrink-0" style={{ color: 'var(--color-text-primary)' }}>{a.time}</span>
                      <div className="w-[3px] h-8 rounded flex-shrink-0" style={{ background: a.bar }} />
                      <div className="flex-1">
                        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.name}</p>
                        <p className="text-[11px] mt-px" style={{ color: 'var(--color-text-secondary)' }}>{a.detail}</p>
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                        style={styleObj(STATUS_STYLES[a.statusClass])}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bar chart */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  <IconChartBar size={16} style={{ color: '#1D9E75' }} /> RDV cette semaine
                </div>
                <Link href="/garage/stats" className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>Voir détail ›</Link>
              </div>
              <div className="p-4 space-y-2">
                {DAYS_SHORT.map((d, i) => (
                  <div key={d} className="flex items-center gap-3">
                    <span className="text-[12px] w-8 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{d}</span>
                    <div className="flex-1 rounded-full h-[6px]" style={{ background: 'var(--color-background-secondary)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${(BAR_VALS[i] / max) * 100}%`, background: '#1D9E75' }} />
                    </div>
                    <span className="text-[12px] font-medium w-3 text-right" style={{ color: 'var(--color-text-primary)' }}>{BAR_VALS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-3.5">

            {/* Notifications */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  <IconBell size={16} style={{ color: '#1D9E75' }} /> Notifications
                </div>
                <span className="text-[11px] font-medium px-2 py-px rounded-full" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                  5 nouvelles
                </span>
              </div>
              {NOTIFS.map((n, i) => {
                const Icon = n.icon
                return (
                  <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 transition-colors cursor-pointer"
                    style={{
                      borderBottom: i < NOTIFS.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                      background: n.unread ? '#E1F5EE' : 'transparent',
                    }}>
                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={styleObj(NOTIF_ICON_STYLE[n.color])}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-[12px] leading-snug" style={{ color: 'var(--color-text-primary)' }}>{n.text}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{n.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions rapides */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-primary)' }}>
                <IconBolt size={16} style={{ color: '#1D9E75' }} /> Actions rapides
              </div>
              <div className="grid grid-cols-2 gap-px p-px" style={{ background: 'var(--color-border-tertiary)' }}>
                {[
                  { label: 'Ajouter un RDV',     icon: IconCalendarPlus, href: '/garage/appointments' },
                  { label: 'Nouveau client',      icon: IconUserPlus,     href: '/garage/clients' },
                  { label: 'Bloquer un créneau', icon: IconClockOff,     href: '/garage/agenda' },
                  { label: 'Paramètres ↗',        icon: IconSettings,     href: '/garage/settings' },
                ].map((a) => {
                  const Icon = a.icon
                  return (
                    <Link key={a.label} href={a.href}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 text-center transition-colors"
                      style={{ background: 'var(--color-background-primary)', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                      <Icon size={18} style={{ color: '#1D9E75' }} />
                      {a.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Derniers avis */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  <IconStar size={16} style={{ color: '#1D9E75' }} /> Derniers avis
                </div>
                <Link href="/garage/reviews" className="text-[12px] font-medium" style={{ color: '#1D9E75' }}>Voir tous ›</Link>
              </div>
              {REVIEWS.map((r, i) => (
                <div key={i} className="px-4 py-3" style={{ borderBottom: i < REVIEWS.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                  <div className="text-[13px] mb-1" style={{ color: '#EF9F27' }}>
                    {'★'.repeat(r.stars)}{'★'.repeat(5 - r.stars).split('').map((_, j) => (
                      <span key={j} style={{ color: 'var(--color-border-secondary)' }}>★</span>
                    ))}
                  </div>
                  <p className="text-[12px] leading-snug" style={{ color: 'var(--color-text-primary)' }}>{r.text}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>{r.meta}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
