'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconSearch, IconPhone, IconMail, IconCar, IconCalendar, IconChevronRight } from '@tabler/icons-react'

const CLIENTS = [
  { id:'1', firstName:'Marc',      lastName:'Dupont',   initials:'MD', email:'marc.dupont@gmail.com',    phone:'+32 470 12 34 56', totalRdv:8,  lastVisit:'15 mai 2024', vehicles:['Renault Clio 2021 · 1-MXD-872'], history:[{date:'15 mai 2024',service:'Vidange',status:'CONFIRMED'},{date:'22 oct. 2023',service:'Freins',status:'DONE'},{date:'10 jul. 2023',service:'Révision',status:'DONE'}] },
  { id:'2', firstName:'Alice',     lastName:'Bernard',  initials:'AB', email:'alice.bernard@outlook.com', phone:'+32 475 98 76 54', totalRdv:3,  lastVisit:'19 mai 2024', vehicles:['Peugeot 308 2019 · 1-AXB-456'],  history:[{date:'19 mai 2024',service:'Freins avant',status:'PENDING'},{date:'03 nov. 2023',service:'Vidange',status:'DONE'}] },
  { id:'3', firstName:'Karl',      lastName:'Schmitt',  initials:'KS', email:'karl.schmitt@gmail.com',    phone:'+32 472 44 55 66', totalRdv:5,  lastVisit:'19 mai 2024', vehicles:['Volkswagen Golf 2018 · 3-KXS-789','Audi A3 2020 · 2-KAS-112'], history:[{date:'19 mai 2024',service:'Climatisation',status:'IN_PROGRESS'},{date:'14 jan. 2024',service:'Diagnostic',status:'DONE'}] },
  { id:'4', firstName:'Jean',      lastName:'Moreau',   initials:'JM', email:'jean.moreau@yahoo.fr',      phone:'+32 479 77 88 99', totalRdv:12, lastVisit:'19 mai 2024', vehicles:['Citroën C3 2022 · 1-JXM-334','Renault Kangoo 2019 · 2-JXM-885'], history:[{date:'19 mai 2024',service:'Vidange',status:'DONE'},{date:'01 déc. 2023',service:'Diagnostic',status:'DONE'},{date:'14 sep. 2023',service:'Embrayage',status:'DONE'}] },
  { id:'5', firstName:'Sophie',    lastName:'Petit',    initials:'SP', email:'sophie.petit@gmail.com',    phone:'+32 478 11 22 33', totalRdv:6,  lastVisit:'19 mai 2024', vehicles:['BMW Série 3 2020 · 2-SXP-101'], history:[{date:'19 mai 2024',service:'Révision complète',status:'CONFIRMED'},{date:'22 mar. 2024',service:'Pneus',status:'DONE'}] },
  { id:'6', firstName:'Luc',       lastName:'Fontaine', initials:'LF', email:'luc.fontaine@hotmail.com',  phone:'+32 471 23 45 67', totalRdv:2,  lastVisit:'20 mai 2024', vehicles:['Toyota Yaris 2021 · 2-LXF-009'], history:[{date:'20 mai 2024',service:'Freins',status:'CONFIRMED'}] },
  { id:'7', firstName:'Sara',      lastName:'Ngom',     initials:'SN', email:'sara.ngom@gmail.com',       phone:'+32 476 89 01 23', totalRdv:1,  lastVisit:'22 mai 2024', vehicles:['Renault Mégane 2020 · 1-SXN-445'], history:[{date:'22 mai 2024',service:'Révision complète',status:'CONFIRMED'}] },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:     { bg:'#FAEEDA', color:'#633806', label:'En attente' },
  CONFIRMED:   { bg:'#E1F5EE', color:'#085041', label:'Confirmé' },
  IN_PROGRESS: { bg:'#E6F1FB', color:'#185FA5', label:'En cours' },
  DONE:        { bg:'var(--color-background-secondary)', color:'var(--color-text-secondary)', label:'Terminé' },
  CANCELLED:   { bg:'#FCEBEB', color:'#A32D2D', label:'Annulé' },
}

export default function ClientsPage() {
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = CLIENTS.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
  })

  const sel = CLIENTS.find(c => c.id === selected)

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Clients" subtitle={`${CLIENTS.length} clients`} />
      <main className="flex-1 p-5">
        <div className="flex gap-4">

          {/* Liste */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-64">
                <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
                  className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none"
                  style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }} />
              </div>
              <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{filtered.length} résultat(s)</p>
            </div>

            <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
                style={{ gridTemplateColumns: '1fr 130px 60px 40px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                <span>Client</span><span>Dernier RDV</span><span className="text-center">RDV</span><span />
              </div>
              {filtered.map((c, i) => (
                <div key={c.id}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className="grid items-center px-4 py-2.5 cursor-pointer transition-colors"
                  style={{
                    gridTemplateColumns: '1fr 130px 60px 40px',
                    borderBottom: i < filtered.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    background: selected === c.id ? 'var(--color-primary-light)' : 'transparent',
                  }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                      {c.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.firstName} {c.lastName}</p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{c.phone}</p>
                    </div>
                  </div>
                  <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{c.lastVisit}</p>
                  <p className="text-[13px] font-semibold text-center" style={{ color: 'var(--color-text-primary)' }}>{c.totalRdv}</p>
                  <IconChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Détail */}
          {sel && (
            <div className="w-72 flex-shrink-0">
              <div className="rounded-[10px] p-5 sticky top-20" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold"
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                    {sel.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{sel.firstName} {sel.lastName}</p>
                    <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{sel.totalRdv} rendez-vous</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                    <IconMail size={13} style={{ color: 'var(--color-text-tertiary)' }} /> {sel.email}
                  </div>
                  <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                    <IconPhone size={13} style={{ color: 'var(--color-text-tertiary)' }} /> {sel.phone}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Véhicule(s)</p>
                  {sel.vehicles.map(v => (
                    <div key={v} className="flex items-center gap-2 text-[12px] py-1 rounded px-2" style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      <IconCar size={12} /> {v}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Historique</p>
                  <div className="space-y-2">
                    {sel.history.map((h, i) => {
                      const s = STATUS_STYLE[h.status]
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{h.service}</p>
                            <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{h.date}</p>
                          </div>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label}</span>
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
