'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  IconCircleFilled, IconCalendar, IconUser,
  IconMenu2, IconX, IconLogout, IconHome,
} from '@tabler/icons-react'

const NAV = [
  { href: '/client/appointments', label: 'Mes rendez-vous', icon: IconCalendar },
  { href: '/client/profile',      label: 'Mon profil',      icon: IconUser },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex items-center gap-2">
          <Logo size="sm" href="/" />
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--color-text-secondary)' }}>
            <IconX size={18} />
          </button>
        )}
      </div>

      {/* Client label */}
      <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            C
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium leading-tight truncate" style={{ color: 'var(--color-text-primary)' }}>
              Espace client
            </p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: '#1D9E75' }}>Tableau de bord</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div>
          <p className="px-3 pt-3 pb-1 text-[10px] font-medium tracking-[0.6px] uppercase"
            style={{ color: 'var(--color-text-secondary)' }}>
            MON COMPTE
          </p>
          {NAV.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-[9px] px-[10px] py-2 rounded mx-[6px] my-px text-[13px] transition-colors"
                style={{
                  color: active ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                  background: active ? 'var(--color-primary-light)' : 'transparent',
                  fontWeight: active ? '500' : '400',
                }}>
                <Icon size={16} />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" onClick={onClose}
          className="flex items-center gap-[9px] px-[10px] py-2 rounded text-[13px] transition-colors w-full"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconHome size={16} />
          <span>Trouver un garage</span>
        </Link>
        <Link href="/api/auth/signout"
          className="flex items-center gap-[9px] px-[10px] py-2 rounded text-[13px] transition-colors w-full"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconLogout size={16} />
          <span>Déconnexion</span>
        </Link>
      </div>
    </>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-secondary)' }}>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[200px] hidden lg:flex flex-col z-20"
        style={{ background: 'var(--color-background-primary)', borderRight: '0.5px solid var(--color-border-tertiary)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4"
        style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex items-center gap-2">
          <Logo size="sm" href="/" />
        </div>
        <button onClick={() => setMobileOpen(true)} style={{ color: 'var(--color-text-secondary)' }}>
          <IconMenu2 size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[240px] flex flex-col h-full z-50"
            style={{ background: 'var(--color-background-primary)' }}>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-[200px] flex flex-col pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  )
}
