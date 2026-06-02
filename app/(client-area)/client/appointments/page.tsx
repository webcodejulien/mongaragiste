'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { IconCalendarPlus, IconX } from '@tabler/icons-react'
import Link from 'next/link'

interface Appointment {
  id: string
  date: string
  startTime: string
  status: string
  vehicleModel: string | null
  vehiclePlate: string | null
  notes: string | null
  garage: {
    name: string
    slug: string
    address: string
    city: string
  }
  service: {
    name: string
    duration: number
    price: number | null
  }
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label: 'En attente',   bg: '#FAEEDA', color: '#633806' },
  CONFIRMED:   { label: 'Confirmé',     bg: '#E1F5EE', color: '#085041' },
  IN_PROGRESS: { label: 'En cours',     bg: '#E6F1FB', color: '#185FA5' },
  DONE:        { label: 'Terminé',      bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
  CANCELLED:   { label: 'Annulé',       bg: '#FCEBEB', color: '#A32D2D' },
}

const FILTERS  = ['Tous', 'À venir', 'Passés', 'Annulés']
const FILTER_KEYS = ['all', 'upcoming', 'past', 'cancelled']

function fmtDate(d: string, time?: string) {
  const dt = new Date(d)
  const days   = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
  const base = `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]}`
  return time ? `${base} · ${time}` : base
}

function isUpcoming(appt: Appointment) {
  const apptDate = new Date(appt.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return apptDate >= today && appt.status !== 'CANCELLED' && appt.status !== 'DONE'
}

function isPast(appt: Appointment) {
  const apptDate = new Date(appt.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return apptDate < today || appt.status === 'DONE'
}

function canCancel(appt: Appointment) {
  if (!['PENDING', 'CONFIRMED'].includes(appt.status)) return false
  const apptDate = new Date(appt.date)
  const now = new Date()
  return apptDate > now
}

export default function ClientAppointmentsPage() {
  const [all,           setAll]           = useState<Appointment[]>([])
  const [loading,       setLoading]       = useState(true)
  const [fIdx,          setFIdx]          = useState(0)
  const [cancelId,      setCancelId]      = useState<string | null>(null)
  const [cancelling,    setCancelling]    = useState(false)

  useEffect(() => {
    fetch('/api/client/appointments')
      .then(r => r.json())
      .then(d => setAll(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel() {
    if (!cancelId) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/client/appointments/${cancelId}`, { method: 'PATCH' })
      if (res.ok) {
        setAll(prev => prev.map(a => a.id === cancelId ? { ...a, status: 'CANCELLED' } : a))
      }
    } finally {
      setCancelling(false)
      setCancelId(null)
    }
  }

  const filtered = all.filter(a => {
    const key = FILTER_KEYS[fIdx]
    if (key === 'all')       return true
    if (key === 'upcoming')  return isUpcoming(a)
    if (key === 'past')      return isPast(a)
    if (key === 'cancelled') return a.status === 'CANCELLED'
    return true
  })

  const upcomingCount = all.filter(isUpcoming).length

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Mes rendez-vous"
        subtitle={upcomingCount > 0 ? `${upcomingCount} à venir` : undefined}
      />

      <main className="flex-1 p-5">
        {/* Filters + CTA */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f, i) => (
              <button key={f} onClick={() => setFIdx(i)}
                className="px-2.5 py-1.5 rounded text-[12px] font-medium transition-colors"
                style={{
                  background: fIdx === i ? '#1D9E75' : 'var(--color-background-primary)',
                  color:      fIdx === i ? '#fff'    : 'var(--color-text-secondary)',
                  border:     fIdx === i ? 'none'    : '0.5px solid var(--color-border-tertiary)',
                }}>
                {f}
              </button>
            ))}
          </div>
          <Link href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#1D9E75' }}>
            <IconCalendarPlus size={15} />
            Réserver un RDV
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-[10px] overflow-hidden overflow-x-auto"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ minWidth: '620px' }}>
            {/* Header */}
            <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
              style={{
                gridTemplateColumns: '160px 1fr 160px 110px 80px',
                color: 'var(--color-text-secondary)',
                background: 'var(--color-background-secondary)',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
              }}>
              <span>Date</span>
              <span>Garage</span>
              <span>Service</span>
              <span>Véhicule</span>
              <span className="text-right">Statut</span>
            </div>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={all.length === 0 ? '📋' : '🔍'}
                title={all.length === 0 ? 'Aucun rendez-vous pour l\'instant' : 'Aucun résultat'}
                description={all.length === 0
                  ? 'Vos réservations apparaîtront ici. Trouvez un garage et réservez votre premier créneau.'
                  : 'Essayez de modifier votre filtre.'}
                action={all.length === 0 ? (
                  <Link href="/"
                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                    style={{ background: '#1D9E75' }}>
                    Trouver un garage
                  </Link>
                ) : undefined}
              />
            ) : (
              <div>
                {filtered.map((a) => {
                  const s = STATUS[a.status] ?? STATUS.PENDING
                  return (
                    <div key={a.id}
                      className="grid items-center px-4 py-3 transition-colors hover:bg-gray-50"
                      style={{
                        gridTemplateColumns: '160px 1fr 160px 110px 80px',
                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                      }}>
                      {/* Date */}
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {fmtDate(a.date, a.startTime)}
                        </p>
                      </div>

                      {/* Garage */}
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.garage.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          {a.garage.city}
                        </p>
                      </div>

                      {/* Service */}
                      <div>
                        <p className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{a.service.name}</p>
                        {a.service.price != null && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                            {a.service.price.toFixed(2)} €
                          </p>
                        )}
                      </div>

                      {/* Véhicule */}
                      <div>
                        <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                          {a.vehicleModel || '—'}
                        </p>
                        {a.vehiclePlate && (
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                            {a.vehiclePlate}
                          </p>
                        )}
                      </div>

                      {/* Statut + action */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                        {canCancel(a) && (
                          <button
                            onClick={() => setCancelId(a.id)}
                            className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-opacity hover:opacity-80"
                            style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                            <IconX size={10} />
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {!loading && (
          <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            {filtered.length} résultat(s)
          </p>
        )}
      </main>

      {/* Confirmation dialog */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-[12px] p-6 w-full max-w-sm shadow-xl"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)' }}>
            <p className="text-[15px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Annuler ce rendez-vous ?
            </p>
            <p className="text-[13px] mb-5" style={{ color: 'var(--color-text-secondary)' }}>
              Cette action est irréversible. Le garage sera informé de l'annulation.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelId(null)}
                disabled={cancelling}
                className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                style={{ border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-secondary)' }}>
                Retour
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: '#A32D2D' }}>
                {cancelling ? 'Annulation…' : 'Confirmer l\'annulation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
