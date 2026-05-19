'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconLayoutDashboard, IconCalendar, IconClipboardList,
  IconUsers, IconChartBar, IconStar, IconBell,
  IconReceipt, IconSettings, IconHelp,
  IconExternalLink, IconLogout, IconCircleFilled,
} from '@tabler/icons-react'

const NAV = [
  {
    section: 'PRINCIPAL',
    items: [
      { href: '/garage',              label: 'Dashboard',     icon: IconLayoutDashboard },
      { href: '/garage/agenda',       label: 'Agenda',        icon: IconCalendar },
      { href: '/garage/appointments', label: 'Rendez-vous',   icon: IconClipboardList, badge: 3, badgeColor: 'amber' },
      { href: '/garage/clients',      label: 'Clients',       icon: IconUsers },
    ],
  },
  {
    section: 'GESTION',
    items: [
      { href: '/garage/stats',        label: 'Statistiques',  icon: IconChartBar },
      { href: '/garage/reviews',      label: 'Avis clients',  icon: IconStar },
      { href: '/garage/notifications',label: 'Notifications', icon: IconBell, badge: 5, badgeColor: 'red' },
      { href: '/garage/billing',      label: 'Facturation',   icon: IconReceipt },
    ],
  },
  {
    section: 'COMPTE',
    items: [
      { href: '/garage/settings',     label: 'Paramètres',    icon: IconSettings },
      { href: '/garage/help',         label: 'Aide',          icon: IconHelp },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-[200px] flex flex-col z-20"
      style={{ background: 'var(--color-background-primary)', borderRight: '0.5px solid var(--color-border-tertiary)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <IconCircleFilled size={8} className="text-primary-400" />
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
      </div>

      {/* Garage info */}
      <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            GD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium leading-tight truncate" style={{ color: 'var(--color-text-primary)' }}>
              Garage Dubois
            </p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-primary)' }}>Plan Pro</p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1D9E75' }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="px-3 pt-3 pb-1 text-[10px] font-medium tracking-[0.6px] uppercase"
              style={{ color: 'var(--color-text-secondary)' }}>
              {group.section}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-[9px] px-[10px] py-2 rounded mx-[6px] my-px text-[13px] transition-colors"
                  style={{
                    color: active ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                    background: active ? 'var(--color-primary-light)' : 'transparent',
                    fontWeight: active ? '500' : '400',
                  }}
                >
                  <Icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-medium px-1.5 py-px rounded-full text-white"
                      style={{ background: item.badgeColor === 'red' ? '#E24B4A' : '#EF9F27', color: item.badgeColor === 'red' ? '#fff' : '#412402' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" className="flex items-center gap-[9px] px-[10px] py-2 rounded text-[13px] transition-colors w-full"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconExternalLink size={16} />
          <span>Page publique</span>
        </Link>
        <Link href="/api/auth/signout" className="flex items-center gap-[9px] px-[10px] py-2 rounded text-[13px] transition-colors w-full"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconLogout size={16} />
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  )
}
