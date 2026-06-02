'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { IconSearch, IconCheck, IconX, IconDownload, IconPhone, IconFileInvoice } from '@tabler/icons-react'
import Link from 'next/link'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',   bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',     bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',     bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',      bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
  CANCELLED:   { label: 'Annulé',       bg: '#FCEBEB', color: '#A32D2D' },
}

const FILTERS = ['Tous','En attente','Confirmés','En cours','Terminés','Annulés']
const KEYS    = ['','PENDING','CONFIRMED','IN_PROGRESS','DONE','CANCELLED']

function fmtDate(d: string) {
  const dt = new Date(d)
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]}`
}

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate()
}

function isTodayOrPast(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  // Compare date only (ignore time)
  const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return dDay <= today
}

export default function AppointmentsPage() {
  const [all,     setAll]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [fIdx,    setFIdx]    = useState(0)
  const [expanded,setExpanded]= useState<string|null>(null)

  useEffect(() => {
    fetch('/api/garage/appointments')
      .then(r => r.json())
      .then(d => setAll(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/garage/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setAll(p => p.map(a => a.id === id ? { ...a, status } : a))
  }

  const filtered = all.filter(a => {
    const q = search.toLowerCase()
    const name = `${a.client?.firstName ?? ''} ${a.client?.lastName ?? ''}`.toLowerCase()
    const matchQ = !q || name.includes(q) || (a.service?.name ?? '').toLowerCase().includes(q) || (a.vehiclePlate ?? '').toLowerCase().includes(q)
    const matchS = !KEYS[fIdx] || a.status === KEYS[fIdx]
    return matchQ && matchS
  })

  const pendingItems = all.filter(a => a.status === 'PENDING')
  const pending = pendingItems.length

  // Counts per status key for filter badges
  const counts: Record<string, number> = {}
  all.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
  function filterCount(i: number) {
    if (i === 0) return all.length
    return counts[KEYS[i]] ?? 0
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Rendez-vous" subtitle={pending > 0 ? `${pending} en attente de confirmation` : undefined}/>

      <main className="flex-1 p-5">

        {/* Section urgences */}
        {!loading && pendingItems.length > 0 && (
          <div className="mb-5 rounded-[10px] p-4"
            style={{ background: '#FFF8EF', border: '1px solid #F5C97A' }}>
            <p className="text-[13px] font-semibold mb-3" style={{ color: '#633806' }}>
              🔔 {pendingItems.length} demande{pendingItems.length > 1 ? 's' : ''} en attente
            </p>
            <div className="flex flex-wrap gap-3">
              {pendingItems.map(a => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: '#fff', border: '0.5px solid #F5C97A', minWidth: '260px', maxWidth: '380px', flex: '1 1 260px' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {a.client?.firstName} {a.client?.lastName}
                    </p>
                    <p className="text-[12px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                      {a.service?.name ?? '—'} · {fmtDate(a.date)} à {a.startTime}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => updateStatus(a.id, 'CONFIRMED')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[12px] font-medium"
                      style={{ background: '#E1F5EE', color: '#085041' }}>
                      <IconCheck size={12}/> Confirmer
                    </button>
                    <button onClick={() => updateStatus(a.id, 'CANCELLED')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[12px] font-medium"
                      style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                      <IconX size={12}/> Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="relative max-w-xs flex-1">
            <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Client, service, immatriculation…"
              className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none"
              style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}/>
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f, i) => (
              <button key={f} onClick={() => setFIdx(i)}
                className="px-2.5 py-1.5 rounded text-[12px] font-medium transition-colors"
                style={{
                  background: fIdx===i ? '#1D9E75' : 'var(--color-background-primary)',
                  color: fIdx===i ? '#fff' : 'var(--color-text-secondary)',
                  border: fIdx===i ? 'none' : '0.5px solid var(--color-border-tertiary)',
                }}>
                {f} ({filterCount(i)})
              </button>
            ))}
          </div>
          <a href="/api/garage/export?type=appointments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium ml-auto flex-shrink-0"
            style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)', background: 'var(--color-background-primary)' }}>
            <IconDownload size={13}/> Export CSV
          </a>
        </div>

        <div className="rounded-[10px] overflow-hidden overflow-x-auto"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ minWidth: '700px' }}>
          <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
            style={{ gridTemplateColumns:'90px 1fr 160px 150px 110px 130px', color:'var(--color-text-secondary)', background:'var(--color-background-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
            <span>Date/Heure</span><span>Client</span><span>Service</span><span>Véhicule</span><span>Statut</span><span className="text-right">Actions</span>
          </div>

          {loading ? (
            Array.from({length:5}).map((_,i) => <SkeletonRow key={i}/>)
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={all.length === 0 ? '📋' : '🔍'}
              title={all.length === 0 ? 'Aucun rendez-vous pour l\'instant' : 'Aucun résultat'}
              description={all.length === 0
                ? 'Les réservations de vos clients apparaîtront ici. Partagez votre page publique pour recevoir vos premiers RDV.'
                : 'Essayez de modifier votre recherche ou vos filtres.'}
              action={all.length === 0 ? (
                <Link href="/garage/agenda"
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                  style={{ background: '#1D9E75' }}>
                  Ajouter un RDV manuellement
                </Link>
              ) : undefined}
            />
          ) : (
            <div>
              {filtered.map((a) => {
                const s = STATUS[a.status] ?? STATUS.PENDING
                const isExp = expanded === a.id
                const phone = a.client?.phone
                const showDone = a.status === 'CONFIRMED' && isTodayOrPast(a.date)
                return (
                  <div key={a.id}>
                    <div className="grid items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-gray-50"
                      style={{ gridTemplateColumns:'90px 1fr 160px 150px 110px 130px', borderBottom:'0.5px solid var(--color-border-tertiary)' }}
                      onClick={() => setExpanded(isExp ? null : a.id)}>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{a.startTime}</p>
                        <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{fmtDate(a.date)}</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{a.client?.firstName} {a.client?.lastName}</p>
                        {phone ? (
                          <a href={`tel:${phone}`}
                            className="text-[11px] flex items-center gap-0.5 w-fit"
                            style={{ color:'#1D9E75' }}
                            onClick={e => e.stopPropagation()}>
                            <IconPhone size={10}/>{phone}
                          </a>
                        ) : (
                          <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{a.client?.user?.email}</p>
                        )}
                      </div>
                      <p className="text-[13px]" style={{ color:'var(--color-text-primary)' }}>{a.service?.name}</p>
                      <div>
                        <p className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{a.vehicleModel || '—'}</p>
                        {a.vehiclePlate && <p className="text-[10px] font-mono mt-0.5" style={{ color:'var(--color-text-tertiary)' }}>{a.vehiclePlate}</p>}
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full w-fit"
                        style={{ background:s.bg, color:s.color }}>{s.label}</span>
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        {a.status === 'PENDING' && (
                          <button onClick={() => updateStatus(a.id,'CONFIRMED')}
                            className="p-1.5 rounded" style={{ background:'#E1F5EE', color:'#085041' }}
                            title="Confirmer">
                            <IconCheck size={13}/>
                          </button>
                        )}
                        {showDone && (
                          <button onClick={() => updateStatus(a.id,'DONE')}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium"
                            style={{ background:'#E1F5EE', color:'#085041' }}
                            title="Marquer comme terminé">
                            <IconCheck size={12}/> Terminé
                          </button>
                        )}
                        {['PENDING','CONFIRMED'].includes(a.status) && (
                          <button onClick={() => updateStatus(a.id,'CANCELLED')}
                            className="p-1.5 rounded" style={{ background:'#FCEBEB', color:'#A32D2D' }}
                            title="Annuler">
                            <IconX size={13}/>
                          </button>
                        )}
                        {a.status === 'DONE' && (
                          <Link href={`/garage/appointments/${a.id}/invoice`}
                            className="p-1.5 rounded flex items-center"
                            style={{ background:'#E6F1FB', color:'#185FA5' }}
                            title="Générer la facture">
                            <IconFileInvoice size={13}/>
                          </Link>
                        )}
                      </div>
                    </div>
                    {isExp && a.notes && (
                      <div className="px-4 py-2.5" style={{ background:'var(--color-background-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                        <p className="text-[11px] font-medium mb-0.5" style={{ color:'var(--color-text-secondary)' }}>Notes</p>
                        <p className="text-[13px]" style={{ color:'var(--color-text-primary)' }}>{a.notes}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          </div>{/* end minWidth wrapper */}
        </div>
        {!loading && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>{filtered.length} résultat(s)</p>
            <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>Cliquez sur une ligne pour voir les détails</p>
          </div>
        )}
      </main>
    </div>
  )
}
