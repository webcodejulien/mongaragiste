'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft, IconPlus, IconTrash, IconLoader2,
} from '@tabler/icons-react'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
}

const defaultItem = (): QuoteItem => ({ description: '', quantity: 1, unitPrice: 0 })

export default function NewQuotePage() {
  const router = useRouter()

  const [clientName,    setClientName]    = useState('')
  const [clientEmail,   setClientEmail]   = useState('')
  const [clientPhone,   setClientPhone]   = useState('')
  const [vehicleModel,  setVehicleModel]  = useState('')
  const [vehiclePlate,  setVehiclePlate]  = useState('')
  const [items,         setItems]         = useState<QuoteItem[]>([defaultItem()])
  const [notes,         setNotes]         = useState('')
  const [validUntil,    setValidUntil]    = useState('')
  const [saving,        setSaving]        = useState(false)
  const [sendingEmail,  setSendingEmail]  = useState(false)
  const [error,         setError]         = useState('')

  /* Calculs */
  const subtotalHt = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const tva        = subtotalHt * 0.21
  const total      = subtotalHt + tva

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: field === 'description' ? value : Number(value) } : item
    ))
  }

  function addItem() {
    setItems(prev => [...prev, defaultItem()])
  }

  function removeItem(index: number) {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  async function save(andSend = false): Promise<string | null> {
    setError('')
    if (!clientName.trim()) {
      setError('Le nom du client est requis.')
      return null
    }
    if (items.some(i => !i.description.trim())) {
      setError('Chaque prestation doit avoir une description.')
      return null
    }

    const body = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      vehicleModel: vehicleModel.trim() || undefined,
      vehiclePlate: vehiclePlate.trim() || undefined,
      items: items.map(i => ({
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      notes: notes.trim() || undefined,
      validUntil: validUntil || undefined,
    }

    const res = await fetch('/api/garage/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Erreur lors de la création.')
      return null
    }
    return data.id as string
  }

  async function handleSaveDraft() {
    setSaving(true)
    const id = await save(false)
    setSaving(false)
    if (id) router.push('/garage/quotes')
  }

  async function handleSaveAndSend() {
    if (!clientEmail.trim()) {
      setError('Un email client est requis pour envoyer le devis.')
      return
    }
    setSendingEmail(true)
    const id = await save(false)
    if (!id) { setSendingEmail(false); return }

    const res = await fetch(`/api/garage/quotes/${id}/send`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur lors de l'envoi.")
      setSendingEmail(false)
      return
    }
    setSendingEmail(false)
    router.push('/garage/quotes')
  }

  const inputClass = 'w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-colors'
  const inputStyle = {
    background: 'var(--color-background-secondary)',
    border: '0.5px solid var(--color-border-tertiary)',
    color: 'var(--color-text-primary)',
  }
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6, display: 'block' }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/garage/quotes" className="flex items-center gap-1.5 text-[13px]"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconArrowLeft size={15} /> Retour
        </Link>
        <h1 className="text-[20px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Nouveau devis
        </h1>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg text-[13px]"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '0.5px solid #FECACA' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulaire gauche */}
        <div className="lg:col-span-3 space-y-5">

          {/* Infos client */}
          <div className="rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Informations client
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label style={labelStyle}>Nom complet *</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="Ex : Marie Dupont" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  type="email" placeholder="marie@example.com" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                  placeholder="+32 xxx xx xx xx" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Véhicule</label>
                <input value={vehicleModel} onChange={e => setVehicleModel(e.target.value)}
                  placeholder="Ex : Peugeot 308" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Immatriculation</label>
                <input value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)}
                  placeholder="Ex : 1-ABC-123" className={inputClass}
                  style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div className="rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Prestations
            </h2>

            {/* Header colonnes */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-6"><span style={{ ...labelStyle, marginBottom: 0 }}>Description</span></div>
              <div className="col-span-2"><span style={{ ...labelStyle, marginBottom: 0 }}>Qté</span></div>
              <div className="col-span-3"><span style={{ ...labelStyle, marginBottom: 0 }}>Prix HT (€)</span></div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      value={item.description}
                      onChange={e => updateItem(index, 'description', e.target.value)}
                      placeholder="Description de la prestation"
                      className={inputClass} style={inputStyle}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                      type="number" min="1" step="1"
                      className={inputClass} style={{ ...inputStyle, textAlign: 'center' }}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      value={item.unitPrice}
                      onChange={e => updateItem(index, 'unitPrice', e.target.value)}
                      type="number" min="0" step="0.01"
                      className={inputClass} style={{ ...inputStyle, textAlign: 'right' }}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: items.length <= 1 ? '#D1D5DB' : '#9CA3AF' }}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#1D9E75', border: '0.5px dashed #1D9E75', background: '#F0FDF4' }}
            >
              <IconPlus size={13} /> Ajouter une ligne
            </button>
          </div>

          {/* Notes et validité */}
          <div className="rounded-[10px] p-5"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Informations complémentaires
            </h2>
            <div className="space-y-3">
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Conditions particulières, remarques..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Valable jusqu'au</label>
                <input
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  type="date"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu droite */}
        <div className="lg:col-span-2 space-y-4">
          {/* Récapitulatif */}
          <div className="rounded-[10px] p-5 sticky top-6"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Récapitulatif
            </h2>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {items.map((item, i) => {
                const lineTotal = item.quantity * item.unitPrice
                return (
                  <div key={i} className="flex justify-between items-start gap-2">
                    <span className="text-[12px] flex-1 leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description || `Ligne ${i + 1}`}
                      {item.quantity > 1 && <span className="ml-1 opacity-60">×{item.quantity}</span>}
                    </span>
                    <span className="text-[12px] font-medium flex-shrink-0" style={{ color: 'var(--color-text-primary)' }}>
                      {lineTotal.toFixed(2)} €
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Totaux */}
            <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: 12 }}>
              <div className="flex justify-between py-1">
                <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>Sous-total HT</span>
                <span className="text-[12px]" style={{ color: 'var(--color-text-primary)' }}>{subtotalHt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>TVA 21%</span>
                <span className="text-[12px]" style={{ color: 'var(--color-text-primary)' }}>{tva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2.5 px-3 rounded-lg mt-2"
                style={{ background: '#F0FDF4' }}>
                <span className="text-[14px] font-bold" style={{ color: '#065F46' }}>Total TTC</span>
                <span className="text-[14px] font-bold" style={{ color: '#065F46' }}>{total.toFixed(2)} €</span>
              </div>
            </div>

            {validUntil && (
              <p className="text-[11px] mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                Valable jusqu'au {new Date(validUntil).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            {/* Boutons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={handleSaveDraft}
                disabled={saving || sendingEmail}
                className="w-full py-2.5 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-background-secondary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {saving ? <IconLoader2 size={15} className="animate-spin" /> : null}
                Sauvegarder brouillon
              </button>
              <button
                onClick={handleSaveAndSend}
                disabled={saving || sendingEmail}
                className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white flex items-center justify-center gap-2"
                style={{ background: '#1D9E75' }}
              >
                {sendingEmail ? <IconLoader2 size={15} className="animate-spin" /> : null}
                Sauvegarder et envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
