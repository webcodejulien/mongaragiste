'use client'

import { useEffect, useState, useCallback } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import {
  IconPlus, IconSend, IconTrash, IconX,
  IconSearch,
} from '@tabler/icons-react'

const REMINDER_TYPES = [
  'Révision annuelle',
  'Vidange',
  'Contrôle technique',
  'Pneus hiver',
  'Pneus été',
  'Autre',
]

type Reminder = {
  id: string
  clientId: string
  client: {
    firstName: string
    lastName: string
    phone: string | null
    user: { email: string | null }
  }
  vehiclePlate: string | null
  vehicleModel: string | null
  type: string
  dueDate: string | null
  dueMileage: number | null
  notes: string | null
  sentAt: string | null
  status: 'PENDING' | 'SENT' | 'CANCELLED'
  createdAt: string
}

type Client = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

const STATUS_FILTERS = ['Tous', 'À envoyer', 'Envoyés', 'Annulés']
const STATUS_KEYS    = ['',     'PENDING',   'SENT',    'CANCELLED']

function fmtDate(d: string) {
  const dt = new Date(d)
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

function UrgencyBadge({ dueDate }: { dueDate: string | null }) {
  const days = daysUntil(dueDate)
  if (days === null) return <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>—</span>

  let bg = '#E1F5EE', color = '#085041', label = `J-${days}`
  if (days < 0)  { bg = '#FCEBEB'; color = '#A32D2D'; label = `${Math.abs(days)}j dépassé` }
  else if (days < 15) { bg = '#FCEBEB'; color = '#A32D2D'; label = `J-${days}` }
  else if (days < 30) { bg = '#FFF3CD'; color = '#856404'; label = `J-${days}` }

  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: bg, color }}>
      {label}
    </span>
  )
}

export default function RemindersPage() {
  const [reminders, setReminders]   = useState<Reminder[]>([])
  const [clients,   setClients]     = useState<Client[]>([])
  const [loading,   setLoading]     = useState(true)
  const [filterIdx, setFilterIdx]   = useState(0)
  const [search,    setSearch]      = useState('')
  const [showForm,  setShowForm]    = useState(false)
  const [sending,   setSending]     = useState<string | null>(null)
  const [deleting,  setDeleting]    = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    clientId:     '',
    vehiclePlate: '',
    vehicleModel: '',
    type:         REMINDER_TYPES[0],
    dueDate:      '',
    dueMileage:   '',
    notes:        '',
  })
  const [saving,      setSaving]    = useState(false)
  const [clientSearch, setClientSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/garage/reminders')
      .then(r => r.json())
      .then(d => setReminders(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    fetch('/api/garage/clients')
      .then(r => r.json())
      .then(d => setClients(Array.isArray(d) ? d : []))
  }, [load])

  const filtered = reminders.filter(r => {
    const matchStatus = !STATUS_KEYS[filterIdx] || r.status === STATUS_KEYS[filterIdx]
    const q = search.toLowerCase()
    const name = `${r.client.firstName} ${r.client.lastName}`.toLowerCase()
    const matchSearch = !q || name.includes(q) || (r.vehiclePlate ?? '').toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const pendingCount = reminders.filter(r => r.status === 'PENDING').length

  async function handleSend(id: string) {
    setSending(id)
    try {
      const res = await fetch(`/api/garage/reminders/${id}/send`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setReminders(prev => prev.map(r => r.id === id ? updated : r))
      }
    } finally {
      setSending(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce rappel ?')) return
    setDeleting(id)
    try {
      await fetch(`/api/garage/reminders/${id}`, { method: 'DELETE' })
      setReminders(prev => prev.filter(r => r.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  async function handleCancel(id: string) {
    await fetch(`/api/garage/reminders/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: 'CANCELLED' }),
    })
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.clientId || !form.type) return
    setSaving(true)
    try {
      const res = await fetch('/api/garage/reminders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          clientId:     form.clientId,
          vehiclePlate: form.vehiclePlate || undefined,
          vehicleModel: form.vehicleModel || undefined,
          type:         form.type,
          dueDate:      form.dueDate || undefined,
          dueMileage:   form.dueMileage ? Number(form.dueMileage) : undefined,
          notes:        form.notes || undefined,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        setReminders(prev => [created, ...prev])
        setShowForm(false)
        setForm({ clientId: '', vehiclePlate: '', vehicleModel: '', type: REMINDER_TYPES[0], dueDate: '', dueMileage: '', notes: '' })
        setClientSearch('')
      }
    } finally {
      setSaving(false)
    }
  }

  const filteredClients = clients.filter(c => {
    if (!clientSearch) return true
    const q = clientSearch.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q)
  })

  const selectedClient = clients.find(c => c.id === form.clientId)

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Rappels d'entretien"
        subtitle={pendingCount > 0 ? `${pendingCount} rappel${pendingCount > 1 ? 's' : ''} à envoyer` : undefined}
      />

      <main className="flex-1 p-5">

        {/* Modal formulaire */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-[12px] p-6"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Nouveau rappel
                </h2>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--color-text-tertiary)' }}>
                  <IconX size={18}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Client */}
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                    style={{ color: 'var(--color-text-secondary)' }}>Client *</label>
                  {selectedClient ? (
                    <div className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: 'var(--color-primary-light)', border: '0.5px solid #1D9E75' }}>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--color-primary-dark)' }}>
                        {selectedClient.firstName} {selectedClient.lastName}
                      </span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, clientId: '' }))}
                        style={{ color: 'var(--color-text-tertiary)' }}>
                        <IconX size={14}/>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                        placeholder="Rechercher un client…"
                        className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                        style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                      />
                      {clientSearch && (
                        <div className="mt-1 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
                          style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)' }}>
                          {filteredClients.slice(0, 8).map(c => (
                            <button key={c.id} type="button"
                              onClick={() => { setForm(f => ({ ...f, clientId: c.id })); setClientSearch('') }}
                              className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50"
                              style={{ color: 'var(--color-text-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                              {c.firstName} {c.lastName}
                              <span className="text-[11px] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>{c.email}</span>
                            </button>
                          ))}
                          {filteredClients.length === 0 && (
                            <p className="px-3 py-2 text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Aucun client trouvé</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                    style={{ color: 'var(--color-text-secondary)' }}>Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                  >
                    {REMINDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Véhicule */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                      style={{ color: 'var(--color-text-secondary)' }}>Immatriculation</label>
                    <input
                      value={form.vehiclePlate}
                      onChange={e => setForm(f => ({ ...f, vehiclePlate: e.target.value }))}
                      placeholder="1-ABC-123"
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                      style={{ color: 'var(--color-text-secondary)' }}>Modèle</label>
                    <input
                      value={form.vehicleModel}
                      onChange={e => setForm(f => ({ ...f, vehicleModel: e.target.value }))}
                      placeholder="Volkswagen Golf"
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                {/* Date + kilométrage */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                      style={{ color: 'var(--color-text-secondary)' }}>Date prévue</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                      style={{ color: 'var(--color-text-secondary)' }}>Kilométrage prévu</label>
                    <input
                      type="number"
                      value={form.dueMileage}
                      onChange={e => setForm(f => ({ ...f, dueMileage: e.target.value }))}
                      placeholder="150000"
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                    style={{ color: 'var(--color-text-secondary)' }}>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    placeholder="Remarques optionnelles…"
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none resize-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded text-[13px]"
                    style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={!form.clientId || saving}
                    className="px-4 py-2 rounded text-[13px] font-medium text-white disabled:opacity-50"
                    style={{ background: '#1D9E75' }}>
                    {saving ? 'Enregistrement…' : 'Créer le rappel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barre d'actions */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-56">
              <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-tertiary)' }}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Client, véhicule, type…"
                className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}/>
            </div>
            <div className="flex gap-1">
              {STATUS_FILTERS.map((f, i) => (
                <button key={f} onClick={() => setFilterIdx(i)}
                  className="px-2.5 py-1.5 rounded text-[12px] font-medium transition-colors"
                  style={{
                    background: filterIdx === i ? '#1D9E75' : 'var(--color-background-primary)',
                    color:      filterIdx === i ? '#fff'    : 'var(--color-text-secondary)',
                    border:     filterIdx === i ? 'none'    : '0.5px solid var(--color-border-tertiary)',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-white"
            style={{ background: '#1D9E75' }}>
            <IconPlus size={14}/> Nouveau rappel
          </button>
        </div>

        {/* Tableau */}
        <div className="rounded-[10px] overflow-hidden overflow-x-auto"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ minWidth: '720px' }}>
            <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
              style={{
                gridTemplateColumns: '1fr 140px 160px 90px 80px 130px',
                color: 'var(--color-text-secondary)',
                background: 'var(--color-background-secondary)',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
              }}>
              <span>Client</span>
              <span>Véhicule</span>
              <span>Type</span>
              <span>Date prévue</span>
              <span>Urgence</span>
              <span className="text-right">Actions</span>
            </div>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i}/>)
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="🔔"
                title={reminders.length === 0 ? 'Aucun rappel pour l\'instant' : 'Aucun résultat'}
                description={
                  reminders.length === 0
                    ? 'Créez des rappels d\'entretien pour vos clients : vidange, révision, CT...'
                    : 'Essayez de modifier votre recherche ou vos filtres.'
                }
                action={
                  reminders.length === 0 ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                      style={{ background: '#1D9E75' }}>
                      Créer un rappel
                    </button>
                  ) : undefined
                }
              />
            ) : (
              filtered.map((r, i) => {
                const clientName = `${r.client.firstName} ${r.client.lastName}`
                const statusBg: Record<string, string> = {
                  PENDING:   '#FAEEDA',
                  SENT:      '#E1F5EE',
                  CANCELLED: '#FCEBEB',
                }
                const statusColor: Record<string, string> = {
                  PENDING:   '#633806',
                  SENT:      '#085041',
                  CANCELLED: '#A32D2D',
                }
                const statusLabel: Record<string, string> = {
                  PENDING:   'À envoyer',
                  SENT:      'Envoyé',
                  CANCELLED: 'Annulé',
                }

                return (
                  <div key={r.id}
                    className="grid items-center px-4 py-3 transition-colors hover:bg-gray-50"
                    style={{
                      gridTemplateColumns: '1fr 140px 160px 90px 80px 130px',
                      borderBottom: i < filtered.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    }}>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{clientName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-px rounded-full"
                          style={{ background: statusBg[r.status] ?? '#eee', color: statusColor[r.status] ?? '#555' }}>
                          {statusLabel[r.status] ?? r.status}
                        </span>
                        {r.sentAt && (
                          <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                            Envoyé le {fmtDate(r.sentAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {r.vehicleModel && (
                        <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{r.vehicleModel}</p>
                      )}
                      {r.vehiclePlate && (
                        <p className="text-[10px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{r.vehiclePlate}</p>
                      )}
                      {!r.vehicleModel && !r.vehiclePlate && (
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>—</span>
                      )}
                    </div>

                    <p className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{r.type}</p>

                    <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {r.dueDate ? fmtDate(r.dueDate) : r.dueMileage ? `${r.dueMileage.toLocaleString('fr-BE')} km` : '—'}
                    </p>

                    <UrgencyBadge dueDate={r.dueDate}/>

                    <div className="flex items-center justify-end gap-1.5">
                      {r.status === 'PENDING' && (
                        <button
                          onClick={() => handleSend(r.id)}
                          disabled={sending === r.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[12px] font-medium disabled:opacity-50"
                          style={{ background: '#E1F5EE', color: '#085041' }}
                          title="Envoyer le rappel">
                          {sending === r.id ? '…' : <><IconSend size={12}/> Envoyer</>}
                        </button>
                      )}
                      {r.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="p-1.5 rounded"
                          style={{ background: '#FAEEDA', color: '#633806' }}
                          title="Annuler">
                          <IconX size={13}/>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="p-1.5 rounded disabled:opacity-50"
                        style={{ background: '#FCEBEB', color: '#A32D2D' }}
                        title="Supprimer">
                        <IconTrash size={13}/>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {!loading && (
          <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            {filtered.length} résultat(s)
          </p>
        )}
      </main>
    </div>
  )
}
