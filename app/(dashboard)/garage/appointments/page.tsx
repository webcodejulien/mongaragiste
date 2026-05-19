'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconSearch, IconFilter, IconChevronDown, IconCheck, IconX, IconEye } from '@tabler/icons-react'

const ALL = [
  { id:'1',  date:'2024-05-19', time:'08:00', client:'Marc Dupont',    phone:'+32 470 12 34 56', service:'Vidange',             vehicle:'Renault Clio 2021',    plate:'1-MXD-872', status:'CONFIRMED',   notes:'' },
  { id:'2',  date:'2024-05-19', time:'09:00', client:'Alice Bernard',  phone:'+32 475 98 76 54', service:'Freins avant',        vehicle:'Peugeot 308 2019',     plate:'1-AXB-456', status:'PENDING',     notes:'Bruit au freinage côté gauche' },
  { id:'3',  date:'2024-05-19', time:'11:00', client:'Sophie Petit',   phone:'+32 478 11 22 33', service:'Révision complète',   vehicle:'BMW Série 3 2020',     plate:'2-SXP-101', status:'CONFIRMED',   notes:'' },
  { id:'4',  date:'2024-05-19', time:'14:00', client:'Karl Schmitt',   phone:'+32 472 44 55 66', service:'Climatisation',       vehicle:'Volkswagen Golf 2018', plate:'3-KXS-789', status:'IN_PROGRESS', notes:'Urgence — véhicule chaud' },
  { id:'5',  date:'2024-05-19', time:'15:30', client:'Jean Moreau',    phone:'+32 479 77 88 99', service:'Vidange',             vehicle:'Citroën C3 2022',      plate:'1-JXM-334', status:'DONE',        notes:'' },
  { id:'6',  date:'2024-05-20', time:'09:00', client:'Luc Fontaine',   phone:'+32 471 23 45 67', service:'Freins',              vehicle:'Toyota Yaris 2021',    plate:'2-LXF-009', status:'CONFIRMED',   notes:'' },
  { id:'7',  date:'2024-05-20', time:'10:30', client:'Sara Ngom',      phone:'+32 476 89 01 23', service:'Révision complète',   vehicle:'Renault Mégane 2020',  plate:'1-SXN-445', status:'CONFIRMED',   notes:'' },
  { id:'8',  date:'2024-05-21', time:'09:00', client:'Pierre Collin',  phone:'+32 473 45 67 89', service:'Pneus (x4)',          vehicle:'Audi A3 2019',         plate:'3-PCL-882', status:'CANCELLED',   notes:'Client a annulé' },
  { id:'9',  date:'2024-05-22', time:'14:00', client:'Emma Laurent',   phone:'+32 474 01 23 45', service:'Diagnostic',          vehicle:'Ford Focus 2018',      plate:'2-ELX-330', status:'PENDING',     notes:'' },
  { id:'10', date:'2024-05-23', time:'10:00', client:'Thomas Bernard', phone:'+32 477 55 44 33', service:'Embrayage',           vehicle:'Citroën Berlingo 2017',plate:'1-TBX-771', status:'CONFIRMED',   notes:'Devis accepté' },
]

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',   bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',     bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',     bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',      bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
  CANCELLED:   { label: 'Annulé',       bg: '#FCEBEB', color: '#A32D2D' },
}

const FILTERS = ['Tous', 'En attente', 'Confirmés', 'En cours', 'Terminés', 'Annulés']
const STATUS_KEYS = ['', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED']

function formatDate(d: string) {
  const dt = new Date(d)
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]}`
}

export default function AppointmentsPage() {
  const [search, setSearch]       = useState('')
  const [filterIdx, setFilterIdx] = useState(0)
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [items, setItems]         = useState(ALL)

  const filtered = items.filter(a => {
    const q = search.toLowerCase()
    const matchQ = !q || a.client.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.plate.toLowerCase().includes(q)
    const matchS = filterIdx === 0 || a.status === STATUS_KEYS[filterIdx]
    return matchQ && matchS
  })

  function confirm(id: string) { setItems(p => p.map(a => a.id === id ? { ...a, status: 'CONFIRMED' } : a)) }
  function cancel(id: string)  { setItems(p => p.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a)) }

  const pending = items.filter(a => a.status === 'PENDING').length

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Rendez-vous" subtitle={pending > 0 ? `${pending} en attente de confirmation` : undefined} />
      <main className="flex-1 p-5">

        {/* Barre de filtre */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Client, service, immatriculation…"
              className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-1"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }} />
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f, i) => (
              <button key={f} onClick={() => setFilterIdx(i)}
                className="px-2.5 py-1.5 rounded text-[12px] font-medium transition-colors"
                style={{
                  background: filterIdx === i ? '#1D9E75' : 'var(--color-background-primary)',
                  color: filterIdx === i ? '#fff' : 'var(--color-text-secondary)',
                  border: filterIdx === i ? 'none' : '0.5px solid var(--color-border-tertiary)',
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {/* Header */}
          <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
            style={{ gridTemplateColumns: '90px 1fr 160px 150px 110px 110px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <span>Date / Heure</span><span>Client</span><span>Service</span><span>Véhicule</span><span>Statut</span><span className="text-right">Actions</span>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Aucun rendez-vous trouvé.</div>
          )}

          {filtered.map((a, i) => {
            const s = STATUS[a.status]
            const isExp = expanded === a.id
            return (
              <div key={a.id}>
                <div className="grid items-center px-4 py-2.5 transition-colors cursor-pointer hover:bg-gray-50"
                  style={{ gridTemplateColumns: '90px 1fr 160px 150px 110px 110px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}
                  onClick={() => setExpanded(isExp ? null : a.id)}>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.time}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(a.date)}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.client}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{a.phone}</p>
                  </div>
                  <p className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{a.service}</p>
                  <div>
                    <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{a.vehicle}</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{a.plate}</p>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full w-fit"
                    style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                  <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                    {a.status === 'PENDING' && (
                      <>
                        <button onClick={() => confirm(a.id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ background: '#E1F5EE', color: '#085041' }}
                          title="Confirmer">
                          <IconCheck size={13} />
                        </button>
                        <button onClick={() => cancel(a.id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ background: '#FCEBEB', color: '#A32D2D' }}
                          title="Annuler">
                          <IconX size={13} />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 rounded transition-colors"
                      style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}
                      title="Détails">
                      <IconEye size={13} />
                    </button>
                  </div>
                </div>
                {isExp && a.notes && (
                  <div className="px-4 py-3" style={{ background: '#FAFAF8', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                    <p className="text-[11px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Notes</p>
                    <p className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{a.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>{filtered.length} résultat(s)</p>
      </main>
    </div>
  )
}
