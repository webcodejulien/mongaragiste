'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { IconSearch, IconMail, IconPhone, IconChevronRight, IconDownload } from '@tabler/icons-react'
import Link from 'next/link'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label:'En attente', bg:'#FAEEDA', color:'#633806' },
  CONFIRMED:   { label:'Confirmé',   bg:'#E1F5EE', color:'#085041' },
  IN_PROGRESS: { label:'En cours',   bg:'#E6F1FB', color:'#185FA5' },
  DONE:        { label:'Terminé',    bg:'var(--color-background-secondary)', color:'var(--color-text-secondary)' },
  CANCELLED:   { label:'Annulé',     bg:'#FCEBEB', color:'#A32D2D' },
}

function fmtDate(d: string) {
  const dt = new Date(d)
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [selected, setSelected] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/garage/clients')
      .then(r => r.json())
      .then(d => setClients(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
      || (c.email ?? '').toLowerCase().includes(q)
      || (c.phone ?? '').includes(q)
  })

  const sel = clients.find(c => c.id === selected)

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Clients" subtitle={!loading ? `${clients.length} client${clients.length !== 1 ? 's' : ''}` : undefined}/>

      <main className="flex-1 p-5">
        <div className="flex gap-5">
          {/* Liste */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-64">
                <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--color-text-tertiary)' }}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
                  className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none"
                  style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-primary)', color:'var(--color-text-primary)' }}/>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>{filtered.length} résultat(s)</p>
                <a href="/api/garage/export?type=clients"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium"
                  style={{ border:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)', background:'var(--color-background-primary)' }}>
                  <IconDownload size={13}/> Export CSV
                </a>
              </div>
            </div>

            <div className="rounded-[10px] overflow-hidden"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
                style={{ gridTemplateColumns:'1fr 130px 60px 40px', color:'var(--color-text-secondary)', background:'var(--color-background-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                <span>Client</span><span>Dernier RDV</span><span className="text-center">RDV</span><span/>
              </div>

              {loading ? (
                Array.from({length:5}).map((_,i) => <SkeletonRow key={i}/>)
              ) : filtered.length === 0 && clients.length === 0 ? (
                <EmptyState
                  icon="👥"
                  title="Aucun client pour l'instant"
                  description="Vos clients apparaîtront ici dès qu'ils auront pris leur premier rendez-vous."
                  action={
                    <Link href="/" className="text-[13px] font-medium" style={{ color:'#1D9E75' }}>
                      Voir ma page publique
                    </Link>
                  }
                />
              ) : filtered.length === 0 ? (
                <EmptyState icon="🔍" title="Aucun client trouvé" description="Essayez de modifier votre recherche."/>
              ) : (
                filtered.map((c, i) => (
                  <div key={c.id} onClick={() => setSelected(selected===c.id ? null : c.id)}
                    className="grid items-center px-4 py-2.5 cursor-pointer transition-colors"
                    style={{ gridTemplateColumns:'1fr 130px 60px 40px', borderBottom: i<filtered.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none', background: selected===c.id ? 'var(--color-primary-light)' : 'transparent' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
                        style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                        {initials(c.firstName, c.lastName)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{c.firstName} {c.lastName}</p>
                        <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{c.phone || c.email}</p>
                      </div>
                    </div>
                    <p className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{fmtDate(c.lastVisit)}</p>
                    <p className="text-[13px] font-semibold text-center" style={{ color:'var(--color-text-primary)' }}>{c.totalRdv}</p>
                    <IconChevronRight size={14} style={{ color:'var(--color-text-tertiary)' }}/>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panneau détail */}
          {sel && (
            <div className="w-72 flex-shrink-0">
              <div className="rounded-[10px] p-5 sticky top-20"
                style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold"
                    style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                    {initials(sel.firstName, sel.lastName)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>{sel.firstName} {sel.lastName}</p>
                    <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{sel.totalRdv} rendez-vous</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
                    <IconMail size={12} style={{ color:'var(--color-text-tertiary)' }}/> {sel.email}
                  </div>
                  {sel.phone && (
                    <div className="flex items-center gap-2 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
                      <IconPhone size={12} style={{ color:'var(--color-text-tertiary)' }}/> {sel.phone}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide mb-2" style={{ color:'var(--color-text-tertiary)' }}>Historique</p>
                  <div className="space-y-2">
                    {sel.appointments.map((a: any, i: number) => {
                      const s = STATUS[a.status] ?? STATUS.DONE
                      return (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium truncate" style={{ color:'var(--color-text-primary)' }}>{a.service}</p>
                            <p className="text-[10px]" style={{ color:'var(--color-text-tertiary)' }}>{fmtDate(a.date)}</p>
                          </div>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background:s.bg, color:s.color }}>{s.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
