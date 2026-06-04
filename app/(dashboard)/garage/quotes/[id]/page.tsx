'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft, IconPrinter, IconLoader2, IconMail, IconCheck, IconX,
  IconCalendarPlus,
} from '@tabler/icons-react'
import { Logo } from '@/components/Logo'

type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Garage {
  name: string
  address: string
  city: string
  zipCode: string
  phone: string
  vatNumber?: string
}

interface QuoteData {
  id: string
  quoteNr: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  vehicleModel: string | null
  vehiclePlate: string | null
  items: QuoteItem[]
  subtotalHt: number
  tva: number
  total: number
  notes: string | null
  validUntil: string | null
  status: QuoteStatus
  createdAt: string
  garage: Garage
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  DRAFT:     'Brouillon',
  SENT:      'Envoyé',
  ACCEPTED:  'Accepté',
  REJECTED:  'Refusé',
  CONVERTED: 'Converti',
}

const STATUS_STYLES: Record<QuoteStatus, { bg: string; color: string }> = {
  DRAFT:     { bg: '#F3F4F6', color: '#6B7280' },
  SENT:      { bg: '#EFF6FF', color: '#2563EB' },
  ACCEPTED:  { bg: '#F0FDF4', color: '#16A34A' },
  REJECTED:  { bg: '#FEF2F2', color: '#DC2626' },
  CONVERTED: { bg: '#ECFDF5', color: '#065F46' },
}

export default function QuoteDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const [data,     setData]     = useState<QuoteData | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [actioning, setActioning] = useState(false)

  useEffect(() => {
    fetch(`/api/garage/quotes/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setData(null)
        else setData(d)
      })
      .finally(() => setLoading(false))
  }, [params.id])

  async function handleSend() {
    if (!data?.clientEmail) return
    setActioning(true)
    const res = await fetch(`/api/garage/quotes/${params.id}/send`, { method: 'POST' })
    if (res.ok) {
      setData(prev => prev ? { ...prev, status: 'SENT' } : prev)
    }
    setActioning(false)
  }

  async function handleStatus(status: QuoteStatus) {
    setActioning(true)
    const res = await fetch(`/api/garage/quotes/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setData(prev => prev ? { ...prev, status } : prev)
    }
    setActioning(false)
  }

  function handleCreateAppointment() {
    if (!data) return
    const params = new URLSearchParams()
    if (data.clientName)    params.set('clientName',    data.clientName)
    if (data.vehicleModel)  params.set('vehicleModel',  data.vehicleModel)
    if (data.vehiclePlate)  params.set('vehiclePlate',  data.vehiclePlate)
    if (data.clientPhone)   params.set('clientPhone',   data.clientPhone)
    router.push(`/garage/agenda?${params.toString()}`)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <IconLoader2 size={24} className="animate-spin" style={{ color: '#1D9E75' }} />
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--color-text-secondary)' }}>Devis introuvable.</p>
    </div>
  )

  const statusStyle = STATUS_STYLES[data.status]

  return (
    <>
      {/* Barre d'actions — masquée à l'impression */}
      <div
        className="no-print sticky top-0 z-10 h-14 flex items-center justify-between px-6"
        style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}
      >
        <Link href="/garage/quotes" className="flex items-center gap-2 text-[13px]"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconArrowLeft size={15} /> Retour aux devis
        </Link>

        <div className="flex items-center gap-2">
          {/* Badge statut */}
          <span
            className="px-2.5 py-1 rounded-full text-[12px] font-medium"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {STATUS_LABELS[data.status]}
          </span>

          {/* Envoyer */}
          {(data.status === 'DRAFT' || data.status === 'SENT') && data.clientEmail && (
            <button
              onClick={handleSend}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
              style={{ background: '#EFF6FF', color: '#2563EB', border: '0.5px solid #BFDBFE' }}
            >
              {actioning ? <IconLoader2 size={13} className="animate-spin" /> : <IconMail size={13} />}
              Envoyer par email
            </button>
          )}

          {/* Marquer Accepté */}
          {(data.status === 'SENT' || data.status === 'DRAFT') && (
            <button
              onClick={() => handleStatus('ACCEPTED')}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
              style={{ background: '#F0FDF4', color: '#16A34A', border: '0.5px solid #BBF7D0' }}
            >
              <IconCheck size={13} /> Accepté
            </button>
          )}

          {/* Marquer Refusé */}
          {(data.status === 'SENT' || data.status === 'DRAFT') && (
            <button
              onClick={() => handleStatus('REJECTED')}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '0.5px solid #FECACA' }}
            >
              <IconX size={13} /> Refusé
            </button>
          )}

          {/* Créer un RDV si Accepté */}
          {data.status === 'ACCEPTED' && (
            <button
              onClick={handleCreateAppointment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white"
              style={{ background: '#1D9E75' }}
            >
              <IconCalendarPlus size={13} /> Créer un RDV
            </button>
          )}

          {/* Imprimer */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white"
            style={{ background: '#1D9E75' }}
          >
            <IconPrinter size={15} /> Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Styles impression */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .quote-page { box-shadow: none !important; margin: 0 !important; padding: 32px !important; }
        }
        @page { size: A4; margin: 20mm; }
      `}</style>

      {/* Document devis */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="quote-page bg-white rounded-xl p-10 shadow-sm"
          style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#111', lineHeight: 1.5 }}>

          {/* En-tête */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="mb-3">
                <Logo size="md" />
              </div>
              <p className="text-[16px] font-bold text-gray-900">{data.garage.name}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{data.garage.address}</p>
              <p className="text-[13px] text-gray-500">{data.garage.zipCode} {data.garage.city}</p>
              <p className="text-[13px] text-gray-500">{data.garage.phone}</p>
              {data.garage.vatNumber && (
                <p className="text-[13px] text-gray-500">TVA: {data.garage.vatNumber}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[28px] font-bold text-gray-900">DEVIS</p>
              <p className="text-[14px] font-semibold mt-1" style={{ color: '#1D9E75' }}>
                N° {data.quoteNr}
              </p>
              <p className="text-[13px] text-gray-500 mt-1">
                Date : {new Date(data.createdAt).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {data.validUntil && (
                <p className="text-[13px] text-gray-500 mt-0.5">
                  Valable jusqu'au : {new Date(data.validUntil).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* Ligne séparatrice */}
          <div className="h-px bg-gray-200 mb-8" />

          {/* Client + Véhicule */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Devis établi pour</p>
              <p className="text-[14px] font-semibold text-gray-900">{data.clientName}</p>
              {data.clientEmail && <p className="text-[13px] text-gray-500">{data.clientEmail}</p>}
              {data.clientPhone && <p className="text-[13px] text-gray-500">{data.clientPhone}</p>}
            </div>
            {(data.vehicleModel || data.vehiclePlate) && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Véhicule</p>
                {data.vehicleModel && (
                  <p className="text-[14px] font-semibold text-gray-900">{data.vehicleModel}</p>
                )}
                {data.vehiclePlate && (
                  <p className="text-[13px] font-mono mt-1 px-2 py-0.5 rounded inline-block"
                    style={{ background: '#F3F4F6', color: '#374151' }}>
                    {data.vehiclePlate}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tableau prestations */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Prestation', 'Qté', 'Prix unitaire HT', 'Total HT'].map(h => (
                  <th key={h} style={{
                    padding: '10px 12px',
                    textAlign: h === 'Prestation' ? 'left' : 'right',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 500, color: '#111' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                    {item.unitPrice.toFixed(2)} €
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#111' }}>
                    {item.total.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totaux */}
          <div className="flex justify-end mb-10">
            <div style={{ minWidth: 240 }}>
              <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Sous-total HT</span>
                <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{data.subtotalHt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>TVA 21%</span>
                <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{data.tva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-2.5 mt-1 rounded-lg px-3"
                style={{ background: '#F0FDF4' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>Total TTC</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>{data.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div style={{ background: '#FFFBEB', borderLeft: '3px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 32 }}>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Notes</p>
              <p style={{ fontSize: 13, color: '#374151' }}>{data.notes}</p>
            </div>
          )}

          {/* Pied de devis */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
              {data.garage.name} · {data.garage.address}, {data.garage.zipCode} {data.garage.city}
              {data.garage.vatNumber ? ` · TVA: ${data.garage.vatNumber}` : ''}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              Devis généré via MonGaragiste · mongaragiste.app
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
